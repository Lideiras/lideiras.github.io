import type { SectionId } from '../data/content';
import { SECTION_IDS, SWEET_SPOT, TAKEOVER_HITS } from '../game/config';
import type { Input } from '../game/input';
import { getLang, setLang, t, type UIKey } from '../i18n';
import { esc, sectionKey } from './panels';

export interface HudCallbacks {
  onMenuSelect(id: SectionId): void;
  onToggleMute(): boolean; // devuelve el nuevo estado muted
}

/**
 * Un rótulo de rumbo y su última posición pedida, en píxeles.
 *
 * La posición se GUARDA en vez de escribirse al vuelo porque el recorte y la
 * separación necesitan conocer todos los rótulos a la vez: mover uno depende de
 * dónde hayan caído los otros, así que la colocación va en dos pasadas
 * (`placeLabel` pide, `layoutLabels` decide).
 */
interface HudLabel {
  el: HTMLElement;
  key: UIKey;
  text: HTMLElement;
  dist: HTMLElement;
  arrow: HTMLElement;
  x: number;
  y: number;
  /** `true` cuando está DENTRO de pantalla: cuelga de su punto en vez de centrarse. */
  bottom: boolean;
}

const clampNum = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));

/*
 * ICONOS DIBUJADOS, no emoji.
 *
 * El botón de sonido usaba 🔊/🔇 y el menú ☰: los tres son glifos del sistema,
 * así que cambian de forma, de color y de grosor según la plataforma (y en
 * algunas versiones de Windows salen a color, en medio de una interfaz pixel de
 * dos colores). Estos son rectángulos y triángulos sobre una rejilla de 16 px,
 * con `shape-rendering: crispEdges` para que el borde quede a píxel entero, y
 * heredan el color del botón con `currentColor`.
 */
const ICON = {
  sound:
    '<svg viewBox="0 0 16 16" width="19" height="19" aria-hidden="true" shape-rendering="crispEdges">' +
    '<rect x="2" y="6" width="3" height="4" fill="currentColor"/>' +
    '<path d="M5 6 L9 3 L9 13 L5 10 Z" fill="currentColor"/>' +
    '<path d="M11 5 L12.5 5 L12.5 11 L11 11 Z" fill="currentColor"/>' +
    '<path d="M14 4 L15 4 L15 12 L14 12 Z" fill="currentColor"/></svg>',
  muted:
    '<svg viewBox="0 0 16 16" width="19" height="19" aria-hidden="true" shape-rendering="crispEdges">' +
    '<rect x="2" y="6" width="3" height="4" fill="currentColor"/>' +
    '<path d="M5 6 L9 3 L9 13 L5 10 Z" fill="currentColor"/>' +
    '<path d="M11 5 L13 7 M13 5 L11 7" stroke="currentColor" stroke-width="1.6" fill="none"/>' +
    '<path d="M11 9 L13 11 M13 9 L11 11" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',
  menu:
    '<svg viewBox="0 0 16 16" width="19" height="19" aria-hidden="true" shape-rendering="crispEdges">' +
    '<rect x="2" y="3" width="12" height="2" fill="currentColor"/>' +
    '<rect x="2" y="7" width="12" height="2" fill="currentColor"/>' +
    '<rect x="2" y="11" width="12" height="2" fill="currentColor"/></svg>',
} as const;

