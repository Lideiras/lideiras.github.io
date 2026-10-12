import { G, SHOOT_JUMP } from './config';

/**
 * Salto del personaje al soltar un tiro.
 *
 * Vive fuera de `main.ts` por una razón práctica: si la integración está
 * dentro del bucle de render no hay forma de comprobarla sin levantar el
 * juego entero, y es justamente la parte donde un error se nota (el jugador
 * atravesando el suelo, o quedándose pegado a media altura).
 */
export interface Jump {
  /** Altura sobre el suelo, en metros. */
  y: number;
  /** Velocidad vertical, en m/s. Negativa al bajar. */
  vel: number;
}

export const newJump = (): Jump => ({ y: 0, vel: 0 });

/** Impulso de salida. */
export function launchJump(j: Jump, v: number = SHOOT_JUMP): void {
  j.vel = v;
}

/**
 * Avanza un fotograma. Devuelve `true` si el personaje tiene los pies en el
 * suelo al terminar.
 *
 * Integra la altura con la solución exacta de aceleración constante
 * (`y += v·dt + ½·a·dt²`) en vez de con Euler semi-implícito (`y += v·dt` y
 * luego bajar `v`). Parece una diferencia de comas, pero no lo es: con Euler el
 * pico se pasa por `v·dt/2`, o sea **2,9 cm de más a 60 fps y 7,3 cm a 24 fps**.
 * El jugador saltaría más alto cuanto más lento fuera el monitor, y un test que
 * comparaba 30 y 60 fps lo delató. Con la forma exacta el error es el del
 * muestreo del pico (~1 mm), independiente del frame rate.
 */
export function stepJump(j: Jump, dt: number): boolean {
  if (j.vel === 0 && j.y === 0) return true;
  j.y += j.vel * dt - 0.5 * G * dt * dt;
  j.vel -= G * dt;
  if (j.y <= 0) {
    // Aterriza: nunca por debajo del suelo y sin rebote. Un rebote aquí se
    // leería como que el jugador rebota con los pies, que no es lo que hace.
    j.y = 0;
    j.vel = 0;
    return true;
  }
  return false;
}

/** Altura máxima que alcanzará un salto lanzado con `v`. */
export const peakOf = (v: number): number => (v * v) / (2 * G);
