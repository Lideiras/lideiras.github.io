import * as THREE from 'three';
import type { VoxelWorld } from './util';

/* ===========================================================================
 * VOXELIZADORES
 * ---------------------------------------------------------------------------
 * Dos técnicas complementarias para convertir mallas en voxels. Las dos
 * escriben en `VoxelWorld`, así que el resultado hereda el culling de caras
 * internas, la oclusión de ambiente y el material del resto del mundo: no es
 * una malla ajena pegada al escenario.
 *
 * 1) `voxelizeMesh` — RASTERIZACIÓN DE TRIÁNGULOS. Recorre cada triángulo y
 *    marca las celdas cuyo centro cae sobre él. Barato y con cobertura
 *    garantizada (los triángulos contiguos tapan todos los centros), pero
 *    produce una CÁSCARA: sirve para superficies (suelo, gradas, muros).
 *
 * 2) `voxelizeModel` — PARIDAD DE RAYO. Técnica de Ksenia Kondrashova
 *    (Codrops, "Turning 3D Models to Voxel Art with Three.js"): desde cada
 *    punto de la rejilla se lanza un rayo y se cuentan las intersecciones; un
 *    número IMPAR significa que el punto está dentro. Da VOLUMEN MACIZO, pero
 *    cuesta un raycast por celda: sólo vale para modelos pequeños (el balón).
 * =========================================================================== */

/**
 * Techo de celdas que puede cubrir UN triángulo antes de descartarlo.
 *
 * Es una guarda de coste, no una optimización. Una cara fusionada por el
 * exportador (media pista en un solo triángulo) cubre decenas de miles de
 * celdas y es legítima; un vértice con una coordenada absurda — 1e30, o un NaN
 * que se cuela hasta el cálculo de la caja — genera una caja de billones de
 * celdas y bloquea el hilo principal de la página para siempre. Con el techo,
 * el peor caso está acotado y el problema se ve en consola en vez de colgarse.
 */
const MAX_CELLS_PER_TRIANGLE = 250_000;

/* ---------------------------------------------------------------------------
 * Muestreo de la textura-paleta
 * ------------------------------------------------------------------------- */

/**
 * Devuelve una función que lee el color de una textura en coordenadas UV.
 *
 * Los GLB de voxel art no guardan el color en el material: traen una textura
 * diminuta con la paleta y cada triángulo apunta por UV a su cuadro. Sin
 * muestrear la textura, todo el modelo saldría de un solo color plano.
 */
export function textureSampler(tex: THREE.Texture): ((u: number, v: number) => number) | null {
  const img = tex.image as { width?: number; height?: number } | undefined;
  const w = img?.width ?? 0;
  const h = img?.height ?? 0;
  if (!w || !h) return null;

  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true });
  if (!g) return null;
  try {
    g.drawImage(img as CanvasImageSource, 0, 0);
  } catch {
    // Textura de otro origen: el canvas queda contaminado y no se puede leer.
    return null;
  }
  const data = g.getImageData(0, 0, w, h).data;

  return (u: number, v: number) => {
    // Se envuelve en [0,1) por si el material repite la textura.
    const uu = u - Math.floor(u);
    const vv = v - Math.floor(v);
    const px = Math.min(w - 1, Math.max(0, Math.floor(uu * w)));
    // En la imagen la V crece hacia ABAJO; en UV crece hacia arriba.
    const py = Math.min(h - 1, Math.max(0, Math.floor((1 - vv) * h)));
    const o = (py * w + px) * 4;
    return ((data[o] ?? 0) << 16) | ((data[o + 1] ?? 0) << 8) | (data[o + 2] ?? 0);
  };
}

/**
 * Color plano del material, o el de respaldo.
 *
 * Ojo con el blanco: glTF deja `baseColorFactor` sin definir en muchos
 * modelos, y el loader lo traduce a blanco puro. Eso NO es una decisión de
 * arte, es ausencia de dato. Si se toma como color válido, el modelo entero
 * sale blanco y se pierde el trabajo del artista.
 */
function materialColor(mat: THREE.Material | undefined, fallback: number): number {
  const std = mat as THREE.MeshStandardMaterial | undefined;
  if (!std?.color) return fallback;
  const hex = std.color.getHex();
  return hex === 0xffffff ? fallback : hex;
}

/* ---------------------------------------------------------------------------
 * 1) Rasterización de triángulos
 * ------------------------------------------------------------------------- */

