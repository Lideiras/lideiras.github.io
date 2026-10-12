// Silkscreen es la tipografía pixel de la estética voxel (decisión del propietario).
import '@fontsource/silkscreen';
import '@fontsource/silkscreen/700.css';
// Bebas Neue e Inter se quedan como respaldo para textos largos.
import '@fontsource/bebas-neue';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import './styles.css';
import { readSavedLang, setLang, t, type Lang } from './i18n';

/** true = preguntar el idioma en CADA visita, antes de cargar el juego. */
const ASK_EVERY_VISIT = true;

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
