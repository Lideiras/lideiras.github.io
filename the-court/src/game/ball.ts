import * as THREE from 'three';
import { BALL, G, RIM, SCORE_RADIUS, boardX, rimX, type Side } from './config';

export interface BallEvents {
  score?: (side: Side) => void;
  rim?: () => void;
  board?: () => void;
  bounce?: (impactSpeed: number) => void;
}

const SIDES: Side[] = [-1, 1];

export class Ball {
  readonly pos = new THREE.Vector3();
  readonly vel = new THREE.Vector3();
  state: 'held' | 'flying' = 'held';
  scored = false;
  private resting = 0;
  private age = 0;
  private readonly prev = new THREE.Vector3();

  constructor(readonly object: THREE.Object3D, private readonly ev: BallEvents = {}) {}

  launch(from: THREE.Vector3, vel: THREE.Vector3): void {
    this.pos.copy(from);
    this.vel.copy(vel);
    this.state = 'flying';
    this.scored = false;
    this.resting = 0;
    this.age = 0;
    this.object.position.copy(this.pos);
  }

  get settled(): boolean {
    return this.state === 'flying' && (this.age > 8 || this.resting > 0.8);
  }

  step(dt: number): void {
    if (this.state !== 'flying') return;
    const n = Math.max(1, Math.ceil(dt / (1 / 120)));
    const h = dt / n;
    for (let i = 0; i < n; i++) this.integrate(h);
    this.age += dt;
    this.object.position.copy(this.pos);
    this.object.rotation.x += this.vel.z * dt * 3;
    this.object.rotation.z -= this.vel.x * dt * 3;
  }

  private integrate(dt: number): void {
    const { pos, vel, prev } = this;
    prev.copy(pos);

    // Gravedad exacta (aceleración constante)
    pos.addScaledVector(vel, dt);
    pos.y -= 0.5 * G * dt * dt;
    vel.y -= G * dt;

    // Suelo
    if (pos.y < BALL.radius && vel.y < 0) {
      const impact = -vel.y;
      pos.y = BALL.radius;
      vel.y = impact * 0.62;
      vel.x *= 0.92;
      vel.z *= 0.92;
      if (impact > 1.2) this.ev.bounce?.(impact);
      if (vel.y < 0.8) vel.y = 0;
    }
    if (pos.y <= BALL.radius + 1e-3 && vel.y === 0) {
      const f = Math.max(0, 1 - 2.2 * dt);
      vel.x *= f;
      vel.z *= f;
      this.resting = Math.hypot(vel.x, vel.z) < 0.4 ? this.resting + dt : 0;
    } else {
      this.resting = 0;
    }

    for (const s of SIDES) {
      // Tablero (plano x = boardX, rectángulo 1.8 x 1.05 m)
      const bx = boardX(s);
      if ((prev.x - bx) * (pos.x - bx) < 0 && Math.abs(pos.z) < 0.9 && pos.y > 2.9 && pos.y < 3.95) {
        const dir = Math.sign(prev.x - bx);
        pos.x = bx + dir * (BALL.radius + 0.026);
        vel.x = -vel.x * 0.55;
        this.ev.board?.();
      }

      // Aro (plano y = RIM.y, solo cruzando hacia abajo)
      if (prev.y > RIM.y && pos.y <= RIM.y && vel.y < 0) {
        const k = (prev.y - RIM.y) / (prev.y - pos.y);
        const cx = prev.x + (pos.x - prev.x) * k;
        const cz = prev.z + (pos.z - prev.z) * k;
        const dx = cx - rimX(s);
        const dz = cz;
        const dist = Math.hypot(dx, dz);
        if (dist <= SCORE_RADIUS) {
          if (!this.scored) {
            this.scored = true;
            this.ev.score?.(s);
          }
          vel.x *= 0.35;
          vel.z *= 0.35;
          vel.y *= 0.7;
        } else if (dist <= RIM.radius + BALL.radius + 0.06) {
          const nx = dx / (dist || 1);
          const nz = dz / (dist || 1);
          vel.set(nx * 1.8 + vel.x * 0.2, 2.8, nz * 1.8 + vel.z * 0.2);
          pos.y = RIM.y + 0.02;
          this.ev.rim?.();
        }
      }
    }
  }
}
