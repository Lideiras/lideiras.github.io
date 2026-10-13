import * as THREE from 'three';
import { VoxelWorld, canvasTexture, drawPixelText, pixelTextWidth } from './util';

/* ---------------------------------------------------------------------------
 * DORSAL EN PIXEL-ART
 * Los dígitos se dibujan como rectángulos sobre un canvas (nada de fuentes
 * vectoriales): así el número es pixel-art de verdad y con NearestFilter se lee
 * nítido de espaldas. Usa la fuente compartida PIXEL_FONT de util.ts.
 * ------------------------------------------------------------------------- */

export interface HumanOptions {
  skin: number;
  /** Tono alternativo de piel (nariz, mejillas) para que la cara tenga volumen. */
  skinAlt?: number;
  hair: number;
  /**
   * Tono de sombra del pelo. La guía (§6.2) limita el cabello a una base, una
   * sombra y un tono de luz; pintar cada mechón de un tono distinto convierte
   * la cabeza en ruido. Se usa sólo en la masa trasera y las patillas.
   */
  hairAlt?: number;
  jersey: number;
  /** Tono oscuro de la camiseta: paneles laterales y sombra de la prenda. */
  jerseyAlt?: number;
  shorts: number;
  shoes: number;
  /** Color de acento único: cinturilla, muñequeras, franjas (guía §10.1). */
  accent?: number;
  number?: string;
  /** Anisotropía máxima del renderer, para el dorsal (se ve muy reducido). */
  anisotropy?: number;
  /**
   * Funde los colores de cada pieza en una sola malla (por defecto sí).
   *
   * Se puede apagar para MEDIR: comparando la firma geométrica del rig fundido
   * con la del rig sin fundir se comprueba que no se pierde ni un triángulo ni un
   * color (BITACORA §3m). `false` reproduce el comportamiento anterior.
   */
  mergeColors?: boolean;
}

export interface HumanRig {
  root: THREE.Group; // posición/rotación en el mundo (pies en y=0, mira hacia +Z local)
  body: THREE.Group; // sube y baja al correr
  /**
   * Pivote de inclinación del torso, situado a la altura de la cintura.
   *
   * Hace falta uno propio porque `torso` cuelga en el ORIGEN (los pies) y la
   * cabeza es hermana suya, no hija: rotar `torso` dejaba la cabeza quieta y
   * barría el torso de lado. Girando este grupo se echan a la vez pantalón,
   * torso, cabeza y brazos, y las piernas se quedan verticales, que es
   * exactamente lo que hace alguien al accelerating.
   */
  lean: THREE.Group;
  torso: THREE.Group;
  armL: THREE.Group; // pivotes en los hombros
  armR: THREE.Group;
  legL: THREE.Group; // pivotes en las caderas
  legR: THREE.Group;
}

/** Textura del dorsal: cada carácter del número son 5x7 píxeles cuadrados. */
function numberTexture(text: string, anisotropy?: number): THREE.CanvasTexture {
  const px = 6; // lado de cada píxel-art en el canvas
  const w = Math.max(1, pixelTextWidth(text, px));
  const h = 7 * px;
  return canvasTexture(
    w,
    h,
    (g) => {
      g.clearRect(0, 0, w, h);
      drawPixelText(g, text, 0, 0, px, '#ffffff');
    },
    // Con mipmaps: el dorsal mide 0,3 m y se mira desde 16 m, así que la textura
    // se reduce mucho. Sin ellos, los dígitos se ven rotos a distancia.
    { mipmaps: true, anisotropy },
  );
}

