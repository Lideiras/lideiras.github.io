import * as THREE from 'three';
import { VoxelWorld } from '../src/game/builders/util';
import { buildHoop, buildScorerTable, buildBench, buildTunnel, createBallMesh } from '../src/game/builders/props';
import { buildHuman } from '../src/game/builders/human';


/**
 * Un modelo voxel es "sólido" si CUALQUIER rayo que entra desde fuera y apunta a
 * un punto interior toca antes una cara. Si el rayo no toca nada, hay un hueco
 * y se ve a través de la figura.
 */
function holes(name: string, obj: THREE.Object3D, opts: { center?: THREE.Vector3; dirs?: number } = {}) {
  const box = new THREE.Box3().setFromObject(obj);
  const center = opts.center ?? box.getCenter(new THREE.Vector3());
  const n = opts.dirs ?? 60;

  const rc = new THREE.Raycaster();
  let probados = 0;
  let fallidos = 0;
  const ejemplos: string[] = [];

  for (let i = 0; i < n; i++) {
    // Dirección tipo esfera de Fibonacci, pero sólo las que entran por arriba/frente
    const t = (i + 0.5) / n;
    const phi = Math.acos(1 - 2 * t);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const dir = new THREE.Vector3(
      Math.cos(theta) * Math.sin(phi),
      Math.cos(phi),
      Math.sin(theta) * Math.sin(phi),
    );
    // Colocamos el origen lejos en esa dirección y apuntamos al centro.
    const origin = center.clone().addScaledVector(dir, 200);
    rc.set(origin, dir.clone().negate());
    const hits = rc.intersectObject(obj, true).filter((h) => {
      const m = h.object as THREE.Mesh;
      return m.isMesh && h.distance < 200;
    });
    probados++;
    if (hits.length === 0) {
      fallidos++;
      if (ejemplos.length < 3) ejemplos.push(dir.clone().multiplyScalar(-1).toArray().map((n2) => n2.toFixed(2)).join(','));
    }
  }
  const pct = ((fallidos / probados) * 100).toFixed(0);
  console.log(
    `${name.padEnd(22)} rayos=${String(probados).padStart(3)}  SIN TOCAR=${String(fallidos).padStart(3)} (${pct}%)  ${fallidos === 0 ? 'SOLIDO' : '<<< AGUJEROS ' + ejemplos.join(' | ')}`,
  );
  return fallidos;
}

let total = 0;
console.log('=== PRUEBA DE ESTANQUEIDAD (0 rayos sin tocar = sólido) ===\n');
total += holes('cubo 10^3 (control)', new VoxelWorld().fillCells(0, 0, 0, 9, 9, 9, 0xffffff).build());
total += holes('balon', createBallMesh(), { dirs: 80 });
total += holes('canasta izq', buildHoop(-1));
total += holes('canasta der', buildHoop(1));
total += holes('banquillo', buildBench());
total += holes('tunel', buildTunnel());
total += holes('mesa anotadores', buildScorerTable());
total += holes('jugador (completo)', buildHuman({ skin: 0xf0b27a, hair: 0x54371f, jersey: 0xff8c3a, shorts: 0x35406b, shoes: 0xfdfdf6, number: '23' }).root);
console.log(`\nTOTAL DE AGUJEROS: ${total}`);