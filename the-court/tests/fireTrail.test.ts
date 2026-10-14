import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { FireTrail } from '../src/game/fireTrail';

/*
 * CONTRATO DE LA ESTELA DEL TAKEOVER (lote A, T3)
 * ---------------------------------------------------------------------------
 * La estela no se puede probar «a ojo» desde un test —es una nube de puntos que
 * dibuja la GPU—, pero sí se pueden fijar las cuatro cosas que la hacen
 * aceptable en este proyecto, y son las que se rompen al tocar el archivo por
 * primera vez:
 *
 *   1. **No proyecta sombra.** El mapa de sombras se hornea UNA vez
 *      (`shadowMap.autoUpdate = false`): si un objeto que se mueve proyectara,
 *      dejaría su silueta clavada en el sitio donde estaba al hornear.
 *   2. **Nace apagada y no se enciende sola.** Con el balón en la mano no debe
 *      dibujar nada: el fuego se enciende cuando el juego lo dice.
 *   3. **Es UNA llamada de dibujo**: el `drawRange` es constante y no se
 *      escribe geometría nueva, sólo posiciones y colores de un búfer fijo.
 *   4. **Se apaga sola** cuando se le corta la intensidad: sin esto, al fallar
 *      la canasta el fuego se quedaría encendido para siempre.
 * ---------------------------------------------------------------------------
 */

/** Frames de 60 fps hasta superar la vida de un punto (0,45 s). */
const APAGADO_FRAMES = 40;

/** Recorre la estela con el balón en movimiento y devuelve el color máximo. */
function encenderYAvanzar(fuego: FireTrail, frames = 30): number {
  fuego.setIntensity(1);
  const centro = new THREE.Vector3(0, 0.2, 0);
  let max = 0;
  for (let i = 0; i < frames; i++) {
    centro.x = i * 0.25; // el balón vuela: 15 m/s a 60 fps
    fuego.update(1 / 60, centro, 15);
    const col = fuego.object.geometry.getAttribute('color') as THREE.BufferAttribute;
    for (let v = 0; v < col.count * 3; v++) max = Math.max(max, col.array[v] as number);
  }
  return max;
}

function coloresVivos(fuego: FireTrail): number {
  const col = fuego.object.geometry.getAttribute('color') as THREE.BufferAttribute;
  let vivos = 0;
  for (let i = 0; i < col.count; i++) {
    if ((col.array[i * 3] as number) > 0.001) vivos++;
  }
  return vivos;
}

describe('estela del Takeover: invariantes de coste y sombras', () => {
  it('no proyecta sombra y no participa en el mapa horneado', () => {
    const fuego = new FireTrail();
    expect(fuego.object.castShadow).toBe(false);
    expect(fuego.object.receiveShadow).toBe(false);
  });

  it('es aditiva, sin escritura de profundidad y sin niebla', () => {
    // Es lo que la hace barata: se suma a lo que hay detrás y no ordena
    // transparencias. Con `depthWrite` la llama taparía el balón.
    const fuego = new FireTrail();
    const mat = fuego.object.material as THREE.PointsMaterial;
    expect(mat.blending).toBe(THREE.AdditiveBlending);
    expect(mat.depthWrite).toBe(false);
    expect(mat.fog).toBe(false);
    expect(mat.vertexColors).toBe(true);
  });

  it('el búfer es fijo: UNA sola llamada de dibujo con N puntos', () => {
    // El rango de dibujo no cambia nunca, así que el número de vértices
    // enviados es constante aunque la estela esté vacía: no hay recomposición
    // de búfer ni llamadas extra por punto.
    const fuego = new FireTrail();
    const geo = fuego.object.geometry;
    const rango = geo.drawRange;
    const total = (geo.getAttribute('position') as THREE.BufferAttribute).count;
    expect(total).toBeGreaterThan(8);
    expect(rango.start).toBe(0);
    expect(rango.count).toBe(total);
  });

  it('nace apagada y no se dibuja hasta que el juego la enciende', () => {
    const fuego = new FireTrail();
    expect(fuego.object.visible).toBe(false);
    expect(fuego.on).toBe(false);
  });
});

describe('estela del Takeover: encendido, apagado y balón quieto', () => {
  it('con el balón QUIETO no se escribe ni un punto (no es una luz pegada al jugador)', () => {
    // Regatear en el sitio con el fuego encendido acumularía muestras en el
    // mismo punto y el efecto pasaría de estela a foco. La clase lo evita por
    // velocidad, no por estado: por debajo de la velocidad mínima no muestrea.
    const fuego = new FireTrail();
    fuego.setIntensity(1);
    const quieto = new THREE.Vector3(1, 0.2, 2);
    for (let i = 0; i < 30; i++) fuego.update(1 / 60, quieto, 0.1);
    expect(coloresVivos(fuego)).toBe(0);
  });

  it('encendida y con el balón en movimiento, la cola se enciende', () => {
    const fuego = new FireTrail();
    const max = encenderYAvanzar(fuego);
    expect(fuego.on).toBe(true);
    expect(fuego.object.visible).toBe(true);
    expect(max).toBeGreaterThan(0.5);
    expect(coloresVivos(fuego)).toBeGreaterThan(10);
  });

  it('al cortarle la intensidad se apaga SOLA (y deja de dibujarse)', () => {
    const fuego = new FireTrail();
    encenderYAvanzar(fuego);
    fuego.setIntensity(0);
    // La cola ya escrita se consume: primero sigue visible y envejeciendo...
    fuego.update(1 / 60, new THREE.Vector3(6, 0.2, 0), 15);
    for (let i = 0; i < APAGADO_FRAMES; i++) fuego.update(1 / 60, new THREE.Vector3(6, 0.2, 0), 15);
    expect(coloresVivos(fuego)).toBe(0);
    // ...y al final el objeto se esconde: apagado no cuesta ni una llamada.
    expect(fuego.object.visible).toBe(false);
  });

  it('dispose() suelta geometría y material sin lanzar', () => {
    const fuego = new FireTrail();
    encenderYAvanzar(fuego);
    expect(() => fuego.dispose()).not.toThrow();
  });
});
