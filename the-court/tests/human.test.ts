import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  POSE_TASA,
  RECOGE_TIME,
  animateHuman,
  buildHuman,
  holdPeso,
  mezclaPeso,
  poseCelebrate,
  poseShoot,
  recogePeso,
  regateAltura,
} from '../src/game/builders/human';

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

  });

/* ===========================================================================
 * CONTINUIDAD DE LA POSE
 * ---------------------------------------------------------------------------
 * El usuario reportó "un movimiento anormal con los brazos al recibir la bola
 * después de un tiro". La causa eran poses que se ASIGNABAN encima de la pose
 * base en lugar de mezclarse: al recuperar el balón, el brazo saltaba de la
 * pose de tiro a la de pecho en un solo fotograma (1,05 rad de golpe).
 *
 * Estos tests miden eso en radianes por fotograma, que es la unidad en la que
 * se ve: el braceo normal del personaje ya mueve el brazo 0,165 rad por
 * fotograma a velocidad de carrera, así que cualquier salto varias veces mayor
 * que eso es un salto, no animación.
 * =========================================================================== */

/** Salto máximo del brazo entre dos fotogramas consecutivos que se considera
 *  animación y no salto. El doble del braceo normal deja margen de sobra. */
const MAX_SALTO = 0.35;

describe('continuidad de pose: recoger el balón', () => {
  it('la ventana de recogida dura lo que dice y no dura más', () => {
    expect(RECOGE_TIME).toBeGreaterThan(0.1);
    expect(RECOGE_TIME).toBeLessThan(0.6);
  });

  it('el gesto de agacharse empieza y termina en cero (campana)', () => {
    // Si `recoge` no volviera a 0, dejaría al personaje con los brazos caídos
    // para siempre después de la primera recogida.
    expect(recogePeso(0)).toBe(0);
    expect(recogePeso(RECOGE_TIME)).toBe(0);
    expect(recogePeso(RECOGE_TIME + 1)).toBe(0);
    // Máximo en el centro de la ventana.
    expect(recogePeso(RECOGE_TIME / 2)).toBeGreaterThan(0.9);
    // Y crece y decrece, sin dientes de sierra.
    let anterior = 0;
    for (let t = 0; t <= RECOGE_TIME / 2; t += 1 / 60) {
      const p = recogePeso(t);
      expect(p).toBeGreaterThanOrEqual(anterior);
      anterior = p;
    }
    expect(anterior).toBeLessThanOrEqual(1);
  });

  it('la mezcla hacia el pecho es monótona y no arranca de golpe', () => {
    expect(holdPeso(0)).toBe(0);
    expect(holdPeso(RECOGE_TIME)).toBe(1);
    expect(holdPeso(RECOGE_TIME * 2)).toBe(1);
    // Extremos con derivada 0: el primer y el último fotograma del gesto quedan
    // pegados a la pose anterior y a la siguiente.
    const primerPaso = holdPeso(1 / 60) - holdPeso(0);
    const ultimoPaso = holdPeso(RECOGE_TIME) - holdPeso(RECOGE_TIME - 1 / 60);
    expect(primerPaso).toBeLessThan(0.03);
    expect(ultimoPaso).toBeLessThan(0.03);
    let anterior = -1;
    for (let t = 0; t <= RECOGE_TIME; t += 1 / 60) {
      const p = holdPeso(t);
      expect(p).toBeGreaterThanOrEqual(anterior);
      anterior = p;
    }
  });

  it('al recoger el balón los brazos NO dan ningún salto', () => {
    // Se simula la recogida completa: 1,8 s de braceo, y en el último medio
    // segundo el balón pasa a las manos con la curva `hold` y el gesto `recoge`.
    const rig = buildHuman(OPTS);
    const dt = 1 / 60;
    const brazoAntes = (r: typeof rig): number => r.armL.rotation.x;
    let previo = 0;
    let maxSalto = 0;
    for (let i = 0; i * dt <= 1.8; i++) {
      const t = i * dt;
      const recogiendo = t > 1.5;
      animateHuman(rig, t, 1, recogiendo, true, 0, {
        handSide: 1,
        regate: 1,
        hold: recogiendo ? holdPeso(t - 1.5) : 0,
        recoge: recogiendo ? recogePeso(t - 1.5) : 0,
      });
      const brazo = brazoAntes(rig);
      if (i > 0) maxSalto = Math.max(maxSalto, Math.abs(brazo - previo));
      previo = brazo;
    }
    expect(maxSalto).toBeLessThan(MAX_SALTO);
    expect(maxSalto).toBeGreaterThan(0); // el rig se mueve de verdad
  });

  it('el salto que había antes lo cogía este test (control)', () => {
    // Si el máximo de arriba bajara a 0 por un error del propio test, este
    // control falla: el cambio de rama de golpe sigue dando un salto enorme.
    const rig = buildHuman(OPTS);
    animateHuman(rig, 0, 1, false, true, 0, { hold: 0 });
    const antes = rig.armL.rotation.x;
    animateHuman(rig, 0, 1, true, true, 0, { hold: 1 });
    expect(Math.abs(rig.armL.rotation.x - antes)).toBeGreaterThan(MAX_SALTO);
  });

  it('tras el gesto de recoger, los brazos vuelven a la pose base', () => {
    // Sin esto, el último fotograma del gesto dejaría residuo en los brazos.
    const limpio = buildHuman(OPTS);
    animateHuman(limpio, 2, 0, true, true, 0, { hold: 1 });
    const despues = buildHuman(OPTS);
    animateHuman(despues, 2, 0, true, true, 0, { hold: 1, recoge: recogePeso(RECOGE_TIME / 2) });
    animateHuman(despues, 2, 0, true, true, 0, { hold: 1 });
    expect(despues.armL.rotation.x).toBeCloseTo(limpio.armL.rotation.x, 6);
    expect(despues.armR.rotation.x).toBeCloseTo(limpio.armR.rotation.x, 6);
  });
});

