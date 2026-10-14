import type { SectionId } from '../data/content';

export const G = 9.81;
export const COURT = { length: 28, width: 15, halfL: 14, halfW: 7.5 } as const;
export const RIM = { y: 3.05, radius: 0.225, tube: 0.012, fromBaseline: 1.575, boardFromBaseline: 1.2 } as const;
export const BALL = { radius: 0.12, visualScale: 1.7 } as const;
export const SCORE_RADIUS = 0.2; // tolerancia (m) del centro de la canasta; más alto = más fácil
export const SHOOT_RANGE = 11; // distancia máxima "recomendada" al aro
export const METER_HZ = 0.7; // barridos completos (0→1→0) por segundo: más bajo = más fácil
export const SWEET_SPOT = 0.3; // |e| <= 0.3 = zona verde (30 % del medidor): canasta garantizada

/**
 * Aciertos consecutivos que encienden el modo TAKEOVER.
 *
 * Cinco es lo que pidió el propietario. Vive aquí y no en `main.ts` porque lo
 * comparten los dos lados: el juego decide CON esto cuándo se enciende y el HUD
 * dibuja CON esto las muescas del medidor. Con dos copias, el día que se cambie
 * una el medidor enseñaría cinco huecos y el fuego se encendería en la sexta.
 */
export const TAKEOVER_HITS = 5;

/**
 * Velocidad vertical del salto al soltar el tiro, en m/s.
 *
 * La altura que da es `v² / (2g)` = 0,59 m: casi un tercio de la altura del
 * personaje (1,81 m), que es lo que mide un tiro conRise real. Se eligió por
 * comparación, no a ojo: la celebración sube 0,12 m, así que esto es casi cinco
 * veces más y se ve desde el otro lado de la pista.
 *
 * NO toca la trayectoria. El tiro se solvea desde un `y` fijo de 2,15 m
 * (`shoot()`), no desde la posición del jugador, así que subir el cuerpo no
 * cambia ni un milímetro la dificultad ni el punto de caída del balón.
 */
export const SHOOT_JUMP = 3.4;

/** Giro mínimo, en radianes, que hace cambiar el jugador de mano de regate. */
export const HAND_SWITCH_ANGLE = 0.7; // ~40°

/*
 * UMBRALES DE GESTO (lote A, T4): a qué distancia el tiro se resuelve como mate
 * o como tiro largo.
 *
 * Son SÓLO del gesto. La física no los mira: la trayectoria sale de `solveShot`
 * desde el mismo punto de siempre y `SHOOT_RANGE` (el alcance de juego) sigue
 * siendo el único número que decide dificultad y zona verde. Si estos dos
 * cambiaran la jugabilidad, estarían rebalanceando el juego sin que nadie lo
 * haya pedido.
 */
/** A esta distancia o menos, el gesto es mate/entrada (se está debajo del aro). */
export const DUNK_RANGE = 2.9;
/** A esta distancia o más, el gesto es tiro largo. */
export const LONG_RANGE = 7.5;

/*
 * MATE EN CARRERA (lote B).
 *
 * `DUNK_RUN_MIN` es la velocidad de entrada —en fracción de la velocidad máxima—
 * que separa «tiro de cerca» de «mate en carrera». 0,55 y no 0,2: con un umbral
 * bajo, soltar el tiro justo después de un paso corto disparaba una carrera de
 * medio metro, y el mate dejaba de ser algo que el jugador decide hacer
 * corriendo y pasaba a ser algo que le pasa sin querer. A velocidad plena el
 * jugador sostiene el movimiento todo el rato, así que 0,55 sólo excluye lo que
 * de verdad está quieto o casi parado.
 */
export const DUNK_RUN_MIN = 0.55;

/**
 * Distancia al aro, en metros, a la que termina la carrera del mate.
 *
 * Es donde acaba el cuerpo: debajo del aro y por fuera de la estructura. Si el
 * jugador ya está más cerca, no retrocede (ver `startDunk`).
 */
export const DUNK_STOP = 0.85;

/*
 * CONCURSO DE TRIPLES (lote B).
 *
 * Cinco carros con tres balones cada uno repartidos por la línea de tres de la
 * canasta derecha, un carrito en la esquina desde el que se convoca (se pulsa E)
 * y un cronómetro. El último balón de cada carro vale doble: es la «bola del
 * dinero» del concurso de la NBA, y es lo que hace que la última bandeja de cada
 * carro importe más que las otras dos.
 */
