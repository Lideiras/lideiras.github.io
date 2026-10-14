import { describe, expect, it } from 'vitest';
import { DUNK_RANGE, DUNK_RUN_MIN, DUNK_STOP, rimX } from '../src/game/config';
import {
  DUNK_ALTURA,
  DUNK_CAIDA,
  DUNK_TOTAL,
  DUNK_VUELO,
  dunkPose,
  dunkX,
  dunkY,
  dunkZ,
  newDunk,
  puedeMate,
  startDunk,
  stepDunk,
  type Dunk,
} from '../src/game/dunk';

/** Avanza la animación `ms` segundos a `fps` fotogramas por segundo. */
function correr(d: Dunk, ms: number, fps = 60): { golpes: number; fines: number } {
  let golpes = 0;
  let fines = 0;
  const dt = 1 / fps;
  for (let t = 0; t < ms; t += dt) {
    const p = stepDunk(d, dt);
    if (p.golpe) golpes++;
    if (p.fin) fines++;
  }
  return { golpes, fines };
}

describe('mate en carrera: cuándo se decide', () => {
  it('corriendo y cerca del aro, el tiro es mate', () => {
    expect(puedeMate(1.2, 1, DUNK_RANGE, DUNK_RUN_MIN)).toBe(true);
    expect(puedeMate(DUNK_RANGE, DUNK_RUN_MIN, DUNK_RANGE, DUNK_RUN_MIN)).toBe(true);
  });

  it('quieto NO es mate, por cerca que esté: ése es el tiro de cerca de siempre', () => {
    expect(puedeMate(1.2, 0, DUNK_RANGE, DUNK_RUN_MIN)).toBe(false);
    // Justo por debajo del umbral tampoco: se camina, no se machaca.
    expect(puedeMate(1.2, DUNK_RUN_MIN - 0.01, DUNK_RANGE, DUNK_RUN_MIN)).toBe(false);
  });

  it('corriendo pero lejos tampoco: el mate no tiene alcance de tres puntos', () => {
    expect(puedeMate(DUNK_RANGE + 0.01, 1, DUNK_RANGE, DUNK_RUN_MIN)).toBe(false);
  });
});

describe('mate en carrera: la llegada al aro', () => {
  it('termina a DUNK_STOP del centro del aro, sobre la recta de aproximación', () => {
    const d = newDunk();
    startDunk(d, rimX(-1) + 5, 0, -1);
    const distFinal = Math.hypot(d.x1 - rimX(-1), d.z1);
    expect(distFinal).toBeCloseTo(DUNK_STOP, 6);
    // Y va en línea recta desde donde estaba: misma dirección que el aro.
    expect(d.z1).toBeCloseTo(0, 6);
  });

  it('llega al aro desde el lado: el destino se aparta en Z, no se queda en el poste', () => {
    const d = newDunk();
    startDunk(d, rimX(1) + 6, 4, 1);
    const distFinal = Math.hypot(d.x1 - rimX(1), d.z1);
    expect(distFinal).toBeCloseTo(DUNK_STOP, 6);
    // La recta de aproximación pasa por el aro: el destino está entre el
    // jugador y el aro, nunca al otro lado.
    expect(Math.sign(rimX(1) - d.x1)).toBe(Math.sign(rimX(1) - (rimX(1) + 6)));
    expect(Math.abs(d.z1)).toBeLessThan(4);
  });

  it('si YA estaba más cerca que DUNK_STOP, no retrocede: mate vertical', () => {
    const d = newDunk();
    startDunk(d, rimX(-1) + 0.5, 0, -1);
    expect(d.x1).toBeCloseTo(rimX(-1) + 0.5, 6);
    expect(d.z1).toBeCloseTo(0, 6);
  });
});

