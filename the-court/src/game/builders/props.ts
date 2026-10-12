import * as THREE from 'three';
import { BALL, COURT, RIM, SCORER_TABLE, boardX, rimX, type Side } from '../config';
import { PALETTE, VOXEL, VoxelWorld, voxelGroup } from './util';
import { voxelizeObject } from './voxelize';

/**
 * Anillo de voxels por BARRIDO: recorre la circunferencia y rellena un disco de
 * radio `thickness/2` en cada paso. La versión anterior decidía celda a celda si
 * la distancia al centro estaba dentro del grosor; como la banda era más fina
 * que la diagonal del voxel, salían celdas sueltas y el aro se veía espinoso.
 */
function ringVoxels(v: VoxelWorld, cx: number, cy: number, cz: number, r: number, thickness: number, color: number): void {
  const s = v.size;
  const ix = (m: number) => Math.round(m / s);
  const j0 = ix(cy - s / 2);
  const j1 = j0 + 1;
  const half = thickness / 2;
  const step = s / 2 / Math.max(r, 0.001);
  for (let a = 0; a < Math.PI * 2; a += step) {
    const px = cx + Math.cos(a) * r;
    const pz = cz + Math.sin(a) * r;
    for (let i = ix(px - half - s); i <= ix(px + half + s); i++) {
      for (let k = ix(pz - half - s); k <= ix(pz + half + s); k++) {
        const dx = (i + 0.5) * s - px;
        const dz = (k + 0.5) * s - pz;
        if (dx * dx + dz * dz > half * half) continue;
        v.fillCells(i, j0, k, i, j1, k, color);
      }
    }
  }
}

/**
 * Canasta completa.
 *
 * Se construye a DOS granos (decisión del propietario):
 *  · estructura (poste, brazo, base) a 0.25 m → se lee maciza, sin el enrejado
 *    que producía el sombreado por bloque a 6.25 cm en superficies grandes;
 *  · tablero, aro y red a 0.0625 m → aquí sí interesa el detalle fino.
 */
