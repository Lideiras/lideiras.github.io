import * as THREE from 'three';

const cache = new Map<number, THREE.MeshStandardMaterial>();

/** Material low-poly con flat shading, cacheado por color. */
export function mat(color: number): THREE.MeshStandardMaterial {
  let m = cache.get(color);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.05 });
    cache.set(color, m);
  }
  return m;
}

export function box(w: number, h: number, d: number, color: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** Cilindro entre dos puntos (sólo para lo que siga siendo redondo; el resto es voxel). */
export function cylBetween(a: THREE.Vector3, b: THREE.Vector3, radius: number, color: number): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 6), mat(color));
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  m.castShadow = true;
  return m;
}

export function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (!g) throw new Error('2D canvas no disponible');
  draw(g);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  // Sin suavizado: es una textura pixel-art y debe leerse como bloques, no como degradado.
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

/** PRNG determinista para que la escena sea idéntica en cada carga. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ===========================================================================
 * MOTOR VOXEL
 * ---------------------------------------------------------------------------
 * El mundo se construye con cubos de lado VOXEL (6.25 cm). No se crean miles
 * de BoxGeometry sueltas: se guardan las celdas ocupadas en un Set y al
 * construir se emite UNA malla por color, descartando las caras internas.
 * Eso convierte un bloque macizo de 20x20x20 voxels (8000 celdas) en una malla
 * de ~2400 triángulos en vez de 96.000.
 *
 * Además aplica oclusión de ambiente por vértice (las esquinas en sombra se
 * oscurecen), que es lo que realmente hace que un bloque se lea como bloque.
 * =========================================================================== */

/**
 * Lado del cubo en metros: 3,125 cm.
 *
 * La referencia del proyecto es Cube World, y su firma visual es el VOXEL
 * DIMINUTO: el mundo entero está hecho de cubos muy pequeños, y por eso sus
 * formas se leen redondeadas aunque sean cúbicas. Con 6,25 cm las esferas y los
 * cilindros salían a escalones y el conjunto parecía de bloques grandes.
 * Reducir el grano a la mitad cuadruplica el número de cubos por modelo.
 */
export const VOXEL = 0.03125;

/** Intensidad de la oclusión de ambiente por vértice (0 = esquina totalmente tapada). */
const AO_LEVELS = [0.52, 0.70, 0.86, 1] as const;

/**
 * Color al que se tiñe la sombra.
 *
 * Trove tiñe la sombra, no la apaga: su guía pide "hand-coloring for shading"
 * en vez de degradados automáticos. Multiplicar el color base hacia negro
 * (lo que hacíamos) deja las zonas oscuras sucias y sin vida. Mezclando con
 * un violeta frío el volumen se mantiene y la escena sigue siendo colorida.
 */
const SHADOW_TINT = new THREE.Color(0x6b6ad0);

/** Aplica el nivel de AO a un color base sin perder saturación. */
function shadeColor(out: THREE.Color, base: THREE.Color, level: number): void {
  const shade = AO_LEVELS[level]!;
  // 1) Multiplicación suave: mantiene el tono del bloque.
  out.copy(base).multiplyScalar(0.46 + 0.54 * shade);
  // 2) Tinte frío proporcional a la oclusión: la sombra se vuelve violeta,
  //    nunca gris muerto.
  out.lerp(SHADOW_TINT, (1 - shade) * 0.3);
}

const vkey = (x: number, y: number, z: number): string => `${x}|${y}|${z}`;

interface FaceDef {
  /** Normal de la cara (ejes del mundo). */
  n: readonly [number, number, number];
  /**
   * Los 4 vértices de la cara en coordenadas locales de celda (0..1).
   * Se escriben a mano, en orden antihorario visto desde FUERA, porque
   * deducirlos de dos tangentes salía con la normal invertida en varias caras:
   * el backface culling se comía la mitad de la geometría y el objeto se veía
   * hecho esquirlas.
   */
  corners: readonly (readonly [number, number, number])[];
}

