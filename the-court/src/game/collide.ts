import { COURT, SCORER_TABLE } from './config';

/* ===========================================================================
 * COLISIONES SIN MOTOR DE FÍSICAS (fase D del informe)
 * ---------------------------------------------------------------------------
 * Hasta ahora el jugador sólo estaba acotado por un rectángulo (`PLAYER.bounds`)
 * y ATRAVESABA el banquillo, la mesa, los postes, las vallas y los actores del
 * plató. Eso se nota muchísimo: el cuerpo no tiene presencia y el mundo no
 * existe. La tentación es meter cannon-es o rapier —y son 40 kB de motor, un
 * paso de simulación, cuerpos rígidos y un montón de estados nuevos para mover
 * un muñeco por una pista—. Aquí basta con veinte volúmenes declarados a mano y
 * treinta líneas de matemáticas:
 *
 *  · **Caja**: la cápsula del jugador es un círculo (radio 0,35 m) en XZ y una
 *    altura [0, 1,8]; el balón es una esfera de 0,2 m. Se resuelve por el punto
 *    más cercano y se empuja hacia fuera, que sale gratis el DESLIZAMIENTO: al
 *    empujar por la normal, la componente tangencial del movimiento se conserva
 *    y uno se desliza a lo largo de la valla en vez de quedarse clavado.
 *  · **Cilindro**: para los postes y las tres figuras del plató, que son
 *    redondos y se leen mejor así.
 *  · **Escalón**: las cajas de menos de 15 cm se ignoran, así que los bordillos y
 *    las juntas del parqué no traban el paso.
 *
 * Los volúmenes se declaran AQUÍ, junto a las constantes que usan los
 * constructores, y no derivados del `boundingBox` de los grupos. No es capricho:
 * el `boundingBox` de una malla fundida o de un grupo con huecos (las vallas
 * tienen cuatro aperturas a propósito) envuelve también el hueco, y el jugador
 * no podría entrar al banquillo, a la mesa, al túnel ni al plató. La prueba de
 * aceptación está en `tests/collide.test.ts`: las SEIS zonas siguen alcanzables.
 * ========================================================================= */

export interface Box {
  kind: 'box';
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  y0: number;
  y1: number;
}

export interface Cylinder {
  kind: 'cyl';
  x: number;
  z: number;
  r: number;
  y0: number;
  y1: number;
}

export type Collider = Box | Cylinder;

export const BORDER = 0.15; // por debajo de esto se sube andando
export const PLAYER_RADIUS = 0.35;
export const PLAYER_HEIGHT = 1.8;

const box = (x0: number, z0: number, x1: number, z1: number, y0: number, y1: number): Box => ({ kind: 'box', x0, z0, x1, z1, y0, y1 });
const cyl = (x: number, z: number, r: number, y0: number, y1: number): Cylinder => ({ kind: 'cyl', x, z, r, y0, y1 });

/**
 * Volúmenes sólidos de la pista. Cada uno va comentado con la pieza del
 * constructor de la que sale, para que no se separen nunca.
 */