export const CONCURSO = {
  /**
   * Segundos de reloj.
   *
   * El de la NBA son 70 s (o 60 para el concurso de estrellas), y 60 es lo que
   * pide la referencia: con 15 balones da 4 s por tiro, que es lo que se tarda
   * entre colocarse y soltar si no se pierde el tiempo andando.
   */
  segundos: 60,
  /** Balones por carro. */
  balones: 3,
  /** Puntos por canasta y por la «bola del dinero» (la última de cada carro). */
  puntos: 1,
  puntosDinero: 2,
  /**
   * Distancia, en metros, para poder coger un balón de un carro.
   *
   * 1,2 m es el radio de una persona dando un paso: más cerca y hay que meterse
   * en el carro, más lejos y se cogen balones a dos metros, que no se ve.
   */
  alcance: 1.2,
} as const;

/** Radio del triple (FIBA: 6,75 m desde el centro del aro). */
export const TRIPLE_RADIO = 6.75;

export const PLAYER = {
  speed: 5.2,
  bounds: { minX: -16, maxX: 16, minZ: -8.8, maxZ: 10.6 },
} as const;

export const CAMERA = {
  fov: 32,
  /*
   * Punto medio. A 18,4 m (el valor original) el balón ocupaba 25 px y su
   * detalle era invisible; a 13,1 m el encuadre se quedaba demasiado cerca
   * para jugar cómodo. A 16,0 m el personaje ocupa 140 px y el balón 29.
   */
  offset: [0, 12.4, 10.2] as const,
  lerp: 4,
  clampX: 11,
  minZ: -4,
  maxZ: 5,

  /*
   * ADELANTO (fase C).
   *
   * El encuadre se desplaza hacia donde VA el jugador, no hacia donde está. La
   * cámara de arriba mira al suelo, así que en marcha se ve el hueco por delante
   * del cuerpo y no el rastro por detrás. 3,2 m es media pantalla larga a esta
   * altura: más se nota el tirón al cambiar de sentido, menos no se percibe.
   */
  advance: 3.2,
  /*
   * ACERCAMIENTO AL CARGAR EL TIRO (fase C).
   *
   * Mientras se carga, la distancia baja de 16,0 a 14,4 m: el medidor se lee
   * mejor y el gesto tiene intención (la cámara se arrima al tiro, como en una
   * retransmisión). Es el mismo factor que el informe pedia para el dolly-in.
   */
  chargeZoom: 0.9,
  /*
   * CRECIMIENTO DEL ENCUADRE EN VERTICAL.
   *
   * `1,5 / aspect` alejaba la cámara para «ver más cancha» en pantallas
   * verticales, y en un móvil (aspect 0,5) se va al tope de 2,4: el jugador
   * acaba siendo un muñeco diminuto con el HUD encima. Se conserva el gesto —en
   * vertical se ve más pista— pero a media fuerza: el crecimiento se interpola a
   * la mitad, así que en 827 × 979 la distancia pasa de 1,78 a 1,39 (el personaje
   * un 22 % más grande) y en un móvil de 2,4 a 2,0. En apaisado no cambia nada
   * (factor 1).
   */
  portraitGrow: 0.5,

  /*
   * ANGULAR DE LA CÁMARA DE TELEVISIÓN.
   *
   * Los 32° del plano de juego son un teleobjetivo suave: desde la distancia del
   * punto de vista (1,3 m) sólo entraría la cabeza. Un objetivo de retransmisión
   * de verdad es un angular, y con 50° entra el sujeto entero de la cabeza a la
   * cadera y el plató de fondo. Es lo que pidió el propietario («la cámara desde
   * la perspectiva de la cámara de televisión»), y no es un truco de encuadre:
   * es lo que hace el zoom de una cámara de estudio.
   */
  tvFov: 50,
} as const;

export type Side = -1 | 1;
export const rimX = (s: Side): number => s * (COURT.halfL - RIM.fromBaseline); // ±12.425
export const boardX = (s: Side): number => s * (COURT.halfL - RIM.boardFromBaseline); // ±12.8

/**
 * Canasta del concurso de triples: la DERECHA (la de la 6.ª sección, `stats`).
 *
 * El propietario lo dijo así («las posiciones de la canasta derecha»), y tiene
 * sentido: es la canasta a la que se puede tirar sin desbloquear nada, así que
 * el concurso no depende del progreso del jugador.
 *
 * Va AQUÍ, después de `rimX`, y no con el resto del bloque del concurso: usa esa
 * función, y un `const` que se usa antes de declararse revienta el módulo entero
 * al cargarlo (zona muerta temporal).
 */