export function buildHoop(side: Side): THREE.Group {
  const bx = boardX(side);
  const poleX = side * (COURT.halfL + 0.6);
  const s = VOXEL;
  const tag = side > 0 ? 'R' : 'L';

  const group = new THREE.Group();
  group.name = `hoop${tag}`;

  // ── Estructura: base, poste por tramos, brazo y tornapuntas ─────────────
  group.add(
    voxelGroup(
      `hoopStruct${tag}`,
      (v) => {
        const [lo, hi] = poleX < bx ? [poleX, bx] : [bx, poleX];
        // Base: placa ancha con refuerzos en las esquinas y pernos.
        v.span(poleX - 0.55, 0, -0.55, poleX + 0.55, 0.12, 0.55, 0x6b7686);
        v.span(poleX - 0.42, 0.12, -0.42, poleX + 0.42, 0.3, 0.42, PALETTE.metal);
        for (const dx of [-0.34, 0.34]) {
          for (const dz of [-0.34, 0.34]) {
            v.span(poleX + dx - 0.05, 0.12, dz - 0.05, poleX + dx + 0.05, 0.34, dz + 0.05, 0x8e9cb4);
          }
        }
        // Poste por TRAMOS: cuatro secciones separadas por collares, en vez de
        // un prisma liso de 3,75 m. El collar es lo que da escala al poste.
        for (let i = 0; i < 4; i++) {
          const y0 = 0.3 + i * 0.86;
          v.span(poleX - 0.22, y0, -0.22, poleX + 0.22, y0 + 0.78, 0.22, PALETTE.pole);
          v.span(poleX - 0.27, y0 + 0.78, -0.27, poleX + 0.27, y0 + 0.86, 0.27, PALETTE.metal);
        }
        // Brazo horizontal hasta el tablero, con cartela de unión.
        v.span(lo, 3.2, -0.18, hi, 3.5, 0.18, PALETTE.pole);
        v.span(lo + 0.06, 3.06, -0.22, lo + 0.3, 3.2, 0.22, PALETTE.metal);
        // Tornapuntas escalonado bajo el brazo.
        v.span(lo + 0.25, 2.62, -0.15, lo + 1.15, 3.2, 0.15, PALETTE.metal);
        v.span(lo + 0.65, 2.1, -0.15, lo + 1.55, 2.62, 0.15, PALETTE.metal);
        v.span(lo + 1.05, 1.6, -0.15, lo + 1.85, 2.1, 0.15, PALETTE.metal);
      },
      // Grano MEDIO: el poste es un prisma de 44 cm de lado. A 3 cm salían
      // 33.000 triángulos por canasta para una silueta que no cambia.
      VOXEL * 2,
    ),
  );

  // ── Tablero, aro y red ──────────────────────────────────────────────────
  group.add(
    voxelGroup(`hoopFine${tag}`, (v) => {
      const t = s;
      const y0 = 2.9;
      const y1 = 3.95;
      // Tablero: 2 voxels de grosor para que se lea de canto.
      v.span(bx - t, y0, -0.9, bx + t, y1, 0.9, PALETTE.frame);
      // Marco perimetral: sin él el tablero es una losa blanca sin escala.
      for (const zz of [-0.9, 0.9]) v.span(bx - t * 1.1, y0, zz - t, bx + t * 1.1, y1, zz + t, PALETTE.metal);
      for (const yy of [y0, y1]) v.span(bx - t * 1.1, yy - t, -0.9, bx + t * 1.1, yy + t, 0.9, PALETTE.metal);
      // Protector inferior: la banda acolchada que llevan todos los tableros.
      v.span(bx - t * 1.4, y0 - 0.06, -0.9, bx + t * 1.4, y0, 0.9, 0x2b3550);

      // Cuadro de tiro: contorno naranja sobre el tablero.
      const f = side * (t + s * 0.6);
      v.span(bx + f - 0.03, 3.05, -0.3, bx + f + 0.03, 3.5, -0.2, PALETTE.rim);
      v.span(bx + f - 0.03, 3.05, 0.2, bx + f + 0.03, 3.5, 0.3, PALETTE.rim);
      v.span(bx + f - 0.03, 3.05, -0.3, bx + f + 0.03, 3.15, 0.3, PALETTE.rim);
      v.span(bx + f - 0.03, 3.4, -0.3, bx + f + 0.03, 3.5, 0.3, PALETTE.rim);

      // Soporte del aro: escuadra que une tablero y aro.
      const rimCx = rimX(side);
      v.span(
        Math.min(bx + f, rimCx), RIM.y - 0.05, -0.06,
        Math.max(bx + f, rimCx), RIM.y + 0.05, 0.06, PALETTE.rim,
      );

      // Aro: anillo sólido a la altura reglamentaria (3,05 m).
      ringVoxels(v, rimCx, RIM.y, 0, RIM.radius, s * 1.8, PALETTE.rim);

      // Red: DOCE hilos (antes 8) que se cierran hacia abajo, con dos aros
      // intermedios. Más hilos es lo que hace que la red se lea como red y no
      // como cuatro palos.
      const HILOS = 12;
      const niveles = 8;
      for (let n = 0; n < HILOS; n++) {
        const a = (n / HILOS) * Math.PI * 2;
        for (let l = 0; l < niveles; l++) {
          const tt = l / (niveles - 1);
          const rr = RIM.radius * (1 - tt * 0.42);
          const y = RIM.y - 0.04 - tt * 0.44;
          const j0 = Math.round((y - s / 2) / s);
          const cx = Math.round((rimCx + Math.cos(a) * rr) / s);
          const cz = Math.round((Math.sin(a) * rr) / s);
          v.fillCells(cx, j0, cz, cx, j0 + 1, cz, PALETTE.net);
        }
      }
      // Aros de la red: dos anillos intermedios que la mantienen abierta.
      ringVoxels(v, rimCx, RIM.y - 0.2, 0, RIM.radius * 0.88, s * 1.2, PALETTE.net);
      ringVoxels(v, rimCx, RIM.y - 0.48, 0, RIM.radius * 0.58, s * 1.2, PALETTE.net);
    }),
  );

  return group;
}

/**
 * Mesa de anotadores, al centro de la banda lejana (0, -9), delante de las gradas.
 * Es la que abre la sección de Skills. Lleva una placa con el rótulo encima.
 */
