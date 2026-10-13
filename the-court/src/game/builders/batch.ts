import * as THREE from 'three';

/*
 * FUNDIDO DE MALLAS ESTÁTICAS
 * ===========================
 *
 * Todo el voxel del mundo comparte UN material (`VOXEL_MATERIAL`, con el color en
 * el atributo `color` de la geometría), pero cada grupo del constructor añade su
 * propia malla: 172 mallas para 172 llamadas de dibujo. En el pase visible se
 * culean con el frustum y quedan 35-92 por fotograma, pero la mitad del coste de
 * un draw call en WebGL no es dibujar: es validar estado y rebotar en la CPU, así
 * que pasar de 92 llamadas a 4-11 se nota.
 *
 * Aquí se funden esas mallas —world transform incluido— en unas pocas
 * `BufferGeometry` nuevas. El aspecto NO cambia porque:
 *
 *  · Todas comparten material, así que comparten shader y estado de render; el
 *    resultado de una cara sólo depende de su geometría, su color y las luces,
 *    no de en qué malla viaje.
 *  · La transformación se cuece: se copia la posición ya en coordenadas de mundo
 *    (y la normal con la matriz de normales), así que cada triángulo queda donde
 *    estaba.
 *  · Se respeta `castShadow`/`receiveShadow`/`renderOrder` de cada malla: las que
 *    proyectan sombra van a un lote y las que no a otro, para que el mapa de
 *    sombras siga viendo exactamente la misma lista de proyectantes.
 *  · Los objetos que se mueven NO entran (`exclude`): el jugador, el balón y los
 *    dos actores del plató se quedan siendo mallas sueltas.
 *
 * Lo que sí cambia es el GRANULARIDAD del culling: un lote de 24 × 24 m se culea
 * entero o no se culea, así que puede entrar algún triángulo que antes se
 * descartaba por malla. Se paga en triángulos y se cobra en draw calls; el reparto
 * se elige con `cell` y se mide (BITACORA §3l).
 */

export interface BatchOptions {
  /** Material cuyas mallas se funden, comparado por identidad. */
  material: THREE.Material;
  /**
   * Lado de la celda en XZ, en metros, para no perder el culling: cada celda es
   * un lote. `0` funde todo lo que comparta estado de sombras en un único lote.
   */
  cell?: number;
  /** Subárboles intocables aunque compartan el material (lo que se mueve). */
  exclude?: THREE.Object3D[];
}

export interface BatchResult {
  /** Mallas originales que se han fundido. */
  merged: number;
  /** Mallas nuevas que han quedado en la escena. */
  batches: number;
  /** Triángulos de las mallas fundidas (debe ser igual que `before`). */
  triangles: number;
  /** Triángulos que tenían esas mismas mallas antes. */
  before: number;
  /** Bytes de los buffers nuevos. */
  bytes: number;
  /** Mallas descartadas por no tener los atributos esperados. */
  skipped: number;
}

interface Group {
  cast: boolean;
  receive: boolean;
  order: number;
  meshes: THREE.Mesh[];
  /** Triángulos lógicos, para comprobar que no se pierde ni uno. */
  triangles: number;
}

/**
 * Funde en lotes las mallas estáticas de `roots` que usan `opts.material`.
 *
 * Devuelve las cuentas para poder afirmar en el log que el número de triángulos
 * es exactamente el mismo antes y después (si no, algo se ha perdido por el
 * camino y no se debe dar por bueno el cambio).
 */
