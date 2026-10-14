/*
 * TIPOGRAFÍAS: sólo los subsets que se usan.
 *
 *  · Silkscreen es la pixel de la estética voxel (decisión del propietario). Se
 *    cargan `latin-400` y `latin-700` en vez del `index.css` completo, que
 *    traía cirílico y griego que nadie pide.
 *  · Bebas Neue se queda de respaldo para textos largos.
 *  · INTER SE HA QUITADO. Estaba en la pila de respaldo
 *    (`--font: Silkscreen, Inter, …`) y no llegaba a aplicarse nunca: medido con
 *    `document.fonts`, sus caras quedaban en `unloaded` en las dos páginas. Eran
 *    480 KB (+308 KB de .woff) descargados para nada.
 */
import '@fontsource/silkscreen/latin-400.css';
import '@fontsource/silkscreen/latin-700.css';
import '@fontsource/bebas-neue/latin.css';
import './styles.css';
import { readSavedLang, setLang, type Lang } from './i18n';

const gate = document.getElementById('lang-gate') as HTMLElement;
const loader = document.getElementById('loader') as HTMLElement;
const fill = document.getElementById('loader-fill') as HTMLElement;
const loaderText = document.getElementById('loader-text') as HTMLElement;
const canvas = document.getElementById('game') as HTMLCanvasElement;

function webgl2Available(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/**
 * Crea el juego y lo deja CONSTRUIDO, sin jugar.
 *
 * Todo el trabajo pesado ocurre dentro de `createGame` (mundo, horneado de
 * sombras, precompilación, texturas, escala de render) y devuelve con la escena
 * lista. Por eso el idioma ya no tiene que decidirse ANTES de cargar: la pista
 * puede estar en órbita detrás del selector.
 *
 * El orden de los dos respaldos importa y no se invierte: sin WebGL2 se cae a
 * `/classic/` ANTES de descargar nada, y si `createGame` peta también, con la
 * barra ya escondida para no dejar al usuario mirando una pantalla parada.
 */
async function cargar(): Promise<{ game: import('./game/main').GameHandle } | null> {
  loader.hidden = false;
  document.body.dataset.mode = 'loading';
  try {
    // El código 3D se descarga una vez, y se comparte entre las dos salidas.
    const { createGame } = await import('./game/main');
    /*
     * La pantalla de carga no es sólo "bajar cosas": dentro de `createGame` hay
     * trabajo que no se ve en ninguna parte. Lo que más ha crecido es la
     * PRECARGA (ver el bloque en `game/main.ts`), que paga aquí, con la barra por
     * delante, todo lo que si no se pagaría dentro del juego con el jugador
     * moviéndose y la cámara siguiendo — que es justo lo que se nota como tirón.
     *
     * Por eso `onProgress` tiene que seguir respondiendo en cada fase aunque el
     * trabajo sea bloqueante: `createGame` cede un fotograma (`nextFrame()`) antes
     * de cada compilación y de cada dos texturas, y esta barra es lo que se pinta
     * en ese hueco. Por eso el aviso de la barra no puede adelantarse a
     * `createGame`, y por eso `loader.hidden = true` va DESPUÉS de que resuelva.
     */
    const game = await createGame({
      canvas,
      onProgress: (p) => {
        fill.style.width = `${Math.round(p * 100)}%`;
      },
    });
    loader.hidden = true;
    return { game };
  } catch (err) {
    console.error(err);
    // Se esconde la barra ANTES de navegar: si la redirección tarda (red lenta,
    // caché fría de `/classic/`), el jugador se queda mirando una barra parada en
    // el 43 % sin explicación. Sin pantalla de carga ya sólo queda el mensaje de
    // la versión clásica, que al menos dice dónde está.
    loader.hidden = true;
    location.replace('/classic/');
    return null;
  }
}

/** Elige idioma, arranca el juego y aparta la puerta. */
function entrar(lang: Lang, game: import('./game/main').GameHandle): void {
  setLang(lang);
  gate.hidden = true;
  game.start();
}

const saved = readSavedLang();

/*
 * SIN WEBGL2 NO SE DESCARGA NADA.
 *
 * La comprobación va la primera, antes de la barra y antes de la puerta. Con la
 * puerta por delante, el orden antiguo hacía que quien no tiene WebGL2 se
 * comiera los 192 kB del chunk de Three.js y además viera un selector antes de
 * acabar en la versión clásica: el peor de los dos mundos. La versión clásica es
 * la red de seguridad de quien no tiene GPU, así que es lo que antes se comprueba.
 */
if (!webgl2Available()) {
  location.replace('/classic/');
} else {
  /*
   * SIEMPRE SE ELIGE IDIOMA, y siempre se ve la cinemática.
   *
   * Antes el idioma sólo se preguntaba en la primera visita (había una constante
   * `ASK_EVERY_VISIT = false`) porque la puerta era una pantalla opaca que tapaba
   * el juego entero: era fricción pura para repetir una decisión ya tomada. Con
   * la puerta pintada SOBRE la pista en órbita eso deja de ser una pantalla
   * intermedia y pasa a ser el escaparate: se ve la cancha y el personaje
   * moviéndose antes de decidir, y ahora la puerta va SIEMPRE por delante.
   *
   * El idioma que se usó la visita anterior sólo se usa para dejar ese botón
   * resaltado (`is-last`) y con el foco puesto: es una sugerencia, no un atajo.
   */
  loaderText.textContent = 'Cargando… · Loading…';
  void cargar().then((r) => {
    if (!r) return;
    /*
     * El bucle ya está corriendo y el input sigue apagado (`setMode` sólo lo
     * habilita en `play`), así que la pista se mueve sola detrás del selector y
     * no se puede jugar todavía. No se llama a `setLang` aquí a propósito: esa
     * función PERSISTE el idioma en `localStorage`, y se guardaría uno que el
     * visitante todavía no ha elegido.
     */
    r.game.beginAttract();
    document.body.dataset.mode = 'attract';
    gate.hidden = false;

    const buttons = gate.querySelectorAll<HTMLButtonElement>('button[data-lang]');
    buttons.forEach((b) => {
      if (b.dataset.lang === saved) b.classList.add('is-last');
      b.addEventListener('click', () => entrar(b.dataset.lang as Lang, r.game));
    });
    (gate.querySelector<HTMLButtonElement>('button[data-lang].is-last') ?? buttons[0])?.focus();
  });
}