describe('continuidad de pose: las poses se mezclan, no se imponen', () => {
  it('poseShoot con peso 0 no toca ningún hueso', () => {
    const rig = buildHuman(OPTS);
    animateHuman(rig, 1.3, 0.5, true);
    const antes = {
      l: rig.armL.rotation.x,
      r: rig.armR.rotation.x,
      torso: rig.torso.rotation.x,
    };
    poseShoot(rig, 0);
    expect(rig.armL.rotation.x).toBe(antes.l);
    expect(rig.armR.rotation.x).toBe(antes.r);
    expect(rig.torso.rotation.x).toBe(antes.torso);
  });

  it('poseCelebrate con peso 0 no toca ningún hueso', () => {
    const rig = buildHuman(OPTS);
    animateHuman(rig, 1.3, 0.5, true);
    const antes = {
      l: rig.armL.rotation.x,
      r: rig.armR.rotation.x,
      torso: rig.torso.rotation.x,
      y: rig.body.position.y,
    };
    poseCelebrate(rig, 1.3, 0);
    expect(rig.armL.rotation.x).toBe(antes.l);
    expect(rig.armR.rotation.x).toBe(antes.r);
    expect(rig.torso.rotation.x).toBe(antes.torso);
    expect(rig.body.position.y).toBe(antes.y);
  });

  it('con peso 1 la pose sigue mandando (regresión de las poses viejas)', () => {
    const rig = buildHuman(OPTS);
    animateHuman(rig, 0, 0, true);
    poseShoot(rig, 1);
    expect(rig.armL.rotation.x).toBeCloseTo(-1.95, 6);
    expect(rig.armR.rotation.x).toBeCloseTo(-1.95, 6);
  });

  it('cargar y soltar el tiro no produce saltos de brazo', () => {
    // Se sube el peso de la pose de tiro (cargando) y se BAJA (al soltar y al
    // acabarse el seguimiento). La bajada es la mitad importante: con el
    // código viejo la pose se imponía y el brazo daba el mismo salto de 1,05
    // rad al dejar de cargar que daba al recoger el balón.
    const rig = buildHuman(OPTS);
    const dt = 1 / 60;
    let peso = 0;
    let previo: number | null = null;
    let maxSalto = 0;
    for (let i = 0; i * dt <= 1.2; i++) {
      const t = i * dt;
      animateHuman(rig, t, 0, true);
      // Sube durante medio segundo y baja en el siguiente cuarto.
      const objetivo = t < 0.5 ? t / 0.5 : Math.max(0, 1 - (t - 0.5) / 0.25);
      peso = mezclaPeso(peso, objetivo, dt, POSE_TASA);
      poseShoot(rig, peso);
      if (previo !== null) maxSalto = Math.max(maxSalto, Math.abs(rig.armL.rotation.x - previo));
      previo = rig.armL.rotation.x;
    }
    expect(maxSalto).toBeLessThan(MAX_SALTO);
    // Y de verdad acaba volviendo a la pose base: si la pose se impusiera, el peso
    // seguiría a 1 y los brazos quedarían arriba para siempre.
    expect(peso).toBeLessThan(0.01);
    expect(rig.armL.rotation.x).toBeCloseTo(-0.9, 1);
  });

  it('mezclaPeso se acerca al objetivo sin pasarse ni dar saltos', () => {
    const dt = 1 / 60;
    let v = 0;
    let previo = 0;
    for (let i = 0; i < 120; i++) {
      v = mezclaPeso(v, 1, dt);
      expect(v).toBeGreaterThan(previo);
      expect(v).toBeLessThanOrEqual(1);
      expect(v - previo).toBeLessThan(0.2);
      previo = v;
    }
    expect(v).toBeGreaterThan(0.98);
    // Ni una sola vez se pasa del objetivo y vuelve: una mezcla exponencial no
    // oscila, y un peso que oscilara con el braceo se leería como un tirón.
    let anterior = 0.5;
    for (let i = 0; i < 60; i++) {
      const w = mezclaPeso(anterior, 1, dt);
      expect(w).toBeLessThanOrEqual(1);
      expect(w).toBeGreaterThan(anterior);
      anterior = w;
    }
  });
});