export class Hud {
  /**
   * Una etiqueta por sección. Guardo las tres piezas por separado porque
   * `refreshText` sólo debe reescribir el TEXTO: si asignara `textContent` al
   * elemento completo se llevaría por delante la flecha y la distancia.
   */
  private labels = new Map<string, HudLabel>();
  private prompt!: HTMLElement;
  private meter!: HTMLElement;
  private needle!: HTMLElement;
  private sweet!: HTMLElement;
  private chargeEl!: HTMLElement;
  private recordEl!: HTMLElement;
  private takeoverEl!: HTMLElement;
  private pipsEl!: HTMLElement;
  private toastEl!: HTMLElement;
  private subsEl!: HTMLElement;
  private subsLineEl!: HTMLElement;
  private live!: HTMLElement;
  private broadcastEl!: HTMLElement;
  private timeEl!: HTMLElement;
  private lastSecond = -1;
  private contestEl!: HTMLElement;
  /** Último texto pintado del concurso: sólo se escribe el DOM cuando cambia. */
  private contestTxt = '';
  private progress!: HTMLElement;
  private menu!: HTMLElement;
  private menuBtn!: HTMLButtonElement;
  private muteBtn!: HTMLButtonElement;
  private toastTimer = 0;
  private subsTimer = 0;
  private progressValue = 0;
  private muted: boolean;
  /* Estado de cada sección para el menú: visitada o bloqueada (las zonas de
     tiro que aún no se han descubierto). El progreso del chip ya se veía, pero
     la lista del menú era plana: no había forma de saber qué faltaba. */
  private visited = new Set<string>();
  private locked = new Set<string>();

