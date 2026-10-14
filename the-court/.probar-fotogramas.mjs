/** Sonda: ¿hay fotogramas en el headless? (el reloj del concurso debe avanzar). */
import { chromium } from 'playwright';

const URL = process.env.URL_VERIF ?? 'http://localhost:5173/';
const args = process.env.SIN_FLAGS
  ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
  : [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist',
      '--disable-features=CalculateNativeWinOcclusion',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-background-timer-throttling',
    ];

const navegador = await chromium.launch({ args });
const page = await (await navegador.newContext({ reducedMotion: 'no-preference' })).newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForSelector('#lang-gate:not([hidden])', { timeout: 90000 });
await page.click('button[data-lang="es"]');
await page.waitForFunction(() => window.__court && document.body.dataset.mode === 'play', null, { timeout: 60000, polling: 200 });
await page.evaluate(() => window.__court.jugador(12.105, 6.9));
await page.waitForTimeout(600);
await page.keyboard.press('e');
await page.waitForTimeout(900);
const t1 = await page.evaluate(() => ({ t: window.__court.concurso().t, ventana: window.__court.calidad().ventana, mediana: window.__court.calidad().medianaMs }));
await page.waitForTimeout(3000);
const t2 = await page.evaluate(() => ({ t: window.__court.concurso().t, ventana: window.__court.calidad().ventana, balon: window.__court.balon().estado }));
console.log(JSON.stringify({ t1, t2, avanza: t1.t - t2.t, flags: !process.env.SIN_FLAGS }));
await navegador.close();