/* ===========================================================================
 * CONSTRUCCIÓN DEL PERSONAJE
 * ---------------------------------------------------------------------------
 * Referencia: Cube World. La firma visual no es "tener cubos", es la JERARQUÍA
 * DE MASAS: cabeza enorme, pelo volumétrico y escalonado, torso corto y
 * compacto, manos y calzado anchos, y el resto al servicio de esas masas.
 *
 * El cuerpo se dibuja en 48 CELDAS DE DISEÑO de alto, que es una escala cómoda
 * de ajustar a mano. La rejilla real es D veces más fina (ver `D`), así que
 * cada celda de diseño es un bloque de celdas reales: el personaje mide lo
 * mismo y tiene muchos más cubos.
 * =========================================================================== */

/** Lado del voxel del personaje, en metros. */
export const CHAR_VOXEL = 0.0185;

/** Celdas de diseño -> celdas de rejilla. Cada celda de diseño es un bloque DxDxD. */
const D = 2;

/** Celdas de diseño -> metros. */
const u = (n: number): number => n * D * CHAR_VOXEL;

/**
 * Centro de la mano en coordenadas LOCALES del grupo de brazo, en metros.
 * La mano ocupa las celdas de diseño -9..-6, así que su centro es -7,5.
 * Se usa para colgar el balón de la mano de verdad en vez de adivinar una
 * altura fija: así el balón sigue al brazo en cualquier pose.
 */
export const HAND_LOCAL_Y = 7.5 * D * CHAR_VOXEL;

/** Posición mundial del centro de la mano, para anclar objetos a ella. */
export function handWorld(rig: HumanRig, side: -1 | 1, out: THREE.Vector3): THREE.Vector3 {
  const arm = side < 0 ? rig.armL : rig.armR;
  arm.updateWorldMatrix(true, false);
  return out.set(0, -HAND_LOCAL_Y, 0).applyMatrix4(arm.matrixWorld);
}

/** Superficie de dibujo que usan los constructores: en celdas de DISEÑO. */
interface Grid {
  fillCells(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, color: number): void;
  eraseCells(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): void;
}

/**
 * Adapta una rejilla real al dibujo en celdas de diseño.
 *
 * Cada celda de diseño (x0..x1) se convierte en el bloque real
 * [x0*D, (x1+1)*D - 1], de modo que las piezas siguen encajando exactamente
 * unas con otras sin dejar costuras de media celda.
 */
function designGrid(v: VoxelWorld): Grid {
  return {
    fillCells: (x0, y0, z0, x1, y1, z1, color) =>
      v.fillCells(x0 * D, y0 * D, z0 * D, (x1 + 1) * D - 1, (y1 + 1) * D - 1, (z1 + 1) * D - 1, color),
    eraseCells: (x0, y0, z0, x1, y1, z1) =>
      v.eraseCells(x0 * D, y0 * D, z0 * D, (x1 + 1) * D - 1, (y1 + 1) * D - 1, (z1 + 1) * D - 1),
  };
}

/* ---------------------------------------------------------------------------
 * REPARTO VERTICAL (en celdas de diseño, y = 0 es el suelo)
 * ---------------------------------------------------------------------------
 * La guía (§3.2) pide que la cabeza CON EL PELO ocupe entre el 35 % y el 45 %
 * de la altura. Antes se llevaba 14 de 48 celdas (29 %) y el personaje se leía
 * como un humano bajito, no como un personaje de Cube World.
 *
 * Reparto actual: cabeza + pelo = 28 de 48 celdas = 58,3 %. Proporción de
 * vinilo (Funko): la cabeza es más de la mitad del muñeco y el cuerpo queda
 * reducido a un muñón con brazos y piernas cortos.
 *
 * REGLA: el torso y los tramos de las extremidades se recortan, pero las MANOS
 * y los PIES conservan su tamaño. Al acortar el brazo, la mano gana peso
 * relativo, que es exactamente la lectura de Cube World: muñones cortos con
 * manos y botas grandes.
 *
 *   y  0.. 2  zapatilla        (3)   <- SIN recortar
 *   y  3.. 9  pierna           (7)   <- recortada
 *   y  8..13  pantalón corto   (6)
 *   y 13..19  torso            (7)   <- recortado
 *   y 20..47  CABEZA + PELO   (28)  <- 58,3 %
 * ------------------------------------------------------------------------- */
