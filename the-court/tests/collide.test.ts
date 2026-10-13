import { describe, expect, it } from 'vitest';
import { COURT, PLAYER, ZONES } from '../src/game/config';
import { PLAYER_HEIGHT, PLAYER_RADIUS, bounceBall, buildColliders, resolveCircle } from '../src/game/collide';

const COLS = buildColliders();

/** Caída (m) al punto más cercano de un volumen, para detectar penetraciones. */
function penetration(p: { x: number; z: number }): number {
  let worst = 0;
  for (const c of COLS) {
    if (c.kind === 'box') {
      const qx = Math.min(Math.max(p.x, c.x0), c.x1);
      const qz = Math.min(Math.max(p.z, c.z0), c.z1);
      const d = Math.hypot(p.x - qx, p.z - qz);
      if (d < PLAYER_RADIUS && c.y1 - c.y0 > 0.15) worst = Math.max(worst, PLAYER_RADIUS - d);
    } else {
      const d = Math.hypot(p.x - c.x, p.z - c.z);
      if (d < PLAYER_RADIUS + c.r) worst = Math.max(worst, PLAYER_RADIUS + c.r - d);
    }
  }
  return worst;
}

/**
 * Camina hacia un objetivo en pasos cortos, resolviendo la colisión en cada paso
 * (que es exactamente lo que hace el bucle del juego: mover y resolver).
 * Devuelve la distancia mínima conseguida al objetivo, para poder preguntar «¿se
 * puede llegar a la zona?» en vez de «¿se puede llegar al centímetro exacto?».
 */
function walkTo(target: [number, number], step = 0.06): { best: number; at: { x: number; z: number }; stuck: boolean } {
  const p = { x: 0, z: 0 };
  let best = Math.hypot(target[0], target[1]);
  let stuck = 0;
  for (let i = 0; i < 4000; i++) {
    const dx = target[0] - p.x;
    const dz = target[1] - p.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.05) break;
    p.x = Math.min(Math.max(p.x + (dx / d) * step, PLAYER.bounds.minX), PLAYER.bounds.maxX);
    p.z = Math.min(Math.max(p.z + (dz / d) * step, PLAYER.bounds.minZ), PLAYER.bounds.maxZ);
    const antes = { ...p };
    resolveCircle(p, PLAYER_RADIUS, COLS);
    if (Math.abs(p.x - antes.x) < 1e-6 && Math.abs(p.z - antes.z) < 1e-6) stuck++;
    else stuck = 0;
    best = Math.min(best, Math.hypot(target[0] - p.x, target[1] - p.z));
    if (stuck > 400) break;
  }
  return { best, at: p, stuck: stuck > 400 };
}

describe('colisiones del jugador', () => {
  it('no se puede atravesar la mesa de anotadores', () => {
    const { at } = walkTo([0, -9]);
    expect(at.z, `acabó en z=${at.z.toFixed(2)}`).toBeGreaterThan(-8.55);
    expect(penetration(at)).toBeLessThan(0.02);
  });

  it('no se puede atravesar el banquillo', () => {
    const { at } = walkTo([0, 8.4]);
    expect(at.z, `acabó en z=${at.z.toFixed(2)}`).toBeLessThan(7.75);
  });

  it('no se puede atravesar el poste de la canasta', () => {
    const { at } = walkTo([-16, 0]);
    expect(Math.abs(at.x)).toBeLessThan(COURT.halfL + 0.6 - 0.3);
  });

  it('no se puede atravesar a los actores del plató', () => {
    const { at } = walkTo([11.9, 8.7]);
    expect(Math.hypot(at.x - 11.9, at.z - 8.7)).toBeGreaterThan(0.6);
  });

  it('se desliza a lo largo de la valla en vez de quedarse clavado', () => {
    // En x = 4 hay valla de verdad (los huecos están delante del banquillo, la
    // mesa, el túnel y el plató).
    const p = { x: 4, z: 8.0 };
    // Empuja contra la valla (z = 8,65) en diagonal: la componente +X debe seguir.
    // Se dan 40 pasos y no más: en x = 6,2 empieza el hueco del plató, y entrar en
    // el hueco no es «atravesar la valla», es pasar por la puerta.
    for (let i = 0; i < 40; i++) {
      p.x += 0.05;
      p.z += 0.05;
      resolveCircle(p, PLAYER_RADIUS, COLS);
    }
    expect(p.x).toBeGreaterThan(5.9); // avanzó a lo largo de la valla
    expect(p.z).toBeLessThan(8.65 - PLAYER_RADIUS + 0.02); // y no la ha atravesado
  });

  it('las esquinas no dejan pasar por la mitad', () => {
    // Dos cajas en ángulo recto: el empujón de una mete al jugador en la otra.
    const L = [
      { kind: 'box' as const, x0: -1, z0: -1, x1: 0.1, z1: 0.1, y0: 0, y1: 1 },
      { kind: 'box' as const, x0: 0.1, z0: -1, x1: 1, z1: 0.1, y0: 0, y1: 1 },
    ];
    const p = { x: 0.05, z: 0.05 };
    resolveCircle(p, PLAYER_RADIUS, L);
    expect(p.z).toBeGreaterThan(0.1 + PLAYER_RADIUS - 1e-6);
    resolveCircle(p, PLAYER_RADIUS, L);
    expect(Math.max(Math.abs(p.x), Math.abs(p.z))).toBeGreaterThan(PLAYER_RADIUS - 1e-6);
  });

  it('arrancar dentro de un volumen no deja al jugador encerrado', () => {
    const p = { x: 0, z: 8.0 }; // dentro del banquillo
    resolveCircle(p, PLAYER_RADIUS, COLS);
    resolveCircle(p, PLAYER_RADIUS, COLS);
    expect(penetration(p)).toBeLessThan(0.02);
  });

  it('los bordillos de menos de 15 cm se suben andando', () => {
    const p = { x: 0, z: 0 };
    resolveCircle(p, PLAYER_RADIUS, [{ kind: 'box', x0: -0.5, z0: -0.5, x1: 0.5, z1: 0.5, y0: 0, y1: 0.12 }], 0, PLAYER_HEIGHT);
    expect(p.x).toBe(0);
    expect(p.z).toBe(0);
  });
});