export function buildScorerTable(): THREE.Group {
  return voxelGroup('scorerTable', (v) => {
    const x0 = -1.2;
    const x1 = 1.2;
    const z = SCORER_TABLE.z;

    // Tablero con reborde: el canto superior es lo que da grosor a la mesa.
    v.span(x0, 0.92, z - 0.42, x1, 1.0, z + 0.42, PALETTE.tableTop);
    v.span(x0 - 0.04, 1.0, z - 0.46, x1 + 0.04, 1.06, z + 0.46, PALETTE.table);
    // Faldón frontal: tapa el hueco de debajo y hace que la mesa lea maciza.
    v.span(x0, 0.72, z + 0.36, x1, 0.92, z + 0.42, PALETTE.table);

    // Patas por tramos, con travesaño y pies.
    for (const dx of [-1.0, 1.0]) {
      v.span(dx - 0.06, 0.1, z - 0.34, dx + 0.06, 0.92, z + 0.34, PALETTE.metal);
      v.span(dx - 0.14, 0, z - 0.42, dx + 0.14, 0.1, z + 0.42, 0x6b7686);
    }
    v.span(x0 + 0.1, 0.45, z - 0.05, x1 - 0.1, 0.53, z + 0.05, PALETTE.metal);

    // ── Equipo sobre la mesa: monitor, teclado, papeles y dos vasos.
    // Monitor con peana y pantalla encendida (azul), mirando a la pista.
    v.span(-0.42, 1.0, z - 0.16, -0.05, 1.06, z + 0.02, 0x1f2937);
    v.span(-0.4, 1.06, z - 0.12, -0.07, 1.46, z - 0.04, 0x0b1220);
    v.span(-0.37, 1.11, z - 0.05, -0.1, 1.41, z - 0.03, 0x3f8ae0);
    // Teclado.
    v.span(0.05, 1.0, z - 0.2, 0.55, 1.05, z + 0.02, 0x2b3a52);
    // Papeles y dos vasos.
    v.span(0.65, 1.0, z - 0.12, 0.95, 1.06, z + 0.14, 0xe8e2d0);
    v.span(-1.0, 1.0, z - 0.1, -0.84, 1.16, z + 0.06, 0xe8e2d0);
    v.span(-0.74, 1.0, z - 0.08, -0.6, 1.14, z + 0.08, 0xe8e2d0);

    // ── Dos sillas de anotador, giradas hacia la mesa.
    for (const dx of [-0.75, 0.75]) {
      v.span(dx - 0.22, 0.42, z - 0.86, dx + 0.22, 0.5, z - 0.5, PALETTE.wood); // asiento
      v.span(dx - 0.22, 0.5, z - 0.9, dx + 0.22, 0.92, z - 0.84, PALETTE.wood); // respaldo
      v.span(dx - 0.06, 0, z - 0.82, dx + 0.06, 0.42, z - 0.54, PALETTE.metal);
    }

    // ── Placa con el rótulo, sobre un poste, mirando a la pista.
    v.span(-0.05, 1.06, z + 0.4, 0.05, 2.1, z + 0.46, PALETTE.metal);
    v.span(-0.9, 1.6, z + 0.36, 0.9, 2.14, z + 0.44, 0x1f2937);
    v.span(-0.82, 1.67, z + 0.34, 0.82, 2.07, z + 0.38, PALETTE.shirt);

    // ── Cables: dos tiros sueltos que caen de la mesa al suelo. Detalle
    // pequeño, pero es lo que separa una mesa de un mueble de bloque.
    for (const dx of [-1.15, 1.12]) {
      v.span(dx, 0.5, z + 0.3, dx + 0.05, 0.92, z + 0.35, 0x1f2937);
      v.span(dx + 0.05, 0.12, z + 0.3, dx + 0.28, 0.5, z + 0.35, 0x1f2937);
    }
  }, VOXEL * 2);
}