const C = {
  shoeTop: 3,
  hip: 9, // pivote de cadera
  shortsTop: 14,
  shoulder: 18, // pivote de hombro
  torsoTop: 20,
  headTop: 48,
} as const;

/**
 * Anchos (en celdas de diseño, contados a cada lado del eje).
 *
 * La guía (§3.1) pide que la cabeza supere claramente al torso: 1,25–1,6×.
 * Aquí la cabeza mide 18 celdas y el torso 14 (12 + una hombrera por lado)
 * -> 1,29×. Contando las patillas del pelo, 20/14 -> 1,43×.
 */
const HX = 10; // semiancho de la cabeza  -> 20 celdas (0,740 m)
const HZ = 8; // semiprofundidad        -> 16 celdas
const TX = 6; // semiancho del torso    -> 12 celdas (0,444 m)

/**
 * Inclinación máxima del torso al correr de verdad, en radianes.
 *
 * 0,14 rad son unos 8°: se percibe como que el cuerpo se echa adelante sin
 * llegar a postureo, que es el punto en el que un personaje voxel de bloques
 * rígidos empieza a ser imposible de sostener.
 */
const LEAN_RUN = 0.14;
const TZ = 4; // semiprofundidad        -> 8 celdas

/**
 * Bloque con las esquinas verticales recortadas.
 *
 * Es la diferencia entre "un cubo" y "un bloque tallado": la guía (§15) avisa
 * de que un personaje hecho sólo de cajas planas se lee como un muñeco
 * genérico. Recortar una celda en cada esquina redondea la silueta sin salirse
 * del lenguaje cúbico.
 */
function block(
  v: Grid,
  x0: number, y0: number, z0: number,
  x1: number, y1: number, z1: number,
  color: number,
  cut = 1,
): void {
  v.fillCells(x0, y0, z0, x1, y1, z1, color);
  if (cut <= 0) return;
  for (const cx of [x0, x1 - cut + 1]) {
    for (const cz of [z0, z1 - cut + 1]) {
      v.eraseCells(cx, y0, cz, cx + cut - 1, y1, cz + cut - 1);
    }
  }
}

/**
 * Humanoide voxel con proporción de Cube World.
 *
 * Se conservan los pivotes del esqueleto (`C.hip` en la cadera, `C.shoulder`
 * en el hombro) para que `animateHuman` y `poseShoot` sigan funcionando sin
 * cambios; lo que cambia es la estructura completa de masas.
 */