export function buildColliders(): Collider[] {
  const out: Collider[] = [];

  /* ── Vallas publicitarias (ver `buildBoards` en court.ts) ─────────────────
   * Se generan con el MISMO bucle y los MISMOS huecos que la geometría: si se
   * cambia un hueco allá, hay que cambiarlo aquí, y por eso las dos listas están
   * a la vista una de otra. */
  const zBoard = COURT.halfW + 1.15;
  const xEnd = COURT.halfL + 0.9;
  for (const sz of [-1, 1]) {
    // Tramo continuo de valla: se cierra al llegar a un hueco y se reabre al
    // pasarlo. Cerrar el tramo en CADA celda del hueco dejaría colisiones
    // fantasma dentro del hueco (y el banquillo, la mesa, el túnel y el plató
    // dejarían de ser accesibles).
    let start = -xEnd;
    for (let x = -xEnd; x < xEnd; x += 0.8) {
      const enTunel = sz < 0 && x > -12.4 && x < -7.6;
      const enMesa = sz < 0 && x > -1.6 && x < 1.6;
      const enBanquillo = sz > 0 && x > -3.0 && x < 3.0;
      const enPlato = sz > 0 && x > 6.2 && x < 12.8;
      const hueco = enTunel || enMesa || enBanquillo || enPlato;
      if (hueco) {
        if (x - start > 0.2) out.push(box(start, sz * zBoard - 0.12, x, sz * zBoard + 0.12, 0, 0.92));
        start = Infinity; // dentro del hueco no hay tramo abierto
      } else if (start === Infinity) {
        start = x;
      }
    }
    if (start !== Infinity && xEnd - start > 0.2) {
      out.push(box(start, sz * zBoard - 0.12, xEnd, sz * zBoard + 0.12, 0, 0.92));
    }
  }

  /* ── Canastas (ver `buildHoop`): poste forrado y zapata de hormigón. ───── */
  for (const side of [-1, 1] as const) {
    const poleX = side * (COURT.halfL + 0.6);
    out.push(box(poleX - 0.55, -0.55, poleX + 0.55, 0.55, 0, 0.25)); // base
    out.push(cyl(poleX, 0, 0.34, 0, 3.9)); // poste con el forro de espuma
  }

  /* ── Mesa de anotadores (ver `buildScorerTable`). ─────────────────────── */
  out.push(box(SCORER_TABLE.x - 1.24, SCORER_TABLE.z - 0.46, SCORER_TABLE.x + 1.24, SCORER_TABLE.z + 0.46, 0, 1.1));

  /* ── Banquillo, cesta de balones y marcador de faltas (ver `buildBench`).
   * El banco arranca en z = 7,75 y la zona de la sección está en (0, 8,4): el
   * jugador se queda delante del banco, que es donde tiene que estar. ──────── */
  const zb = 7.75;
  out.push(box(-2.5, zb, 2.5, zb + 0.57, 0, 1.1));
  // La cesta de balones se recorta 5 cm por detrás a propósito: la bandeja real
  // llega a z = 8,55 y la valla empieza en 8,53, así que las dos cajas se
  // solapaban y el balón rebotaba entre las dos sin salir. Un solape entre
  // volúmenes es siempre un rebote infinito.
  out.push(box(2.9, zb - 0.2, 3.9, zb + 0.75, 0, 0.7)); // cesta de balones
  out.push(box(-3.43, zb + 0.33, -3.27, zb + 0.57, 0, 1.62)); // marcador de faltas

  /* ── Plató de entrevista (ver `buildInterviewSet`): las tres figuras. ────
   * El punto de la entrevista está en (9, 8,3) y el reportero en (9, 9,7): a
   * 1,4 m, así que se puede uno poner cara a cara con él sin atravesarlo. ──── */
  out.push(cyl(9.0, 9.7, 0.42, 0, 1.9)); // reportero
  out.push(cyl(11.0, 8.7, 0.75, 0, 1.8)); // cámara con trípode
  out.push(cyl(11.9, 8.7, 0.42, 0, 1.9)); // operador

  /* ── Graderío (ver `buildStands`): el primer peldaño es un muro de 55 cm.
   * Sólo hacen falta los lados largos: por los cortos el rectángulo de juego
   * (±16 m) ya se queda antes del anillo (±16,2 m). ─────────────────────── */
  const R0Z = COURT.halfW + 2.2;
  out.push(box(-20, -R0Z - 3.5, 20, -R0Z, 0, 0.6));
  out.push(box(-20, R0Z, 20, R0Z + 3.5, 0, 0.6));
  return out;
}

/** ¿La caja es un obstáculo para la altura dada? Los bordillos se suben. */
function blocks(b: Box, y0: number, y1: number): boolean {
  return b.y1 - b.y0 > BORDER && b.y0 < y1 && b.y1 > y0;
}

/**
 * Empuja un círculo (jugador) fuera de todos los obstáculos. Modifica `p` y
 * devuelve si ha habido contacto.
 *
 * Es una resolución POSICIONAL, no de velocidades: se llama después de mover y
 * deja al jugador apoyado en la cara. Con varios volúmenes a la vez (una esquina)
 * el bucle se repite unas pocas iteraciones, que es lo que hace que en una
 * esquina no se cuele por la mitad.
 */
