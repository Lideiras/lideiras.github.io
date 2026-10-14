import { describe, expect, it } from 'vitest';
import { CEDE_MS, comentar, nuevoComentarista, type Suceso } from '../src/game/commentary';

/*
 * El comentarista se puede comprobar sin navegador porque no toca ni el DOM ni el
 * mundo: le llega lo que pasa y devuelve la frase ya montada. Lo que se prueba
 * aquí son las dos cosas que se rompen calladas: que cada suceso diga lo suyo
 * (con sus cifras dentro) y que el reparto de sitio no deje una frase pegada ni
 * se lleve por delante un dato que el jugador necesita para el tiro siguiente.
 */

/** Un instante cualquiera: lo que importa en estas pruebas son las diferencias. */
const T0 = 1000;

const carro: Suceso = { tipo: 'carro', carro: 2, total: 5 };
const fallo: Suceso = { tipo: 'fallo' };
const final = (record: boolean): Suceso => ({ tipo: 'final', puntos: 9, aciertos: 9, tiros: 15, record });

describe('comentarista: qué se cuenta', () => {
  it('el carro nuevo sale con su número y con el total', () => {
    const f = comentar(nuevoComentarista(), carro, T0)!;
    expect(f.texto).toContain('2');
    expect(f.texto).toContain('5');
  });

  it('la canasta lleva lo que suma y el marcador con el que se queda', () => {
    const f = comentar(nuevoComentarista(), { tipo: 'canasta', suma: 1, puntos: 6, dinero: false, racha: 1 }, T0)!;
    expect(f.texto).toContain('6');
  });

  it('la bola del dinero manda sobre la racha: no se pierde su frase', () => {
    // Una canasta puede ser de dinero Y subir la racha a la vez. Se cuenta el
    // dinero (una vez por carro) y no la racha, que se puede cantar en el tiro
    // siguiente; y como la frase del dinero NO lleva la racha, que aparezca el
    // marcador prueba cuál de las dos salió.
    const f = comentar(nuevoComentarista(), { tipo: 'canasta', suma: 2, puntos: 6, dinero: true, racha: 5 }, T0)!;
    expect(f.texto).toContain('6');
    expect(f.texto).not.toContain('5');
  });

  it('una racha encendida (tres o más) canta las seguidas y pesa más', () => {
    const suave = comentar(nuevoComentarista(), { tipo: 'canasta', suma: 1, puntos: 2, dinero: false, racha: 2 }, T0)!;
    const viva = comentar(nuevoComentarista(), { tipo: 'canasta', suma: 1, puntos: 3, dinero: false, racha: 3 }, T0)!;
    expect(viva.texto).toContain('3');
    expect(viva.peso).toBeGreaterThan(suave.peso);
  });

  it('el marcador final lleva los puntos y los tiros, y con récord es otra frase', () => {
    const normal = comentar(nuevoComentarista(), final(false), T0)!;
    const record = comentar(nuevoComentarista(), final(true), T0)!;
    expect(normal.texto).toContain('9');
    expect(normal.texto).toContain('15');
    expect(record.texto).not.toBe(normal.texto);
  });

  it('el marcador final se queda más tiempo que una frase de rutina', () => {
    // Es el único momento en el que el jugador no está corriendo a ningún sitio:
    // se puede leer entero.
    expect(comentar(nuevoComentarista(), final(false), T0)!.ms).toBeGreaterThan(
      comentar(nuevoComentarista(), fallo, T0)!.ms,
    );
  });
});

describe('comentarista: el reparto de sitio', () => {
  it('la primera frase entra siempre', () => {
    const c = nuevoComentarista();
    expect(comentar(c, carro, T0)).not.toBeNull();
  });

  it('la rutina no pisa un dato recién puesto (el aviso del carro nuevo)', () => {
    const c = nuevoComentarista();
    comentar(c, carro, T0);
    expect(comentar(c, fallo, T0 + 200)).toBeNull();
  });

  it('entre dos frases de la misma categoría gana la última: es lo que acaba de pasar', () => {
    const c = nuevoComentarista();
    const a = comentar(c, fallo, T0)!;
    const b = comentar(c, { tipo: 'canasta', suma: 1, puntos: 2, dinero: false, racha: 1 }, T0 + 200)!;
    expect(b.texto).not.toBe(a.texto);
  });

  it('pasado el mínimo, entra todo: nada se queda pegado en pantalla', () => {
    const c = nuevoComentarista();
    comentar(c, { tipo: 'arranque' }, T0);
    // La que está puesta pesa más (arranque) y aún no se ha retirado, así que la
    // rutina espera… hasta el mínimo. Ahí ya se ha leído y cede.
    expect(comentar(c, fallo, T0 + CEDE_MS - 1)).toBeNull();
    expect(comentar(c, fallo, T0 + CEDE_MS)).not.toBeNull();
  });

  it('una frase ya retirada deja pasar cualquier cosa', () => {
    const c = nuevoComentarista();
    const f = comentar(c, carro, T0)!;
    expect(comentar(c, fallo, T0 + f.ms)).not.toBeNull();
  });

  it('lo grande pisa incluso dentro del mínimo (la bocina y el final no esperan)', () => {
    const c = nuevoComentarista();
    comentar(c, { tipo: 'dinero' }, T0);
    expect(comentar(c, final(true), T0 + 100)).not.toBeNull();
  });
});