/** Banquillo del jugador: asiento, respaldo, patas, bolsa y toalla. */
export function buildBench(): THREE.Group {
  return voxelGroup('bench', (v) => {
    // z0 estaba en 9,42: el banquillo quedaba 1,9 m por detrás de la banda.
    // A 7,75 arranca a 25 cm del borde de la pista y por delante de las vallas.
    const z0 = 7.75;
    // Asiento por LAMAS: dos tablones con junta en vez de una losa maciza.
    v.span(-2.5, 0.44, z0, 2.5, 0.54, z0 + 0.27, PALETTE.wood);
    v.span(-2.5, 0.44, z0 + 0.31, 2.5, 0.54, z0 + 0.55, PALETTE.wood);
    // Respaldo con lama de remate.
    v.span(-2.5, 0.54, z0 + 0.44, 2.5, 0.72, z0 + 0.55, PALETTE.wood);
    v.span(-2.5, 0.86, z0 + 0.44, 2.5, 1.04, z0 + 0.55, PALETTE.wood);
    v.span(-2.5, 1.04, z0 + 0.42, 2.5, 1.1, z0 + 0.57, PALETTE.woodDark);
    // Patas con pie.
    for (const x of [-2.25, 0, 2.25]) {
      v.span(x - 0.06, 0.1, z0 + 0.02, x + 0.06, 0.44, z0 + 0.53, PALETTE.metal);
      v.span(x - 0.12, 0, z0, x + 0.12, 0.1, z0 + 0.55, 0x6b7686);
    }
    // Bolsa de deporte con cremallera.
    v.span(1.05, 0.54, z0 + 0.08, 1.75, 0.89, z0 + 0.48, PALETTE.shirt);
    v.span(1.2, 0.89, z0 + 0.14, 1.6, 1.01, z0 + 0.42, PALETTE.shirtAlt);
    v.span(1.0, 0.72, z0 + 0.44, 1.8, 0.78, z0 + 0.5, 0x1f2937); // correa
    // Toallas dobladas y nevera.
    v.span(-1.45, 0.54, z0 + 0.1, -0.95, 0.63, z0 + 0.46, 0xf8fafc);
    v.span(-1.4, 0.63, z0 + 0.14, -1.0, 0.69, z0 + 0.42, 0xdfe9f7);
    v.span(-2.4, 0.54, z0 + 0.12, -1.75, 0.86, z0 + 0.44, 0x3f8ae0);
    v.span(-2.36, 0.86, z0 + 0.16, -1.79, 0.92, z0 + 0.4, 0xdfe9f7);
    // Botellas en el suelo, junto a la pata central.
    v.span(-0.3, 0, z0 + 0.62, -0.16, 0.24, z0 + 0.76, 0x4fa8f0);
    v.span(0.2, 0, z0 + 0.6, 0.34, 0.24, z0 + 0.74, 0x7ee08a);
  }, VOXEL * 2);
}

/**
 * Túnel de vestuarios. El rótulo es un pictograma (flecha de bloques), NO texto:
 * así no hay ninguna palabra visible sin traducir.
 */
export function buildTunnel(): THREE.Group {
  return voxelGroup('tunnel', (v) => {
    const x0 = -11.7;
    const x1 = -8.3;
    const z = -9.9;

    // ── Marco que SOBRESALE del muro: sin él la boca es un agujero recortado
    // en una pared plana y no se lee como una puerta.
    v.span(x0 - 0.25, 0, z - 0.45, x1 + 0.25, 3.25, z + 0.45, PALETTE.tunnel);
    // Jambas y dintel en tono más claro, para que el hueco se recorte.
    v.span(x0, 0, z - 0.36, x0 + 0.35, 2.65, z + 0.36, 0x4a5a80);
    v.span(x1 - 0.35, 0, z - 0.36, x1, 2.65, z + 0.36, 0x4a5a80);
    v.span(x0, 2.65, z - 0.36, x1, 3.0, z + 0.36, 0x4a5a80);
    // Interior en negro con DOS escalones de profundidad: da sensación de
    // túnel, no de rectángulo pintado.
    v.span(x0 + 0.35, 0, z - 0.3, x1 - 0.35, 2.65, z + 0.3, PALETTE.tunnelInner);
    v.span(x0 + 0.7, 0, z - 0.18, x1 - 0.7, 2.4, z + 0.18, 0x151d30);

    // ── Rótulo con el pictograma de salida (flecha de bloques, no texto).
    v.span(x0 + 0.5, 3.25, z + 0.34, x1 - 0.5, 3.85, z + 0.46, 0x1f2937);
    for (let n = 0; n < 5; n++) {
      const ax = x0 + 0.75 + n * 0.26;
      v.span(ax, 3.42, z + 0.46, ax + 0.26, 3.68, z + 0.5, 0x16a34a);
      if (n < 4) v.span(ax + 0.26, 3.5, z + 0.46, ax + 0.38, 3.6, z + 0.5, 0x16a34a);
    }
    // Aros de señalización a los lados del marco.
    for (const dx of [x0 - 0.25, x1 + 0.25]) {
      v.span(dx - 0.1, 1.5, z + 0.42, dx + 0.1, 1.7, z + 0.5, 0x16a34a);
    }
    // Marca de suelo: dos franjas que entran hacia el túnel.
    v.span(x0 + 0.5, 0, z + 0.45, x0 + 0.72, 0.02, z + 1.6, 0xdfe9f7);
    v.span(x1 - 0.72, 0, z + 0.45, x1 - 0.5, 0.02, z + 1.6, 0xdfe9f7);
    // Dos focos sobre el dintel.
    for (const dx of [x0 + 0.7, x1 - 0.7]) {
      v.span(dx - 0.12, 3.0, z + 0.3, dx + 0.12, 3.16, z + 0.42, 0x8e9cb4);
      v.span(dx - 0.08, 3.0, z + 0.42, dx + 0.08, 3.12, z + 0.48, 0xfff3c4);
    }
  }, VOXEL * 4);
}