export function resolveCircle(p: { x: number; z: number }, r: number, cols: Collider[], y0 = 0, y1 = PLAYER_HEIGHT): boolean {
  let hit = false;
  for (let iter = 0; iter < 3; iter++) {
    let moved = false;
    for (const c of cols) {
      if (c.y0 >= y1 || c.y1 <= y0) continue;
      if (c.kind === 'box' && !blocks(c, y0, y1)) continue;
      if (c.kind === 'box') {
        const qx = Math.min(Math.max(p.x, c.x0), c.x1);
        const qz = Math.min(Math.max(p.z, c.z0), c.z1);
        let dx = p.x - qx;
        let dz = p.z - qz;
        let d = Math.hypot(dx, dz);
        if (d >= r) continue;
        if (d < 1e-6) {
          // Centro DENTRO de la caja: se sale por la cara más cercana.
          const salidas = [
            { d: p.x - c.x0, x: -1, z: 0 },
            { d: c.x1 - p.x, x: 1, z: 0 },
            { d: p.z - c.z0, x: 0, z: -1 },
            { d: c.z1 - p.z, x: 0, z: 1 },
          ].sort((a, b) => a.d - b.d);
          const s = salidas[0]!;
          p.x += s.x * (s.d + r);
          p.z += s.z * (s.d + r);
          dx = 0;
          dz = 0;
          d = 0;
          moved = hit = true;
          continue;
        }
        const k = (r - d) / d;
        p.x += dx * k;
        p.z += dz * k;
        moved = hit = true;
      } else {
        let dx = p.x - c.x;
        let dz = p.z - c.z;
        let d = Math.hypot(dx, dz);
        if (d >= r + c.r) continue;
        if (d < 1e-6) {
          dx = 1;
          dz = 0;
          d = 1;
        }
        const need = r + c.r - d;
        p.x += (dx / d) * need;
        p.z += (dz / d) * need;
        moved = hit = true;
      }
    }
    if (!moved) break;
  }
  return hit;
}

/**
 * Rebote del balón contra los volúmenes.
 *
 * Se resuelve la penetración por el punto más cercano y se refleja la velocidad
 * con un coeficiente de restitución bajo (0,55): el balón de un partido pierde
 * mucha energía contra una valla, y así el rebote no se va a la otra punta de la
 * pista. La componente tangencial se conserva casi entera (0,94), que es lo que
 * hace que un balón que golpea de refilón siga de largo.
 */
export function bounceBall(
  pos: { x: number; y: number; z: number },
  vel: { x: number; y: number; z: number },
  r: number,
  cols: Collider[],
): boolean {
  let hit = false;
  // Dos pasadas: al salir empujado de un volumen el balón puede quedar dentro
  // de otro que lo toque (una esquina, la valla y la cesta de balones). Con una
  // sola pasada se queda rebotando entre los dos, que es lo que se veía.
  for (let pass = 0; pass < 2; pass++) if (bounceOnce(pos, vel, r, cols)) hit = true;
  return hit;
}

function bounceOnce(
  pos: { x: number; y: number; z: number },
  vel: { x: number; y: number; z: number },
  r: number,
  cols: Collider[],
): boolean {
  let hit = false;
  for (const c of cols) {
    if (c.y0 > pos.y + r || c.y1 < pos.y - r) continue;
    let nx = 0;
    let ny = 0;
    let nz = 0;
    let pen = 0;
    if (c.kind === 'box') {
      const qx = Math.min(Math.max(pos.x, c.x0), c.x1);
      const qy = Math.min(Math.max(pos.y, c.y0), c.y1);
      const qz = Math.min(Math.max(pos.z, c.z0), c.z1);
      let dx = pos.x - qx;
      let dy = pos.y - qy;
      let dz = pos.z - qz;
      const d = Math.hypot(dx, dy, dz);
      if (d >= r) continue;
      if (d < 1e-6) {
        // Centro dentro: normal por la cara más cercana.
        const cands = [
          { p: pos.x - c.x0, n: [-1, 0, 0] },
          { p: c.x1 - pos.x, n: [1, 0, 0] },
          { p: pos.y - c.y0, n: [0, -1, 0] },
          { p: c.y1 - pos.y, n: [0, 1, 0] },
          { p: pos.z - c.z0, n: [0, 0, -1] },
          { p: c.z1 - pos.z, n: [0, 0, 1] },
        ].sort((a, b) => a.p - b.p);
        const s = cands[0]!;
        nx = s.n[0]!;
        ny = s.n[1]!;
        nz = s.n[2]!;
        pen = s.p + r;
      } else {
        nx = dx / d;
        ny = dy / d;
        nz = dz / d;
        pen = r - d;
      }
    } else {
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      const d = Math.hypot(dx, dz);
      if (d >= r + c.r) continue;
      const k = d < 1e-6 ? 1 : d;
      nx = (d < 1e-6 ? 1 : dx / k);
      nz = (d < 1e-6 ? 0 : dz / k);
      ny = 0;
      pen = r + c.r - d;
    }
    pos.x += nx * pen;
    pos.y += ny * pen;
    pos.z += nz * pen;
    const vn = vel.x * nx + vel.y * ny + vel.z * nz;
    if (vn < 0) {
      const e = 0.55;
      vel.x -= (1 + e) * vn * nx;
      vel.y -= (1 + e) * vn * ny;
      vel.z -= (1 + e) * vn * nz;
      vel.x *= 0.94;
      vel.y *= 0.94;
      vel.z *= 0.94;
      hit = true;
    }
  }
  return hit;
}
