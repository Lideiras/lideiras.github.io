/**
 * Verificación de T1 en navegador real. NO es un test del proyecto: es una
 * comprobación puntual de la secuencia de arranque, que `tsc` y vitest no tocan.
 *
 * Se ejecuta contra el servidor de desarrollo (npm run dev).
 */
import { chromium } from 'playwright';

const URL = process.env.URL_VERIF ?? 'http://localhost:5173/';
const fallos = [];
const ok = [];

function comprobar(nombre, cond, detalle = '') {
  (cond ? ok : fallos).push(`${nombre}${detalle ? ` — ${detalle}` : ''}`);
}

// Sin esto el headless puede no tener WebGL2 y la página caería a /classic/,
// que es la respuesta CORRECTA para un navegador sin GPU pero inútil para
// verificar la cinemática. SwiftShader da un contexto software real.
const navegador = await chromium.launch({
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
  ],
});

// ── 1. PRIMERA VISITA (sin idioma guardado) ──────────────────────────────
{
  const ctx = await navegador.newContext({ reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));

  await page.goto(URL, { waitUntil: 'load' });

  // La barra debe verse y la puerta NO, durante la carga.
  const loaderVisibleTemprano = await page.locator('#loader').isVisible().catch(() => false);

  // Esperar a que aparezca la puerta (la escena ya está cargada).
  let puertaVisible = false;
  try {
    await page.waitForSelector('#lang-gate:not([hidden])', { timeout: 60000 });
    puertaVisible = await page.locator('#lang-gate').isVisible();
  } catch {
    puertaVisible = false;
  }
  comprobar('primera visita: la puerta aparece', puertaVisible);

  // ¿Hay WebGL de verdad? En headless puede no haberlo y caer a /classic/.
  const urlFinal = page.url();
  const cayoAClasica = urlFinal.includes('/classic/');
  comprobar('no se cayó a /classic/ (hay WebGL2)', !cayoAClasica, urlFinal);

  if (!cayoAClasica) {
    const modo = await page.evaluate(() => document.body.dataset.mode);
    comprobar('modo = attract con la pista detrás', modo === 'attract', `modo=${modo}`);

    // La cámara tiene que ESTAR MOVIÉNDOSE: dos lecturas separadas.
    const pos1 = await page.evaluate(() => {
      const c = window.__court?.camera;
      return c ? [+c.position.x.toFixed(3), +c.position.y.toFixed(3), +c.position.z.toFixed(3)] : null;
    });
    await page.waitForTimeout(1500);
    const pos2 = await page.evaluate(() => {
      const c = window.__court?.camera;
      return c ? [+c.position.x.toFixed(3), +c.position.y.toFixed(3), +c.position.z.toFixed(3)] : null;
    });
    comprobar('hay sonda de cámara (__court)', pos1 !== null);
    if (pos1 && pos2) {
      const movido = Math.hypot(pos2[0] - pos1[0], pos2[1] - pos1[1], pos2[2] - pos1[2]);
      comprobar('la cámara SE MUEVE (órbita viva)', movido > 0.05, `Δ=${movido.toFixed(3)} m en 1,5 s`);
    }

    // El canvas no puede estar en negro. NO se lee con `readPixels`: sin
    // `preserveDrawingBuffer` devuelve vacío una vez que el navegador ha
    // compuesto el fotograma, y daría un falso negativo. Se captura de verdad.
    const disparo = await page.screenshot({ type: 'png' });
    await page.screenshot({ path: '.verif-cinematica.png', fullPage: false });
    comprobar('la captura no viene vacía', disparo.length > 8000, `${disparo.length} bytes`);
    const pixeles = await page.evaluate(async () => {
      // Se pinta la escena sobre un canvas 2D para contar colores de verdad.
      const c = document.getElementById('game');
      if (!c) return { n: 0 };
      const o = document.createElement('canvas');
      o.width = 160; o.height = 90;
      const ctx2 = o.getContext('2d');
      ctx2.drawImage(c, 0, 0, 160, 90);
      const d = ctx2.getImageData(0, 0, 160, 90).data;
      const vistos = new Set();
      for (let i = 0; i < d.length; i += 4) vistos.add(`${d[i]},${d[i + 1]},${d[i + 2]}`);
      return { n: vistos.size };
    });
    comprobar('la escena se dibuja (variedad de color)', pixeles.n > 12, `${pixeles.n} colores distintos`);

    // El HUD debe estar oculto durante la cinemática.
    const uiVisible = await page.locator('#ui').isVisible().catch(() => false);
    comprobar('el HUD está oculto en la cinemática', !uiVisible);

    // Elegir idioma -> debe entrar en juego.
    await page.locator('button[data-lang="en"]').click();
    await page.waitForTimeout(1200);
    const modoTras = await page.evaluate(() => document.body.dataset.mode);
    comprobar('al elegir idioma entra en play', modoTras === 'play', `modo=${modoTras}`);

    const puertaOculta = await page.locator('#lang-gate').isHidden();
    comprobar('la puerta se aparta', puertaOculta);

    // `#ui` no sirve para esto: sus hijos son `position: fixed`, así que el div
    // mide 0x0 y Playwright lo da por invisible siempre. Se mira el HUD de verdad.
    const hudVisible = await page.locator('.hud .chip').isVisible().catch(() => false);
    comprobar('el HUD vuelve', hudVisible);

    // ¿Un solo bucle? Medir fps aproximados con dos requestAnimationFrameChain.
    const fotogramas = await page.evaluate(
      () =>
        new Promise((res) => {
          let n = 0;
          const t0 = performance.now();
          const paso = () => {
            n++;
            if (performance.now() - t0 < 1000) requestAnimationFrame(paso);
            else res(n);
          };
          requestAnimationFrame(paso);
        }),
    );
    // headless va a vsync o más; lo que importa es que no sea 0 ni 2x.
    comprobar('el bucle corre a ritmo normal', fotogramas > 20 && fotogramas < 130, `${fotogramas} fps aprox`);

    comprobar('sin errores de consola', errores.length === 0, errores.slice(0, 3).join(' | '));
  }
  await ctx.close();
}

