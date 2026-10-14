/**
 * Verificación del COMENTARISTA (3r) en navegador real. NO es un test del
 * proyecto: comprueba que los enganches de `main.ts` disparan y que lo que sale
 * por pantalla cuadra con el estado del concurso.
 *
 * Se ejecuta contra el servidor de desarrollo (npm run dev).
 *
 * Va con viewport pequeño y los flags que evitan que Chromium deje de producir
 * fotogramas: sin GPU de verdad (SwiftShader) el fotograma cuesta ~0,6 s, así que
 * este guion tarda minutos. Es el precio de jugar de verdad en vez de simularlo.
 */
import { chromium } from 'playwright';

const URL = process.env.URL_VERIF ?? 'http://localhost:5173/';
const fallos = [];
const ok = [];
const comprobar = (nombre, cond, detalle = '') => (cond ? ok : fallos).push(`${nombre}${detalle ? ` — ${detalle}` : ''}`);
const t0 = Date.now();
const sello = () => `${((Date.now() - t0) / 1000).toFixed(0)}s`;

const navegador = await chromium.launch({
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--disable-features=CalculateNativeWinOcclusion',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-background-timer-throttling',
  ],
});
const ctx = await navegador.newContext({ reducedMotion: 'no-preference', viewport: { width: 480, height: 320 } });
const page = await ctx.newPage();
const errores = [];
page.on('pageerror', (e) => errores.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));

await page.goto(URL, { waitUntil: 'load' });
await page.waitForSelector('#lang-gate:not([hidden])', { timeout: 120000 });
await page.click('button[data-lang="es"]');
await page.waitForFunction(() => window.__court && document.body.dataset.mode === 'play', null, { timeout: 120000, polling: 200 });
await page.waitForTimeout(600);

