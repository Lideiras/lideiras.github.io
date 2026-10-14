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
 *   y  8..12  perneras         (5)
 *   y 13..14  cinturilla       (2)   <- 2 celdas, no 1
 *   y 15..19  camiseta         (5)   <- recortada
 *   y 20..47  CABEZA + PELO   (28)  <- 58,3 %
 *
 * La frontera entre pantalón y camiseta está en y = 14/15 y NO hay celda
 * compartida: cada pieza acaba donde empieza la siguiente (ver `SHIRT_Y0`).
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
 * Primera celda de la camiseta, en celdas de diseño.
 *
 * El pantalón sube hasta `shortsTop` (14) con su cinturilla de DOS celdas
 * (13 y 14) y la camiseta empieza una por encima. Antes la camiseta arrancaba
 * en `shortsTop - 1` (13), es decir, en la MISMA celda que la cinturilla:
 * pantalón y camiseta ocupaban el mismo volumen.
 *
 * Eso es z-fighting puro. Cada pieza se construye en su propio `VoxelWorld` y
 * sólo descarta las caras internas DENTRO de sí misma, así que las dos
 * emitían las mismas caras en el mismo plano exacto: la de delante (z = 0,148
 * m), la de detrás (z = -0,148 m) y los dos costados (x = ±0,222 m) sobre la
 * celda 13. Son las rayas que parpadeaban en la cintura, que es justo lo que la
 * cámara ve de frente.
 *
 * Ahora las piezas COMPARTEN PLANO de contacto sin duplicar celda: el techo del
 * pantalón y la base de la camiseta están los dos en y = 15 * 0,037 = 0,555 m
 * y sus caras quedan enfrentadas, de modo que el backface culling descarta
 * siempre una de las dos. Ningún par de caras coplanares sobrevive.
 */
const SHIRT_Y0 = C.shortsTop + 1; // 15

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

/**
 * Inclinación lateral MÁXIMA en un corte, en radianes.
 *
 * Gira sobre la Z local del tronco (`lean.rotation.z`), así que 0,35 rad son
 * unos 20°: el cuerpo se inclina hacia dentro del giro como el de alguien que
 * planta el pie para cambiar de sentido. Se midió contra el `lean` hacia
 * delante (0,14) para que el corte se lea MÁS que la carrera — es un gesto
 * puntual, no un estado— pero sin que el personaje parezca caerse. Al ser un
 * rig de bloques rígidos, por encima de unos 25° el torso se separa del
 * pantalón y se ve la costura.
 */
const CORTE_BANK = 0.35;

const TZ = 4; // semiprofundidad        -> 8 celdas

/**
 * Pivote de hombro, en celdas de diseño.
 *
 * Va PEGADO al torso, no a la altura del semiancho de la cabeza. El pivote
 * estaba en `HX` (10) y, como la geometría del brazo se escribe en local, la
 * celda -3 de la mano caía en la celda 7 mientras el torso terminaba en la 5:
 * entre el hombro y el cuerpo quedaban 1..2 celdas de diseño vacías, es decir
 * 3,7 cm a la altura de la mano y 7,4 cm a la del antebrazo. El brazo se veía
 * flotando al lado del cuerpo.
 *
 * En la celda 9 la celda -3 cae en la 6, que es justo la cara exterior del
 * torso (su última celda es la 5): contacto de plano, sin hueco y sin solape.
 */