// ── 2. VISITA DE VUELTA (con idioma guardado): la cinemática sale IGUAL ───
// Decisión del propietario: el idioma se pide SIEMPRE, para que la cinemática
// no se pueda saltar. Del idioma anterior sólo se guarda el resalte del botón.
{
  const ctx = await navegador.newContext({ reducedMotion: 'no-preference' });
  await ctx.addInitScript(() => localStorage.setItem('court.lang', 'es'));
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));

  await page.goto(URL, { waitUntil: 'load' });
  let ok2 = false;
  try {
    await page.waitForSelector('#lang-gate:not([hidden])', { timeout: 60000 });
    ok2 = true;
  } catch { ok2 = false; }
  comprobar('visita de vuelta: la cinemática sale igual', ok2);

  const resaltado = await page.locator('button[data-lang].is-last').textContent().catch(() => null);
  comprobar('resalta el idioma anterior', resaltado === 'Español', `resaltado=${resaltado}`);

  await page.locator('button[data-lang="en"]').click();
  await page.waitForTimeout(1200);
  const modo2 = await page.evaluate(() => document.body.dataset.mode);
  comprobar('visita de vuelta: entra en play', modo2 === 'play', `modo=${modo2}`);

  // Y tiene que PODER JUGAR: sin esto el bug del bucle se cuela por debajo.
  const leerCam = () =>
    page.evaluate(() => {
      const c = window.__court?.camera;
      return c ? [+c.position.x.toFixed(3), +c.position.y.toFixed(3), +c.position.z.toFixed(3)] : null;
    });
  const antes = await leerCam();
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(1200);
  await page.keyboard.up('KeyW');
  await page.waitForTimeout(200);
  const despues = await leerCam();
  const movido =
    antes && despues
      ? Math.hypot(despues[0] - antes[0], despues[1] - antes[1], despues[2] - antes[2])
      : 0;
  comprobar('el jugador SE MUEVE con W', movido > 0.3, `Δ=${movido.toFixed(3)} m`);

  const mediana = await page.evaluate(() => window.__court?.calidad?.().medianaMs ?? 0);
  comprobar('el bucle de render corre', mediana > 0, `mediana=${mediana} ms`);

  comprobar('visita de vuelta: sin errores', errores.length === 0, errores.slice(0, 3).join(' | '));
  await ctx.close();
}

await navegador.close();

console.log('\n================ OK ================');
ok.forEach((l) => console.log('  ✓ ' + l));
if (fallos.length) {
  console.log('\n============== FALLOS ==============');
  fallos.forEach((l) => console.log('  ✗ ' + l));
  process.exit(1);
}
console.log(`\nTODO VERIFICADO (${ok.length} comprobaciones).`);