const FACES: readonly FaceDef[] = [
  { n: [1, 0, 0], corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
  { n: [-1, 0, 0], corners: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]] },
  { n: [0, 1, 0], corners: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]] },
  { n: [0, -1, 0], corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
  { n: [0, 0, 1], corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] },
  { n: [0, 0, -1], corners: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]] },
];

/** Ejes de la normal y de los dos tangentes, para el cálculo de la AO. */

/**
 * Acumulador de voxels. Todos los métodos usan coordenadas y tamaños en
 * METROS (como el resto del juego) y ajustan internamente a la rejilla.
 */
export class VoxelWorld {
  /** celda -> color */
  private readonly cells = new Map<string, number>();
  /** celdas macizas (con o sin color), para el culling de caras internas */
  private readonly solid = new Set<string>();
  /** celda -> distancia del triángulo que la marcó (menor = más cercano) */
  private readonly best = new Map<string, number>();

  constructor(readonly size: number = VOXEL) {}

  /** ¿Cuántos voxels hay colocados? Útil para depurar el coste. */
  get count(): number {
    return this.solid.size;
  }

  /**
   * Cuántos colores distintos hay. Es el termómetro de si la textura-paleta de
   * un glTF se leyó bien: un modelo voxel art con la paleta leída da decenas de
   * colores; si sale 1, la textura no se muestreó y todo es color plano.
   */
  get colorCount(): number {
    return new Set(this.cells.values()).size;
  }

  /** Rellena un rango de celdas YA en coordenadas de rejilla (inclusivo). */
  fillCells(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, color: number): this {
    const [ax, bx] = x0 <= x1 ? [x0, x1] : [x1, x0];
    const [ay, by] = y0 <= y1 ? [y0, y1] : [y1, y0];
    const [az, bz] = z0 <= z1 ? [z0, z1] : [z1, z0];
    for (let x = ax; x <= bx; x++) {
      for (let y = ay; y <= by; y++) {
        for (let z = az; z <= bz; z++) {
          this.cells.set(vkey(x, y, z), color);
          this.solid.add(vkey(x, y, z));
        }
      }
    }
    return this;
  }

  /** Caja centrada en (cx,cy,cz) de tamaño (w,h,d) en metros. */
  box(cx: number, cy: number, cz: number, w: number, h: number, d: number, color: number): this {
    const s = this.size;
    const i0 = Math.round((cx - w / 2) / s);
    const i1 = Math.ceil((cx + w / 2) / s) - 1;
    const j0 = Math.round((cy - h / 2) / s);
    const j1 = Math.ceil((cy + h / 2) / s) - 1;
    const k0 = Math.round((cz - d / 2) / s);
    const k1 = Math.ceil((cz + d / 2) / s) - 1;
    return this.fillCells(i0, j0, k0, i1, j1, k1, color);
  }

  /** Caja definida por esquinas opuestas en metros (x0<x1, y0<y1, z0<z1). */
  span(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, color: number): this {
    const s = this.size;
    return this.fillCells(
      Math.round(x0 / s), Math.round(y0 / s), Math.round(z0 / s),
      Math.ceil(x1 / s) - 1, Math.ceil(y1 / s) - 1, Math.ceil(z1 / s) - 1,
      color,
    );
  }

