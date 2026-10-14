/** Diagnóstico puntual: ¿dónde se rompe la cadena? No es un test del proyecto. */
import { chromium } from 'playwright';

const URL = 'http://127.0.0.1:5173/';
const navegador = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const ctx = await navegador.newContext({ reducedMotion: 'no-preference' });
const page = await ctx.newPage();
const errores = [];
page.on('pageerror', (e) => errores.push('PAGEERROR ' + String(e).slice(0, 300)));
page.on('console', (m) => m.type() === 'error' && errores.push('CONSOLE ' + m.text().slice(0, 300)));

const cam = () =>
  page.evaluate(() => {
    const c = window.__court?.camera;
    return c ? [+c.position.x.toFixed(3), +c.position.y.toFixed(3), +c.position.z.toFixed(3)] : null;
  });
const estado = () =>
  page.evaluate(() => ({
    modo: document.body.dataset.mode,
    mediana: window.__court?.calidad?.().medianaMs ?? null,
    escala: window.__court?.calidad?.().escala ?? null,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    activo: document.activeElement?.tagName + '#' + (document.activeElement?.id || ''),
  }));

await page.goto(URL, { waitUntil: 'load' });
await page.waitForSelector('#lang-gate:not([hidden])', { timeout: 60000 });

console.log('--- EN LA CINEMÁTICA ---');
console.log('estado:', JSON.stringify(await estado()));
const a1 = await cam();
await page.waitForTimeout(2000);
const a2 = await cam();
console.log('cámara t0:', JSON.stringify(a1), ' t+2s:', JSON.stringify(a2));
console.log('delta:', a1 && a2 ? Math.hypot(a2[0] - a1[0], a2[1] - a1[1], a2[2] - a1[2]).toFixed(3) : 'n/a');

console.log('\n--- PULSANDO ESPAÑOL ---');
await page.locator('button[data-lang="es"]').click();
await page.waitForTimeout(1500);
console.log('estado:', JSON.stringify(await estado()));
const b1 = await cam();
await page.waitForTimeout(1500);
const b2 = await cam();
console.log('cámara t0:', JSON.stringify(b1), ' t+1,5s:', JSON.stringify(b2));
console.log('delta sin teclas:', b1 && b2 ? Math.hypot(b2[0] - b1[0], b2[1] - b1[1], b2[2] - b1[2]).toFixed(3) : 'n/a');

console.log('\n--- MANTENIENDO W 1,5 s ---');
await page.keyboard.down('KeyW');
await page.waitForTimeout(1500);
await page.keyboard.up('KeyW');
await page.waitForTimeout(300);
const c2 = await cam();
console.log('cámara tras W:', JSON.stringify(c2));
console.log(
  'delta al andar:',
  b2 && c2 ? Math.hypot(c2[0] - b2[0], c2[1] - b2[1], c2[2] - b2[2]).toFixed(3) : 'n/a',
);
console.log('estado final:', JSON.stringify(await estado()));

console.log('\n--- ERRORES ---');
console.log(errores.length ? errores.slice(0, 8).join('\n') : '(ninguno)');
await navegador.close();