describe('las seis zonas siguen alcanzables', () => {
  for (const z of ZONES) {
    it(`${z.id} (${z.x}, ${z.z}) r=${z.radius}`, () => {
      const { best, at } = walkTo([z.x, z.z]);
      expect(best, `se quedó a ${best.toFixed(2)} m, en (${at.x.toFixed(2)}, ${at.z.toFixed(2)})`).toBeLessThan(z.radius);
    });
  }
});

describe('colisiones del balón', () => {
  const r = 0.2;

  /** ¿El centro del balón ha quedado dentro de algún volumen? */
  const dentroDeAlguno = (p: { x: number; y: number; z: number }, radio: number): boolean => {
    for (const c of COLS) {
      if (c.kind === 'box') {
        if (p.x > c.x0 + 1e-6 && p.x < c.x1 - 1e-6 && p.y > c.y0 + 1e-6 && p.y < c.y1 - 1e-6 && p.z > c.z0 + 1e-6 && p.z < c.z1 - 1e-6) return true;
      } else if (Math.hypot(p.x - c.x, p.z - c.z) < c.r - 1e-6 && p.y > c.y0 && p.y < c.y1) {
        return true;
      }
    }
    void radio;
    return false;
  };

  it('rebota en la valla, no la atraviesa y nunca se queda dentro de un volumen', () => {
    // x = 4 está delante de un tramo de valla, no de un hueco.
    const pos = { x: 4, y: r, z: 6 };
    const vel = { x: 0, y: 0, z: 9 };
    let dentro = 0;
    let rebotes = 0;
    for (let i = 0; i < 400; i++) {
      pos.x += vel.x * 0.008;
      pos.y += vel.y * 0.008;
      pos.z += vel.z * 0.008;
      if (bounceBall(pos, vel, r, COLS)) rebotes++;
      if (dentroDeAlguno(pos, r)) dentro++;
    }
    expect(rebotes).toBeGreaterThan(0);
    expect(dentro, `dentro en ${dentro} fotogramas`).toBe(0);
    // El balón se va deslizando a lo largo de la valla y sale por el hueco del
    // plató, que empieza en x = 6,2: lo que no puede es atravesar un tramo.
    if (pos.x < 6.2) expect(pos.z).toBeLessThan(8.53);
  });

  it('atraviesa el hueco de la mesa y muere en la mesa', () => {
    // El hueco de las vallas delante de la mesa es lo que hace que el tiro desde
    // media pista no rebote en la valla: el balón tiene que pasar y frenarse con
    // la mesa, no pararse antes.
    const pos = { x: 0, y: r, z: -4 };
    const vel = { x: 0, y: 1.2, z: -7 };
    for (let i = 0; i < 500; i++) {
      pos.x += vel.x * 0.008;
      pos.y += vel.y * 0.008;
      pos.z += vel.z * 0.008;
      vel.y -= 9.81 * 0.008;
      if (pos.y < r) {
        pos.y = r;
        vel.y = 0;
      }
      bounceBall(pos, vel, r, COLS);
    }
    expect(pos.z).toBeGreaterThan(-9.5);
    expect(pos.y).toBeGreaterThan(r - 1e-6);
  });

  it('un balón que roza el banquillo sale empujado y con la velocidad invertida', () => {
    const pos = { x: 0, y: r, z: 7.6 }; // rozando la cara delantera del banco
    const vel = { x: 0, y: 0, z: 2 };
    expect(bounceBall(pos, vel, r, COLS)).toBe(true);
    expect(pos.z).toBeLessThan(7.75);
    expect(vel.z).toBeLessThan(0);
  });
});