  /**
   * Esfera rellena de voxels, centrada en (cx,cy,cz) con radio r en metros.
   * Sirve paraSizes redondeados visualmente a voxel (balón, cabezas).
   */
  sphere(cx: number, cy: number, cz: number, r: number, color: number): this {
    const s = this.size;
    const i0 = Math.floor((cx - r) / s);
    const i1 = Math.ceil((cx + r) / s);
    const j0 = Math.floor((cy - r) / s);
    const j1 = Math.ceil((cy + r) / s);
    const k0 = Math.floor((cz - r) / s);
    const k1 = Math.ceil((cz + r) / s);
    // OJO: `dx`, `dy` y `dz` están en METROS, así que el radio al cuadrado
    // también. Estaba escrito como `(r / s) ** 2`, que son celdas al cuadrado:
    // con s < 1 ese valor es enorme (576 para el balón), la comparación nunca
    // se cumplía y la función rellenaba la CAJA ENTERA. Es decir: `sphere()`
    // devolvía un CUBO macizo. El balón procedural salía cúbico por esto.
    const rc = r * r;
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        for (let k = k0; k <= k1; k++) {
          const dx = (i + 0.5) * s - cx;
          const dy = (j + 0.5) * s - cy;
          const dz = (k + 0.5) * s - cz;
          // Sólo lo que cae DENTRO de la esfera ocupa celda. Marcar también el
          // envoltorio como macizo hacía que el culling descartase las caras de
          // la superficie: el balón quedaba con agujeros y se veía a través.
          if (dx * dx + dy * dy + dz * dz > rc) continue;
          this.cells.set(vkey(i, j, k), color);
          this.solid.add(vkey(i, j, k));
        }
      }
    }
    return this;
  }

  /**
   * Marca una celda por coordenadas de rejilla (usado por el voxelizador).
   *
   * `distance` es la distancia del triángulo al centro de la celda. Cuando dos
   * triángulos marcan la misma celda gana el MÁS CERCANO, no el último: si se
   * dejaba ganar al último, el orden del búfer de índices decidía el color y
   * las líneas de la pista desaparecían bajo la superficie base, porque la
   * base venía después en el fichero.
   */
  putCell(ix: number, iy: number, iz: number, color: number, distance = -Infinity): void {
    const k = `${ix}|${iy}|${iz}`;
    const prev = this.best.get(k);
    if (prev !== undefined && prev < distance) return;
    this.best.set(k, distance);
    this.cells.set(k, color);
    this.solid.add(k);
  }

  /** ¿La celda de rejilla dada está ocupada? */
  occupied(x: number, y: number, z: number): boolean {
    return this.solid.has(vkey(x, y, z));
  }

  /**
   * Olvida las prioridades de distancia: a partir de aquí vuelve a ganar el
   * último que escriba. Lo usa el voxelizador entre mallas, para que el detalle
   * de una malla pequeña pise a la masa de una grande sin competir por cercanía.
   */
  resetPriority(): void {
    this.best.clear();
  }

  /** Limpia un rango de celdas (vaciar un rango de celdas). */
  eraseCells(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): this {
    const [ax, bx] = x0 <= x1 ? [x0, x1] : [x1, x0];
    const [ay, by] = y0 <= y1 ? [y0, y1] : [y1, y0];
    const [az, bz] = z0 <= z1 ? [z0, z1] : [z1, z0];
    for (let x = ax; x <= bx; x++) {
      for (let y = ay; y <= by; y++) {
        for (let z = az; z <= bz; z++) {
          this.cells.delete(vkey(x, y, z));
          this.solid.delete(vkey(x, y, z));
          this.best.delete(vkey(x, y, z));
        }
      }
    }
    return this;
  }

  /**
   * Emite la geometría: una malla por color, con culling de caras internas y AO.
   * Devuelve un Group listo para añadir a la escena.
   *
   * `flatTop` + `flatY` sirven para las marcas del suelo (líneas de pista,
   * anillos de zona): solo se emite la cara superior y a la altura indicada.
   * Sin esto, un bloque de 6.25 cm apoyado en el parquet se ve como una valla
   * desde la cámara rasante en lugar de como una línea pintada.
   */
  build(opts: { shadows?: boolean; name?: string; flatTop?: boolean; flatY?: number } = {}): THREE.Group {
    const s = this.size;
    const group = new THREE.Group();
    group.name = opts.name ?? 'voxels';
    const flat = opts.flatTop ?? false;
    const flatY = opts.flatY ?? 0;

    // Agrupa celdas por color para poder crear una malla por tonalidad.
    const byColor = new Map<number, number[]>();
    for (const [k, color] of this.cells) {
      let list = byColor.get(color);
      if (!list) byColor.set(color, (list = []));
      list.push(...k.split('|').map(Number));
    }

    for (const [color, coords] of byColor) {
      const pos: number[] = [];
      const nor: number[] = [];
      const col: number[] = [];
      // Índices de los dos triángulos de cada quad. IMPRESCINDIBLE: un
      // BufferGeometry SIN índice se dibuja con gl.TRIANGLES, así que un quad
      // de 4 vértices no se dibuja como quad. Sólo salía bien el primer
      // triángulo de cada dos y el resto eran triángulos cosidos entre caras
      // distintas: eso era exactamente el "las caras no se rellenan y se ve a
      // través de los modelos".
      const tri: number[] = [];
      let vbase = 0;
      const base = new THREE.Color(color);
      const tmp = new THREE.Color();

      for (let idx = 0; idx < coords.length; idx += 3) {
        const ix = coords[idx];
        const iy = coords[idx + 1];
        const iz = coords[idx + 2];

        for (const face of FACES) {
          const [nx, ny, nz] = face.n;
          if (flat && ny !== 1) continue; // en modo plano solo la cara superior
          if (this.occupied(ix + nx, iy + ny, iz + nz)) continue; // cara interna: no se emite

          // Eje de la normal y los dos ejes tangentes (para la AO).
          const na = nx !== 0 ? 0 : ny !== 0 ? 1 : 2;
          const t1 = (na + 1) % 3;
          const t2 = (na + 2) % 3;

          for (let c = 0; c < 4; c++) {
            const [cx, cy, cz] = face.corners[c]!;
            pos.push((ix + cx) * s, flat ? flatY : (iy + cy) * s, (iz + cz) * s);
            nor.push(nx, ny, nz);

            if (flat) {
              // Sin AO en modo plano: no hay esquina que oscurecer.
              col.push(base.r, base.g, base.b);
              continue;
            }
            // AO: los dos vecinos laterales de la esquina y su diagonal.
            const dv1 = cx * 2 - 1;
            const dv2 = cy * 2 - 1;
            const d3 = cz * 2 - 1;
            const o1 = [dv1, dv2, d3];
            const off = [nx, ny, nz];
            const A = [...off];
            A[t1] = (A[t1] as number) + (o1[t1] as number);
            const B = [...off];
            B[t2] = (B[t2] as number) + (o1[t2] as number);
            const C = [
              (off[0] as number) + (o1[0] as number),
              (off[1] as number) + (o1[1] as number),
              (off[2] as number) + (o1[2] as number),
            ];
            const side1 = this.occupied(ix + A[0]!, iy + A[1]!, iz + A[2]!) ? 1 : 0;
            const side2 = this.occupied(ix + B[0]!, iy + B[1]!, iz + B[2]!) ? 1 : 0;
            const diag = this.occupied(ix + C[0]!, iy + C[1]!, iz + C[2]!) ? 1 : 0;
            const level = side1 && side2 ? 0 : 3 - (side1 + side2 + diag);
            shadeColor(tmp, base, level);
            col.push(tmp.r, tmp.g, tmp.b);
          }

          // Dos triángulos por quad, con el mismo sentido antihorario que los
          // cuatro vértices. Comprobado cara por cara: la normal geométrica de
          // (v0,v1,v2) coincide con face.n en las seis direcciones.
          tri.push(vbase, vbase + 1, vbase + 2, vbase, vbase + 2, vbase + 3);
          vbase += 4;
        }
      }

      if (!pos.length) continue;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      geo.setIndex(tri);
      const mtl = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.92,
        metalness: 0,
        // Sin flatShading: usamos las normales por cara que ya calculamos, y el
        // degradado de AO se interpola limpiamente. Con flatShading Three.js
        // recalcula la normal con derivadas de pantalla y el resultado es
        // irregular en caras grandes.
        flatShading: false,
        // DoubleSide: garantía de que ninguna figura se vea hueca. El culling de
        // caras internas ya se hace al construir la malla, así que no emitimos
        // caras de sobra; con FrontSide, cualquier cara mal orientada se come y
        // el modelo se lee como una reja por la que se ve el fondo. El sobrecoste
        // es rasterizar la cara trasera, que el depth test descarta enseguida.
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mtl);
      mesh.castShadow = opts.shadows ?? true;
      mesh.receiveShadow = opts.shadows ?? true;
      group.add(mesh);
    }

    return group;
  }
}