export function buildHuman(o: HumanOptions): HumanRig {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const part = (name: string, draw: (v: Grid) => void): THREE.Group => {
    const v = new VoxelWorld(CHAR_VOXEL);
    draw(designGrid(v));
    /*
     * UNA malla por pieza, no una por color.
     *
     * El constructor emite una malla por tonalidad, y cada malla es una llamada
     * de dibujo por fotograma: el rig del jugador salía con 30 (cabello, piel,
     * camiseta, pantalón, zapatilla, acento... repetidos en cada pieza) y los dos
     * actores del plató con ~30 cada uno. Fundir los colores en una geometría con
     * color por vértice deja el rig en 8-9 llamadas y el resultado es idéntico
     * (caras opacas, mismo material con `vertexColors`).
     *
     * El mundo estático NO necesita esto: `batch.ts` lo funde igual en el
     * arranque. Aquí sí, porque el rig no se puede fundir: se mueve cada fotograma.
     */
    return v.build({ name, mergeColors: o.mergeColors ?? true });
  };

  const HIP = u(C.hip);
  const SHOULDER = u(C.shoulder);
  const accent = o.accent ?? o.shoes;
  const jerseyAlt = o.jerseyAlt ?? o.shorts;
  const hairAlt = o.hairAlt ?? o.hair;

  /* ── Pierna ────────────────────────────────────────────────────────────
   * El pivote está en la cadera, así que la geometría se escribe en celdas
   * NEGATIVAS hacia abajo (local y = 0 es la cadera).
   *
   * La pierna es CORTA y la zapatilla ancha: la guía (§9.3) señala las botas
   * como una de las masas que equilibran la cabeza grande. */
  const leg = (side: -1 | 1): THREE.Group => {
    const pivot = new THREE.Group();
    pivot.position.set(side * u(3), HIP, 0);
    const limb = part('leg', (v) => {
      const foot = -C.hip; // suelo
      const shoeTop = -C.hip + C.shoeTop;
      // Muslo y espinilla: un solo volumen; el color marca la articulación.
      v.fillCells(-2, shoeTop, -2, 1, 0, 1, o.skin);
      // Calcetín: franja de acento sobre el tobillo.
      v.fillCells(-2, shoeTop, -2, 1, shoeTop + 2, 1, accent);
      // Rodillera: placa frontal, no esfera (§9.2).
      v.fillCells(-2, -8, 2, 1, -5, 2, accent);
      // Zapatilla por capas: cuerpo, puntera, suela y cordones.
      block(v, -3, foot, -4, 2, shoeTop - 1, 2, o.shoes, 1);
      v.fillCells(-3, foot, 3, 2, shoeTop - 2, 4, o.shoes); // puntera
      v.fillCells(-3, foot, -4, 2, foot, 4, 0x2f3a55); // suela
      v.fillCells(-1, foot + 1, -2, 0, shoeTop - 2, 1, accent); // cordones
      // Refuerzo lateral: rompe la simetría del zapato visto de perfil.
      v.fillCells(side > 0 ? 1 : -2, foot + 1, -4, side > 0 ? 2 : -1, foot + 2, -2, jerseyAlt);
    });
    pivot.add(limb);
    return pivot;
  };

  /* ── Brazo ─────────────────────────────────────────────────────────────
   * Manga, puño, antebrazo, muñequera y MANO GRANDE. La guía (§8.2) pide que
   * la mano mida entre el 30 % y el 40 % de la anchura de la cabeza: aquí son
   * 6 celdas frente a 16 -> 37,5 %.
   *
   * El brazo se acorta respecto al diseño anterior: con una cabeza que ocupa
   * el 42 % de la altura, unos brazos largos devolverían la lectura humana. */
  const arm = (side: -1 | 1): THREE.Group => {
    const pivot = new THREE.Group();
    pivot.position.set(side * u(HX), SHOULDER, 0);
    const limb = part('arm', (v) => {
      // Tramos recortados: manga 2, puño 1, antebrazo 2, muñequera 1.
      v.fillCells(-2, -2, -2, 1, 0, 1, o.jersey); // manga
      v.fillCells(-2, -3, -2, 1, -2, 1, accent); // puño de la manga
      v.fillCells(-2, -5, -2, 1, -3, 1, o.skin); // antebrazo
      v.fillCells(-2, -6, -2, 1, -5, 1, accent); // muñequera
      // MANO: 3 celdas, igual que antes. Es la pieza que NO se recorta.
      block(v, -3, -9, -3, 2, -6, 2, o.skin, 1);
      // Pulgar: una sola pieza, sólo donde la cámara la ve (§8.2).
      v.fillCells(side > 0 ? 2 : -3, -8, 0, side > 0 ? 2 : -3, -7, 2, o.skin);
    });
    pivot.add(limb);
    return pivot;
  };

  const legL = leg(-1);
  const legR = leg(1);
  const armL = arm(-1);
  const armR = arm(1);

  /* ── Pantalón corto ────────────────────────────────────────────────────
   * Cinturilla, perneras separadas y franja lateral. Sin el corte central, el
   * pantalón y las piernas se funden en un bloque vertical (§4.1). */
  const shorts = part('shorts', (v) => {
    const y0 = C.shortsTop - 6;
    block(v, -TX, y0, -TZ, TX - 1, C.shortsTop - 1, TZ - 1, o.shorts, 1);
    v.fillCells(-TX, C.shortsTop - 1, -TZ, TX - 1, C.shortsTop, TZ - 1, accent); // cinturilla
    // Franja lateral: da dirección a la pierna sin añadir piezas pequeñas.
    v.fillCells(-TX, y0 + 1, -TZ, -TX, C.shortsTop - 2, TZ - 1, accent);
    v.fillCells(TX - 1, y0 + 1, -TZ, TX - 1, C.shortsTop - 2, TZ - 1, accent);
    // Entrepierna: vaciar el centro separa las dos perneras.
    v.eraseCells(-1, y0, -TZ + 1, 0, y0 + 3, TZ - 2);
  });

  /* ── Torso ─────────────────────────────────────────────────────────────
   * Volumen COMPACTO (8 celdas de alto frente a 14 de cabeza). La guía (§7.1)
   * pide que el torso sea un prisma corto y que la ropa se explique con piezas
   * superpuestas, no con anatomía. */
  const torso = part('torso', (v) => {
    const y0 = C.shortsTop - 1; // 19
    const y1 = C.torsoTop - 1; // 27
    block(v, -TX, y0, -TZ, TX - 1, y1, TZ - 1, o.jersey, 1);

    // SIN hombreras. Sobresalían una celda por lado y ensanchaban el torso
    // justo lo que hacía falta para que la cabeza dejara de dominar: el cuerpo
    // es un muñón, no una figura atlética.
    // Panel lateral oscuro: separa pecho y espalda y evita el bloque monocromo.
    v.fillCells(-TX, y0 + 2, -TZ, -TX, y1 - 4, TZ - 1, jerseyAlt);
    v.fillCells(TX - 1, y0 + 2, -TZ, TX - 1, y1 - 4, TZ - 1, jerseyAlt);
    // Franja del pecho en color de acento: el detalle grande y legible (§7.3).
    v.fillCells(-TX, y0 + 3, TZ - 1, TX - 1, y0 + 4, TZ - 1, accent);
    // Cuello de la camiseta, en el tono claro del calzado.
    v.fillCells(-3, y1, TZ - 2, 2, y1, TZ - 1, o.shoes);
    // Bajos de la camiseta: escalón de una celda que marca la cintura.
    v.fillCells(-TX + 1, y0, -TZ + 1, TX - 2, y0, TZ - 2, jerseyAlt);
  });

  /* ── Cabeza y pelo ─────────────────────────────────────────────────────
   * El módulo que manda en la lectura (§5). Cabeza de 16 x 14 x 14 celdas con
   * las esquinas recortadas, y el pelo construido en CINCO capas: casquete,
   * masa trasera, patillas, flequillo asimétrico de tres alturas y cresta. */
  const head = part('head', (v) => {
    const chin = C.torsoTop; // 20
    const skullTop = chin + 17; // 37
    const capY = chin + 17; // 37: línea del pelo en el frente
    const crestY = chin + 26; // 46

    // Cráneo: 18 x 16 x 16 celdas. Se recortan las esquinas inferiores para
    // insinuar una mandíbula en vez del ladrillo perfecto.
    block(v, -HX, chin, -HZ, HX - 1, skullTop, HZ - 1, o.skin, 1);
    v.eraseCells(-HX, chin, -HZ, -HX + 1, chin + 1, -HZ + 1);
    v.eraseCells(HX - 2, chin, -HZ, HX - 1, chin + 1, -HZ + 1);

    // ── PELO, capa 1: masa trasera. Sin ella el peinado es una fachada que no
    // funciona de perfil (§6.3).
    v.fillCells(-HX, chin + 4, -HZ - 2, HX - 1, crestY - 1, -HZ - 1, hairAlt);
    // ── capa 2: casquete. No avanza por delante del plano de la cara.
    v.fillCells(-HX, capY, -HZ - 1, HX - 1, crestY - 1, HZ - 1, o.hair);
    // ── capa 3: patillas, SÓLO la mitad trasera del costado y desde media
    // altura. Cubrir todo el lateral convierte la cabeza en un casco marrón.
    v.fillCells(-HX - 1, chin + 12, -HZ, -HX - 1, capY + 2, -1, hairAlt);
    v.fillCells(HX, chin + 14, -HZ, HX, capY + 2, -1, hairAlt);
    // ── capa 4: flequillo de tres alturas, por DELANTE de la cara. Empieza en
    // chin+9 (y 34), justo encima de las cejas: bajarlo las entierra.
    const bangY = chin + 12; // 32
    v.fillCells(-HX, bangY + 2, HZ, -4, capY - 1, HZ + 1, o.hair); // mechón izq.
    v.fillCells(-3, bangY + 3, HZ, 2, capY - 1, HZ + 1, o.hair); // mechón centro
    v.fillCells(3, bangY + 1, HZ, HX - 1, capY - 1, HZ + 1, o.hair); // mechón der. (largo)
    // ── capa 5: cresta, el rasgo que se reconoce en silueta a tamaño icono.
    v.fillCells(-4, crestY, -4, 3, crestY + 1, 3, o.hair);
    v.fillCells(-2, crestY + 2, -2, 1, crestY + 2, 1, o.hair);

    // ── OREJAS: prismas cortos a los lados, no esculpidas (§5.4).
    v.fillCells(-HX - 1, chin + 3, -2, -HX - 1, chin + 6, 2, o.skinAlt ?? o.skin);
    v.fillCells(HX, chin + 3, -2, HX, chin + 6, 2, o.skinAlt ?? o.skin);

    // ── CARA. Cuatro rasgos y nada más: la economía es la que da la lectura a
    // distancia (§5.3). Cejas sobre piel y bajo el flequillo.
    const eyeY = chin + 6; // 26
    const zFace = HZ - 1; // plano frontal de la cara
    // Ojos de 4 x 3 con pupila de 2 x 3, separados 4 celdas.
    v.fillCells(-7, eyeY, zFace, -4, eyeY + 2, zFace, 0xfdfdff);
    v.fillCells(3, eyeY, zFace, 6, eyeY + 2, zFace, 0xfdfdff);
    v.fillCells(-6, eyeY, zFace, -5, eyeY + 2, zFace, 0x2b2438);
    v.fillCells(4, eyeY, zFace, 5, eyeY + 2, zFace, 0x2b2438);
    // Cejas: dos bloques sobre piel, el derecho más bajo (enfado leve).
    v.fillCells(-7, chin + 11, zFace, -3, chin + 11, zFace, o.hair);
    v.fillCells(3, chin + 10, zFace, 7, chin + 10, zFace, o.hair);
    // Nariz: bloque corto que fija el frente sin añadir detalle.
    v.fillCells(-1, eyeY - 2, zFace + 1, 0, eyeY - 1, zFace + 1, o.skinAlt ?? o.skin);
    // Boca: franja de color.
    v.fillCells(-3, chin + 1, zFace, 2, chin + 1, zFace, 0xc9745a);
  });

  // ── Inclinación a la cintura ────────────────────────────────────────────
  const lean = new THREE.Group();
  lean.position.y = HIP;
  body.add(lean);

  // Cada pieza se cuelga de `lean` RESTANDO la altura de la cadera. Así la
  // geometría y los pivotes de rotación se quedan exactamente donde estaban
  // (`lean` cancela el `-HIP`), y el cambio es puro: no altera ni una pose
  // existente. Las piernas NO entran, porque al inclinarse el cuerpo las
  // piernas se quedan verticales.
  for (const g of [shorts, torso, head, armL, armR]) {
    g.position.y -= HIP;
    lean.add(g);
  }

  body.add(legL, legR);

  if (o.number) {
    const tex = numberTexture(o.number, o.anisotropy);
    /*
     * EL PLANO SE DIMENSIONA CON LA PROPORCIÓN DE LA TEXTURA.
     *
     * Estaba fijo en 6 x 8 celdas (vertical) mientras el lienzo del dorsal sale
     * `(n * 6 - 1) x 7` píxeles por carácter, es decir mucho más ancho que alto:
     * con «23» son 66 x 42 (1,57:1) contra 0,75:1 del plano. Los dígitos salían
     * estirados en vertical y aplastados en horizontal —el «2» parecía una
     * escalera—, que es el «dorsal incorrecto» que se veía de espaldas.
     *
     * Ahora se pide una altura de 5,2 celdas y el ancho sale de la proporción; si
     * el número tiene muchos dígitos, se limita el ancho a la espalda (8 celdas) y
     * se recalcula la altura, en vez de deformarlo.
     */
    const lienzo = tex.image as HTMLCanvasElement;
    const relacion = lienzo.width / lienzo.height;
    const anchoMax = u(6.5);
    let alto = u(5.2);
    let ancho = alto * relacion;
    if (ancho > anchoMax) {
      ancho = anchoMax;
      alto = ancho / relacion;
    }
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(ancho, alto),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true }),
    );
    /*
     * El plano se CENTRA en la camiseta y no se coloca a ojo.
     *
     * El dorsal colgaba medio bloque por encima del hombro (`u(shortsTop + 3)`),
     * así que su borde superior asomaba por encima de la tela y el número se leía
     * descentrado. La camiseta va de `shortsTop - 1` a `torsoTop - 1` celdas, es
     * decir a la altura media (shortsTop + torsoTop) / 2, y el plano mide 8 celdas
     * de alto, exactamente la camiseta: centrarlo la cubre entera.
     */
    const centroCamiseta = u((C.shortsTop - 1 + C.torsoTop) / 2) - HIP;
    // La espalda del torso está en z = -TZ celdas; el plano va 3 mm por detrás
    // para no quedar coplanar y provocar z-fighting (§15).
    plane.position.set(0, centroCamiseta, u(-TZ) - 0.003);
    plane.rotation.y = Math.PI; // mira hacia -Z (la espalda)
    lean.add(plane);
  }

  return { root, body, lean, torso, armL, armR, legL, legR };
}