  constructor(private root: HTMLElement, private cb: HudCallbacks, muted: boolean) {
    this.muted = muted;
    this.root.innerHTML = `
      <div class="hud">
        <div class="hud__top">
          <span class="chip" data-progress></span>
          <div class="hud__buttons">
            <button type="button" class="icon" data-mute></button>
            <button type="button" class="icon" data-lang></button>
            <button type="button" class="icon" data-menu-btn aria-haspopup="true" aria-expanded="false"></button>
          </div>
        </div>
        <nav class="menu" data-menu hidden></nav>
        <div class="hud__labels" data-labels></div>
        <div class="hud__record" data-record hidden>
          <span class="hud__record-tag"></span><span class="hud__record-num" data-record-num></span>
        </div>
        <div class="takeover" data-takeover hidden>
          <span class="takeover__tag"></span>
          <span class="takeover__pips" data-pips></span>
        </div>
        <div class="prompt" data-prompt hidden></div>
        <div class="meter" data-meter hidden aria-hidden="true"><i class="charge" data-charge></i><i class="sweet" data-sweet style="left:${((0.5 - SWEET_SPOT / 2) * 100).toFixed(1)}%;width:${(SWEET_SPOT * 100).toFixed(1)}%"></i><span class="ticks"></span><b class="needle" data-needle></b></div>
        <div class="toast" data-toast hidden></div>
        <div class="subs" data-subs hidden aria-hidden="true">
          <span class="subs__who"></span><span class="subs__line" data-subs-line></span>
        </div>
        <div class="contest" data-contest hidden aria-hidden="true">
          <p class="contest__tag"></p>
          <p class="contest__row"><span class="contest__time" data-contest-time>1:00</span><span class="contest__pts" data-contest-pts></span></p>
          <p class="contest__row"><span data-contest-rack></span><span data-contest-balls></span></p>
          <p class="contest__hint" data-contest-hint></p>
        </div>
        <div class="broadcast" data-broadcast hidden aria-hidden="true">
          <span class="broadcast__rec"><i></i>${t('live_rec')}</span>
          <span class="broadcast__channel">${t('live_channel')}</span>
          <span class="broadcast__time" data-broadcast-time>00:00:00</span>
          <span class="broadcast__now">${t('live_now')}</span>
        </div>
        <div class="tvfx" aria-hidden="true"></div>
        <div class="sr-only" data-live aria-live="polite"></div>
      </div>`;
    const q = <T extends HTMLElement>(s: string): T => this.root.querySelector<T>(s)!;
    this.prompt = q('[data-prompt]');
    this.meter = q('[data-meter]');
    this.needle = q('[data-needle]');
    this.sweet = q('[data-sweet]');
    this.chargeEl = q('[data-charge]');
    this.recordEl = q('[data-record]');
    q('[data-record] .hud__record-tag').textContent = t('record_chip');
    this.takeoverEl = q('[data-takeover]');
    this.pipsEl = q('[data-pips]');
    q('[data-takeover] .takeover__tag').textContent = t('takeover_tag');
    // Las muescas se crean UNA vez y luego sólo cambian de clase: son el mismo
    // número que cuenta el juego (`TAKEOVER_HITS`), no una copia a mano.
    for (let i = 0; i < TAKEOVER_HITS; i++) this.pipsEl.appendChild(document.createElement('i'));
    this.toastEl = q('[data-toast]');
    this.subsEl = q('[data-subs]');
    this.subsLineEl = q('[data-subs-line]');
    q('[data-subs] .subs__who').textContent = t('cmt_tag');
    this.broadcastEl = q('[data-broadcast]');
    this.timeEl = q('[data-broadcast-time]');
    this.contestEl = q('[data-contest]');
    q('[data-contest] .contest__tag').textContent = t('contest_tag');
    this.live = q('[data-live]');
    this.progress = q('[data-progress]');
    this.menu = q('[data-menu]');
    this.muteBtn = q<HTMLButtonElement>('[data-mute]');

    q('[data-lang]').addEventListener('click', () => setLang(getLang() === 'es' ? 'en' : 'es'));
    this.muteBtn.addEventListener('click', () => {
      this.muted = this.cb.onToggleMute();
      this.refreshText();
    });
    this.menuBtn = q<HTMLButtonElement>('[data-menu-btn]');
    this.menuBtn.addEventListener('click', () => {
      const open = this.menu.hidden;
      this.menu.hidden = !open;
      this.menuBtn.setAttribute('aria-expanded', String(open));
    });
    this.menu.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-section]');
      if (!b) return;
      this.closeMenu();
      this.cb.onMenuSelect(b.dataset.section as SectionId);
    });
    // Cerrar con Esc y con un clic fuera.
    //
    // Antes sólo lo cerraba su propio botón, así que el menú se quedaba abierto
    // tapando la pista mientras se jugaba. Con el panel abierto el Esc lo captura
    // el propio panel (que se cierra primero), y eso es lo que espera cualquiera
    // que haya usado un diálogo.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.menu.hidden) this.closeMenu();
    });
    document.addEventListener('pointerdown', (e) => {
      if (this.menu.hidden) return;
      const t = e.target as HTMLElement;
      if (this.menu.contains(t) || this.menuBtn.contains(t)) return;
      this.closeMenu();
    });
    window.addEventListener('langchange', () => this.refreshText());
    this.refreshText();
  }

  private refreshText(): void {
    const q = (s: string): HTMLElement => this.root.querySelector<HTMLElement>(s)!;
    q('[data-lang]').textContent = getLang() === 'es' ? 'EN' : 'ES';
    q('[data-lang]').setAttribute('aria-label', t('lang_toggle'));
    this.muteBtn.innerHTML = this.muted ? ICON.muted : ICON.sound;
    this.muteBtn.setAttribute('aria-label', this.muted ? t('unmute') : t('mute'));
    this.menuBtn.innerHTML = ICON.menu;
    this.menuBtn.setAttribute('aria-label', t('menu'));
    this.refreshMenu();
    this.progress.textContent = `${t('progress')} ${this.progressValue}/${SECTION_IDS.length}`;
    for (const { text, key } of this.labels.values()) text.textContent = t(key);
    this.recordEl.querySelector('.hud__record-tag')!.textContent = t('record_chip');
    this.takeoverEl.querySelector('.takeover__tag')!.textContent = t('takeover_tag');
    this.broadcastEl.querySelector('.broadcast__rec')!.innerHTML = `<i></i>${esc(t('live_rec'))}`;
    this.broadcastEl.querySelector('.broadcast__channel')!.textContent = t('live_channel');
    this.broadcastEl.querySelector('.broadcast__now')!.textContent = t('live_now');
    this.contestEl.querySelector('.contest__tag')!.textContent = t('contest_tag');
    this.subsEl.querySelector('.subs__who')!.textContent = t('cmt_tag');
    // Fuerza un repintado del marcador del concurso con los textos nuevos.
    this.contestTxt = '';
  }

  private closeMenu(): void {
    this.menu.hidden = true;
    this.menuBtn.setAttribute('aria-expanded', 'false');
  }

  /**
   * Lista del menú con el estado de cada sección: ✓ visitada, ○ pendiente,
   * 🔒 bloqueada (una zona de tiro que todavía no se ha descubierto).
   *
   * La marca va con `aria-hidden` y el estado se repite en un texto para
   * lectores de pantalla: un ✓ dentro de un botón no dice nada si se lee en voz
   * alta. NO se usa `role="menu"`: eso obliga al patrón completo de menú con
   * flechas y `menuitem`, y unos botones de verdad dentro de un `<nav>` ya son
   * navegables con el tabulador, que es lo que la gente hace.
   */
  private refreshMenu(): void {
    const items = SECTION_IDS.map((id) => {
      const done = this.visited.has(id);
      const locked = !done && this.locked.has(id);
      const state = done ? 'done' : locked ? 'locked' : 'open';
      const mark = done ? '✓' : locked ? '✕' : '○';
      const label = t(done ? 'state_done' : locked ? 'state_locked' : 'state_open');
      return `<button type="button" data-section="${id}" class="menu__item menu__item--${state}">
        <span class="menu__mark" aria-hidden="true">${mark}</span>${esc(t(sectionKey(id)))}
        <span class="sr-only"> — ${esc(label)}</span></button>`;
    }).join('');
    this.menu.innerHTML = `<p class="menu__title">${esc(t('menu_title'))}</p>${items}<a href="/classic/">${esc(t('classic'))}</a>`;
  }

  /** Estado de las secciones para el menú (y el contador de progreso). */
  setMenuState(visited: Iterable<string>, locked: Iterable<string>): void {
    this.visited = new Set(visited);
    this.locked = new Set(locked);
    this.refreshMenu();
  }

  addLabel(id: string, key: UIKey): void {
    const el = document.createElement('div');
    el.className = 'label';
    // Flecha + texto + distancia. La flecha sólo se ve cuando la sección queda
    // fuera de pantalla: dentro de pantalla estorba, porque la etiqueta ya está
    // encima del cartel y la dirección se lee sola.
    el.innerHTML =
      '<i class="label__arrow"></i><span class="label__text"></span><span class="label__dist"></span>';
    el.querySelector('.label__text')!.textContent = t(key);
    this.root.querySelector('[data-labels]')!.appendChild(el);
    this.labels.set(id, {
      el,
      key,
      text: el.querySelector('.label__text') as HTMLElement,
      dist: el.querySelector('.label__dist') as HTMLElement,
      arrow: el.querySelector('.label__arrow') as HTMLElement,
      // Posición provisional: el primer `layoutLabels` la sobrescribe en el
      // mismo fotograma en el que se construye el rótulo.
      x: 0,
      y: 0,
      bottom: false,
    });
  }

  /**
   * Coloca una etiqueta en píxeles de pantalla.
   *
   * `angle` es la dirección hacia la sección medida en el plano del suelo
   * respecto a hacia dónde mira la cámara: 0 = recto, ±π = a la espalda. Sólo
   * se usa cuando la sección queda fuera de pantalla, que es cuando el jugador
   * necesita la pista.
   */
  placeLabel(id: string, x: number, y: number, onScreen: boolean, angle: number, dist: number): void {
    const l = this.labels.get(id);
    if (!l) return;
    l.el.style.display = '';
    l.el.classList.toggle('label--edge', !onScreen);
    l.x = x;
    l.y = y;
    l.bottom = onScreen;
    l.arrow.style.transform = `rotate(${angle.toFixed(3)}rad)`;
    const d = `${Math.round(dist)} m`;
    if (l.dist.textContent !== d) l.dist.textContent = d;
  }

  /**
   * Recorta y separa los rótulos de rumbo dentro del viewport.
   *
   * Antes el recorte se hacía en coordenadas normalizadas con un margen FIJO
   * (0,84) que no sabía nada del tamaño del rótulo, y no había ninguna
   * separación entre rótulos. Medido con `getBoundingClientRect()`:
   *
   *   · a 828 px de ancho, 3 de los 6 salían fuera de pantalla (Proyectos
   *     −29 px por la izquierda, Experiencia −22 px, Entrevístame +28 px por la
   *     derecha);
   *   · a 1440 px, «Skills/Stats» y «Experiencia» se solapaban.
   *
   * Aquí se mide la caja REAL de cada rótulo (con el ancho que le da el texto
   * traducido, que cambia entre español e inglés), se mete dentro de la pantalla
   * con un margen, se le resta el sitio que ocupan la barra superior, el récord
   * y el aviso, y después los que se pisan se empujan en vertical. La lectura de
   * tamaños va en una pasada y la escritura en otra: si se leyera y escribiera
   * por rótulo, cada `offsetWidth` forzaría un reflow completo.
   */
  layoutLabels(viewW: number, viewH: number): void {
    const MARGIN = 10;
    const GAP = 6;
    // Zonas ocupadas por el propio HUD: barra de arriba (récord y botones) y
    // franja de abajo (récord, aviso y medidor).
    const TOP = 58;
    const BOTTOM = 104;
    const boxes: { l: HudLabel; x: number; y: number; w: number; h: number }[] = [];
    for (const l of this.labels.values()) {
      if (l.el.style.display === 'none') continue;
      const w = l.el.offsetWidth;
      const h = l.el.offsetHeight;
      // Dentro de pantalla el rótulo cuelga de su punto (ancla abajo); en el
      // borde se centra sobre él.
      const top = l.bottom ? h : h / 2;
      const bot = l.bottom ? 0 : h / 2;
      boxes.push({
        l,
        w,
        h,
        x: clampNum(l.x, MARGIN + w / 2, viewW - MARGIN - w / 2),
        y: clampNum(l.y, TOP + top, viewH - BOTTOM - bot),
      });
    }

    for (let pass = 0; pass < 3; pass++) {
      let moved = false;
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i]!;
          const b = boxes[j]!;
          if (Math.abs(a.x - b.x) >= (a.w + b.w) / 2 + GAP) continue;
          const aTop = a.y - (a.l.bottom ? a.h : a.h / 2);
          const aBot = a.y + (a.l.bottom ? 0 : a.h / 2);
          const bTop = b.y - (b.l.bottom ? b.h : b.h / 2);
          const bBot = b.y + (b.l.bottom ? 0 : b.h / 2);
          if (bTop >= aBot + GAP || aTop >= bBot + GAP) continue;
          // Se pisan: baja el de abajo y, si ya no cabe, sube el de arriba.
          const push = aBot + GAP - bTop;
          const bMax = viewH - BOTTOM - (b.l.bottom ? 0 : b.h / 2);
          const bNext = b.y + push;
          if (bNext <= bMax) {
            b.y = bNext;
          } else {
            b.y = bMax;
            const over = bNext - bMax;
            const aMin = TOP + (a.l.bottom ? a.h : a.h / 2);
            a.y = Math.max(aMin, a.y - over);
          }
          moved = true;
        }
      }
      if (!moved) break;
    }

    for (const b of boxes) {
      const anchor = b.l.bottom ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)';
      b.l.el.style.transform = `${anchor} translate(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px)`;
    }
  }

  /** Marca las secciones todavía bloqueadas (Projects hasta encestar). */
  setLabelLocked(id: string, locked: boolean): void {
    this.labels.get(id)?.el.classList.toggle('label--locked', locked);
  }

  hideLabel(id: string, hidden: boolean): void {
    const l = this.labels.get(id);
    if (l) l.el.style.display = hidden ? 'none' : '';
  }

  /**
   * Récord permanente, abajo a la derecha.
   *
   * Antes el marcador solo vivía dentro del panel de Récord, o sea que para
   * saber cuánto llevabas (-> los tiros) tenías que entrar en la sección, y
   * y entrar en la sección te gastaba una zona de la pista. Con esto está
   * siempre a la
   * vista, que es de lo que sirve un marcador.
   */
  setRecord(made: number, attempted: number): void {
    this.recordEl.hidden = false;
    const pct = attempted > 0 ? Math.round((made / attempted) * 100) : 0;
    const txt = `${made}/${attempted}${attempted > 0 ? ` · ${pct}%` : ''}`;
    const num = this.recordEl.querySelector('[data-record-num]') as HTMLElement;
    if (num.textContent !== txt) num.textContent = txt;
  }

  setProgress(n: number): void {
    this.progressValue = n;
    this.progress.textContent = `${t('progress')} ${n}/${SECTION_IDS.length}`;
  }

  /**
   * Medidor de racha TAKEOVER: aciertos consecutivos y aviso de encendido.
   *
   * Va arriba en el CENTRO y no es un sitio cualquiera: el medidor de tiro vive
   * abajo al centro (`bottom: 14%`) y el récord en la esquina inferior derecha,
   * así que el hueco libre del HUD es justo ése. El plan del lote lo pedía
   * explícitamente —el medidor de tiro se oculta con `showMeter(null)` y no se
   * puede compartir sitio con él— y en móvil vertical tampoco se pisa con el
   * joystick, que ocupa la franja de abajo.
   *
   * `streak` es la racha CRUDA (puede pasar de `TAKEOVER_HITS`) y `on` dice si
   * el modo está encendido. Con la racha a 0 y el modo apagado, se esconde: no
   * hay nada que contar todavía.
   */
  setTakeover(streak: number, on: boolean): void {
    const visible = on || streak > 0;
    this.takeoverEl.hidden = !visible;
    if (!visible) {
      /*
       * Al esconderse se LIMPIAN las clases. Son estado de la racha anterior y,
       * si se quedaran puestas, el DOM diría «encendido, 5 de 5» con el fuego ya
       * apagado: cualquier cosa que leyera el estado de ahí (una captura, una
       * prueba automática, el día que se añada un `aria-live`) mentiría. Se vio
       * midiendo en vivo tras el primer fallo.
       */
      this.takeoverEl.classList.remove('takeover--on');
      for (let i = 0; i < TAKEOVER_HITS; i++) {
        (this.pipsEl.children[i] as HTMLElement).classList.remove('is-lit');
      }
      return;
    }
    this.takeoverEl.classList.toggle('takeover--on', on);
    for (let i = 0; i < TAKEOVER_HITS; i++) {
      (this.pipsEl.children[i] as HTMLElement).classList.toggle('is-lit', on || i < streak);
    }
  }

  /**
   * Retransmisión del plató: REC parpadeante, canal y contador.
   *
   * Es el «filtro de imagen» que pidió el propietario para la entrevista, pero
   * hecho con DOM y no con un filtro CSS sobre el lienzo: un `filter` a pantalla
   * completa obliga al compositor a reprocesar los 828 × 1.033 px en cada
   * fotograma, y esto tiene que seguir yendo fino en una GPU integrada de 2013.
   * Las líneas de TV (`.tvfx`), la barra de REC y el contador se dibujan una vez
   * por cambio de texto: coste cero por fotograma.
   *
   * `seconds` es el reloj de la escena. El contador NO se reescribe en cada
   * fotograma: sólo cuando cambia el cuarto de segundo que se enseña, que es la
   * única escritura de DOM que hace falta para que parezca un contador real.
   */
  setBroadcast(on: boolean, seconds = 0): void {
    this.broadcastEl.hidden = !on;
    if (!on) {
      this.lastSecond = -1;
      return;
    }
    const frame = Math.floor(seconds * 25);
    if (frame === this.lastSecond) return;
    this.lastSecond = frame;
    const total = Math.floor(frame / 25);
    const mm = String(Math.floor(total / 60)).padStart(2, '0');
    const ss = String(total % 60).padStart(2, '0');
    const ff = String(frame % 25).padStart(2, '0');
    this.timeEl.textContent = `${mm}:${ss}:${ff}`;
  }

  /**
   * Marcador del concurso de triples: reloj, puntos, carro y balones que quedan.
   *
   * Va arriba a la IZQUIERDA, debajo del chip de progreso, y no en el centro: el
   * centro de arriba es del medidor de racha del Takeover, y abajo están el
   * medidor de tiro, el aviso y el récord. Es el único hueco del HUD que no se
   * pisa con nada, y además deja libre el centro de la pantalla, que es donde
   * está el carro al que hay que correr.
   *
   * Se escribe el DOM SÓLO cuando el texto cambia: el reloj se redondea al
   * segundo y los puntos y el carro cambian de tarde en tarde, así que en el 90 %
   * de los fotogramas esta función no toca nada.
   */
  setContest(info: { t: number; puntos: number; carro: number; total: number; balones: number; aviso: string | null } | null): void {
    this.contestEl.hidden = info === null;
    if (!info) {
      this.contestTxt = '';
      return;
    }
    const seg = Math.max(0, Math.ceil(info.t));
    const txt = `${seg}|${info.puntos}|${info.carro}|${info.balones}|${info.aviso ?? ''}`;
    if (txt === this.contestTxt) return;
    this.contestTxt = txt;
    const q = (s: string): HTMLElement => this.contestEl.querySelector<HTMLElement>(s)!;
    q('[data-contest-time]').textContent = `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, '0')}`;
    q('[data-contest-pts]').textContent = `${t('contest_score')} ${info.puntos}`;
    q('[data-contest-rack]').textContent = `${t('contest_rack')} ${info.carro + 1}/${info.total}`;
    q('[data-contest-balls]').textContent = '●'.repeat(info.balones) + '○'.repeat(Math.max(0, 3 - info.balones));
    q('[data-contest-hint]').textContent = info.aviso ?? '';
  }

  setPrompt(text: string | null): void {
    this.prompt.hidden = text === null;
    if (text !== null && this.prompt.textContent !== text) this.prompt.textContent = text;
  }

  /**
   * `sweet` es la anchura de la zona verde en fracción del medidor (0..1).
   *
   * Es un PARÁMETRO y no una constante porque la zona se estrecha con la
   * distancia al aro: antes estaba fijada en el HTML al construir el HUD, así
   * que la dificultad cambiaba en el cálculo pero el jugador veía siempre la
   * misma barra verde y no tenía forma de notarlo.
   */
  showMeter(value: number | null, sweet = SWEET_SPOT, charge = 0, center = 0.5): void {
    this.meter.hidden = value === null;
    if (value === null) {
      this.meter.classList.remove('meter--full');
      return;
    }
    // Barra de calentamiento: crece de izquierda a derecha mientras se mantiene
    // el disparo pulsado. Antes el medidor sólo movía la aguja, así que la
    // espera se leía como una pantalla estática y no había forma de saber
    // cuánto se llevaba cargado ni cuándo tocaba soltar.
    const pct = Math.max(0, Math.min(1, charge));
    this.chargeEl.style.width = `${(pct * 100).toFixed(1)}%`;
    this.meter.classList.toggle('meter--full', pct >= 0.999);
    this.needle.style.left = `${(value * 100).toFixed(1)}%`;
    // La zona verde se desplaza de lado a lado, así que su `left` ya no es la
    // mitad menos la mitad del ancho: es el centro que le toca ahora mismo.
    const w = Math.max(2, sweet * 100);
    this.sweet.style.left = `${(center * 100 - w / 2).toFixed(1)}%`;
    this.sweet.style.width = `${w.toFixed(1)}%`;
  }

  toast(text: string, ms = 2400): void {
    this.toastEl.textContent = text;
    this.toastEl.hidden = false;
    this.live.textContent = text;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => (this.toastEl.hidden = true), ms);
  }

  /**
   * Subtítulo del comentarista: la banda de pie de pantalla de la tele.
   *
   * Es OTRA COSA que el aviso (`toast`), y por eso es otro elemento y no una
   * reutilización del mismo: el aviso es del juego y aparece arriba al 14 %
   * (resultados, récords, mensajes del dueño), mientras que el subtítulo va
   * abajo, debajo del medidor de tiro, como el de una retransmisión. Pueden
   * coincidir —el final del concurso deja aviso y subtítulo a la vez— y ahí es
   * donde se ve el reparto: uno dice el resultado y el otro lo canta.
   *
   * Va con `aria-hidden` en el elemento y el texto MANDA a la región `aria-live`
   * del HUD: el subtítulo es para los ojos (duplica lo que ya se ve en el HUD) y
   * el lector de pantalla anuncia la línea una vez, no dos.
   *
   * Se retira solo, como el aviso. La duración la decide quien lo llama (el
   * comentarista tiene sus propias duraciones por tipo de frase), así que aquí
   * no hay ningún texto que aguante «lo que haga falta».
   */
  subtitle(text: string, ms = 2400): void {
    if (this.subsLineEl.textContent !== text) this.subsLineEl.textContent = text;
    this.subsEl.hidden = false;
    this.live.textContent = text;
    window.clearTimeout(this.subsTimer);
    this.subsTimer = window.setTimeout(() => (this.subsEl.hidden = true), ms);
  }

  /** Retira el subtítulo ya: al dejar el concurso a medias no se sigue hablando. */
  hideSubtitle(): void {
    window.clearTimeout(this.subsTimer);
    this.subsEl.hidden = true;
  }

  /** Joystick virtual + botones TIRO / ACCIÓN para pantallas táctiles. */
  mountTouch(input: Input): void {
    const wrap = document.createElement('div');
    wrap.className = 'touch';
    wrap.innerHTML = `
      <div class="joy" data-joy><div class="stick" data-stick></div></div>
      <div class="touch__btns">
        <button type="button" class="btn-round" data-act>E</button>
        <button type="button" class="btn-round btn-round--big" data-shoot>🏀</button>
      </div>`;
    this.root.appendChild(wrap);

    const joy = wrap.querySelector<HTMLElement>('[data-joy]')!;
    const stick = wrap.querySelector<HTMLElement>('[data-stick]')!;
    const R = 48;
    let pid: number | null = null;
    const set = (e: PointerEvent): void => {
      const r = joy.getBoundingClientRect();
      let dx = e.clientX - (r.left + r.width / 2);
      let dy = e.clientY - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy);
      if (len > R) {
        dx = (dx / len) * R;
        dy = (dy / len) * R;
      }
      stick.style.transform = `translate(${dx}px, ${dy}px)`;
      input.joy = { x: dx / R, y: dy / R };
    };
    const end = (): void => {
      pid = null;
      stick.style.transform = '';
      input.joy = { x: 0, y: 0 };
    };
    joy.addEventListener('pointerdown', (e) => {
      pid = e.pointerId;
      joy.setPointerCapture(pid);
      set(e);
    });
    joy.addEventListener('pointermove', (e) => pid === e.pointerId && set(e));
    joy.addEventListener('pointerup', end);
    joy.addEventListener('pointercancel', end);

    const shoot = wrap.querySelector<HTMLElement>('[data-shoot]')!;
    shoot.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      input.shootHeld = true;
    });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave'] as const) shoot.addEventListener(ev, () => (input.shootHeld = false));
    wrap.querySelector<HTMLElement>('[data-act]')!.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      input.pressInteract();
    });
  }
}
