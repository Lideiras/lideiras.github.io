import * as THREE from 'three';
import { buildHoop, buildScorerTable, buildBench, createBallMesh } from '../src/game/builders/props';

/**
 * Malla cerrada = cada arista la comparten EXACTAMENTE 2 quads.
 * Arista con 1 uso => hay un agujero por el que se ve al fondo.
 */
function check(name: string, obj: THREE.Object3D) {
  const edges = new Map<string, number>();
  let quads = 0;
  const key = (a: number[], b: number[]) => {
    const ka = a.join(','), kb = b.join(',');
    return ka < kb ? ka + '|' + kb : kb + '|' + ka;
  };
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const p = m.geometry.attributes.position;
    for (let q = 0; q < Math.floor(p.count / 4); q++) {
      const c = [0, 1, 2, 3].map((k) => {
        const i = q * 4 + k;
        return `${p.getX(i).toFixed(4)},${p.getY(i).toFixed(4)},${p.getZ(i).toFixed(4)}`.split(',').map(Number);
      });
      quads++;
      edges.set(key(c[0]!, c[1]!), (edges.get(key(c[0]!, c[1]!)) ?? 0) + 1);
      edges.set(key(c[1]!, c[2]!), (edges.get(key(c[1]!, c[2]!)) ?? 0) + 1);
      edges.set(key(c[2]!, c[3]!), (edges.get(key(c[2]!, c[3]!)) ?? 0) + 1);
      edges.set(key(c[3]!, c[0]!), (edges.get(key(c[3]!, c[0]!)) ?? 0) + 1);
    }
  });
  let abiertas = 0, sueltas = 0;
  for (const v of edges.values()) { if (v === 1) abiertas++; else if (v > 2) sueltas++; }
  console.log(`${name.padEnd(20)} quads=${String(quads).padStart(5)} aristas=${String(edges.size).padStart(5)}  ABIERTAS=${abiertas}  sobrantes=${sueltas}  ${abiertas === 0 && sueltas === 0 ? 'CERRADO' : '<<< NO CERRADO'}`);
  return abiertas + sueltas;
}

let t = 0;
console.log('=== ESTANQUEIDAD DE LA MALLA (0 aristas abiertas = sin huecos) ===\n');
t += check('canasta izquierda', buildHoop(-1));
t += check('canasta derecha', buildHoop(1));
t += check('mesa anotadores', buildScorerTable());
t += check('banquillo', buildBench());
t += check('balon', createBallMesh());
console.log(`\nTOTAL DE HUECOS: ${t}`);
