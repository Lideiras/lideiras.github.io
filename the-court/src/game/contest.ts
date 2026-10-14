import { CONCURSO, TRIPLES } from './config';

/*
 * CONCURSO DE TRIPLES (lote B).
 *
 * Cinco carros con tres balones en la línea de tres y 60 segundos de reloj. El
 * PRIMERO es el carrito de la esquina, que es el que se pulsa con E para
 * convocarlo: llegar, pulsar y tirar desde ahí mismo, sin dar un paso de más.
 *
 * Este módulo es SÓLO el estado y las reglas: cuánto queda, cuántos puntos lleva,
 * qué carro toca, cuántos balones le quedan y si el jugador está lo bastante
 * cerca para coger uno. El balón, el HUD y el mundo los pone `main.ts`, que es
 * quien los tiene.
 *
 * Separarlo no es un capricho de estilo: las reglas son lo único del minijuego
 * que se puede comprobar sin navegador (racha, bola del dinero, cambio de carro,
 * final por tiempo o por balones), y con el estado dentro del bucle eso habría
 * que jugarlo entero cada vez que se tocara un número.
 */

export interface Concurso {
  /** `true` mientras dura el minijuego. */
  activo: boolean;
  /** Segundos que quedan. */
  t: number;
  puntos: number;
  /** Carro actual, 0..TRIPLES.length-1. */
  carro: number;
  /** Balones que le quedan al carro actual. */
  balones: number;
  tiros: number;
  aciertos: number;
  /**
   * Canastas SEGUIDAS. La rompe el primer fallo.
   *
   * Vive aquí y no en el comentarista porque es del concurso y no de la voz que
   * lo cuenta: la racha se reinicia al empezar la partida y no sabe nada de lo
   * que se hizo antes de pulsar E (el `hitStreak` del Takeover sí, y por eso no
   * sirve: encestar dos veces en la pista y luego entrar al concurso no puede
   * salir como «dos seguidas»).
   */
  racha: number;
  /** Hay un balón en juego: no se puede coger otro (y el HUD no insiste). */
  esperando: boolean;
  /** El cronómetro corre. Arranca con el PRIMER balón, no al pulsar E. */
  reloj: boolean;
  /** El balón que se acaba de coger es la «bola del dinero» (la última del carro). */
  dinero: boolean;
  /** Cómo terminó, o `null` si sigue o no ha empezado. */
  fin: 'tiempo' | 'carros' | null;
}

export const nuevoConcurso = (): Concurso => ({
  activo: false,
  t: CONCURSO.segundos,
  puntos: 0,
  carro: 0,
  balones: CONCURSO.balones,
  tiros: 0,
  aciertos: 0,
  racha: 0,
  esperando: false,
  reloj: false,
  dinero: false,
  fin: null,
});

/**
 * Empieza el concurso por el PRIMER carro, con el reloj parado.
 *
 * El reloj no corre hasta que se coge el primer balón: si arrancara al pulsar E,
 * el jugador pagaría el tiempo que tarda en colocarse, y en un carro que está a
 * metro y medio del carrito eso son dos segundos de quince tiros.
 */
export function empezar(c: Concurso): void {
  c.activo = true;
  c.t = CONCURSO.segundos;
  c.puntos = 0;
  c.carro = 0;
  c.balones = CONCURSO.balones;
  c.tiros = 0;
  c.aciertos = 0;
  c.racha = 0;
  c.esperando = false;
  c.reloj = false;
  c.dinero = false;
  c.fin = null;
}

/** Sale del concurso (por el botón, por encima del carrito, o al terminar). */
export function salir(c: Concurso): void {
  c.activo = false;
  c.esperando = false;
  c.reloj = false;
}

/**
 * Avanza el cronómetro. Devuelve `true` el fotograma en que se agota.
 *
 * Se comprueba el reloj ANTES de restar y se devuelve el fin una sola vez: el
 * `t` se queda en 0 y no vuelve a bajar, así que el aviso de final no se repite.
 */
export function avanzarReloj(c: Concurso, dt: number): boolean {
  if (!c.activo || !c.reloj) return false;
  if (c.t <= 0) return false;
  c.t = Math.max(0, c.t - dt);
  if (c.t > 0) return false;
  c.fin = 'tiempo';
  return true;
}

export const carroActual = (c: Concurso): { x: number; z: number } => TRIPLES[c.carro] ?? TRIPLES[0]!;

/** Distancia horizontal del jugador al carro que toca, en metros. */
export function distanciaAlCarro(c: Concurso, x: number, z: number): number {
  const p = carroActual(c);
  return Math.hypot(x - p.x, z - p.z);
}

/**
 * ¿Se puede coger un balón?
 *
 * Hacen falta las cuatro: estar en el concurso, que el carro tenga balones, que
 * no haya un tiro en el aire (un solo balón a la vez, como en el concurso de
 * verdad: el reboteador espera a que la bola caiga) y estar cerca del carro.
 */
export function puedeCoger(c: Concurso, x: number, z: number): boolean {
  return (
    c.activo &&
    c.fin !== 'tiempo' &&
    c.balones > 0 &&
    !c.esperando &&
    distanciaAlCarro(c, x, z) <= CONCURSO.alcance
  );
}