/**
 * Atajo: construye un VoxelWorld, le mete el contenido y devuelve el Group.
 * `size` permite usar grano grueso en superficies grandes y planas.
 */
export function voxelGroup(name: string, draw: (v: VoxelWorld) => void, size: number = VOXEL): THREE.Group {
  const v = new VoxelWorld(size);
  draw(v);
  return v.build({ name });
}

/* ===========================================================================
 * FUENTE DE PÍXELES 5x7
 * ---------------------------------------------------------------------------
 * Se usa para el dorsal del jugador y para la marca del centro de pista.
 * Se dibuja como rectángulos enteros: no hay nada de suavizado, así que el
 * resultado es pixel-art real y no una fuente "con aire retro".
 * =========================================================================== */

/** Cada carácter son 7 filas de 5 bits, separadas por comas. */
export const PIXEL_FONT: Record<string, string> = {
  '0': '01110,10001,10011,10101,11001,10001,01110',
  '1': '00100,01100,00100,00100,00100,00100,01110',
  '2': '01110,10001,00001,00010,00100,01000,11111',
  '3': '11111,00010,00100,00010,00001,10001,01110',
  '4': '00010,00110,01010,10010,11111,00010,00010',
  '5': '11111,10000,11110,00001,00001,10001,01110',
  '6': '00110,01000,10000,11110,10001,10001,01110',
  '7': '11111,00001,00010,00100,01000,01000,01000',
  '8': '01110,10001,10001,01110,10001,10001,01110',
  '9': '01110,10001,10001,01111,00001,00010,01100',
  A: '01110,10001,10001,11111,10001,10001,10001',
  B: '11110,10001,10001,11110,10001,10001,11110',
  C: '01110,10001,10000,10000,10000,10001,01110',
  D: '11110,10001,10001,10001,10001,10001,11110',
  E: '11111,10000,10000,11110,10000,10000,11111',
  F: '11111,10000,10000,11110,10000,10000,10000',
  G: '01110,10001,10000,10111,10001,10001,01111',
  H: '10001,10001,10001,11111,10001,10001,10001',
  I: '01110,00100,00100,00100,00100,00100,01110',
  J: '00111,00010,00010,00010,00010,10010,01100',
  K: '10001,10010,10100,11000,10100,10010,10001',
  L: '10000,10000,10000,10000,10000,10000,11111',
  M: '10001,11011,10101,10101,10001,10001,10001',
  N: '10001,11001,10101,10011,10001,10001,10001',
  O: '01110,10001,10001,10001,10001,10001,01110',
  P: '11110,10001,10001,11110,10000,10000,10000',
  Q: '01110,10001,10001,10001,10101,10010,01101',
  R: '11110,10001,10001,11110,10100,10010,10001',
  S: '01111,10000,10000,01110,00001,00001,11110',
  T: '11111,00100,00100,00100,00100,00100,00100',
  U: '10001,10001,10001,10001,10001,10001,01110',
  V: '10001,10001,10001,10001,10001,01010,00100',
  W: '10001,10001,10001,10101,10101,11011,10001',
  X: '10001,10001,01010,00100,01010,10001,10001',
  Y: '10001,10001,01010,00100,00100,00100,00100',
  Z: '11111,00001,00010,00100,01000,10000,11111',
  '-': '00000,00000,00000,11111,00000,00000,00000',
  '.': '00000,00000,00000,00000,00000,01100,01100',
  ' ': '00000,00000,00000,00000,00000,00000,00000',
};