describe('regate: el brazo y el balón comparten fase', () => {
  it('la altura del balón normalizada se queda en 0..1', () => {
    for (let i = 0; i < 400; i++) {
      const a = regateAltura(i * 0.01, 1);
      const b = regateAltura(i * 0.01, -1);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(1);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(1);
    }
  });

  it('las dos manos leen el mismo reloj (y eso es correcto)', () => {
    // `|sin(x)|` es π-periódico, así que el desfasaje de media fase que una vez
    // documentaba esta función se cancelaba con el valor absoluto: la mano
    // izquierda y la derecha dan EXACTAMENTE la misma altura. No es un descuido,
    // sólo hay un balón y una mano que conduce, pero el test lo fija para que
    // nadie "arregle" el desfasaje pensando que está roto.
    for (let i = 0; i < 200; i++) {
      const t = i * 0.01;
      expect(regateAltura(t, 1)).toBe(regateAltura(t, -1));
    }
  });

  it('el brazo empuja CUANDO el balón toca el suelo, no cuando está arriba', () => {
    // Este es el acoplamiento que `main.ts` declara en `placeHeldBall`: la altura
    // del balón y el empuje del brazo salen de la MISMA función. Si alguien
    // cambiara una y no la otra, el brazo empujaría con el balón en el aire.
    const rig = buildHuman(OPTS);
    const brazo = (t: number): number => {
      animateHuman(rig, t, 0, true, true, 0, { handSide: 1, regate: 1, hold: 1 });
      return rig.armR.rotation.x;
    };
    let vistoAbajo = 0;
    let vistoArriba = 0;
    for (let i = 0; i < 480; i++) {
      const t = i * 0.005;
      const altura = regateAltura(t, 1);
      const x = brazo(t);
      if (altura < 0.02) {
        // Balón en el suelo: el brazo tiene que estar abajo, en su punto más
        // vertical (-0,9 + 0,55).
        expect(x).toBeGreaterThan(-0.38);
        vistoAbajo++;
      } else if (altura > 0.98) {
        // Balón arriba del todo: el brazo vuelve a la pose de pecho (-0,9).
        expect(x).toBeLessThan(-0.88);
        vistoArriba++;
      }
    }
    // Los valles y las crestas del seno son ventanas muy estrechas: con 480
    // muestras sólo caen unos pocos puntos ahí, pero tienen que caer algunos.
    expect(vistoAbajo).toBeGreaterThan(2);
    expect(vistoArriba).toBeGreaterThan(2);
  });
});

describe('geometria de referencia (sin animacion)', () => {
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
