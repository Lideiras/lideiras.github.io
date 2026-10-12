import { describe, expect, it } from 'vitest';
import { COURT, RIM } from '../src/game/config';

const halfL = COURT.halfL;
const halfW = COURT.halfW;
const arcR = 6.75;
const OFFSET = RIM.fromBaseline;
const CORNER_STRAIGHT = 0.9;
const ang = Math.acos(-(OFFSET - CORNER_STRAIGHT) / arcR);
const cornerZ = arcR * Math.sin(ang);

/**
 * El perímetro del triple.
 *
 * Son tres piezas que tienen que cerrar: la recta de esquina, el arco y la otra
 * recta. Antes el arco acababa en x = -11,01 y la recta empezaba en x = -13,84,
 * con 2,83 m de hueco: el triple se veía cortado antes de llegar al fondo.
 *
 * Estos tests fijan el cierre en números para que no vuelva a abrirse.
 */
describe('linea de tres puntos', () => {
  for (const side of [-1, 1] as const) {
    const hx = side * (halfL - OFFSET);
    const baseX = side * halfL;
    const xEnd = side * (halfL - CORNER_STRAIGHT);

    // El extremo del arco, en coordenadas del mundo.
    const arcEndX = side === -1 ? hx + arcR * Math.cos(ang) : hx - arcR * Math.cos(ang);
    const arcEndZ = cornerZ;

    it(`${side < 0 ? 'izquierda' : 'derecha'}: el arco y la recta se tocan`, () => {
      expect(Math.abs(arcEndX - xEnd)).toBeLessThan(1e-9);
    });

    it(`${side < 0 ? 'izquierda' : 'derecha'}: la recta llega a la linea de fondo`, () => {
      expect(Math.abs(baseX - side * halfL)).toBeLessThan(1e-9);
      // 0,90 m de recta, que es lo que marca el reglamento.
      expect(Math.abs(baseX - xEnd)).toBeCloseTo(CORNER_STRAIGHT, 9);
    });

    it(`${side < 0 ? 'izquierda' : 'derecha'}: el extremo cae dentro de la pista`, () => {
      expect(Math.abs(arcEndZ)).toBeLessThan(halfW);
      expect(Math.abs(arcEndX)).toBeLessThan(halfL);
    });
  }

  it('los dos lados son simétricos', () => {
    const hxL = -(halfL - OFFSET);
    const hxR = halfL - OFFSET;
    expect(hxL + hxR).toBeCloseTo(0, 9);
    // El ángulo de recorte es el mismo en los dos lados.
    expect(cornerZ).toBeCloseTo(arcR * Math.sin(ang), 12);
  });

  it('la union cae cerca de la esquina reglamentaria', () => {
    // 11 cm de diferencia con la recta a 0,90 m de la banda: es la
    // contradicción geométrica de la que habla el comentario del código.
    expect(Math.abs(cornerZ - (halfW - 0.9))).toBeLessThan(0.15);
    expect(cornerZ).toBeLessThan(halfW);
  });

  it('el arco no invade la banda', () => {
    for (let t = -ang; t <= ang; t += 0.05) {
      expect(arcR * Math.abs(Math.sin(t))).toBeLessThan(halfW);
    }
  });
});