/** Ancho en píxeles que ocupará `text` con un tamaño de píxel de `px`. */
export function pixelTextWidth(text: string, px: number): number {
  const chars = [...text.toUpperCase()];
  return Math.max(0, chars.length * 6 - 1) * px;
}

/**
 * Dibuja `text` como rectángulos de píxel. Devuelve el ancho ocupado.
 * No usa `fillText`: por eso no hay antialiasing y se lee como bloques.
 */
export function drawPixelText(
  g: CanvasRenderingContext2D,
  text: string,
  ox: number,
  oy: number,
  px: number,
  color: string,
): number {
  const chars = [...text.toUpperCase()];
  g.fillStyle = color;
  chars.forEach((ch, ci) => {
    const glyph = PIXEL_FONT[ch] ?? PIXEL_FONT[' ']!;
    glyph.split(',').forEach((row, ry) => {
      [...row].forEach((bit, rx) => {
        if (bit === '1') g.fillRect(ox + (ci * 6 + rx) * px, oy + ry * px, px, px);
      });
    });
  });
  return pixelTextWidth(text, px);
}

/**
 * Paleta inspirada en la guía de arte de Trove.
 *
 * Reglas de Trove que se aplican aquí:
 *  · "Trove is bright, fun and silly" → tonos altos y Midlands luminosos.
 *  · "No uses colores más oscuros que 10.10.10; ahí dejan de reflejar luz"
 *    → ningún color de la paleta baja de 0x1e1e1e (por debajo se ensucian).
 *  · "Coloring simple, shading smooth, evita el exceso de saturación;
 *    usa los colores vivos como ACENTO" → una base cálida y neutra, con
 *    los colores intensos reservados a detalles pequeños (aro, cartel, tally).
 *  · "Blocky before organic, formas simples" → el mundo se lee por masas de
 *    color y siluetas, no por detalle fino.
 */
