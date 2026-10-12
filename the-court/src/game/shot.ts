import { G, METER_HZ, SHOOT_RANGE, SWEET_SPOT } from './config';

export interface V3 { x: number; y: number; z: number }
export interface ShotSolution { vx: number; vy: number; vz: number; t: number; angleDeg: number }

/**
 * Velocidad inicial para ir de `from` a `rim` siguiendo una parábola.
 * Prueba varios ángulos y se queda con el primero que llega al aro DESCENDIENDO
 * (si llegara subiendo, el balón nunca podría entrar).
 */
export function solveShot(from: V3, rim: V3, angles: number[] = [55, 62, 70, 78]): ShotSolution | null {
  const dx = rim.x - from.x;
  const dz = rim.z - from.z;
  const d = Math.hypot(dx, dz);
  const h = rim.y - from.y;
  if (d < 0.01) return null;

  for (const angleDeg of angles) {
    const th = (angleDeg * Math.PI) / 180;
    const denom = 2 * Math.cos(th) ** 2 * (d * Math.tan(th) - h);
    if (denom <= 0) continue;
    const v = Math.sqrt((G * d * d) / denom);
    const vh = v * Math.cos(th);
    const vy = v * Math.sin(th);
    const t = d / vh;
    if (vy - G * t >= 0) continue; // llega subiendo: descartar
    return { vx: (vh * dx) / d, vy, vz: (vh * dz) / d, t, angleDeg };
  }
  return null;
}

/** Medidor triangular 0→1→0 con METER_HZ barridos completos por segundo. */
export function meterAt(seconds: number): number {
  const p = (seconds * METER_HZ) % 2;
  return p < 1 ? p : 2 - p;
}

/**
 * Dificultad 0..1 según la distancia al aro.
 *
 * 0 = a 1,5 m o menos (debajo del aro, tiro regalado), 1 = a SHOOT_RANGE o más.
 * Entre esos dos puntos crece linealmente.
 */
export function difficultyAt(dist: number): number {
  return Math.min(1, Math.max(0, (dist - 1.5) / (SHOOT_RANGE - 1.5)));
}

/**
 * Anchura efectiva de la zona verde.
 *
 * Se ESTRECHA con la distancia: de SWEET_SPOT a 1,5 m hasta la mitad a
 * distancia máxima. Un tiro lejano exige un timing casi perfecto.
 */
export function sweetSpotAt(difficulty: number): number {
  return SWEET_SPOT * (1 - difficulty * 0.5);
}

/**
 * e ∈ [-1, 1]; 0 = centro exacto de la zona verde.
 * `difficulty` estrecha la zona verde (por defecto 0 = la más generosa).
 */
/**
 * Recorrido lateral de la zona verde, en fracción del medidor.
 *
 * Va y vuelve entre estos dos extremos, en 2,6 s cada medio recorrido.
 */
const SWEEP = 0.3;
const SWEEP_HZ = 0.38;

/**
 * Centro de la zona verde en el instante `t` (segundos cargando).
 *
 * Antes la zona verde estaba clavada en el centro y lo único que se movía era
 * la aguja: el tiro era «suelta cuando la aguja cruce el verde», sin más. Ahora
 * el verde ALSO se desplaza, así que hay que.leer dónde va a estar la aguja
 * dentro de un cuarto de segundo y soltar ahí, no solo perseguir la aguja.
 *
 * OJO: esto cambia el juego. Si el juicio usara el centro fijo, el jugador
 * vería una barra móvil y sería puntuado contra un blanco parado — la barra se
 * movería y el tiro no. Por eso `evaluateMeter` recibe el centro del MISMO
 * instante en que se suelta.
 */
export function sweetCenterAt(t: number): number {
  return 0.5 + Math.sin(t * 2 * Math.PI * SWEEP_HZ) * SWEEP;
}

/** Posición del centro y su velocidad (fracción por segundo), para la UI. */
export function sweetCenterVel(t: number): number {
  return Math.cos(t * 2 * Math.PI * SWEEP_HZ) * SWEEP * 2 * Math.PI * SWEEP_HZ;
}

export function evaluateMeter(
  m: number,
  difficulty = 0,
  center = 0.5,
): { e: number; perfect: boolean; sweet: number } {
  const e = (m - center) * 2;
  const sweet = sweetSpotAt(difficulty);
  return { e, perfect: Math.abs(e) <= sweet, sweet };
}

/**
 * Aplica el error de timing a la solución ideal.
 * - Dentro de la zona verde (|e| <= SWEET_SPOT) el error es 0: canasta garantizada.
 * - Fuera, el error crece linealmente hasta 1 en los extremos del medidor.
 * - assist ∈ [0, 1]: 1 = error completo, 0 = siempre perfecto.
 */
export function applyShotError(
  sol: ShotSolution,
  e: number,
  assist: number,
  rnd: () => number,
  difficulty = 0,
): V3 {
  const sweet = sweetSpotAt(difficulty);
  const mag = Math.max(0, Math.abs(e) - sweet) / (1 - sweet);
  const eEff = Math.sign(e) * mag;
  // La distancia AMPLIFICA el error: a máxima dificultad el desvío por mal
  // timing es más del doble que debajo del aro.
  const gain = 1 + difficulty * 1.1;
  const speedScale = 1 + eEff * 0.06 * assist * gain;
  const yaw = (rnd() - 0.5) * 0.03 * mag * assist * gain;
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const vx = sol.vx * speedScale;
  const vz = sol.vz * speedScale;
  return { x: vx * cos - vz * sin, y: sol.vy * speedScale, z: vx * sin + vz * cos };
}