export interface VoxelizeMeshOptions {
  /** Lado del cubo en metros. */
  grid: number;
  /**
   * Distancia máxima del CENTRO de una celda al plano del triángulo para
   * considerarla tocada. Por defecto media celda (grid * 0.52): con menos, un
   * triángulo que cae justo en el borde entre dos capas de celdas no marcaría
   * ninguna y dejaría un agujero por el que se vería el fondo.
   */
  tolerance?: number;
  /** Color de respaldo si el material no trae ni textura ni color. */
  fallback?: number;
  /**
   * Color OBLIGATORIO, por encima del que traiga el material.
   *
   * `fallback` sólo entra cuando el material no tiene color (o es blanco, que en
   * glTF suele significar «sin dato»). Para el balón eso NO basta: su modelo
   * trae la corteza en marrón (#864d24), que es un color válido, así que el
   * naranja de la paleta nunca llegaba a la malla y el balón se veía marrón
   * oscuro. Con `forceColor` la paleta manda y del modelo se aprovecha sólo la
   * forma. La textura, si la hubiera, sigue teniendo prioridad.
   */
  forceColor?: number;
  /**
   * Recorte opcional en metros. Sólo se marcan las celdas cuyo CENTRO cae
   * dentro. Sirve para voxelizar una franja de un modelo grande — el suelo de
   * la cancha dentro de un estadio entero — sin arrastrar el resto.
   */
  clip?: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number };
  /**
   * Módulo mínimo de la componente Y de la normal. Con 0,9 sólo se rasterizan
   * las caras que miran hacia arriba o hacia abajo. Para extraer el SUELO de un
   * modelo grande es lo que se quiere: los muros no aportan nada al dibujo de
   * la pista y son la mayor parte de los triángulos.
   */
  minNormalY?: number;
}

/**
 * Vuelca una malla en un `VoxelWorld` marcando las celdas que toca.
 * Devuelve cuántas celdas ha añadido.
 */
