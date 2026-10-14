import { DUNK_STOP, rimX, type Side } from './config';

/*
 * MATE EN CARRERA (lote B).
 *
 * El gesto de mate ya existía (lote A, T4): al soltar cerca del aro la pose era
 * `poseDunk`, pero el balón salía disparado igual que en un tiro y el jugador se
 * quedaba plantado donde estaba. Lo que pidió el propietario después es otra
 * cosa: si **está corriendo** y suelta cerca de la canasta, el jugador no tira
 * —corre hasta el aro, salta y METE el balón— y mientras dura la animación el
 * input está bloqueado. Quieto, en cambio, el tiro de cerca se queda como
 * estaba, que es lo que él mismo dijo que estaba bien.
 *
 * Este módulo es la animación, y sólo la animación: posición en el suelo,
 * altura del cuerpo y el instante exacto del golpe. No toca el balón, ni la
 * cámara, ni la puntuación. Todo eso vive en `main.ts`, que es quien tiene el
 * balón y la cámara. La separación no es decorativa: es lo que permite
 * comprobar en un test que la animación dura lo que dice, que el golpe sale UNA
 * vez y que el cuerpo no se hunde en el parqué, sin levantar el juego entero.
 */

export interface Dunk {
  /** Mientras está `true` el input del jugador no manda: la animación manda. */
  activo: boolean;
  /** Segundos desde el inicio. Se queda clavado en `DUNK_TOTAL` al terminar. */
  t: number;
  /** Punto de partida: donde el jugador soltó el tiro. */
  x0: number;
  z0: number;
  /** Punto de llegada: a `DUNK_STOP` m del centro del aro, nunca más allá. */
  x1: number;
  z1: number;
  /** Aro al que se machaca. */
  side: Side;
  /** El golpe ya se ha avisado. Sin esta bandera el aviso saldría en cada fotograma. */
  golpeado: boolean;
}

/*
 * TIEMPOS.
 *
 * `DUNK_VUELO` es la carrera hasta el aro (y el salto, que termina en el pico
 * justo al machacar) y `DUNK_CAIDA`, la vuelta al suelo colgado del aro. En
 * total 0,68 s: por debajo de medio segundo no da tiempo a leer el gesto, y por
 * encima del segundo el input bloqueado se siente como que el juego se ha
 * colgado. 0,34 s de vuelo son justo los que tarda el cuerpo en cruzar los
 * ~1,6 m que separan el punto de tiro de debajo del aro a velocidad de carrera.
 */
export const DUNK_VUELO = 0.34;
export const DUNK_CAIDA = 0.34;
export const DUNK_TOTAL = DUNK_VUELO + DUNK_CAIDA;

/*
 * ALTURA DEL SALTO.
 *
 * 0,72 m de pico es un mate sin ser un atleta: con 1,81 m de estatura y las
 * manos arriba, la mano llega a la altura del aro (3,05 m) —la pose de mate
 * lleva los brazos a -2,5 rad, casi verticales— y el balón entra de verdad por
 * el aro, que es donde lo deja `main.ts`.
 */
export const DUNK_ALTURA = 0.72;

export const newDunk = (): Dunk => ({
  activo: false,
  t: 0,
  x0: 0,
  z0: 0,
  x1: 0,
  z1: 0,
  side: 1,
  golpeado: false,
});

/**
 * ¿Este tiro es un mate en carrera o un tiro de cerca?
 *
 * Las DOS condiciones son del propietario y ninguna sobra: cerca del aro solo
 * (distancia) es el mate quieto que ya existía, y corriendo solo (velocidad) no
 * es un mate, es un tiro tras una carrera. Hacen falta las dos, y por eso viven
 * juntas y con nombre propio en vez de como un `&&` suelto en el bucle: es la
 * regla del juego, no un detalle de la animación.
 */
export const puedeMate = (distAro: number, velocidad: number, distMax: number, velMin: number): boolean =>
  velocidad >= velMin && distAro <= distMax;

/**
 * Arranca la animación desde `(x, z)` hacia el aro `side`.
 *
 * El destino NO es el centro del aro: es un punto a `DUNK_STOP` m del él sobre
 * la recta de aproximación. Machacar desde el centro del aro dejaría al jugador
 * dentro del poste y de la red; desde 0,85 m queda debajo del aro, con el cuerpo
 * entero fuera de la estructura, que es donde acaba alguien que machaca.
 *
 * Y si el jugador YA estaba a menos de esa distancia, el destino es su propia
 * posición (`DUNK_STOP` no se puede «devolver»): así el mate de debajo del aro
 * se resuelve con el salto vertical y sin dar un paso atrás, que es lo que pasa
 * en la vida real.
 */