export const PALETTE = {
  /* Pista */
  hardwood: 0xd9a05b, // parqué claro, cálido
  hardwoodDark: 0xb87a3c,
  paint: 0xfdf6e8, // líneas de pista: blanco cálido, nunca gris
  key: 0xb8443c, // zona pintada: rojo teja, no marrón
  keyDark: 0x96332d,

  /* Canasta */
  frame: 0xfdfdf6, // tablero
  rim: 0xff7a2f, // aro: el acento naranja más caliente de la escena
  net: 0xfffaf0,
  pole: 0xb9c4d4, // estructura gris-azulada clara (antes 0x9aa3ad, apagado)
  metal: 0x8e9cb4,

  /* Escenario */
  stands: 0x5d6f96,
  standsSeat: 0x7c93c8,
  wood: 0xa9713c,
  woodDark: 0x7c4e26,
  tunnel: 0x3d4a6b, // antes 0x1b2230: ya no era casi negro
  tunnelInner: 0x2a3550,
  tunnelExit: 0x3ee06a, // verde señalización, acento
  table: 0xc3cddd,
  tableTop: 0x93a1b8,

  /* Personajes */
  skin: 0xf0b27a,
  skinAlt: 0xd69457,
  hair: 0x54371f,
  hairAlt: 0x2f2018,
  shirt: 0xff8c3a, // camiseta del jugador
  shirtAlt: 0x3f8ae0, // camiseta del reportero
  shorts: 0x35406b,
  shortsAlt: 0x4a3f7a,
  shoe: 0xfdfdf6,
  reporterHair: 0x352a22,

  /* Objetos */
  screen: 0x2a3a63,
  tallyOn: 0xff3b30,
  tallyOff: 0x8a4a45,
  // Más saturado y un punto más cálido que el naranja de-series: sobre el
  // parqué,#f5822a se apagaba. 0xff7a1a es el mismo tono con el canal rojo al
  // tope y el verde bajo, que es lo que hace que un naranja parezca naranja.
  ball: 0xff7a1a,
  setBackdrop: 0x3d4a80, // fondo del plató
  setStripe: 0xff8c3a,
} as const;

/** Colores del público en las gradas: variados pero de la misma familia. */
export const CROWD_COLORS = [0xff8c3a, 0x4fa8f0, 0xffd54a, 0x7ee08a, 0xc88cf0, 0xfdfdf6] as const;