describe('mate en carrera: la animación', () => {
  it('el avance llega al destino y no lo pasa, y el cuerpo nunca se hunde', () => {
    const d = newDunk();
    startDunk(d, rimX(-1) + 4, 2, -1);
    correr(d, DUNK_TOTAL + 0.1);
    expect(dunkX(d)).toBeCloseTo(d.x1, 6);
    expect(dunkZ(d)).toBeCloseTo(d.z1, 6);
    expect(dunkY(d)).toBe(0);
    expect(d.activo).toBe(false);
  });

  it('el pico del salto cae EN el golpe, no a mitad del vuelo', () => {
    const d = newDunk();
    startDunk(d, rimX(-1) + 3, 0, -1);
    let maxY = -1;
    let maxT = -1;
    const dt = 1 / 240;
    while (d.activo) {
      stepDunk(d, dt);
      const y = dunkY(d);
      if (y > maxY) {
        maxY = y;
        maxT = d.t;
      }
    }
    expect(maxY).toBeCloseTo(DUNK_ALTURA, 3);
    /*
     * El pico cae EN `DUNK_VUELO` (el golpe), con la tolerancia de un fotograma:
     * el máximo de una parábola no tiene por qué caer en un múltiplo de `dt`, así
     * que el muestreo lo puede coger un fotograma antes. Lo que este aserto
     * descarta es el error que importa: un salto cuyo pico esté a mitad del
     * vuelo, que es lo que saldría con una parábola simétrica.
     */
    expect(Math.abs(maxT - DUNK_VUELO)).toBeLessThanOrEqual(dt + 1e-9);
    // Control: a mitad del vuelo el cuerpo está claramente más bajo.
    const mitad = newDunk();
    startDunk(mitad, rimX(-1) + 3, 0, -1);
    stepDunk(mitad, DUNK_VUELO / 2);
    expect(dunkY(mitad)).toBeLessThan(maxY - 0.05);
  });

  it('el golpe y el final salen UNA sola vez cada uno, con cualquier dt', () => {
    for (const fps of [24, 30, 60, 144]) {
      const d = newDunk();
      startDunk(d, rimX(1) + 5, -3, 1);
      const { golpes, fines } = correr(d, DUNK_TOTAL * 3, fps);
      expect(golpes, `a ${fps} fps`).toBe(1);
      expect(fines, `a ${fps} fps`).toBe(1);
    }
  });

  it('sin arrancarla no pasa nada: ni golpe ni fin ni movimiento', () => {
    const d = newDunk();
    const { golpes, fines } = correr(d, 1);
    expect(golpes).toBe(0);
    expect(fines).toBe(0);
    expect(d.activo).toBe(false);
    expect(dunkY(d)).toBe(0);
  });

  it('el peso de la pose está arriba ANTES de llegar al aro y vuelve a 0 al final', () => {
    const d = newDunk();
    startDunk(d, rimX(-1) + 3, 0, -1);
    // A mitad de la carrera el brazo ya va camino de arriba…
    const mitad = DUNK_VUELO / 2;
    stepDunk(d, mitad);
    expect(dunkPose(d)).toBeGreaterThan(0.5);
    // …y en el golpe está arriba del todo.
    stepDunk(d, DUNK_VUELO - mitad);
    expect(dunkPose(d)).toBe(1);
    // Al final la pose suelta, así que no hay salto de huesos al volver a andar.
    correr(d, DUNK_CAIDA + 0.05);
    expect(dunkPose(d)).toBe(0);
  });

  it('el resultado no depende del frame rate (24 vs 144 fps)', () => {
    const a = newDunk();
    const b = newDunk();
    startDunk(a, rimX(1) + 4.5, 1.5, 1);
    startDunk(b, rimX(1) + 4.5, 1.5, 1);
    correr(a, DUNK_TOTAL + 0.2, 24);
    correr(b, DUNK_TOTAL + 0.2, 144);
    expect(dunkX(a)).toBeCloseTo(dunkX(b), 6);
    expect(dunkZ(a)).toBeCloseTo(dunkZ(b), 6);
    expect(Math.hypot(dunkX(a) - b.x1, dunkZ(a) - b.z1)).toBeLessThan(1e-6);
  });
});