/**
 * Anillo luminoso que marca una zona interactiva, construido con voxels.
 * Devuelve una única Mesh para mantener la firma que usa main.ts.
 */
export function buildZoneRing(x: number, z: number, radius: number): THREE.Mesh {
  const v = new VoxelWorld();
  const s = v.size;
  const ix = (m: number) => Math.round(m / s);

  /**
   * Se rasteriza BARRIDIENDO la circunferencia y rellenando un disco de radio
   * `half` en cada paso. La versión anterior decidía celda a celda si la
   * distancia al centro caía dentro del grosor: eso deja huecos radiales y el
   * anillo se veía como una rueda de radios en vez de una línea.
   */
  const half = s * 4; // semi-grosor de 12,5 cm -> banda de 25 cm
  const step = 0.01;
  for (let a = 0; a < Math.PI * 2; a += step) {
    const px = x + Math.cos(a) * radius;
    const pz = z + Math.sin(a) * radius;
    for (let i = ix(px - half); i <= ix(px + half); i++) {
      for (let k = ix(pz - half); k <= ix(pz + half); k++) {
        const dx = (i + 0.5) * s - px;
        const dz = (k + 0.5) * s - pz;
        if (dx * dx + dz * dz > half * half) continue;
        v.fillCells(i, 0, k, i, 0, k, 0xff6a1a);
      }
    }
  }
  // Modo plano: solo la cara superior, a 1.2 cm del suelo. Como bloque de 6.25 cm
  // se leería como una valla desde la cámara rasante.
  const group = v.build({ name: `zoneRing(${x},${z})`, flatTop: true, flatY: 0.012, shadows: false });
  const mesh = group.children[0] as THREE.Mesh | undefined;
  if (!mesh) {
    // Nunca debería ocurrir: si el radio es diminuto, cae a un cuadrado.
    return new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), new THREE.MeshBasicMaterial({ color: 0xff6a1a }));
  }
  const mat = new THREE.MeshBasicMaterial({ color: 0xff6a1a, side: THREE.DoubleSide });
  mesh.material = mat;
  // La geometría se construye en coordenadas ABSOLUTAS (cada celda se coloca en
  // el x,z de la zona), así que el origen del mesh está en (0,0,0) del mundo y
  // no en el centro del anillo. Al escalarlo para que palpite, el anillo NO
  // crecía: se DESPLAZABA, y cada uno hacia un lado distinto según dónde
  // estuviera. Recentrar la geometría y devolver la posición al mesh hace que
  // el escalado sea simétrico y el anillo sólo cambie de diámetro.
  mesh.geometry.translate(-x, 0, -z);
  mesh.position.set(x, 0, z);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}