const SHOULDER_X = TX + 3; // 9

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
    pivot.position.set(side * u(SHOULDER_X), SHOULDER, 0);
    const limb = part('arm', (v) => {
      /*
       * La manga llega a la celda local -3 en vez de a la -2 para ENCAJAR con
       * el torso: con el pivote en `SHOULDER_X` (9), la celda -3 cae en la 6,
       * la cara exterior del torso. Con la manga en -2 la celda 6 quedaba
       * vacía a la altura del hombro y se veía una ranura oscura de 3,7 cm x
       * 11 cm entre el brazo y el cuerpo. Ahora el hombro apoya en la camisa.
       *
       * Es la única pieza que se ensancha: 5 celdas de manga, 4 de antebrazo y
       * 6 de mano (la mano es la masa gruesa y no se recorta).
       */
      v.fillCells(-3, -2, -2, 1, 0, 1, o.jersey); // manga
      v.fillCells(-2, -3, -2, 1, -2, 1, accent); // puño de la manga
      v.fillCells(-2, -5, -2, 1, -3, 1, o.skin); // antebrazo
      v.fillCells(-2, -6, -2, 1, -5, 1, accent); // muñequera
      // MANO: 3 celdas, igual que antes. Es la pieza que NO se recorta.
      // Su celda -3 queda en la 6 también: la mano apoya en el pantalón.
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
   * pantalón y las piernas se funden en un bloque vertical (§4.1).
   *
   * El pantalón es el dueño de la frontera de la cintura: llega hasta
   * `shortsTop` (14) y la camiseta arranca en 15 (`SHIRT_Y0`). La cinturilla
   * son DOS celdas (13 y 14) porque es una banda, no una línea. */
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
   * Volumen COMPACTO (5 celdas de camiseta + 2 de cinturilla = 7, frente a 14
   * de cabeza). La guía (§7.1) pide que el torso sea un prisma corto y que la
   * ropa se explique con piezas superpuestas, no con anatomía.
   *
   * La camiseta empieza en `SHIRT_Y0` (15), una celda por encima de la
   * cinturilla: es la fila que antes compartían las dos piezas y que
   * duplicaba las caras en la cintura. El bajo escalonado queda justo encima
   * del cinturón, que es donde tiene que leerse. */
  const torso = part('torso', (v) => {
    const y0 = SHIRT_Y0; // 15
    const y1 = C.torsoTop - 1; // 19
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

    /* ── PELO, capa 1: masa trasera. Sin ella el peinado es una fachada que no
     * funciona de perfil (§6.3). */
    //
    // La nuca bajaba hasta chin+4 y el cráneo se veía por debajo: el pelo
    // parecía pegado al frente y la cabeza se leía con una nuca pelada. Ahora
    // llega hasta chin+1 y, por arriba, añade una fila MÁS ATRÁS que el
    // cráneo: de perfil la cabeza tiene detrás en vez de terminar en seco.
    v.fillCells(-HX, chin + 1, -HZ - 2, HX - 1, crestY - 1, -HZ - 1, hairAlt);
    // Fila exterior de la nuca, más estrecha para que el contorno se redondee
    // en vez de terminar en una pared recta.
    v.fillCells(-HX + 3, chin + 10, -HZ - 3, HX - 4, crestY - 1, -HZ - 2, hairAlt);
    // ── capa 2: casquete. No avanza por delante del plano de la cara.
    v.fillCells(-HX, capY, -HZ - 1, HX - 1, crestY - 1, HZ - 1, o.hair);
    /*
     * capa 3: MASAS LATERALES.
     *
     * Antes eran un muro de UNA celda de grosor, desde media altura y sólo por
     * la mitad trasera del costado: de frente no se veían y de perfil no daban
     * volumen, que es justo lo que señaló el propietario. Con una sola capa,
     * el pelo se lee como PINTADO sobre el cráneo en lugar de como una masa.
     *
     * Ahora cada lado tiene DOS capas y ambas escalonan:
     *   · la primera pegada a la cabeza, completa en altura (desde el casquete
     *     hasta media mejilla) y en fondo, pero parando antes de la cara;
     *   · la segunda por FUERA a media altura, más corta: es la que da el
     *     escalón en la silueta, que es lo que se lee como volumen.
     *
     * Mismo color de sombra (`hairAlt`) en las dos, como manda la guía §6.2:
     * el lateral es la misma masa vista de otro lado, no un pelo de otro tono.
     * Se paran antes de las orejas (y 23..26) para no tragárselas.
     */
    v.fillCells(-HX - 1, chin + 11, -HZ - 1, -HX - 1, crestY - 1, 4, hairAlt); // izq. pegada
    v.fillCells(-HX - 2, chin + 16, -HZ, -HX - 2, crestY - 1, 2, hairAlt); //     izq. exterior
    v.fillCells(HX, chin + 13, -HZ - 1, HX, crestY - 1, 3, hairAlt); //           der. pegada
    v.fillCells(HX + 1, chin + 17, -HZ, HX + 1, crestY - 1, 1, hairAlt); //       der. exterior
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
     * descentrado. La camiseta va de `SHIRT_Y0` a `C.torsoTop` celdas, es decir
     * a la altura media (SHIRT_Y0 + torsoTop) / 2, y el plano mide 5,2 celdas de
     * alto, justo lo que queda de camiseta: centrarlo lo cubre entero sin que
     * el borde se salga por abajo encima de la cinturilla.
     */
    const centroCamiseta = u((SHIRT_Y0 + C.torsoTop) / 2) - HIP;
    // La espalda del torso está en z = -TZ celdas; el plano va 3 mm por detrás
    // para no quedar coplanar y provocar z-fighting (§15).
    plane.position.set(0, centroCamiseta, u(-TZ) - 0.003);
    plane.rotation.y = Math.PI; // mira hacia -Z (la espalda)
    lean.add(plane);
  }

  return { root, body, lean, torso, armL, armR, legL, legR };
}

/** Frecuencia del regate, en Hz del reloj del personaje. */
export const REGATE_HZ = 11;

/**
 * ALTURA normalizada del balón en el regate: 0 en el suelo, 1 en lo alto del
 * bote. k ∈ [0, 1].
 *
 * Vive aquí, y no en el `main`, porque la fase del bote y la del brazo que
 * empuja TIENEN que ser la MISMA: si el brazo bajara con otro ritmo, se vería
 * empujando cuando el balón ya está subiendo. Compartiendo la función, no hay
 * forma de que se desincronicen.
 *
 * `handSide` NO cambia el resultado, y es a propósito: el valor absoluto de un
 * seno es π-periódico, así que `|sin(x)|` y `|sin(x + π)|` son SIEMPRE iguales
 * (la fase π se cancela con el valor absoluto). Se conserva el parámetro porque
 * quien llama pasa la mano que conduce en los dos sitios y así queda explícito
 * que ambas leen el mismo reloj, que es justo lo que se quiere comprobar.
 * Antes este comentario prometía un «desfasaje de media fase» en la mano
 * izquierda que la matemática no puede dar: era un no-op documentado como si
 * fuera una decisión.
 */
export function regateAltura(time: number, _handSide: -1 | 1 = 1): number {
  return Math.abs(Math.sin(time * REGATE_HZ));
}

/** Mezcla lineal con peso: `k` = 0 deja `a` intacto, `k` = 1 devuelve `b`. */
const mix = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Peso de mezcla acotado a 0..1 (una capa de pose nunca "desmezcla"). */
const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

/* ---------------------------------------------------------------------------
 * PESOS DE CAPA DE POSE
 * ---------------------------------------------------------------------------
 * `poseShoot` y `poseCelebrate` ya no ASIGNAN sobre los huesos: se MEZCLAN
 * sobre lo que dejara `animateHuman`. Como la mezcla se hace contra un peso,
 * el bucle tiene que poder SUBIR ese peso de forma continua; si el peso
 * apareciera de golpe en un fotograma, la mezcla saltaría igual que la
 * asignación. `mezclaPeso` es el único sitio por el que se mueve un peso, y es
 * exponencial (`dt`-independiente), de modo que el resultado no depende de los
 * fotogramas: mismo tiempo total, mismo resultado.
 * ------------------------------------------------------------------------- */

/** Tasa por defecto de entrada/salida de una capa de pose, en 1/s. */
export const POSE_TASA = 12;

/**
 * Suaviza un peso de capa de pose hacia su objetivo, con tasa en 1/s.
 *
 * Es un filtro exponencial de primer orden: tras `t` segundos vale
 * `objetivo - (objetivo - actual) * e^(-tasa * t)`, sea cual sea el `dt` con el
 * que se haya llamado. Por eso un peso NUNCA da un salto: el cambio por
 * fotograma está acotado por `|objetivo - actual| * tasa * dt`.
 */
export function mezclaPeso(actual: number, objetivo: number, dt: number, tasa: number = POSE_TASA): number {
  if (dt <= 0) return actual;
  return actual + (objetivo - actual) * (1 - Math.exp(-tasa * dt));
}

/**
 * Duración de la RECOGIDA del balón, en segundos.
 *
 * Es el tiempo que tardan las tres cosas que tienen que pasar a la vez —el
 * balón sube del punto donde estaba a la posición de regate/pecho, los brazos
 * pasan de braceo a brazos contra el pecho y el gesto de agacharse sube y
 * vuelve— porque si cada una durara lo suyo se desincronizarían entre sí.
 */
export const RECOGE_TIME = 0.3;

/**
 * Peso del gesto de AGACHARSE a recoger el balón, en función del tiempo
 * dentro de la ventana de recogida.
 *
 * Es una campana: 0 al entrar, 1 en el centro y 0 al salir. El gesto tiene que
 * empezar y terminar en 0 justamente porque `recoge` se SUMA a los brazos: si
 * empezara en 1 lo bajaría de golpe (0,55 rad en un fotograma), que es
 * exactamente el salto que se estaba quejando.
 *
 * El máximo de su derivada es `PI / RECOGE_TIME` ≈ 10,5 unidades de peso por
 * segundo, o sea 0,175 por fotograma a 60 fps: 0,096 rad de brazo, muy por
 * debajo del braceo normal (0,165 rad por fotograma a 9,9 rad/s).
 */
export function recogePeso(t: number): number {
  if (t <= 0 || t >= RECOGE_TIME) return 0;
  const u = (Math.PI * t) / RECOGE_TIME;
  return Math.sin(u) * Math.sin(u);
}

/**
 * Peso de la mezcla "brazos contra el pecho" (y de la subida del balón) dentro
 * de la ventana de recogida.
 *
 * `smoothstep` en vez de rampa lineal: en los extremos la derivada es 0, así
 * que el fotograma en que empieza y el fotograma en que termina el gesto se
 * quedan pegados a la pose anterior y a la siguiente sin un escalón.
 */
export function holdPeso(t: number): number {
  if (t <= 0) return 0;
  if (t >= RECOGE_TIME) return 1;
  const u = t / RECOGE_TIME;
  return u * u * (3 - 2 * u);
}

/**
 * Ajustes de la animación que no se deducen de la velocidad.
 *
 * Todos son escalares 0..1 (o -1..1) que `main.ts` lleva y va consumiendo, y
 * todos tienen valor por defecto neutro: llamar a `animateHuman` con los seis
 * parámetros de siempre da EXACTAMENTE la misma pose que antes de este cambio.
 */
export interface HumanAnimOptions {
  /** Mano que conduce el regate: +1 derecha (X local), -1 izquierda. */
  handSide?: -1 | 1;
  /** 0 = quieto con el balón contra el pecho; 1 = regate a tope. */
  regate?: number;
  /** Giro de cabeza al cambiar de mano, -1..1. */
  giro?: number;
  /**
   * Corte (cambio de dirección brusco), magnitud 0..1.
   *
   * Se calcula en `main.ts` del MISMO evento que `giro` —el cambio de mano que
   * dispara un giro de más de `HAND_SWITCH_ANGLE` en la ruta— así que los dos
   * gestos van siempre juntos: la cabeza mira hacia donde va y el cuerpo se
   * inclina hacia dentro del giro. Con un detector propio habría dos umbrales
   * que ajustar y se podrían desincronizar.
   */
  corte?: number;
  /**
   * Lado del corte: +1 si la ruta gira hacia la IZQUIERDA del jugador, -1 si
   * hacia la derecha. Es el signo del giro real de la ruta, no el de la mano:
   * la mano es un interruptor que alterna y no dice hacia dónde se ha girado.
   */
  corteDir?: -1 | 1;
  /** Reacción de frustración tras fallar, 0..1. */
  frustracion?: number;
  /** Gesto de recoger el balón del suelo, 0..1. */
  recoge?: number;
  /**
   * Peso de la pose de "balón contra el pecho", 0..1.
   *
   * Es lo que hace que el cambio de `holdingBall` sea una TRANSICIÓN y no un
   * cambio de rama: el brazo pasa de bracear (`rotation.x` en torno a 0) a
   * Supporting el pecho (-0,9) mezclando las dos poses con este peso.
   *
   * Si no se pasa, vale 1 cuando `holdingBall` y 0 cuando no: llamar como
   * siempre da exactamente la misma pose que antes.
   */
  hold?: number;
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
 *  · **Sujetando el balón**: los brazos se cierran al pecho; si además está
 *    regateando (`opts.regate`), la mano que conduce empuja hacia abajo en fase
 *    con el bote.
 *  · **Aterrizaje**: `land` es la fuerza de la caída, no un 1 fijo — ver abajo.
 *
 * `speed01` interpola entre reposo y carrera, así que la transición es continua
 * y no hay saltos de pose al empezar a moverse. Lo mismo hace `opts.hold` con
 * el balón en las manos: entrar y salir de esa pose es una mezcla, no un
 * `if (holdingBall)`.
 */
export function animateHuman(
  rig: HumanRig,
  time: number,
  speed01: number,
  holdingBall: boolean,
  grounded = true,
  /**
   * Aviso de aterrizaje: la fuerza de la caída, 1 en el salto del tiro y 0 en
   * reposo (fase B).
   *
   * El cuerpo bajaba del salto y se plantaba en seco, como un ascensor. Con esto
   * el torso se hunde 12 cm, las rodillas se flexionan y vuelve en un cuarto de
   * segundo. Ahora `main.ts` lo pasa NORMALIZADO por la velocidad de bajada, así
   * que caer de frente y rozar el suelo no flexionan lo mismo. Es opcional para
   * no cambiar ninguna llamada existente.
   */
  land = 0,
  opts: HumanAnimOptions = {},
): void {
  const s = Math.min(1, speed01 * 3); // 0 = quieto, 1 = a tope
  const swing = Math.sin(time * 11) * 0.9 * s;
  const regate = opts.regate ?? 0;
  const frustracion = opts.frustracion ?? 0;
  const recoge = opts.recoge ?? 0;
  /*
   * PESO de "el balón está en las manos" (ver `HumanAnimOptions.hold`).
   *
   * Antes esto era un `if (holdingBall)`: un cambio de RAMA, y por lo tanto un
   * salto de un fotograma entero en el momento de recoger el balón (hasta 0,9
   * rad de brazo, de 0 a -0,9 de golpe). Ahora las dos poses se calculan
   * siempre y se mezclan con este peso, de modo que el mismo código sirve para
   * la pose final (peso 1) y para la transición (cualquier valor intermedio).
   */
  const hold = clamp01(opts.hold ?? (holdingBall ? 1 : 0));

  // Piernas: zancada al moverse, apoyo firme en reposo.
  rig.legL.rotation.x = swing;
  rig.legR.rotation.x = -swing;

  // Brazos: braceo en carrera, balanceo corto en reposo.
  const idleSway = Math.sin(time * 1.7) * 0.05;
  {
    /*
     * REGATE: el brazo que conduce acompaña al bote (punto A).
     *
     * `contacto` vale 1 justo cuando el balón toca el suelo y 0 en lo alto del
     * bote, porque sale de la MISMA función que dibuja la altura del balón
     * (`regateAltura`). El brazo empuja hacia abajo, y para ello lo que hace
     * falta es DISPONERLO más de la vertical: la pose de pecho es
     * `rotation.x = -0,9` (hacia delante y algo arriba) y el empuje lo lleva
     * hacia -0,35, que es brazo abajo. Sin compartir la fase, el brazo bajaría
     * cuando la pelota ya sube y el gesto se leería al revés.
     *
     * El otro brazo no se queda clavado: se retira un poco hacia arriba (el
     * equilibrio al empujar con un solo brazo) y se abre un pelo más.
     *
     * El empuje va DENTRO de la pose de pecho, así que la fase se comparte
     * también durante la recogida: `hold` mezcla las dos poses enteras, con lo
     * que el brazo y el balón no pueden desfasarse al recogerse el balón.
     */
    const contacto = (1 - regateAltura(time, opts.handSide ?? 1)) * regate;
    const cL = opts.handSide === -1 ? contacto : 0;
    const cR = opts.handSide === -1 ? 0 : contacto;
    rig.armL.rotation.x = mix(-swing * 0.8 + idleSway * (1 - s), -0.9 - swing * 0.1 + 0.55 * cL - 0.18 * cR, hold);
    rig.armR.rotation.x = mix(swing * 0.8 - idleSway * (1 - s), -0.9 + swing * 0.1 + 0.55 * cR - 0.18 * cL, hold);
    rig.armL.rotation.z = mix(0.06 * (1 - s), 0.12 + 0.1 * cL - 0.05 * cR, hold);
    rig.armR.rotation.z = mix(-0.06 * (1 - s), -0.12 - 0.1 * cR + 0.05 * cL, hold);
  }

  // Inclinación hacia delante al moverse.
  //
  // El pivote está en la cintura, así que el efecto es el de echarse adelante
  // desde las caderas: piernas verticales, torso y cabeza hacia delante. Al
  // estar en el aire se atenúa a un tercio, porque saltando no hay apoyo desde
  // el que empujarse.
  rig.lean.rotation.x = LEAN_RUN * s * (grounded ? 1 : 0.35);

  /*
   * CORTE (cambio de dirección brusco).
   *
   * El cuerpo se inclina hacia DENTRO del giro: girando a la izquierda la parte
   * de arriba cae a la izquierda, que es lo que hace alguien al plantar el pie y
   * cambiar de sentido. Sale de rotar `lean` sobre la Z LOCAL (la del pecho), que
   * es el eje que el cuerpo puede inclinar sin romper la silueta: las piernas se
   * quedan verticales y el giro se lee en el tronco y la cabeza, como el `lean`
   * hacia delante de la carrera.
   *
   * El valor se ASIGNA siempre (aunque sea 0): así un corte no se queda pegado en
   * el hueso al terminar. En el aire se atenúa a un tercio, igual que el `lean`
   * hacia delante — sin apoyo no hay contra qué inclinarse.
   */
  const corte = clamp01(opts.corte ?? 0);
  rig.lean.rotation.z = corte * CORTE_BANK * (opts.corteDir ?? 1) * (grounded ? 1 : 0.35);

  // Cuerpo: rebote al correr, respiración al estar quieto, hundimiento al caer.
  rig.body.position.y =
    Math.abs(Math.sin(time * 11)) * 0.06 * s +
    Math.sin(time * 1.7) * 0.006 * (1 - s) -
    land * 0.12 -
    recoge * 0.05 -
    // Al cortar se baja el centro de gravedad: 4 cm en el pico del giro.
    corte * 0.04;
  /*
   * TRANSFERENCIA DE PESO en reposo (proactivo): 1,5 cm de vaivén lateral.
   * Un personaje de bloques que sólo sube y baja parece un poste; el peso
   * corpulento sobre un pie es lo que lo hace estar de pie en vez de montado.
   * Se anula al correr (ahí manda el rebote vertical) y vale 0 con `time` 0, que
   * es lo que mantienen las referencias geométricas de `tests/human.test.ts`.
   */
  rig.body.position.x = Math.sin(time * 0.55) * 0.015 * (1 - s);

  /*
   * ABSORCIÓN DE LA CAÍDA (punto B).
   *
   * `land` ya no es un 1 fijo sino la velocidad de bajada normalizada, así que
   * una caída de frente y un roce se hunden distinto. Lo que se mueve:
   *
   *  · **Rodillas de verdad**: las dos piernas giran HACIA DELANTE, no de lado.
   *    Un personaje de un solo hueso por pierna no flexiona: flexiona hundiendo
   *    la cadera y sacando la rodilla, que es exactamente lo que hace el rig.
   *  · **Torso por delante**: se echa 0,22 rad al absorber, para que el peso
   *    vaya a las puntillas y el aterrizaje se lea como una recepción.
   *  · **Brazos abajo**: se sueltan del pecho hacia la vertical para compensar,
   *    y es lo que equilibra al cuerpo en una caída de frente.
   *  · **Aplastado**: 5 % de altura de torso menos. Es lo único que NO es un
   *    bloque rígido en todo el personaje y dura un cuarto de segundo: se nota y
   *    no rompe la silueta de voxels.
   */
  if (land > 0) {
    rig.legL.rotation.x -= land * 0.34;
    rig.legR.rotation.x -= land * 0.28;
    rig.lean.rotation.x += land * 0.22;
    rig.armL.rotation.x += land * 0.55;
    rig.armR.rotation.x += land * 0.55;
  }
  rig.torso.scale.y = 1 + Math.sin(time * 2.2) * 0.012 - land * 0.05;

  // Cabeza: el pivote es el torso, así que un giro leve ya se lee como «mirar».
  rig.torso.rotation.y = Math.sin(time * 0.6) * 0.08 * (1 - s) + 0.32 * (opts.giro ?? 0);
  // `poseShoot`/`poseCelebrate` mezclan la inclinación del torso hacia un valor
  // absoluto y nadie la devolvía a 0: tras el primer tiro el torso se quedaba
  // torcido para siempre.
  rig.torso.rotation.x = 0;
  /*
   * FRUSTRACIÓN tras fallar (proactivo) y RECOGIDA del balón (proactivo).
   *
   * Son las dos únicas reacciones que no dependen del movimiento, así que no
   * pueden salir de la zancada: se apoyan en los hombros (hombro caído, brazos
   * pegados al cuerpo) y en la cabeza (mirada al suelo). Sin esto, fallar sólo
   * producía un número en el marcador.
   */
  if (frustracion > 0 || recoge > 0) {
    // `recoge` POSITIVO: con el balón contra el pecho el brazo está en -0,9
    // (adelante y arriba) y para agacharse a cogerlo tiene que BAJAR hacia la
    // vertical, o sea menos negativo. La frustración va al revés: sube los
    // brazos un poco y los pega al cuerpo, que es el hombro caído.
    rig.armL.rotation.x += frustracion * 0.22 + recoge * 0.55;
    rig.armR.rotation.x += frustracion * 0.22 + recoge * 0.55;
    rig.armL.rotation.z += frustracion * 0.16;
    rig.armR.rotation.z -= frustracion * 0.16;
    rig.torso.rotation.x = frustracion * 0.2 + recoge * 0.32;
    rig.body.position.y -= frustracion * 0.02;
  }

  // En el aire las piernas se recogen: sin esto el salto parece un ascensor.
  if (!grounded) {
    rig.legL.rotation.x = -0.55;
    rig.legR.rotation.x = 0.35;
    rig.armL.rotation.x = -1.5;
    rig.armR.rotation.x = -1.5;
  }
}

/**
 * Capa de POSE DE TIRO: brazos arriba. k ∈ [0, 1] es a la vez el peso de la
 * mezcla y la altura de la postura.
 *
 * No ASIGNA los huesos: los MEZCLA con lo que dejara `animateHuman`. Con k = 1
 * el resultado es idéntico al de antes (asignar), pero con k < 1 la capa se
 * insinúa sobre la pose base en vez de pisarla, y k = 0 no hace nada. Eso es lo
 * que quita el salto: al empezar a cargar, al soltar el tiro y al terminar el
 * seguimiento, el peso se mueve con `mezclaPeso` y la pose acompaña.
 */
export function poseShoot(rig: HumanRig, k: number): void {
  const w = clamp01(k);
  if (w <= 0) return;
  // -1,2 a -1,95 rad. Subir más los brazos lleva el balón a la altura del
  // rostro y, con una cabeza que ocupa la mitad del personaje, lo tapa entero.
  const a = -1.2 - w * 0.75;
  rig.armL.rotation.x = mix(rig.armL.rotation.x, a, w);
  rig.armR.rotation.x = mix(rig.armR.rotation.x, a, w);
  rig.armL.rotation.z = mix(rig.armL.rotation.z, 0.1, w);
  rig.armR.rotation.z = mix(rig.armR.rotation.z, -0.1, w);
  // La cabeza acompaña al balón: mirar arriba es lo que vende el gesto.
  rig.torso.rotation.x = mix(rig.torso.rotation.x, -0.12 * w, w);
}

/**
 * Capa de MATE / ENTRADA: se resuelve al estar cerca del aro.
 *
 * Es una capa de pose como las demás: MEZCLA con peso `k`, nunca asigna. La
 * diferencia con `poseShoot` es la lectura del gesto: en un mate los dos brazos
 * suben, las rodillas se recogen y el cuerpo se echa ATRÁS, que es lo que
 * distingue «colgar el balón» de «tirar». El tiro de cerca sale muy vertical y
 * con el cuerpo estirado; sin el cambio, machacar y tirar se veían igual.
 *
 * La física NO cambia: la trayectoria la sigue calculando `solveShot` desde el
 * mismo punto de siempre. Esto es sólo el gesto — el balón no sale de la mano
 * ni más alto ni más rápido.
 */
export function poseDunk(rig: HumanRig, k: number): void {
  const w = clamp01(k);
  if (w <= 0) return;
  // Los dos brazos arriba y ligeramente hacia dentro: las manos se cierran
  // sobre el aro, no se abren como en un tiro.
  rig.armL.rotation.x = mix(rig.armL.rotation.x, -2.35, w);
  rig.armR.rotation.x = mix(rig.armR.rotation.x, -2.5, w);
  rig.armL.rotation.z = mix(rig.armL.rotation.z, 0.14, w);
  rig.armR.rotation.z = mix(rig.armR.rotation.z, -0.14, w);
  // Rodillas recogidas: el cuerpo va compacto, colgado del aro.
  rig.legL.rotation.x = mix(rig.legL.rotation.x, -0.7, w);
  rig.legR.rotation.x = mix(rig.legR.rotation.x, -0.42, w);
  // El torso se echa atrás para que la curva del cuerpo se lea en silueta.
  rig.lean.rotation.x = mix(rig.lean.rotation.x, -0.1, w);
  rig.torso.rotation.x = mix(rig.torso.rotation.x, 0.16, w);
}

/**
 * Capa de TIRO LEJANO: se resuelve más allá de `LONG_RANGE` (config.ts).
 *
 * A distancia el tiro no es «los dos brazos arriba»: el cuerpo entero empuja,
 * un brazo busca el aro y el otro se queda abajo de contrapeso, y las piernas
 * acompañan el impulso en vez de recogerse. Es el gesto que el propietario pedía
 * distinto para los tiros largos, y se consigue sin tocar la parábola (que sale
 * del mismo `solveShot` y del mismo `y` de 2,15 m).
 */
export function poseLejano(rig: HumanRig, k: number): void {
  const w = clamp01(k);
  if (w <= 0) return;
  // El brazo que tira sube algo menos que en el tiro normal (el impulso lo pone
  // el cuerpo) y el otro baja a la cadera como contrapeso. El -1,72 es distinto
  // del tope de `poseShoot` (-1,95) a propósito: si coincidieran, el gesto
  // largo sería el mismo tiro con las piernas cambiadas.
  rig.armL.rotation.x = mix(rig.armL.rotation.x, -1.72, w);
  rig.armR.rotation.x = mix(rig.armR.rotation.x, -0.5, w);
  rig.armL.rotation.z = mix(rig.armL.rotation.z, 0.16, w);
  rig.armR.rotation.z = mix(rig.armR.rotation.z, -0.26, w);
  // Piernas: impulso, no recogida. Una empuja y la otra acompaña.
  rig.legL.rotation.x = mix(rig.legL.rotation.x, 0.22, w);
  rig.legR.rotation.x = mix(rig.legR.rotation.x, -0.18, w);
  // Un punto de inclinación atrás: de lejos el tiro sale con toda la cadena.
  rig.torso.rotation.x = mix(rig.torso.rotation.x, -0.07, w);
}

/**
 * Capa de CELEBRACIÓN: brazos en alto y pequeños saltos. k ∈ [0, 1].
 *
 * Mezcla como `poseShoot`, por el mismo motivo. El rebote es la única parte que
 * se SUMA en vez de mezclar: `body.position.y` lo lleva `animateHuman`
 * (respiración y rebote de la zancada) y pisarlo a un valor absoluto dejaba al
 * personaje sin respirar durante la celebración; sumando, el salto se apaga
 * solo con `k` y no aparece de golpe.
 */
export function poseCelebrate(rig: HumanRig, time: number, k: number): void {
  const w = clamp01(k);
  if (w <= 0) return;
  rig.armL.rotation.x = mix(rig.armL.rotation.x, -2.6, w);
  rig.armR.rotation.x = mix(rig.armR.rotation.x, -2.6, w);
  rig.armL.rotation.z = mix(rig.armL.rotation.z, 0.5, w);
  rig.armR.rotation.z = mix(rig.armR.rotation.z, -0.5, w);
  rig.body.position.y += Math.abs(Math.sin(time * 6)) * 0.12 * w;
  rig.torso.rotation.x = mix(rig.torso.rotation.x, 0.1 * w, w);
}
