import { describe, expect, it } from 'vitest';
import {
  CAMERA,
  INTERVIEW,
  SECTION_CAMERA,
  SECTION_IDS,
  ZONES,
} from '../src/game/config';

const zoneOf = (id: string) => ZONES.find((z) => z.id === id)!;
const d3 = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe('encuadre de seccion', () => {
  it('las seis secciones tienen plano propio', () => {
    for (const id of SECTION_IDS) expect(SECTION_CAMERA[id]).toBeDefined();
  });

  it('ninguna se queda en el plano de juego, que esta a 12 m de altura', () => {
    // Este es el fallo que se corrigio: sin encuadre propio, la seccion se
    // abria con la camara de juego a 12,4 m mirando a la nada.
    for (const id of SECTION_IDS) {
      expect(SECTION_CAMERA[id].pos[1]).toBeLessThan(CAMERA.offset[1] * 0.3);
      expect(SECTION_CAMERA[id].pos[1]).toBeGreaterThan(1.4);
    }
  });

  it('la camara esta a una distancia de persona de la seccion', () => {
    for (const id of SECTION_IDS) {
      const d = d3(SECTION_CAMERA[id].pos, [zoneOf(id).x, 1.5, zoneOf(id).z]);
      // La entrevista se queda en 3,7 m a proposito: es un plano corto de
      // cara a cara con el reportero, no un plano de conjunto.
      expect(d, `${id} a ${d.toFixed(1)} m`).toBeGreaterThan(id === 'contact' ? 3.4 : 4.2);
      expect(d, `${id} a ${d.toFixed(1)} m`).toBeLessThan(11);
    }
  });

  it('mira a la seccion, no al cielo ni al suelo', () => {
    for (const id of SECTION_IDS) {
      const look = SECTION_CAMERA[id].look;
      const z = zoneOf(id);
      const flat = Math.hypot(look[0] - z.x, look[2] - z.z);
      expect(flat, `${id} apunta a ${flat.toFixed(1)} m del centro`).toBeLessThan(2.2);
      // Altura de mirada: donde esta el atrezo (mesa, banquillo, tableros).
      expect(look[1], `${id} mira a ${look[1]} m`).toBeGreaterThan(0.9);
      expect(look[1], `${id} mira a ${look[1]} m`).toBeLessThan(3.2);
    }
  });

  it('la camara queda entre el centro de pista y la seccion', () => {
    // Si se colocara al otro lado, el jugador y el atrezo quedarian a la espalda
    // de la camara y el plano framaria el vacio.
    for (const id of SECTION_IDS) {
      const z = zoneOf(id);
      const pos = SECTION_CAMERA[id].pos;
      const len = Math.hypot(z.x, z.z) || 1;
      const outward = (v: readonly number[]) => (v[0] * z.x + v[2] * z.z) / len;
      expect(outward(pos), `${id} se sale de la seccion`).toBeLessThan(
        outward([z.x, 0, z.z]),
      );
    }
  });

  it('el jugador mira a su seccion, de espaldas a la camara', () => {
    // Excepción: la entrevista es un cara a cara. El jugador mira al
    // reportero de frente y la cámara se queda a su lado, así que el "de
    // espaldas a la cámara" no aplica y hasta sería falso.
    for (const id of SECTION_IDS.filter((s) => s !== 'contact')) {
      const face = SECTION_CAMERA[id].face;
      const [px, , pz] = SECTION_CAMERA[id].pos;
      const [lx, , lz] = SECTION_CAMERA[id].look;
      // Direccion camara -> seccion: es a donde debe mirar el personaje.
      const dx = lx - px;
      const dz = lz - pz;
      const len = Math.hypot(dx, dz) || 1;
      // Con rotY = 0 el personaje mira a +Z: adelante = (sin, 0, cos).
      const dot = (Math.sin(face) * dx + Math.cos(face) * dz) / len;
      expect(dot, `${id} mira al lado contrario (dot=${dot.toFixed(2)})`).toBeGreaterThan(0.85);
    }
  });

  it('la entrevista conserva exactamente su encuadre original', () => {
    expect(SECTION_CAMERA.contact.pos).toEqual(INTERVIEW.cameraPos);
    expect(SECTION_CAMERA.contact.look).toEqual(INTERVIEW.cameraLook);
    expect(SECTION_CAMERA.contact.face).toBe(0);
  });

  it('los dos aros son simétricos, para que no cante el desequilibrio', () => {
    // La relación es una ROTACIÓN de 180° alrededor del eje vertical, la que
    // lleva la canasta izquierda a la derecha, no un reflejo: por eso el
    // desplazamiento en z tiene signo opuesto en las dos y el yaw se suma pi en
    // vez de negarse.
    const p = SECTION_CAMERA.projects;
    const s = SECTION_CAMERA.stats;
    expect(s.pos[0]).toBeCloseTo(-p.pos[0], 6);
    expect(s.pos[1]).toBeCloseTo(p.pos[1], 6);
    expect(s.pos[2]).toBeCloseTo(-p.pos[2], 6);
    expect(s.look[0]).toBeCloseTo(-p.look[0], 6);
    expect(s.look[1]).toBeCloseTo(p.look[1], 6);
    const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
    expect(wrap(s.face - p.face)).toBeCloseTo(Math.PI, 6);
  });
});
