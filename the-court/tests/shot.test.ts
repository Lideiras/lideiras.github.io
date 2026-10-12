import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { Ball } from '../src/game/ball';
import { RIM, rimX, G, METER_HZ, SHOOT_RANGE, SWEET_SPOT } from '../src/game/config';
import {
  applyShotError,
  difficultyAt,
  evaluateMeter,
  meterAt,
  solveShot,
  sweetSpotAt,
} from '../src/game/shot';

const rimLeft = { x: rimX(-1), y: RIM.y, z: 0 };

describe('solveShot', () => {
  const shooters = [
    { x: -4.4, y: 2.1, z: 0.5 },
    { x: -8, y: 2.1, z: -3 },
    { x: -10.5, y: 2.1, z: 1 },
    { x: -2, y: 2.1, z: 6 },
    { x: 0, y: 2.15, z: 0 },
  ];
  it.each(shooters)('llega al centro del aro descendiendo desde %o', (from) => {
    const s = solveShot(from, rimLeft)!;
    expect(s).not.toBeNull();
    const x = from.x + s.vx * s.t;
    const z = from.z + s.vz * s.t;
    const y = from.y + s.vy * s.t - 0.5 * G * s.t * s.t;
    expect(x).toBeCloseTo(rimLeft.x, 5);
    expect(z).toBeCloseTo(rimLeft.z, 5);
    expect(y).toBeCloseTo(RIM.y, 5);
    expect(s.vy - G * s.t).toBeLessThan(0);
  });
});

describe('medidor', () => {
  it('es triangular 0→1→0', () => {
    expect(meterAt(0)).toBeCloseTo(0);
    expect(meterAt(1 / METER_HZ)).toBeCloseTo(1);
    expect(meterAt(2 / METER_HZ)).toBeCloseTo(0);
  });
  it('centro = perfecto', () => {
    expect(evaluateMeter(0.5).perfect).toBe(true);
    expect(evaluateMeter(0.9).perfect).toBe(false);
  });
});

function simulate(e: number, from: { x: number; y: number; z: number }) {
  let scores = 0;
  const ball = new Ball(new THREE.Object3D(), { score: () => scores++ });
  const sol = solveShot(from, rimLeft)!;
  const v = applyShotError(sol, e, 1, () => 0.5);
  ball.launch(new THREE.Vector3(from.x, from.y, from.z), new THREE.Vector3(v.x, v.y, v.z));
  for (let i = 0; i < 60 * 6; i++) ball.step(1 / 60);
  return scores;
}

describe('Ball física + canasta', () => {
  it.each(shootersForBall())('desde %o: toda la zona verde encesta exactamente una vez', (from) => {
    for (const e of [-SWEET_SPOT, -0.1, 0, 0.1, SWEET_SPOT]) {
      expect(simulate(e, from)).toBe(1);
    }
  });
  it('un tiro muy corto (extremo del medidor) no encesta', () => {
    expect(simulate(-1, { x: -4.4, y: 2.1, z: 0.5 })).toBe(0);
  });
  it('un tiro corto fuera de la zona verde no encesta desde media distancia', () => {
    expect(simulate(-0.7, { x: -4.4, y: 2.1, z: 0.5 })).toBe(0);
  });
});

function shootersForBall() {
  return [
    { x: -4.4, y: 2.1, z: 0.5 },
    { x: -8, y: 2.1, z: -3 },
    { x: -10.5, y: 2.1, z: 1 },
    { x: -2, y: 2.1, z: 6 },
  ];
}

describe('dificultad por distancia', () => {
  it('debajo del aro es difficulty 0 (tiro regalado)', () => {
    expect(difficultyAt(0)).toBe(0);
    expect(difficultyAt(1.5)).toBe(0);
  });

  it('a SHOOT_RANGE o más es difficulty 1 (máxima)', () => {
    expect(difficultyAt(SHOOT_RANGE)).toBeCloseTo(1, 10);
    expect(difficultyAt(SHOOT_RANGE + 40)).toBe(1);
  });

  it('crece de forma monótona con la distancia', () => {
    let prev = -1;
    for (let d = 0; d <= 14; d += 0.25) {
      const cur = difficultyAt(d);
      expect(cur).toBeGreaterThanOrEqual(prev);
      prev = cur;
    }
  });

  it('la zona verde se estrecha de SWEET_SPOT a la mitad', () => {
    expect(sweetSpotAt(0)).toBe(SWEET_SPOT);
    expect(sweetSpotAt(1)).toBeCloseTo(SWEET_SPOT / 2, 10);
  });

  it('la zona verde se estrecha de forma monótona', () => {
    let prev = Infinity;
    for (let d = 0; d <= 1; d += 0.05) {
      const cur = sweetSpotAt(d);
      expect(cur).toBeLessThanOrEqual(prev);
      prev = cur;
    }
  });

  it('un timing que COLABA de cerca NO cuela de lejos', () => {
    // e = 0,22 cae entre la zona estrecha (0,15) y la ancha (0,30): es el
    // rango exacto donde la distancia decide si el tiro entra o no.
    const m = 0.5 + 0.22 / 2;
    expect(evaluateMeter(m, 0).perfect).toBe(true);
    expect(evaluateMeter(m, 1).perfect).toBe(false);
  });

  it('un timing imposible de acertar falla igual de lejos que de cerca', () => {
    const m = 0.5 + 0.45 / 2; // e = 0,45: fuera de cualquier zona verde
    expect(evaluateMeter(m, 0).perfect).toBe(false);
    expect(evaluateMeter(m, 1).perfect).toBe(false);
  });

  it('el ancho visible del medidor es 30 % de cerca y 15 % de lejos', () => {
    // Estos son los números que el HUD pinta, así que fijan lo que ve el jugador.
    expect(sweetSpotAt(difficultyAt(1.5)) * 100).toBeCloseTo(30, 10);
    expect(sweetSpotAt(difficultyAt(SHOOT_RANGE)) * 100).toBeCloseTo(15, 10);
  });

  it('el error se amplifica con la distancia', () => {
    const sol = solveShot({ x: -8, y: 2.1, z: 0 }, rimLeft)!;
    const far = applyShotError(sol, 0.9, 1, () => 0.5, 1);
    const near = applyShotError(sol, 0.9, 1, () => 0.5, 0);
    const dv = (v: { x: number; y: number; z: number }) => Math.hypot(v.x - sol.vx, v.y - sol.vy, v.z - sol.vz);
    expect(dv(far)).toBeGreaterThan(dv(near));
  });
});