export const CONCURSO_SIDE: Side = 1;

/**
 * Carrito de balones de la esquina: es el PRIMER carro del concurso y desde él
 * se convoca con E.
 *
 * El propietario lo pidió así («el carro donde interactúa el usuario debería ser
 * el primer carro de balones a lanzar»): se llega, se pulsa E y ya se está en el
 * primer puesto, sin un carro de adorno al lado que no sirve para tirar. Sigue
 * siendo un triple: está a 6,91 m del aro, por fuera de los 6,75 de la línea.
 *
 * Va declarado ANTES de `TRIPLES` porque lo usa: un `const` que se usa antes de
 * declararse revienta el módulo entero al cargarlo (zona muerta temporal).
 */
export const CARRITO = { x: rimX(CONCURSO_SIDE) - 0.32, z: 6.9 } as const;

/**
 * Centro de los cinco carros: esquina (el carrito), diagonal, frontal, diagonal
 * y la otra esquina.
 *
 * El ORDEN es el del recorrido: empieza en el carrito de la esquina donde se
 * convoca y cruza la pista hacia el otro lado, así que no hay que dar ninguna
 * vuelta al empezar. Las dos diagonales van a 45° (`ala` es la proyección de la
 * línea de tres sobre cada eje) y la central de frente, que es la posición más
 * lejana del recorrido.
 */
export const TRIPLES: readonly { x: number; z: number }[] = (() => {
  const rx = rimX(CONCURSO_SIDE);
  const esquina = 6.6; // la línea del triple en la esquina está a 0,9 m de la banda
  const ala = TRIPLE_RADIO * Math.SQRT1_2; // 4,77 m: la proyección a 45°
  return [
    { x: CARRITO.x, z: CARRITO.z },
    { x: rx - ala, z: ala },
    { x: rx - 6.9, z: 0 },
    { x: rx - ala, z: -ala },
    // La esquina del lado contrario NO se pone sobre la línea (x = 11,01): se mete
    // 2,4 m hacia la pista para que quepa el carro y el jugador sin pisar el borde
    // del parqué. Queda a 7,02 m del aro, o sea triple por fuera.
    { x: rx - 2.4, z: -esquina },
  ];
})();

export const SECTION_IDS: SectionId[] = ['projects', 'skills', 'about', 'experience', 'contact', 'stats'];

export interface Zone {
  id: SectionId;
  kind: 'shoot' | 'walk' | 'interview';
  x: number;
  z: number;
  radius: number;
  /** Solo la zona que se desbloquea encestando lo tiene. */
  side?: Side;
}

export const ZONES: Zone[] = [
  // Canasta izquierda: Projects se desbloquea encestando una vez.
  { id: 'projects', kind: 'shoot', x: rimX(-1), z: 0, radius: 4.5, side: -1 },
  // Canasta derecha: es la 6.ª sección, un panel de RÉCORD. No desbloquea nada,
  // pero se puede tirar a ella (los tiros cuentan para el récord).
  { id: 'stats', kind: 'walk', x: rimX(1), z: 0, radius: 4.5 },
  // Mesa de anotadores al centro de la banda lejana: abre Skills.
  { id: 'skills', kind: 'walk', x: 0, z: -9, radius: 2.4 },
  { id: 'about', kind: 'walk', x: 0, z: 8.4, radius: 2.4 },
  { id: 'experience', kind: 'walk', x: -10, z: -8.2, radius: 1.8 },
  { id: 'contact', kind: 'interview', x: 9, z: 8.3, radius: 1.6 },
];

/** Mesa de anotadores (Skills): centro de la banda lejana, delante de las gradas. */
export const SCORER_TABLE = { x: 0, z: -9 } as const;

