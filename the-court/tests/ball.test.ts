import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createBallMesh } from '../src/game/builders/props';

/** Color de un vértice, en sRGB (el atributo se guarda en lineal). */
const srgb = (c: THREE.BufferAttribute, i: number): number => {
  const t = new THREE.Color(c.getX(i), c.getY(i), c.getZ(i));
  return t.getHex();
};

/**
 * Reparto de la corteza del balón entre cuero y costuras.
 *
 * El balón se voxeliza con muy pocas celdas de lado (12), así que una costura
 * de DOS celdas de grosor se come una fracción enorme de la esfera. Con 12,
 * cada plano de costura ocupa el equivalente a un 17 % del diámetro y hay tres
 * planos: entre los tres se llevan más de la mitad de la superficie y el balón
 * deja de leerse naranja. Este test mide ese reparto para que la decisión sea
 * un número y no una impresión.
 */
function reparto(): { cuero: number; costura: number; total: number } {
  const g = createBallMesh();
  let cuero = 0;
  let costura = 0;
  g.traverse((o) => {
    if (!(o as THREE.Mesh).isMesh) return;
    const attr = (o as THREE.Mesh).geometry.getAttribute('color');
    if (!attr) return;
    // El costillar es marrón cálido (#8a4413); el cuero, naranja saturado
    // (#ff7a1a). Se separan por el canal rojo en sRGB.
    for (let i = 0; i < attr.count; i++) {
      const hex = srgb(attr as THREE.BufferAttribute, i);
      const r = (hex >> 16) & 255;
      if (r > 150) cuero++;
      else costura++;
    }
  });
  return { cuero, costura, total: cuero + costura };
}

describe('balon: reparto de la corteza', () => {
  const r = reparto();

  it('el cuero es MAS de la mitad de la corteza', () => {
    // Si las costuras se comen el cuero, el balón se ve marrón aunque el color
    // base sea naranja. Este es el fallo que se estaba viendo.
    const ratio = r.cuero / r.total;
    expect(ratio, `cuero ${(ratio * 100).toFixed(0)} %`).toBeGreaterThan(0.7);
  });

  it('hay costuras, y son visibles', () => {
    const ratio = r.costura / r.total;
    expect(ratio, `costuras ${(ratio * 100).toFixed(0)} %`).toBeGreaterThan(0.03);
  });

  it('el cuir es naranja saturado, no marrón', () => {
    const g = createBallMesh();
    let maxRojo = 0;
    g.traverse((o) => {
      if (!(o as THREE.Mesh).isMesh) return;
      const attr = (o as THREE.Mesh).geometry.getAttribute('color');
      if (!attr) return;
      for (let i = 0; i < attr.count; i++) {
        const r = (srgb(attr as THREE.BufferAttribute, i) >> 16) & 255;
        if (r > maxRojo) maxRojo = r;
      }
    });
    // Sin AO, el naranja #ff7a1a tiene el canal rojo a 255. Si el máximo sale
    // muy por debajo, el naranja no llega a la malla.
    expect(maxRojo).toBeGreaterThan(230);
  });
});
