import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { animateHuman, buildHuman, poseCelebrate, poseShoot } from '../src/game/builders/human';

/** Opciones mínimas: el constructor no valida, así que basta lo obligatorio. */
const OPTS = {
  skin: 0xd9a066,
  hair: 0x2b1d12,
  jersey: 0x2f6fd0,
  shorts: 0xf2f2f2,
  shoes: 0xff5a1f,
} as const;

const HIP_Y = 9 * 2 * 0.0185; // C.hip * D * CHAR_VOXEL  (u(9), D=2)

/** Posición mundial de un nodo, con la matriz actualizada. */
function worldOf(node: THREE.Object3D): THREE.Vector3 {
  node.updateWorldMatrix(true, false);
  return new THREE.Vector3().setFromMatrixPosition(node.matrixWorld);
}

/**
 * Referencia geométrica ABSOLUTA: dónde cae cada pieza con el rig recién
 * construido, sin animar nada.
 *
 * Sirve como red de seguridad del re-parentado: al colgar torso, cabeza,
 * pantalón y brazos del pivote de inclinación, todo lo que hangs de él se
 * compensó restando la altura de la cadera. Si esa compensación está mal, los
 * números de aquí se mueven, y eso se ve sin necesidad de mirar una captura.
 */
describe('rig humano: geometria en reposo', () => {
  const rig = buildHuman(OPTS);

  it('la cabeza queda a 1,8 m: la altura del personaje no ha cambiado', () => {
    const head = worldOf(rig.root).y;
    expect(head).toBe(0);
    const box = new THREE.Box3().setFromObject(rig.root);
    expect(box.max.y).toBeCloseTo(1.809, 2);
    expect(head).toBe(0);
  });

  it('el pivote de inclinacion esta a la altura de la cintura', () => {
    expect(worldOf(rig.lean).y).toBeCloseTo(HIP_Y, 6);
  });

  it('la cabeza arranca muy por encima de la cintura', () => {
    // La barbilla esta a 0,74 m (la cabeza es el 59 % de los 1,809 m). Lo que
    // importa es que quede claramente por encima del pivote, no pegada a el.
    const headBox = new THREE.Box3().setFromObject(rig.root.getObjectByName('head')!);
    expect(headBox.min.y).toBeGreaterThan(HIP_Y + 0.3);
  });

  it('las piernas cuelgan del cuerpo, no del pivote de inclinacion', () => {
    // Si las piernas colgaran de `lean` se inclinarían con el torso, que es
    // justo lo que NO queremos: al inclinarse, las piernas se quedan verticales.
    expect(rig.lean.children).not.toContain(rig.legL);
    expect(rig.lean.children).not.toContain(rig.legR);
    expect(rig.root.getObjectByName('leg')).toBeTruthy();
  });

  it('torso, cabeza, pantalón y brazos si cuelgan del pivote', () => {
    for (const g of [rig.torso, rig.armL, rig.armR]) expect(rig.lean.children).toContain(g);
  });
});

describe('inclinacion al moverse', () => {
  it('quieto: el torso queda vertical', () => {
    const rig = buildHuman(OPTS);
    animateHuman(rig, 0, 0, false);
    expect(rig.lean.rotation.x).toBe(0);
  });

  it('corriendo: el torso se echa hacia delante', () => {
    const rig = buildHuman(OPTS);
    animateHuman(rig, 0, 1, false);
    expect(rig.lean.rotation.x).toBeGreaterThan(0.1);
    // ~8 grados: suficiente para notarlo, poco para posturear.
    expect((rig.lean.rotation.x * 180) / Math.PI).toBeLessThan(10);
  });

  it('es proporcional a la velocidad: medio paso = media inclinacion', () => {
    const full = buildHuman(OPTS);
    const half = buildHuman(OPTS);
    animateHuman(full, 0, 1, false);
    animateHuman(half, 0, 1 / 3, false); // s = min(1, 1/3 * 3) = 1... usa 0.1
    animateHuman(half, 0, 0.1, false); // s = 0.3
    expect(half.lean.rotation.x).toBeCloseTo(full.lean.rotation.x * 0.3, 6);
  });

  it('en el aire se atenua: no hay apoyo desde el que empujarse', () => {
    const ground = buildHuman(OPTS);
    const air = buildHuman(OPTS);
    animateHuman(ground, 0, 1, false, true);
    animateHuman(air, 0, 1, false, false);
    expect(air.lean.rotation.x).toBeLessThan(ground.lean.rotation.x);
    expect(air.lean.rotation.x).toBeGreaterThan(0);
  });

  it('la cabeza avanza con el torso: inclinacion, no torsión', () => {
    const quieto = buildHuman(OPTS);
    const andando = buildHuman(OPTS);
    animateHuman(quieto, 0, 0, false);
    animateHuman(andando, 0, 1, false);

    const antes = new THREE.Box3().setFromObject(quieto.root);
    const despues = new THREE.Box3().setFromObject(andando.root);
    // La cabeza se desplaza hacia delante (+Z local).
    expect(despues.max.z).toBeGreaterThan(antes.max.z);
    // Y la caja total NO baja: inclinarse no es agacharse.
    expect(despues.max.y).toBeGreaterThan(antes.max.y - 0.02);
  });

  it('las piernas NO se inclinan con el torso', () => {
    const quieto = buildHuman(OPTS);
    const andando = buildHuman(OPTS);
    animateHuman(quieto, 0, 0, false);
    animateHuman(andando, 0, 1, false);
    const p1 = worldOf(quieto.legL);
    const p2 = worldOf(andando.legL);
    expect(p2.y).toBeCloseTo(p1.y, 6);
    expect(p2.x).toBeCloseTo(p1.x, 6);
  });
});

describe('regresion: las poses existentes siguen mandando', () => {
  it('poseShoot sigue retiring el torso por su cuenta', () => {
    const rig = buildHuman(OPTS);
    animateHuman(rig, 0, 0, true);
    poseShoot(rig, 1);
    // poseShoot escribe torso.rotation.x, no lean.rotation.x: son pivotes
    // distintos, asi que compon en vez de pelearse.
    expect(rig.torso.rotation.x).toBeLessThan(0);
  });

  it('poseCelebrate no pisa la inclinacion', () => {
    const rig = buildHuman(OPTS);
    animateHuman(rig, 0, 1, false);
    const antes = rig.lean.rotation.x;
    poseCelebrate(rig, 0, 1);
    expect(rig.lean.rotation.x).toBe(antes);
  });

  it('el torso no se ha movido de sitio al colgarlo del pivote', () => {
    // Esta es la garantia clave del re-parentado: `lean` esta a +0,333 m y cada
    // pieza se cuelga a -0,333 m, de modo que la suma da cero. Si alguien
    // tocara una de las dos mitades, el torso entero se desplazaria y todas las
    // poses existentes se irian al garete.
    const rig = buildHuman(OPTS);
    const p = worldOf(rig.torso);
    expect(p.x).toBeCloseTo(0, 6);
    expect(p.y).toBeCloseTo(0, 6);
    expect(p.z).toBeCloseTo(0, 6);
  });
});