/**
 * LA BOCINA: el tiempo se agotó, pero el concurso sigue ABIERTO.
 *
 * `avanzarReloj` marca `fin: 'tiempo'` y deja el reloj a 0, y a partir de ahí el
 * concurso no hace nada más que esperar a que se resuelva el balón que ya iba por
 * el aire. Es una espera, no un estado aparte: el cierre de verdad lo hace
 * `main.ts` (`terminarConcurso`) en el fotograma en que el balón deja de volar, y
 * por eso lo que se mira aquí es `activo` + `fin`.
 *
 * Mientras dure: no se coge balón, no se cambia de carro y no se lanza nada —lo
 * que estaba en el aire cuando sonó la bocina vale; lo demás ya no—. Así el tiro
 * lanzado antes del final se resuelve y cuenta, que es lo que pedía el
 * propietario («como en el concurso real»).
 */
export const enBocina = (c: Concurso): boolean => c.activo && c.fin === 'tiempo';

/**
 * ¿Se puede LANZAR el balón?
 *
 * Fuera del concurso siempre: es el baloncesto de siempre. Dentro, sólo con un
 * balón EN JUEGO, que es el que da el reboteador. La condición no es un adorno:
 * con un balón que el concurso no reconoce en las manos (el último de un carro ya
 * vacío, o un rebote que el jugador traía de antes), lanzarlo no puede gastar
 * balón ni contar intento, así que el tiro no sale. Sin esta regla el tiro y la
 * cuenta del carro se pueden desincronizar —el jugador encadena tiros «de
 * regalo» con el balón que le devolvió el reboteador de un carro vacío— y, en el
 * otro sentido, un balón al que no se le marcó `tomarBalon` dispara sin querer
 * otra recogida en el mismo fotograma: el balón sale y vuelve a la mano, que es
 * el «hay que tirar dos veces» que se veía al estrenar carro.
 */
export function puedeTirar(c: Concurso): boolean {
  if (!c.activo) return true;
  return c.esperando && c.fin !== 'tiempo';
}

/**
 * El jugador se lleva un balón del carro a las manos.
 *
 * Devuelve si ése es la «bola del dinero», o sea el ÚLTIMO que le queda al
 * carro. La cuenta de balones NO se descuenta aquí sino al resolver el tiro
 * (`resolverTiro`): mientras el balón está en el aire el carro sigue teniendo el
 * que se está usando, y así la «bola del dinero» es la que se está tirando y no
 * la siguiente.
 */
export function tomarBalon(c: Concurso): boolean {
  c.esperando = true;
  c.dinero = c.balones === 1;
  return c.dinero;
}

/**
 * Arranca el cronómetro. Lo llama `main.ts` con el PRIMER TIRO del concurso.
 *
 * Deliberadamente no arranca al pulsar E ni al coger el primer balón: el jugador
 * tiene que poder colocarse y decidir cuándo empieza a contar, que es lo que hace
 * que la primera bandeja no salga pagada con el reloj ya corriendo.
 */
export function arrancarReloj(c: Concurso): void {
  if (c.activo) c.reloj = true;
}

/**
 * Resuelve el tiro: descuenta el balón, suma los puntos y deja al jugador listo
 * para el siguiente.
 *
 * La puntuación la decide el `dinero` que se marcó al COGER el balón y no el
 * estado de ahora: si se mirara al resolver, un balón que viaja mientras el
 * jugador ya se ha ido al carro siguiente cargaría los puntos al carro
 * equivocado.
 */
export function resolverTiro(c: Concurso, encestado: boolean): number {
  c.esperando = false;
  c.tiros++;
  c.balones = Math.max(0, c.balones - 1);
  c.racha = encestado ? c.racha + 1 : 0;
  if (!encestado) return 0;
  const suma = c.dinero ? CONCURSO.puntosDinero : CONCURSO.puntos;
  c.puntos += suma;
  c.aciertos++;
  return suma;
}

/** ¿Se han acabado los balones del carro actual? */
export const carroVacio = (c: Concurso): boolean => c.balones === 0;

/** ¿Queda algún carro por delante? (falso en el último). */
export const quedanCarros = (c: Concurso): boolean => c.carro < TRIPLES.length - 1;

/**
 * Pasa al carro siguiente si el jugador está EN él. Devuelve `false` si ya era el
 * último (o sea: se acabó el concurso).
 *
 * Cambiar de carro es una acción del jugador (andar hasta el siguiente), no un
 * efecto del reloj: es la mitad de la gracia del concurso —correr de una esquina
 * a la otra— y por eso no se avanza solo.
 */
export function avanzarCarro(c: Concurso, x: number, z: number): boolean {
  // Con el tiempo agotado no se cambia de carro: la partida está esperando al
  // balón que va por el aire, y rellenar el carro siguiente daría balones que ya
  // no valen para nada.
  if (c.fin === 'tiempo') return false;
  const p = TRIPLES[c.carro + 1];
  if (!p) return false;
  if (Math.hypot(x - p.x, z - p.z) > CONCURSO.alcance) return false;
  c.carro++;
  c.balones = CONCURSO.balones;
  /*
   * `dinero` NO se toca aquí: pertenece al balón que está en el aire. Si se
   * reiniciara al cambiar de carro, un tiro lanzado desde el último balón de un
   * carro dejaría de valer doble por el simple hecho de que el jugador ya ha
   * empezado a andar hacia el siguiente. La bandera se reescribe en cada
   * `cogerBalon`, que es donde corresponde.
   */
  return true;
}

/** Termina el concurso por agotar los cinco carros. */
export function terminar(c: Concurso): void {
  c.fin = 'carros';
  salir(c);
}
