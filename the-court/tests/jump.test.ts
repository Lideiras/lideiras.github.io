import { describe, expect, it } from 'vitest';
import { G, SHOOT_JUMP } from '../src/game/config';
import { launchJump, newJump, peakOf, stepJump } from '../src/game/jump';

/** Altura del rebote de la celebración, el salto "de verdad" que había antes. */
const CELEBRATION_BOUNCE = 0.12;

/** Simula el bucle a `fps` durante `seconds`, y devuelve la altura máxima. */
function sim(v: number, seconds = 2, fps = 60): { max: number; airTime: number } {
  const j = newJump();
  launchJump(j, v);
  const dt = 1 / fps;
  let max = 0;
  let airTime = 0;
  for (let t = 0; t < seconds; t += dt) {
    const grounded = stepJump(j, dt);
    if (grounded) {
      if (max > 0) break;
      continue;
    }
    airTime += dt;
    max = Math.max(max, j.y);
  }
  return { max, airTime };
}

describe('salto del tiro', () => {
  it('sube bastante mas que el rebote de la|RD', () => {
    // El requisito era "mas alto que lo que ya habia", y lo que habia era el
    // rebote de 0,12 m de la celebracion. Este salto tiene que ser claramente
    // mas alto o no cumple.
    const { max } = sim(SHOOT_JUMP);
    expect(max).toBeGreaterThan(CELEBRATION_BOUNCE * 3);
    expect(max).toBeGreaterThan(0.5);
  });

  it('la altura coincide con v^2 / 2g', () => {
    const { max } = sim(SHOOT_JUMP);
    expect(max).toBeCloseTo(peakOf(SHOOT_JUMP), 1);
    expect(peakOf(SHOOT_JUMP)).toBeCloseTo(0.589, 2);
  });

  it('da mas de un tercio de la altura del personaje', () => {
    // El personaje mide 1,809 m. Un salto que no seộtiese cuenta al saltar
    // de cerca no se lee ni en su propia pantalla.
    expect(peakOf(SHOOT_JUMP) / 1.809).toBeGreaterThan(0.3);
  });

  it('vuelve al suelo solo', () => {
    const { airTime } = sim(SHOOT_JUMP);
    expect(airTime).toBeGreaterThan(0.5);
    expect(airTime).toBeLessThan(0.9);
    expect(stepJump(newJump(), 1 / 60)).toBe(true);
  });

  it('nunca atraviesa el suelo, a ningun paso', () => {
    for (const fps of [30, 60, 144]) {
      const j = newJump();
      launchJump(j);
      for (let i = 0; i < 600; i++) {
        stepJump(j, 1 / fps);
        expect(j.y, `${fps} fps, paso ${i}`).toBeGreaterThanOrEqual(0);
      }
      expect(j.y).toBe(0);
      expect(j.vel).toBe(0);
    }
  });

  it('un salto mas fuerte da mas altura (monotono)', () => {
    expect(peakOf(2)).toBeLessThan(peakOf(3.4));
    expect(peakOf(3.4)).toBeLessThan(peakOf(5));
  });

  it('permanece quieto cuando no hay salto', () => {
    const j = newJump();
    for (let i = 0; i < 120; i++) {
      expect(stepJump(j, 1 / 60)).toBe(true);
    }
    expect(j.y).toBe(0);
    expect(j.vel).toBe(0);
  });

  it('a 60 fps y 30 fps coincide: el salto no depende del frame rate', () => {
    expect(sim(SHOOT_JUMP, 2, 60).max).toBeCloseTo(sim(SHOOT_JUMP, 2, 30).max, 2);
  });

  it('la gravedad es la del juego', () => {
    expect(G).toBe(9.81);
  });
});
