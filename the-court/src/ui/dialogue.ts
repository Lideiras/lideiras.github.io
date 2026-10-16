import { persona } from '../data/view';
import { t, tf, type UIKey } from '../i18n';
import { statsSource } from './panels';

/* ---------------------------------------------------------------------------
 * El cuadro de conversación con el entrevistador (T12/T14)
 * ------------------------------------------------------------------------- */

/*
 * Este cuadro es un COMPONENTE APARTE, no una pestaña del panel de contacto.
 *
 * El panel es una ventana modal con su propio velo, su foco atrapado y su
 * botón de cerrar: meter dentro una conversación obligaba a que el texto y las
 * respuestas peleasen por el mismo alto, y a tener que desplazarse para ver las
 * respuestas. Aquí el cuadro vive pegado al borde inferior, por encima de la
 * pista (el panel todavía no existe), y cuando la conversación se acaba se
 * esconde y aparece el panel con el formulario.
 */

/** Caracteres por MILISEGUNDO de la máquina de escribir. */
const CPS = 45 / 1000;
/** Pausa entre dos intervenciones del entrevistador, en ms. */
const PAUSA_HABLA = 520;
/** Pausa después de que el jugador elige respuesta, en ms. */
const PAUSA_RESPUESTA = 380;

/**
 * Un turno del guion: lo que dice el entrevistador y, si toca, las dos
 * respuestas entre las que elige el jugador.
 *
 * El guion es una LISTA DE DATOS y no una cascada de `if`: así el orden de la
 * conversación se lee de un vistazo, cada línea es una clave de traducción (y
 * por tanto falta una traducción = falla el build) y añadir una pregunta es
 * añadir un objeto sin tocar la máquina de estados.
 *
 * Los turnos son dos variantes y no dos campos opcionales del mismo objeto: con
 * `host?` y `dato?` los dos a la vez —o ninguno— compilaría, y un turno sin texto
 * saldría como una línea vacía en mitad de la entrevista.
 */
type DlgTurno =
  | { host: UIKey; opciones?: [UIKey, UIKey] }
  | { dato: DlgDato; opciones?: [UIKey, UIKey] };

/** Los dos comentarios que salen de lo que el jugador ha hecho en la pista. */
type DlgDato = 'tiros' | 'concurso';

/**
 * La frase del entrevistador sobre la partida del jugador.
 *
 * Los números salen del MISMO origen que el panel del récord (`statsSource`, que
 * es lo que `main.ts` tiene cargado del navegador): no hay una segunda cuenta que
 * se pueda quedar desfasada de la que ve el jugador en la sexta sección. Sin
 * datos —o con la partida sin empezar— la frase es la de la ausencia, que es lo
 * que hace que el diálogo cambie según lo que haya hecho: a un recién llegado no
 * se le felicita por un cero.
 */
function lineaDato(qué: DlgDato): string {
  const s = statsSource.get();
  if (qué === 'tiros') {
    if (!s || s.attempted === 0) return t('dlg_data_shots_none');
    return tf('dlg_data_shots', {
      made: s.made,
      attempted: s.attempted,
      pct: Math.round((s.made / s.attempted) * 100),
    });
  }
  if (!s || s.contestBest === 0) return t('dlg_data_contest_none');
  return tf('dlg_data_contest', { best: s.contestBest });
}

const GUION: DlgTurno[] = [
  { host: 'dlg_open' },
  /*
   * Lo primero que comenta un entrevistador que acaba de ver el partido son los
   * números: van aquí, antes de las preguntas, y son los que hacen que la misma
   * entrevista se lea distinta en la segunda visita.
   */
  { dato: 'tiros' },
  { dato: 'concurso' },
  { host: 'dlg_q1', opciones: ['dlg_a1a', 'dlg_a1b'] },
  { host: 'dlg_r1' },
  { host: 'dlg_q2', opciones: ['dlg_a2a', 'dlg_a2b'] },
  { host: 'dlg_r2' },
  { host: 'dlg_q3', opciones: ['dlg_a3a', 'dlg_a3b'] },
  { host: 'dlg_r3' },
];