export function startDunk(d: Dunk, x: number, z: number, side: Side): void {
  // El aro está en (rimX(side), 0): la recta de aproximación es la que une al
  // jugador con ese punto.
  const rx = rimX(side);
  const dx = rx - x;
  const dz = -z;
  const len = Math.hypot(dx, dz) || 1;
  const paso = Math.max(0, len - DUNK_STOP);
  d.activo = true;
  d.t = 0;
  d.golpeado = false;
  d.side = side;
  d.x0 = x;
  d.z0 = z;
  d.x1 = x + (dx / len) * paso;
  d.z1 = z + (dz / len) * paso;
}

/**
 * Avanza la animación. Devuelve los dos eventos del gesto.
 *
 * `golpe` sale exactamente UNA vez y en el fotograma en el que el cuerpo llega
 * al pico (el aro). `fin` sale una vez, en el fotograma en que la animación
 * termina y el input vuelve a mandar. Que salgan por evento y no por consulta
 * («¿t >= VUELO?») es lo que garantiza que el balón entre y la cámara vibre una
 * sola vez: con una consulta, un fotograma largo repetiría el golpe.
 */
export function stepDunk(d: Dunk, dt: number): { golpe: boolean; fin: boolean } {
  if (!d.activo) return { golpe: false, fin: false };
  d.t = Math.min(DUNK_TOTAL, d.t + dt);
  const golpe = !d.golpeado && d.t >= DUNK_VUELO;
  if (golpe) d.golpeado = true;
  const fin = d.t >= DUNK_TOTAL;
  if (fin) d.activo = false;
  return { golpe, fin };
}

/**
 * Avance de la carrera, 0..1.
 *
 * Con frenada al final (`1 - (1-u)²` y no `u`): el jugador llega al aro
 * desacelerando, que es como se llega a machacar. Con un avance lineal el cuerpo
 * entra en el aro a velocidad de carrera y el salto parece un choque.
 */
const avance = (t: number): number => {
  const u = Math.min(1, Math.max(0, t / DUNK_VUELO));
  return 1 - (1 - u) * (1 - u);
};

export const dunkX = (d: Dunk): number => d.x0 + (d.x1 - d.x0) * avance(d.t);
export const dunkZ = (d: Dunk): number => d.z0 + (d.z1 - d.z0) * avance(d.t);

/**
 * Altura del cuerpo, en metros.
 *
 * El pico cae EN EL GOLPE, no a mitad del vuelo (`1 - (1-u)²` llega a la altura
 * máxima justo en `DUNK_VUELO`): en un mate se salta PARA machacar, así que la
 * mano está lo más alta posible exactamente cuando el balón entra. La caída sale
 * de ese mismo pico con la forma `(1-v)²`, que empieza frenada —el cuerpo se
 * queda un instante colgado del aro— y acaba rápida.
 *
 * Nunca es negativa: el cuerpo no se hunde en el parqué ni cuando la animación
 * termina a mitad de la caída.
 */
export function dunkY(d: Dunk): number {
  if (d.t <= DUNK_VUELO) {
    const u = d.t / DUNK_VUELO;
    return DUNK_ALTURA * (1 - (1 - u) * (1 - u));
  }
  const v = Math.min(1, (d.t - DUNK_VUELO) / DUNK_CAIDA);
  return DUNK_ALTURA * (1 - v) * (1 - v);
}

/**
 * Peso de la capa de pose (0..1), que `main.ts` mezcla con `mezclaPeso`.
 *
 * Sube de golpe —el brazo tiene que estar arriba ANTES de llegar al aro, no
 * después— y baja durante la caída, así que al tocar el suelo el personaje ya
 * está volviendo a su pose de pie sin ningún salto de huesos.
 */
export function dunkPose(d: Dunk): number {
  if (d.t <= DUNK_VUELO) return Math.min(1, (d.t / DUNK_VUELO) * 1.6);
  const v = Math.min(1, (d.t - DUNK_VUELO) / DUNK_CAIDA);
  return 1 - v * v;
}