// Registro de cada subtítulo puesto a la vista, con el estado de ese momento.
await page.evaluate(() => {
  const subs = document.querySelector('[data-subs]');
  const linea = document.querySelector('[data-subs-line]');
  window.__logSubs = [];
  new MutationObserver(() => {
    const e = { linea: linea.textContent, visible: !subs.hidden, ...window.__court.concurso() };
    const ult = window.__logSubs[window.__logSubs.length - 1];
    if (!ult || ult.linea !== e.linea || ult.visible !== e.visible) window.__logSubs.push(e);
  }).observe(subs, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
});

const log = () => page.evaluate(() => window.__logSubs);
const estado = () => page.evaluate(() => window.__court.concurso());
const jugador = () => page.evaluate(() => window.__court.jugador());
const dichas = async () => (await log()).filter((e) => e.visible).map((e) => e.linea);
const alCarro = (x, z) => page.evaluate(([a, b]) => window.__court.jugador(a, b), [x, z]);
const esperar = (fn, ms = 180000) => page.waitForFunction(fn, null, { timeout: ms, polling: 100 });

/** Un tiro: `malo` suelta enseguida (fuera de la verde), `bueno` apunta al centro. */
async function tirar(malo) {
  await esperar(() => window.__court.balon().estado === 'held' && window.__court.concurso().esperando);
  await page.keyboard.down('Space');
  if (malo) {
    await page.waitForTimeout(60);
  } else {
    await esperar(
      () => {
        const meter = document.querySelector('[data-meter]');
        const needle = document.querySelector('[data-needle]');
        const sweet = document.querySelector('[data-sweet]');
        if (meter.hidden || !meter.classList.contains('meter--full')) return false;
        const a = parseFloat(needle.style.left);
        const c = parseFloat(sweet.style.left) + parseFloat(sweet.style.width) / 2;
        return Math.abs(a - c) < parseFloat(sweet.style.width) / 2 - 2;
      },
      60000,
    );
  }
  await page.keyboard.up('Space');
  await esperar(() => !window.__court.concurso().esperando);
  await page.waitForTimeout(150);
}

// ── El concurso, de principio a fin ──────────────────────────────────────
await alCarro(12.105, 6.9);
await page.keyboard.press('e');
await page.waitForTimeout(800);
const convocado = await estado();
comprobar('se convoca el concurso', convocado.activo === true, JSON.stringify(convocado));
comprobar('arranque: la cabina abre el concurso', (await dichas()).some((l) => l.includes('empieza el concurso')), sello());

for (let i = 0; i < 3; i++) await tirar(true); // carro 1 vacío, con tres fallos
const trasFallos = await estado();
comprobar('tres fallos: carro vacío y tres tiros', trasFallos.balones === 0 && trasFallos.tiros === 3, JSON.stringify(trasFallos));
comprobar('los fallos se narran', (await dichas()).filter((l) => l.includes('Fuera')).length >= 3, sello());

await alCarro(7.652, 4.773); // la diagonal: aquí se canta el cambio de carro
await page.waitForTimeout(900);
comprobar('cambio de carro: la cabina canta el carro 2', (await dichas()).some((l) => /Carro 2 de 5/.test(l)));
comprobar('el concurso ha pasado al carro 2', (await estado()).carro === 1, sello());

await tirar(false); // racha 1
comprobar('canasta: se canta el tanto con el marcador', (await dichas()).some((l) => /¡Dentro! Suma 1/.test(l)));
await tirar(false); // racha 2
comprobar('la bola del dinero se canta al cogerla', (await estado()).dinero === true && (await dichas()).some((l) => l.includes('Bola del dinero')), sello());
await tirar(false); // racha 3, con la bola del dinero
const trasDinero = await estado();
comprobar('la bola del dinero vale doble y se canta', trasDinero.puntos >= 4 && (await dichas()).some((l) => l.includes('Doble con la bola del dinero')), sello());

await alCarro(5.525, 0); // el frontal: carro 3
await page.waitForTimeout(900);
comprobar('cambio de carro: la cabina canta el carro 3', (await dichas()).some((l) => /Carro 3 de 5/.test(l)), sello());
await tirar(false); // racha 4
comprobar('racha: cuatro seguidas se cantan', (await dichas()).some((l) => /4 seguidas/.test(l)), (await dichas()).slice(-1)[0]);

const antesBocina = await estado();
await esperar(() => window.__court.concurso().fin === 'tiempo', 1500000);
comprobar('la bocina se canta', (await dichas()).some((l) => l.includes('Bocina')), `${sello()} desde t=${antesBocina.t.toFixed(1)}`);
await esperar(() => !window.__court.concurso().activo, 120000);
await page.waitForTimeout(500);

const fin = await estado();
const final = (await dichas()).filter((l) => l.includes('Se acabó')).at(-1) ?? '';
const cifras = /¡Se acabó! (\d+) puntos[^0-9]+(\d+) de (\d+)/.exec(final);
comprobar(
  'el marcador final sale con las cifras del concurso',
  !!cifras && +cifras[1] === fin.puntos && +cifras[2] === fin.aciertos && +cifras[3] === fin.tiros,
  `${final} | estado: ${fin.puntos} puntos, ${fin.aciertos}/${fin.tiros}`,
);
comprobar('y con récord personal lo dice', final.includes('récord'), final);
comprobar('el récord del concurso se guarda', fin.mejor === fin.puntos && fin.puntos > 0, `mejor ${fin.mejor} vs ${fin.puntos}`);
comprobar('el jugador acaba con el balón en las manos', (await page.evaluate(() => window.__court.balon().estado)) === 'held');
comprobar('sin errores de página', errores.length === 0, errores.slice(0, 3).join(' | '));

console.log(`\n${ok.length} comprobaciones OK\n`);
for (const l of ok) console.log(`  ✓ ${l}`);
if (fallos.length) {
  console.log(`\n${fallos.length} FALLOS\n`);
  for (const l of fallos) console.log(`  ✗ ${l}`);
}
console.log('\n--- subtítulos vistos (línea · puntos · aciertos/tiros · carro · balones) ---');
for (const e of await log()) {
  if (e.visible) console.log(`  ${e.linea}  [${e.puntos} pts · ${e.aciertos}/${e.tiros} · carro ${e.carro} · ${e.balones} balones]`);
}
console.log(`\ntiempo total: ${sello()}`);
console.log(`jugador final: ${JSON.stringify(await jugador())}`);

await navegador.close();
process.exit(fallos.length ? 1 : 0);