export function voxelizeMesh(target: VoxelWorld, mesh: THREE.Mesh, opts: VoxelizeMeshOptions): number {
  const geo = mesh.geometry;
  const pos = geo.getAttribute('position');
  if (!pos) return 0;
  const uv = geo.getAttribute('uv');
  const index = geo.getIndex();
  const tris = index ? Math.floor(index.count / 3) : Math.floor(pos.count / 3);

  const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material | undefined;
  const map = mat ? (mat as THREE.MeshStandardMaterial).map : null;
  const sample = map ? textureSampler(map) : null;
  if (map && !sample) {
    console.warn('[voxelize] la textura-paleta no se pudo leer; el modelo saldrá de color plano');
  }
  const flat = opts.forceColor ?? materialColor(mat, opts.fallback ?? 0xffffff);

  mesh.updateWorldMatrix(true, false);
  const world = mesh.matrixWorld;

  const grid = opts.grid;
  const tol = opts.tolerance ?? grid * 0.52;
  const clip = opts.clip;

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  const p = new THREE.Vector3();
  let added = 0;
  let descartados = 0;

  for (let t = 0; t < tris; t++) {
    const i0 = index ? index.getX(t * 3) : t * 3;
    const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    a.fromBufferAttribute(pos, i0).applyMatrix4(world);
    b.fromBufferAttribute(pos, i1).applyMatrix4(world);
    c.fromBufferAttribute(pos, i2).applyMatrix4(world);
    if (!Number.isFinite(a.x + a.y + a.z + b.x + b.y + b.z + c.x + c.y + c.z)) {
      descartados++;
      continue;
    }

    ab.subVectors(b, a);
    ac.subVectors(c, a);
    nrm.crossVectors(ab, ac);
    const len = nrm.length();
    if (len < 1e-12) continue; // triángulo degenerado
    nrm.divideScalar(len);

    if (opts.minNormalY !== undefined && Math.abs(nrm.y) < opts.minNormalY) continue;

    // Un color por triángulo, leído de la paleta en el centro del triángulo.
    let color = flat;
    if (sample && uv) {
      color = sample(
        (uv.getX(i0) + uv.getX(i1) + uv.getX(i2)) / 3,
        (uv.getY(i0) + uv.getY(i1) + uv.getY(i2)) / 3,
      );
    }

    // Rango de celdas cuyo CENTRO puede tocar el triángulo.
    //
    // Margen de una celda por lado: la prueba de marca acepta centros a media
    // celda del plano, así que hay celdas fuera de la caja del triángulo que
    // también cuentan. Sin este margen el rango puede salir VACÍO — pasa
    // siempre que el triángulo cae justo en el borde entre dos capas de celdas,
    // que es exactamente el caso del suelo de la cancha (plano en y = 0). Ése
    // era el motivo de que la pista voxelizada saliera con franjas sin rellenar.
    const pad = 1;
    let x0 = Math.ceil(Math.min(a.x, b.x, c.x) / grid - 0.5) - pad;
    let x1 = Math.floor(Math.max(a.x, b.x, c.x) / grid - 0.5) + pad;
    let y0 = Math.ceil(Math.min(a.y, b.y, c.y) / grid - 0.5) - pad;
    let y1 = Math.floor(Math.max(a.y, b.y, c.y) / grid - 0.5) + pad;
    let z0 = Math.ceil(Math.min(a.z, b.z, c.z) / grid - 0.5) - pad;
    let z1 = Math.floor(Math.max(a.z, b.z, c.z) / grid - 0.5) + pad;

    // El recorte se aplica AL RANGO, antes de recorrerlo. Comprobarlo dentro
    // del bucle no sirve: un muro de 25 x 14 m tiene una caja de millones de
    // celdas y recorrerla entera bloquea el hilo principal de la página.
    if (clip) {
      x0 = Math.max(x0, Math.ceil(clip.minX / grid - 0.5));
      x1 = Math.min(x1, Math.floor(clip.maxX / grid - 0.5));
      y0 = Math.max(y0, Math.ceil(clip.minY / grid - 0.5));
      y1 = Math.min(y1, Math.floor(clip.maxY / grid - 0.5));
      z0 = Math.max(z0, Math.ceil(clip.minZ / grid - 0.5));
      z1 = Math.min(z1, Math.floor(clip.maxZ / grid - 0.5));
    }
    if (x0 > x1 || y0 > y1 || z0 > z1) continue;

    const celdas = (x1 - x0 + 1) * (y1 - y0 + 1) * (z1 - z0 + 1);
    if (!Number.isFinite(celdas) || celdas > MAX_CELLS_PER_TRIANGLE) {
      descartados++;
      continue;
    }

    for (let ix = x0; ix <= x1; ix++) {
      for (let iy = y0; iy <= y1; iy++) {
        for (let iz = z0; iz <= z1; iz++) {
          p.set((ix + 0.5) * grid, (iy + 0.5) * grid, (iz + 0.5) * grid);
          // 1) ¿a qué distancia está el centro de la celda del plano?
          const d = (p.x - a.x) * nrm.x + (p.y - a.y) * nrm.y + (p.z - a.z) * nrm.z;
          if (d > tol || d < -tol) continue;
          // 2) proyectado sobre el plano, ¿cae dentro del triángulo?
          p.set(p.x - nrm.x * d, p.y - nrm.y * d, p.z - nrm.z * d);
          if (!pointInTriangle(p, a, b, c)) continue;
          target.putCell(ix, iy, iz, color, Math.abs(d));
          added++;
        }
      }
    }
  }

  if (descartados) {
    console.warn(`[voxelize] ${descartados} triángulos descartados por coste o coordenadas inválidas`);
  }
  return added;
}

/** Test baricéntrico. `p` se supone ya proyectado sobre el plano del triángulo. */
function pointInTriangle(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): boolean {
  const v0x = c.x - a.x, v0y = c.y - a.y, v0z = c.z - a.z;
  const v1x = b.x - a.x, v1y = b.y - a.y, v1z = b.z - a.z;
  const v2x = p.x - a.x, v2y = p.y - a.y, v2z = p.z - a.z;
  const d00 = v0x * v0x + v0y * v0y + v0z * v0z;
  const d01 = v0x * v1x + v0y * v1y + v0z * v1z;
  const d11 = v1x * v1x + v1y * v1y + v1z * v1z;
  const d20 = v2x * v0x + v2y * v0y + v2z * v0z;
  const d21 = v2x * v1x + v2y * v1y + v2z * v1z;
  const den = d00 * d11 - d01 * d01;
  if (Math.abs(den) < 1e-14) return false;
  const v = (d11 * d20 - d01 * d21) / den;
  const w = (d00 * d21 - d01 * d20) / den;
  const eps = -1e-6;
  return v >= eps && w >= eps && v + w <= 1 - eps;
}

/**
 * Vuelca TODAS las mallas de un modelo por rasterización.
 *
 * Las mallas se ordenan de mayor a menor volumen y se escriben en ese orden,
 * así que las pequeñas (las costuras del balón) pisan a las grandes y se
 * quedan con la celda. Es el equivalente al detalle superpuesto a la masa.
 */