/** La línea que se está escribiendo ahora mismo, o `null` si no hay ninguna. */
interface LineaViva {
  /** El bloque completo (nombre + texto), que es lo que acaba en el registro. */
  el: HTMLElement;
  /** El `<p>` donde van los caracteres. */
  texto: HTMLElement;
  /** La frase entera, para poder terminarla de golpe. */
  completo: string;
  /** Caracteres ya escritos: se compara con el objetivo antes de tocar el DOM. */
  escritos: number;
  /** Reloj decorativo en el que empieza a escribirse. */
  arranque: number;
}

/**
 * El cuadro de conversación: registro, línea en curso, respuestas y saltar.
 *
 * Va a base de nodos creados y `textContent` (nada de `innerHTML` con texto del
 * guion): así no hay forma de que una traducción con un `<` rompa el cuadro, y
 * el `role="log"` con `aria-live="polite"` va anunciando cada intervención.
 *
 * LA LÍNEA QUE SE ESCRIBE NO ESTÁ EN EL REGISTRO, Y ESO ES LO IMPORTANTE.
 * `aria-live="polite"` avisa de lo que se AÑADE a la región: si los caracteres
 * se escribieran dentro del registro, el lector de pantalla leería la
 * conversación entera otra vez por cada letra. La línea en curso se escribe en
 * una zona `aria-hidden` (que es la que se ve) y, al terminar, se le quita el
 * `aria-hidden` —aún fuera del registro, así que no avisa— y se mueve dentro:
 * un solo nodo añadido al `log`, con la frase entera, un solo anuncio por
 * intervención.
 */
export class DialogueBox {
  private el: HTMLElement;
  private log: HTMLElement;
  private now: HTMLElement;
  private choices: HTMLElement;
  private skip: HTMLButtonElement;
  private vivo: LineaViva | null = null;
  private pendientes: [UIKey, UIKey] | null = null;
  private turno = 0;
  /** Último reloj decorativo recibido: los manejadores lo necesitan sin esperar al bucle. */
  private reloj = 0;
  /** Reloj en el que se permite pasar al turno siguiente. */
  private hasta = 0;
  private activo = false;