export const INTERVIEW = {
  playerSpot: [9, 8.3] as const,
  cameraPos: [5.4, 2.1, 8.9] as const,
  cameraLook: [9.2, 1.3, 9.0] as const,

  /*
   * PUNTO DE VISTA DE LA CÁMARA DE TELEVISIÓN (lote B).
   *
   * El propietario pidió ver la entrevista DESDE la cámara de TV que hay en el
   * plató. La cámara del grupo `tvCamera` está en (11, 0, 8,7) girada -90°, así
   * que su objetivo mira hacia -X y su barril acaba en x = 10,16.
   *
   * El punto de vista se separa de la cámara hacia el lado de las gradas
   * (x = 11,0 m, z = 10,0 m, y = 1,65 m, que es la altura de los ojos del
   * operador) para ver al entrevistado sin que el aparato se meta en el plano.
   *
   * Las otras dos posiciones se probaron y se descartaron MIDIENDO:
   *  · por delante del objetivo (x < 10,16) hay que acercarse a 1,1 m, y en
   *    pantalla vertical el angular no coge la cabeza entera, que en este rig mide
   *    0,74 x 1,05 m;
   *  · justo encima del aparato (x = 10,9, y = 2,2) el plano mira HACIA ABAJO y
   *    lo que se ve es la coronilla: con la cabeza a 58 % de la altura del
   *    personaje, 0,4 m de altura de cámara son medio plano de pelo.
   *
   * Desde aquí la visual pasa entre el aparato y el muro del plató, deja al
   * jugador a 2,6 m de tres cuartos y con la pista de fondo, y no coge nada del
   * modelo de la cámara (que queda a la espalda, fuera del encuadre).
   */
  pov: {
    pos: [11.0, 1.65, 10.0] as const,
    look: [9.0, 1.3, 8.35] as const,
  },
};

/**
 * Encuadre al entrar en cada sección desde su zona.
 *
 * Antes sólo la sección de entrevista tenía plano propio: al entrar en ella
 * la cámara bajaba de golpe a `INTERVIEW.cameraPos` (y = 2,1 m), abandonando el
 * plano de juego alto (y ≈ 12,4 m). El resto de secciones se abrían con la
 * cámara de juego, a 12 m de altura, mirando a la nada: la sección quedaba
 * fuera de cuadro y el panel aparecía sobre un plano vacío.
 *
 * Los seis planos se resolvieron MEDIDOS, no a ojo. Para cada sección se calculó
 * la caja que envuelve su atrezo y la distancia mínima que hace que quepa con
 * un 30 % de aire, comprobando después con un raycast que no hubiera nada en la
 * línea de visión. Elegir la cámara probando capturas salía mal: el plano de
 * Experiencia quedaba clavado a 4,9 m de un panel de 4,1 × 3,9 m que se comía
 * la pantalla entera, y el de Skills cortaba el monitor por arriba.
 *
 * Criterio común a los seis:
 *
 *  · cámara a la altura de una persona (1,75-2,6 m), nunca a la de un dron;
 *  · distancia calculada para que quepa el atrezo, con aire alrededor;
 *  · acimut de tres cuartos (±30°), para que el plano tenga profundidad y no
 *    sea una foto frontal;
 *  · el punto mirado es el centro de la sección, que es justo donde está el
 *    jugador: sale de fondo con su atrezo;
 *  · `face` deja al jugador mirando hacia su sección y de espaldas a la cámara,
 *    que es lo que se ve al llegar a una vitrina.
 *
 * Con `rotY = 0` el personaje mira a +Z, así que `face = atan2(dx, dz)` con
 * (dx, dz) la dirección desde la cámara hasta la sección.
 */
export const SECTION_CAMERA: Record<
  SectionId,
  { pos: readonly [number, number, number]; look: readonly [number, number, number]; face: number }
> = {
  // Canasta izquierda. A 7,0 m el aro, el tablero y el protector entran enteros
  // con las gradas detrás; el pie del poste se sale de cuadro abajo, que es lo
  // natural, porque el poste llega al suelo y no pinta nada.
  projects: { pos: [-6.36, 2.3, 3.5], look: [-12.43, 2.55, 0], face: (-2 * Math.PI) / 3 },
  // Canasta derecha, simétrica: misma distancia, mismo alto, mismo giro.
  stats: { pos: [6.36, 2.3, -3.5], look: [12.43, 2.55, 0], face: Math.PI / 3 },
  // Mesa de anotadores. A 5,0 m caben los monitores, el teclado y las sillas.
  skills: { pos: [-2.48, 1.75, -4.71], look: [0, 1.15, -9], face: 2.617 },
  // Banquillo de la banda cercana. El atrezo son 5 m de largo, así que la
  // cámara se retira a 8,5 m; a menos distancia sólo se encuadraba una esquina.
  about: { pos: [4.25, 1.75, 1.04], look: [0, 1.05, 8.4], face: -0.524 },
  // Experiencia. El panel mide 4,1 x 3,9 m: por eso la cámara se va a 8,8 m, y
  // sube a 2,5 m para que el panel no se recorte por arriba.
  experience: { pos: [-6.9, 2.49, 0.02], look: [-10, 1.94, -8.2], face: -2.781 },
  // Entrevista: el encuadre que ya existía y funcionaba, intacto.
  contact: { pos: INTERVIEW.cameraPos, look: INTERVIEW.cameraLook, face: 0 },
};