export function batchStaticMeshes(
  scene: THREE.Scene,
  roots: THREE.Object3D[],
  opts: BatchOptions,
): BatchResult {
  const cell = opts.cell ?? 0;
  const skip = new Set<THREE.Object3D>();
  for (const ex of opts.exclude ?? []) ex.traverse((o) => skip.add(o));

  const groups = new Map<string, Group>();
  let skipped = 0;

  for (const root of roots) {
    root.updateWorldMatrix(true, true);
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || (m as THREE.InstancedMesh).isInstancedMesh) return;
      if (m.material !== opts.material) return;
      if (skip.has(m)) return;
      const geo = m.geometry;
      if (!geo?.getAttribute('position') || !geo.getAttribute('normal') || !geo.getAttribute('color')) {
        // Sin los tres atributos no se puede fundir sin cambiar lo que se ve.
        skipped++;
        return;
      }
      m.updateWorldMatrix(true, false);
      const c = worldCenter(m);
      const key =
        `${m.castShadow ? 'c' : '-'}${m.receiveShadow ? 'r' : '-'}${m.renderOrder}` +
        (cell > 0 ? `:${Math.floor(c.x / cell)}_${Math.floor(c.z / cell)}` : ':0');
      let g = groups.get(key);
      if (!g) {
        g = { cast: m.castShadow, receive: m.receiveShadow, order: m.renderOrder, meshes: [], triangles: 0 };
        groups.set(key, g);
      }
      const index = geo.index;
      g.triangles += index ? index.count / 3 : geo.getAttribute('position').count / 3;
      g.meshes.push(m);
    });
  }

  /*
   * Geometrías candidatas a liberar: las de las mallas fundidas.
   *
   * Un mismo `BufferGeometry` puede estar usado por dos mallas; si una entra en
   * el lote y la otra no, liberar la geometría dejaría a la otra sin buffers. No
   * se puede decidir por malla, así que se libera AL FINAL y sólo lo que ya no
   * use ninguna malla viva (ver `disposeUnused` más abajo).
   */
  const mergedGeos = new Set<THREE.BufferGeometry>();
  for (const g of groups.values()) for (const m of g.meshes) mergedGeos.add(m.geometry);

  let batches = 0;
  let triangles = 0;
  let before = 0;
  let bytes = 0;

  for (const g of groups.values()) {
    let verts = 0;
    let indices = 0;
    for (const m of g.meshes) {
      const geo = m.geometry;
      verts += geo.getAttribute('position').count;
      indices += geo.index ? geo.index.count : geo.getAttribute('position').count;
    }
    const pos = new Float32Array(verts * 3);
    const nrm = new Float32Array(verts * 3);
    const col = new Float32Array(verts * 3);
    const idx = new Uint32Array(indices);

    const nm = new THREE.Matrix3();
    const v = new THREE.Vector3();
    let vo = 0;
    let io = 0;
    for (const m of g.meshes) {
      const geo = m.geometry;
      const p = geo.getAttribute('position');
      const n = geo.getAttribute('normal');
      const c = geo.getAttribute('color');
      /*
       * Si la malla ya está en coordenadas de mundo (matriz IDENTIDAD) se copia
       * verbo a verbo.
       *
       * Multiplicar por la identidad daría el mismo número —1·x + 0·y + 0·z + 0
       * es exacto en coma flotante—, pero RENORMALIZAR una normal que ya era
       * unitaria no: la divide por su longitud (1 ± 1 ulp), así que le cambia los
       * últimos bits. En una cara grande y bien iluminada eso se ve como un
       * parpadeo de ±1 nivel por píxel repartido por TODA la pantalla. Es el 95 %
       * del mundo (las 77 de las 81 mallas del mundo están sin transformar; sólo
       * los cuatro cuerpos de la cámara de TV llevan traslación), así que el caso
       * sin transformar es el camino normal y el otro es la excepción.
       */
      const identity = isIdentity(m.matrixWorld);
      nm.getNormalMatrix(m.matrixWorld);
      const e = m.matrixWorld.elements;
      for (let i = 0; i < p.count; i++) {
        const o3 = (vo + i) * 3;
        const x = p.getX(i);
        const y = p.getY(i);
        const z = p.getZ(i);
        const nx = n.getX(i);
        const ny = n.getY(i);
        const nz = n.getZ(i);
        if (identity) {
          pos[o3] = x;
          pos[o3 + 1] = y;
          pos[o3 + 2] = z;
          nrm[o3] = nx;
          nrm[o3 + 1] = ny;
          nrm[o3 + 2] = nz;
        } else {
          pos[o3] = e[0] * x + e[4] * y + e[8] * z + e[12];
          pos[o3 + 1] = e[1] * x + e[5] * y + e[9] * z + e[13];
          pos[o3 + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
          v.set(
            nm.elements[0] * nx + nm.elements[3] * ny + nm.elements[6] * nz,
            nm.elements[1] * nx + nm.elements[4] * ny + nm.elements[7] * nz,
            nm.elements[2] * nx + nm.elements[5] * ny + nm.elements[8] * nz,
          );
          v.normalize();
          nrm[o3] = v.x;
          nrm[o3 + 1] = v.y;
          nrm[o3 + 2] = v.z;
        }
        col[o3] = c.getX(i);
        col[o3 + 1] = c.getY(i);
        col[o3 + 2] = c.getZ(i);
      }
      if (geo.index) {
        const src = geo.index.array;
        for (let i = 0; i < src.length; i++) idx[io + i] = src[i]! + vo;
        io += src.length;
      } else {
        for (let i = 0; i < p.count; i++) idx[io + i] = i + vo;
        io += p.count;
      }
      vo += p.count;
    }

    const merged2 = new THREE.BufferGeometry();
    merged2.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    merged2.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    merged2.setAttribute('color', new THREE.BufferAttribute(col, 3));
    merged2.setIndex(new THREE.BufferAttribute(idx, 1));
    // Las dos cajas se calculan AQUÍ y no bajo demanda: la esfera la usa el
    // culling en cada fotograma y la caja el raycast del tiro, y calcularlas en
    // el primer uso daría un tirón justo al disparar.
    merged2.computeBoundingBox();
    merged2.computeBoundingSphere();

    const mesh = new THREE.Mesh(merged2, opts.material);
    mesh.name = `batch${cell > 0 ? ':' + cell + 'm' : ''}${g.cast ? ':cast' : ''}`;
    mesh.castShadow = g.cast;
    mesh.receiveShadow = g.receive;
    mesh.renderOrder = g.order;
    mesh.matrixAutoUpdate = false;
    scene.add(mesh);

    batches++;
    triangles += g.triangles;
    before += g.triangles;
    bytes += pos.byteLength + nrm.byteLength + col.byteLength + idx.byteLength;

    for (const m of g.meshes) m.parent?.remove(m);
  }

  disposeUnused(scene, mergedGeos);

  return { merged: [...groups.values()].reduce((n, g) => n + g.meshes.length, 0), batches, triangles, before, bytes, skipped };
}

