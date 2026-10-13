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
import { readSavedLang, setLang, t, type Lang } from './i18n';

/**
 * true = preguntar el idioma en CADA visita, antes de cargar el juego.
 *
 * En `false` la puerta sólo aparece la primera vez (cuando no hay idioma
 * guardado) y las siguientes visitas entran directas con el idioma recordado.
 * Antes era `true` y obligaba a decidir en cada recarga para acabar en el mismo
 * sitio, con el botón EN/ES del HUD a un clic de distancia haciendo lo mismo:
 * una pantalla entera de fricción para una decisión que ya estaba tomada.
 */
const ASK_EVERY_VISIT = false;

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

async function start(lang: Lang): Promise<void> {
  setLang(lang);
  gate.hidden = true;
  if (!webgl2Available()) {
    location.replace('/classic/'); // sin WebGL2: versión clásica
    return;
  }
  loader.hidden = false;
  loaderText.textContent = t('loading');
  document.body.dataset.mode = 'loading';
  try {
    // El código 3D se descarga SOLO ahora, después de elegir idioma
    const { createGame } = await import('./game/main');
    const game = await createGame({
      canvas,
      onProgress: (p) => {
        fill.style.width = `${Math.round(p * 100)}%`;
      },
    });
    loader.hidden = true;
    game.start();
  } catch (err) {
    console.error(err);
    location.replace('/classic/');
  }
}

const saved = readSavedLang();
if (!ASK_EVERY_VISIT && saved) {
  void start(saved);
} else {
  document.body.dataset.mode = 'gate';
  const buttons = gate.querySelectorAll<HTMLButtonElement>('button[data-lang]');
  buttons.forEach((b) => {
    if (b.dataset.lang === saved) b.classList.add('is-last');
    b.addEventListener('click', () => void start(b.dataset.lang as Lang));
  });
  (gate.querySelector<HTMLButtonElement>('button[data-lang].is-last') ?? buttons[0])?.focus();
}