  /**
   * @param parent contenedor del HUD (`#ui`): se monta DESPUÉS del HUD y del
   *   panel, porque el constructor del HUD hace `innerHTML = ...` sobre `#ui` y
   *   se comería el cuadro.
   * @param onTerminar se llama al acabar la conversación (o al cortarla con
   *   Escape). Quien lo recibe es el que abre el panel de contacto.
   */
  constructor(parent: HTMLElement, private onTerminar: () => void) {
    this.el = document.createElement('div');
    this.el.className = 'dlgbox';
    this.el.hidden = true;
    this.el.tabIndex = -1;
    this.el.dataset.dlgbox = '';
    this.el.innerHTML = `
      <div class="dlgbox__log" data-dlg-log role="log" aria-live="polite" tabindex="-1"></div>
      <div class="dlgbox__now" data-dlg-now aria-hidden="true"></div>
      <div class="dlgbox__choices" data-dlg-choices></div>
      <button type="button" class="btn dlg__skip" data-dlg-skip></button>`;
    parent.appendChild(this.el);

    this.log = this.el.querySelector<HTMLElement>('[data-dlg-log]')!;
    this.now = this.el.querySelector<HTMLElement>('[data-dlg-now]')!;
    this.choices = this.el.querySelector<HTMLElement>('[data-dlg-choices]')!;
    this.skip = this.el.querySelector<HTMLButtonElement>('[data-dlg-skip]')!;

    this.etiquetas();
    /*
     * Pulsar el cuadro (o su botón) es «adelante»: termina la línea de golpe y
     * enseña las respuestas. El caso de cuando no hay nada que escribir se
     * resuelve en `completar()`.
     */
    this.el.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      this.completar();
    });
    this.skip.addEventListener('click', () => this.completar());
    this.el.addEventListener('keydown', (e) => {
      // Sólo con el CUADRO con el foco: si el foco está en un botón, la tecla es
      // del botón (espacio/intro lo activan) y no hay que interferir.
      if (e.target !== this.el || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      this.completar();
    });
    document.addEventListener('keydown', this.onKey);
  }

  /**
   * Rótulos del cuadro, en el idioma de ahora.
   *
   * El DOM se construye una vez, pero el idioma se puede cambiar con el cuadro
   * en pantalla, así que los textos sueltos se reescriben al abrirlo y no se
   * quedan en el idioma con el que arrancó la partida.
   */
  private etiquetas(): void {
    this.log.setAttribute('aria-label', t('dlg_label'));
    this.skip.textContent = t('dlg_skip');
  }

  /** Cierra el cuadro SIN abrir el panel: la entrevista se abandona. */
  close(): void {
    if (!this.activo) return;
    this.activo = false;
    this.vivo = null;
    this.pendientes = null;
    this.el.hidden = true;
    this.now.replaceChildren();
    this.choices.replaceChildren();
    this.log.replaceChildren();
  }

  /** Arranca la conversación desde el primer turno. */
  start(): void {
    this.close();
    this.turno = 0;
    this.hasta = 0;
    this.etiquetas();
    this.activo = true;
    this.el.hidden = false;
    this.siguiente();
    // El foco al cuadro, no a la pista: mientras se entrevista el input del juego
    // está apagado, así que sin esto el teclado se queda en el lienzo y Escape
    // no llega a ninguna parte.
    this.el.focus({ preventScroll: true });
  }

  /**
   * Avanza la máquina de escribir. Lo llama el bucle con el reloj DECORATIVO.
   *
   * Es decoración, así que usa `time` y nunca `animTime`: con movimiento
   * reducido el reloj va congelado a 0 y, precisamente por eso, la línea se
   * escribe ENTERA de golpe (`reducido`). Sin ese parámetro, con el reloj
   * parado, `time - arranque` no avanzaría nunca y el texto no saldría.
   *
   * Es el único trabajo por fotograma que hace este módulo, y solo con el cuadro
   * abierto: una escritura de `textContent` cuando el número de caracteres ha
   * cambiado de verdad. Ni una lectura de medidas, ni un reflow.
   */
  tick(time: number, reducido: boolean): void {
    this.reloj = time;
    if (!this.activo) return;
    const v = this.vivo;
    if (!v) {
      if (this.pendientes === null && time >= this.hasta) this.siguiente();
      return;
    }
    const n = reducido ? v.completo.length : Math.min(v.completo.length, Math.floor((time - v.arranque) * CPS));
    if (n !== v.escritos) {
      v.escritos = n;
      v.texto.textContent = v.completo.slice(0, n);
    }
    if (n < v.completo.length) return;
    this.cerrarLinea();
    if (this.pendientes) this.mostrar(this.pendientes);
  }

  /** Pone a escribir una intervención y decide cuándo puede venir la siguiente. */
  private hablar(quien: string, texto: string, jugador: boolean): void {
    const el = document.createElement('div');
    el.className = `dlg__line${jugador ? ' dlg__line--player' : ''}`;
    // Se marca aquí aunque la zona muda ya sea `aria-hidden`: el atributo va en
    // la línea para que `cerrarLinea()` pueda quitarlo DE UNA VEZ, en el orden
    // que hace que la región `aria-live` avise una sola vez por intervención.
    el.setAttribute('aria-hidden', 'true');
    const who = document.createElement('span');
    who.className = 'dlg__who';
    who.textContent = quien;
    const p = document.createElement('p');
    p.className = 'dlg__text';
    el.append(who, p);
    this.now.replaceChildren(el);
    this.vivo = { el, texto: p, completo: texto, escritos: -1, arranque: this.reloj };
  }

  /**
   * Termina la línea en curso y la pasa al registro.
   *
   * El orden es el que hace que el lector de pantalla avise UNA vez: primero se
   * quita el `aria-hidden` (la línea sigue fuera del `log`, en la zona muda, así
   * que no se anuncia nada) y después se mueve dentro, que es el nodo añadido a
   * la región `aria-live`.
   */
  private cerrarLinea(): void {
    const v = this.vivo;
    if (!v) return;
    this.vivo = null;
    v.texto.textContent = v.completo;
    v.el.removeAttribute('aria-hidden');
    this.now.replaceChildren();
    this.log.appendChild(v.el);
    // El registro se ancla abajo (se lee lo último que se ha dicho) SIN
    // `scrollIntoView`: eso desplazaría también a la página y, con el cuadro
    // pegado al borde inferior, el botón de saltar se movería con ella.
    this.log.scrollTop = this.log.scrollHeight;
  }

  /** Turno siguiente del guion. Si no hay más, se acabó la conversación. */
  private siguiente(): void {
    if (!this.activo) return;
    const turno = GUION[this.turno++];
    if (!turno) {
      this.finalizar();
      return;
    }
    this.hablar(t('dlg_host'), 'dato' in turno ? lineaDato(turno.dato) : t(turno.host), false);
    this.pendientes = turno.opciones ?? null;
    // Con respuestas se espera a que el jugador elija, así que la espera es
    // infinita; sin ellas, una pausa para que la réplica y la pregunta siguiente
    // no caigan en el mismo fotograma y se lean como una sola frase larga.
    this.hasta = turno.opciones ? Number.POSITIVE_INFINITY : this.reloj + PAUSA_HABLA;
  }

  /** Las dos respuestas, y el foco en la primera. */
  private mostrar(keys: [UIKey, UIKey]): void {
    this.pendientes = null;
    for (const key of keys) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn';
      b.textContent = t(key);
      b.addEventListener('click', () => this.elegir(key));
      this.choices.appendChild(b);
    }
    /*
     * El foco va a la primera respuesta de forma EXPLÍCITA: el cuadro está
     * fuera del panel y no hay ninguna trampa de foco que lo coloque por su
     * cuenta. Sin esto, el teclado se quedaría en el `body` y las respuestas
     * —lo único que hay que pulsar— no se alcanzarían con el tabulador.
     */
    (this.choices.firstElementChild as HTMLElement | null)?.focus();
  }

  /** El jugador elige una respuesta: se anota y sigue el entrevistador. */
  private elegir(key: UIKey): void {
    this.choices.replaceChildren();
    /*
     * El foco vuelve al registro y NO se queda en el botón borrado: al
     * desaparecer el botón, el navegador deja el foco en el `body` y el
     * tabulador se escapaba del diálogo.
     */
    this.log.focus();
    this.hablar(persona().name, t(key), true);
    this.pendientes = null;
    this.hasta = this.reloj + PAUSA_RESPUESTA;
  }

  /** «Adelante»: la línea se escribe entera y las respuestas salen ya. */
  private completar(): void {
    if (!this.activo) return;
    const v = this.vivo;
    if (v) {
      this.cerrarLinea();
      if (this.pendientes) this.mostrar(this.pendientes);
      return;
    }
    /*
     * No hay nada que escribir. La pausa se acorta —quien va rápido no tiene por
     * qué mirar el reloj— PERO sólo si no se está esperando una respuesta: la
     * espera del jugador es un `hasta` infinito, y si se acortara, el pulsingón
     * saltaría al siguiente turno del entrevistador y la respuesta del jugador se
     * perdería sin llegar a existir.
     */
    if (this.hasta !== Number.POSITIVE_INFINITY) this.hasta = this.reloj;
  }

  /**
   * Se acabó la conversación (por el guion o porque la han cortado con Escape):
   * el cuadro desaparece y quien lo montó abre el panel de contacto.
   */
  private finalizar(): void {
    this.close();
    this.onTerminar();
  }

  /**
   * Escape durante la entrevista.
   *
   * CIERRA EL DIÁLOGO, NO LA PARTIDA: no hay vuelta al modo `attract` ni se
   * para nada, y el juego sigue detrás del cuadro. Lo que hace es lo mismo que
   * llegar al final del guion —abrir el panel de contacto—, porque el cuadro no
   * atrapa el foco y sin esto la entrevista no tendría salida: con el input
   * apagado en modo `interview` no hay a quién volver.
   */
  private onKey = (e: KeyboardEvent): void => {
    if (!this.activo || e.key !== 'Escape') return;
    e.preventDefault();
    this.finalizar();
  };
}