/**
 * Animación del personaje.
 *
 * Un solo punto de entrada con la velocidad como parámetro, para que no haya
 * dos animaciones peleándose por los mismos huesos:
 *
 *  · **Reposo**: respiración, balanceo leve de brazos y un cabeceo lento. Un
 *    personaje perfectamente quieto parece una estatua.
 *  · **Caminar / correr**: zancada y braceo en oposición, con rebote del cuerpo.
 *  · **Sujetando el balón**: los brazos se cierran al pecho.
 *
 * `speed01` interpola entre reposo y carrera, así que la transición es continua
 * y no hay saltos de pose al empezar a moverse.
 */
export function animateHuman(
  rig: HumanRig,
  time: number,
  speed01: number,
  holdingBall: boolean,
  grounded = true,
  /**
   * Aviso de aterrizaje: 1 justo al tocar suelo, 0 en reposo (fase B).
   *
   * El cuerpo bajaba del salto y se plantaba en seco, como un ascensor. Con esto
   * el torso se hunde 12 cm, las rodillas se flexionan y vuelve en un cuarto de
   * segundo. Es opcional para no cambiar ninguna llamada existente.
   */
  land = 0,
): void {
  const s = Math.min(1, speed01 * 3); // 0 = quieto, 1 = a tope
  const swing = Math.sin(time * 11) * 0.9 * s;

  // Piernas: zancada al moverse, apoyo firme en reposo.
  rig.legL.rotation.x = swing;
  rig.legR.rotation.x = -swing;

  // Brazos: braceo en carrera, balanceo corto en reposo.
  const idleSway = Math.sin(time * 1.7) * 0.05;
  if (holdingBall) {
    rig.armL.rotation.x = -0.9 - swing * 0.1;
    rig.armR.rotation.x = -0.9 + swing * 0.1;
    rig.armL.rotation.z = 0.12;
    rig.armR.rotation.z = -0.12;
  } else {
    rig.armL.rotation.x = -swing * 0.8 + idleSway * (1 - s);
    rig.armR.rotation.x = swing * 0.8 - idleSway * (1 - s);
    rig.armL.rotation.z = 0.06 * (1 - s);
    rig.armR.rotation.z = -0.06 * (1 - s);
  }

  // Inclinación hacia delante al moverse.
  //
  // El pivote está en la cintura, así que el efecto es el de echarse adelante
  // desde las caderas: piernas verticales, torso y cabeza hacia delante. Al
  // estar en el aire se atenúa a un tercio, porque saltando no hay apoyo desde
  // el que empujarse.
  rig.lean.rotation.x = LEAN_RUN * s * (grounded ? 1 : 0.35);

  // Cuerpo: rebote al correr, respiración al estar quieto y hundimiento al caer.
  rig.body.position.y =
    Math.abs(Math.sin(time * 11)) * 0.06 * s + Math.sin(time * 1.7) * 0.006 * (1 - s) - land * 0.12;
  // Rodillas: al aterrizar se flexionan y los brazos se abren para equilibrar.
  if (land > 0) {
    rig.legL.rotation.x -= land * 0.5;
    rig.legR.rotation.x += land * 0.35;
    rig.armL.rotation.x -= land * 0.4;
    rig.armR.rotation.x -= land * 0.4;
  }
  rig.torso.scale.y = 1 + Math.sin(time * 2.2) * 0.012;

  // Cabeza: el pivote es el torso, así que un giro leve ya se lee como «mirar».
  rig.torso.rotation.y = Math.sin(time * 0.6) * 0.08 * (1 - s);
  // `poseShoot`/`poseCelebrate` escriben la inclinación del torso y nadie la
  // devolvía a 0: tras el primer tiro el torso se quedaba torcido para siempre.
  rig.torso.rotation.x = 0;

  // En el aire las piernas se recogen: sin esto el salto parece un ascensor.
  if (!grounded) {
    rig.legL.rotation.x = -0.55;
    rig.legR.rotation.x = 0.35;
    rig.armL.rotation.x = -1.5;
    rig.armR.rotation.x = -1.5;
  }
}

/** Brazos arriba al cargar el tiro. k ∈ [0, 1]. */
export function poseShoot(rig: HumanRig, k: number): void {
  // -1,2 a -1,95 rad. Subir más los brazos lleva el balón a la altura del
  // rostro y, con una cabeza que ocupa la mitad del personaje, lo tapa entero.
  const a = -1.2 - k * 0.75;
  rig.armL.rotation.x = a;
  rig.armR.rotation.x = a;
  rig.armL.rotation.z = 0.1;
  rig.armR.rotation.z = -0.1;
  // La cabeza acompaña al balón: mirar arriba es lo que vende el gesto.
  rig.torso.rotation.x = -0.12 * k;
}

/** Celebración: brazos en alto y pequeños saltos. k ∈ [0, 1]. */
export function poseCelebrate(rig: HumanRig, time: number, k: number): void {
  const bounce = Math.abs(Math.sin(time * 6)) * 0.12 * k;
  rig.armL.rotation.x = -2.6;
  rig.armR.rotation.x = -2.6;
  rig.armL.rotation.z = 0.5;
  rig.armR.rotation.z = -0.5;
  rig.body.position.y = bounce;
  rig.torso.rotation.x = 0.1 * k;
}