export function voxelizeObject(
  target: VoxelWorld,
  model: THREE.Object3D,
  opts: VoxelizeMeshOptions & { colorOf?: (mesh: THREE.Mesh) => number },
): number {
  const meshes: THREE.Mesh[] = [];
  model.updateMatrixWorld(true);
  model.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) meshes.push(m);
  });
  if (!meshes.length) return 0;
  meshes.sort((m1, m2) => volumeOf(m2) - volumeOf(m1));

  let added = 0;
  for (const m of meshes) {
    // Cada malla reinicia la prioridad: el detalle (malla pequeña, procesada
    // después) debe ganar la celda a la masa, no competir por distancia.
    target.resetPriority();
    const color = opts.colorOf?.(m);
    added += voxelizeMesh(target, m, {
      grid: opts.grid,
      tolerance: opts.tolerance,
      clip: opts.clip,
      minNormalY: opts.minNormalY,
      // `forceColor` cuando hay `colorOf`: el color que decide el juego manda
      // sobre el que traiga el modelo. `fallback` se queda para el caso de que el
      // material no traiga ninguno.
      forceColor: color,
      fallback: color ?? opts.fallback,
    });
  }
  return added;
}

/* ---------------------------------------------------------------------------
 * 2) Paridad de rayo
 * ------------------------------------------------------------------------- */

const _ray = new THREE.Raycaster();

export interface VoxelizeModelOptions {
  /** Lado del cubo en metros. */
  grid: number;
  /** Altura máxima a considerar, para no recorrer la base entera de un modelo grande. */
  maxHeight?: number;
  /**
   * Distancia a la superficie por debajo de la cual un punto se acepta aunque
   * el rayo no dé número impar. Es la optimización del tutorial y además
   * rescata mallas abiertas: los artistas suelen borrar las caras que no se
   * ven, y entonces "dentro" no significa lo que parece.
   */
  surfaceTolerance?: number;
}

/**
 * Volumen macizo de un modelo glTF por paridad de rayo.
 *
 * El material de origen se fuerza a `DoubleSide`: si no, el raycaster sólo ve
 * la cara exterior, cuenta una única intersección en todo el recorrido y la
 * paridad sale mal. Devuelve cuántas celdas ha añadido.
 */
export function voxelizeModel(
  target: VoxelWorld,
  model: THREE.Object3D,
  colorOf: (mesh: THREE.Mesh) => number,
  opts: VoxelizeModelOptions,
): number {
  model.updateMatrixWorld(true);

  const meshes: THREE.Mesh[] = [];
  model.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    for (const mt of mats) if (mt) mt.side = THREE.DoubleSide;
    meshes.push(m);
  });
  if (!meshes.length) return 0;

  // Los detalles primero: si una malla pequeña (las costuras del balón) pisa a
  // una grande (el casquete naranja), el color que debe ganar es el suyo.
  meshes.sort((m1, m2) => volumeOf(m1) - volumeOf(m2));

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const s = target.size;
  const step = opts.grid;
  const tol = opts.surfaceTolerance ?? step * 1.5;
  const dir = new THREE.Vector3(0, 0, 1);
  const origin = box.min.clone();
  const p = new THREE.Vector3();
  let added = 0;

  const nx = Math.ceil(size.x / step);
  const ny = opts.maxHeight
    ? Math.min(Math.ceil(size.y / step), Math.ceil(opts.maxHeight / step))
    : Math.ceil(size.y / step);
  const nz = Math.ceil(size.z / step);

  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      for (let k = 0; k < nz; k++) {
        p.set(origin.x + (i + 0.5) * step, origin.y + (j + 0.5) * step, origin.z + (k + 0.5) * step);
        for (const m of meshes) {
          _ray.set(p, dir);
          const hits = _ray.intersectObject(m, false);
          if (!hits.length) continue;
          const inside = hits.length % 2 === 1;
          const nearSurface = hits[0]!.distance <= tol;
          if (!inside && !nearSurface) continue;
          // La celda que CONTIENE el punto es floor(p/s); `round` desplazaba
          // todo media celda y comía la superficie por un lado.
          target.putCell(Math.floor(p.x / s), Math.floor(p.y / s), Math.floor(p.z / s), colorOf(m));
          added++;
          break;
        }
      }
    }
  }
  return added;
}

/** Volumen de la caja envolvente de una malla, para ordenar por detalle. */
function volumeOf(m: THREE.Mesh): number {
  const b = new THREE.Box3().setFromObject(m);
  const s = b.getSize(new THREE.Vector3());
  return s.x * s.y * s.z;
}
