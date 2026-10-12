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
} as const;

export type Side = -1 | 1;
export const rimX = (s: Side): number => s * (COURT.halfL - RIM.fromBaseline); // ±12.425
export const boardX = (s: Side): number => s * (COURT.halfL - RIM.boardFromBaseline); // ±12.8

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