/**
 * Libera las geometrías de `candidates` que ya no esté usando ninguna malla viva.
 *
 * Se recorre la escena entera y no la lista de mallas fundidas a propósito: así
 * una geometría compartida entre una malla fundida y otra que sigue suelta se
 * conserva, y no hay que llevar la cuenta de quién comparte qué.
 */
function disposeUnused(scene: THREE.Scene, candidates: Set<THREE.BufferGeometry>): void {
  if (candidates.size === 0) return;
  const alive = new Set<THREE.BufferGeometry>();
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && m.geometry) alive.add(m.geometry);
  });
  for (const geo of candidates) if (!alive.has(geo)) geo.dispose();
}

/** Matriz identidad (con margen para el ruido de la cadena de padres). */
function isIdentity(m: THREE.Matrix4): boolean {
  const e = m.elements;
  const I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  for (let i = 0; i < 16; i++) if (Math.abs(e[i]! - I[i]!) > 1e-9) return false;
  return true;
}

/** Centro de la esfera envolvente de una malla, en coordenadas de mundo. */
function worldCenter(m: THREE.Mesh): THREE.Vector3 {
  const geo = m.geometry;
  if (!geo.boundingSphere) geo.computeBoundingSphere();
  return geo.boundingSphere!.center.clone().applyMatrix4(m.matrixWorld);
}