/**
 * Balón de baloncesto.
 *
 * Tres decisiones, todas aprendidas mirando el resultado en pantalla:
 *
 *  1. **12 cubos de diámetro**, que es EXACTAMENTE el grano del resto del
 *     mundo: 0,408 m / 12 = 0,034 m por cubo, frente a los 0,03125 m del
 *     escenario. El balón está hecho de los mismos bloques que la pista, el
 *     jugador y las gradas.
 *
 *     Es la decisión más delicada de todo el modelo y ha pasado por 28, 36, 48
 *     y 20 cubos. Con 48 cada cubo mide 8,5 mm: a la distancia de juego son 0,6
 *     píxeles, el voxelizado se vuelve INVISIBLE y la pelota se ve como una
 *     esfera de plástico lisa. Con 12 cada cubo ocupa 2,7 píxeles y se lee
 *     redonda Y se lee que está hecha de bloques.
 *
 *     REGLA GENERAL: el grano de un objeto se elige por su TAMAÑO EN PANTALLA,
 *     no por su tamaño real. Un objeto que ocupa 30 píxeles no admite más de
 *     ~12-15 divisiones: por encima, el detalle no existe.
 *  2. **Se voxeliza el modelo descargado** para la forma: es su aportación y
 *     respeta el encargo de usar los assets del propietario.
 *  3. **Las costuras se PINTAN ENCIMA.** El modelo trae dos bandas
 *     perpendiculares que forman una cruz; eso no es un balón, es una naranja.
 *     Se pintan un ecuador y dos meridianos, que es el dibujo que hace que
 *     cualquier silueta se reconozca como balón de baloncesto.
 */
export function createBallMesh(glb?: THREE.Object3D | null): THREE.Object3D {
  const R = BALL.radius * BALL.visualScale;
  const grid = (R * 2) / 12;
  const v = new VoxelWorld(grid);

  let celdas = 0;
  if (glb) {
    celdas = voxelizeObject(v, glb, {
      grid,
      colorOf: (m) => {
        const mat = (Array.isArray(m.material) ? m.material[0] : m.material) as
          | THREE.MeshStandardMaterial
          | undefined;
        return mat?.color?.getHex() ?? PALETTE.ball;
      },
    });
  }
  if (celdas === 0) {
    // Sin glTF (o si no produjo voxels) la forma se genera igualmente.
    v.sphere(0, 0, 0, R, PALETTE.ball);
  }

  // ── Costuras. Se recorren las celdas de la CORTEZA y se repintan las que
  // caen sobre los tres anillos. El interior se deja en paz: no se ve.
  const s = grid;
  const reach = Math.ceil(R / s) + 1;
  /*
   * GROSOR DE LA COSTURA: UNA CELDA.
   *
   * Los centros de celda caen en ±0,5s, ±1,5s…, así que el plano x=0 —que cae
   * en la FRONTERA entre las celdas -1 y 0— pinta dos capas con cualquier
   * umbral mayor de 0,5s. Con dos celdas por costura y tres planos, la costura
   * se llevaba el 39 % de la corteza y el balón entero se leía marrón. Medido,
   * no estimado (tests/ball.test.ts).
   *
   * La solución no es bajar el umbral —imposible, por debajo de 0,5s no entra
   * ninguna celda— sino desplazar el plano media celda para que pase por el
   * CENTRO de una celda en vez de por su frontera. Así entra exactamente una.
   * El desplazamiento es de 0,017 m en un balón de 0,41 m: un 4 % del radio,
   * que no se ve, y la costura sale a la mitad de grosor.
   */
  const half = s * 0.5;
  const w = s * 0.5;
  const inner = (R - s * 1.9) ** 2;
  for (let i = -reach; i <= reach; i++) {
    for (let j = -reach; j <= reach; j++) {
      for (let k = -reach; k <= reach; k++) {
        const x = (i + 0.5) * s;
        const y = (j + 0.5) * s;
        const z = (k + 0.5) * s;
        const d2 = x * x + y * y + z * z;
        if (d2 > R * R || d2 < inner) continue;
        if (Math.abs(y - half) < w || Math.abs(x - half) < w || Math.abs(z - half) < w) {
          // Marrón cálido en vez de negro: con negro la costura se leía como
          // un agujero y el balón entero como un oso pardo.
          v.putCell(i, j, k, 0x9c4f18);
        }
      }
    }
  }
  return v.build({ name: 'ball' });
}

export { VOXEL };