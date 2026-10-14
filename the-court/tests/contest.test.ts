import { describe, expect, it } from 'vitest';
import { CARRITO, CONCURSO, TRIPLES, TRIPLE_RADIO, rimX } from '../src/game/config';
import {
  avanzarCarro,
  avanzarReloj,
  arrancarReloj,
  carroVacio,
  distanciaAlCarro,
  empezar,
  nuevoConcurso,
  enBocina,
  puedeCoger,
  puedeTirar,
  quedanCarros,
  resolverTiro,
  salir,
  terminar,
  tomarBalon,
} from '../src/game/contest';

const RIM = { x: rimX(1), z: 0 };
const en = (i: number) => TRIPLES[i]!;

describe('concurso de triples: los carros', () => {
  it('son cinco, todos por fuera de la línea de tres', () => {
    expect(TRIPLES.length).toBe(5);
    for (const p of TRIPLES) {
      const d = Math.hypot(p.x - RIM.x, p.z - RIM.z);
      expect(d, `carro en ${p.x},${p.z}`).toBeGreaterThanOrEqual(TRIPLE_RADIO);
    }
  });

  it('el primer carro es el CARRITO de la esquina donde se convoca', () => {
    // El propietario lo pidió así: el carro con el que se interactúa es el primer
    // carro desde el que se tira, no un atrezo al lado del primer puesto.
    expect(en(0).x).toBeCloseTo(CARRITO.x, 6);
    expect(en(0).z).toBeCloseTo(CARRITO.z, 6);
  });

  it('empiezan y acaban en las esquinas, con el frontal en el centro', () => {
    // Esquinas a los dos lados, diagonales simétricas y el frontal centrado: es el
    // recorrido que pidió el propietario (esquinas, diagonales y central).
    expect(Math.abs(en(0).z)).toBeGreaterThan(6.5);
    expect(Math.abs(en(4).z)).toBeCloseTo(6.6, 6);
    expect(en(2).z).toBeCloseTo(0, 6);
    expect(Math.abs(en(1).z)).toBeCloseTo(Math.abs(en(3).z), 6);
    expect(Math.sign(en(0).z)).toBe(-Math.sign(en(4).z));
    // Los cinco están al mismo lado del aro (hacia el centro de la pista).
    for (const p of TRIPLES) expect(Math.sign(RIM.x - p.x)).toBe(1);
  });

  it('el alcance del carro se mide desde el carro que TOCA', () => {
    const c = nuevoConcurso();
    empezar(c);
    const p0 = en(0);
    expect(distanciaAlCarro(c, p0.x, p0.z)).toBeCloseTo(0, 6);
    c.carro = 2;
    expect(distanciaAlCarro(c, p0.x, p0.z)).toBeGreaterThan(CONCURSO.alcance);
  });
});

describe('concurso de triples: el reloj', () => {
  it('no corre hasta el PRIMER TIRO, ni al convocar ni al coger el balón', () => {
    const c = nuevoConcurso();
    empezar(c);
    const p = en(0);
    tomarBalon(c);
    expect(c.reloj).toBe(false);
    for (let i = 0; i < 60; i++) avanzarReloj(c, 1);
    expect(c.t).toBe(CONCURSO.segundos);
    // Con el primer tiro sí corre.
    arrancarReloj(c);
    avanzarReloj(c, 5);
    expect(c.t).toBe(CONCURSO.segundos - 5);
    expect(distanciaAlCarro(c, p.x, p.z)).toBe(0);
  });

  it('termina una sola vez y deja el reloj a 0', () => {
    const c = nuevoConcurso();
    empezar(c);
    const p = en(0);
    expect(puedeCoger(c, p.x, p.z)).toBe(true);
    tomarBalon(c);
    arrancarReloj(c);
    let avisos = 0;
    for (let i = 0; i < 200; i++) if (avanzarReloj(c, 0.5)) avisos++;
    expect(avisos).toBe(1);
    expect(c.t).toBe(0);
    expect(c.fin).toBe('tiempo');
    // Y una vez terminado, seguir avanzando no vuelve a avisar.
    expect(avanzarReloj(c, 5)).toBe(false);
  });

  it('fuera del concurso el reloj no se mueve', () => {
    const c = nuevoConcurso();
    c.reloj = true;
    avanzarReloj(c, 10);
    expect(c.t).toBe(CONCURSO.segundos);
  });
});

describe('concurso de triples: los balones y la bola del dinero', () => {
  it('el carro da tres balones y el TERCERO vale doble', () => {
    const c = nuevoConcurso();
    empezar(c);
    const p = en(0);
    expect(tomarBalon(c)).toBe(false);
    resolverTiro(c, true);
    expect(puedeCoger(c, p.x, p.z)).toBe(true);
    expect(tomarBalon(c)).toBe(false);
    resolverTiro(c, true);
    expect(tomarBalon(c)).toBe(true); // el tercero: bola del dinero
    expect(carroVacio(c)).toBe(false); // todavía está en la mano
    resolverTiro(c, true);
    expect(carroVacio(c)).toBe(true);
    expect(puedeCoger(c, p.x, p.z)).toBe(false); // carro vacío: no hay más
  });

  it('un tiro no se puede repetir: mientras está en el aire no se coge otro', () => {
    const c = nuevoConcurso();
    empezar(c);
    const p = en(0);
    tomarBalon(c);
    expect(c.esperando).toBe(true);
    expect(puedeCoger(c, p.x, p.z)).toBe(false);
    resolverTiro(c, false);
    expect(puedeCoger(c, p.x, p.z)).toBe(true);
  });

  it('la bola del dinero suma 2 y el resto 1; fallar no suma nada', () => {
    const c = nuevoConcurso();
    empezar(c);
    tomarBalon(c);
    expect(resolverTiro(c, true)).toBe(CONCURSO.puntos);
    tomarBalon(c);
    expect(resolverTiro(c, false)).toBe(0);
    tomarBalon(c);
    expect(resolverTiro(c, true)).toBe(CONCURSO.puntosDinero);
    expect(c.puntos).toBe(CONCURSO.puntos + CONCURSO.puntosDinero);
    expect(c.tiros).toBe(3);
    expect(c.aciertos).toBe(2);
    expect(carroVacio(c)).toBe(true);
  });

  it('la puntuación del carro NUNCA se va al carro siguiente', () => {
    const c = nuevoConcurso();
    empezar(c);
    tomarBalon(c);
    resolverTiro(c, true);
    tomarBalon(c);
    resolverTiro(c, true);
    tomarBalon(c); // el tercero: bola del dinero
    expect(c.dinero).toBe(true);
    // El balón ya va por el aire cuando el jugador se pone a andar al siguiente.
    c.carro++;
    c.balones = CONCURSO.balones;
    expect(c.dinero).toBe(true);
    expect(resolverTiro(c, true)).toBe(CONCURSO.puntosDinero);
  });

  it('la racha cuenta las canastas SEGUIDAS y un fallo la rompe', () => {
    // La narra el comentarista («¡tres seguidas!») y es del concurso, no de la
    // voz: por eso vive aquí y arranca de cero en cada partida. El `hitStreak` del
    // Takeover no sirve para esto, porque cuenta también lo de antes de pulsar E.
    const c = nuevoConcurso();
    empezar(c);
    expect(c.racha).toBe(0);
    tomarBalon(c);
    resolverTiro(c, true);
    tomarBalon(c);
    resolverTiro(c, true);
    expect(c.racha).toBe(2);
    tomarBalon(c);
    resolverTiro(c, false);
    expect(c.racha).toBe(0);
    // Partida nueva, racha nueva: no se arrastra la de la anterior.
    empezar(c);
    expect(c.racha).toBe(0);
  });
});

describe('concurso de triples: con qué balón se tira', () => {
  it('fuera del concurso siempre se tira', () => {
    const c = nuevoConcurso();
    expect(puedeTirar(c)).toBe(true);
    // Al terminar el concurso el balón vuelve a las manos y se sigue jugando
    // al baloncesto de siempre, aunque `esperando` se haya quedado en false.
    empezar(c);
    tomarBalon(c);
    resolverTiro(c, false);
    terminar(c);
    expect(c.esperando).toBe(false);
    expect(puedeTirar(c)).toBe(true);
  });

  it('dentro sólo con un balón EN JUEGO, el que da el reboteador', () => {
    const c = nuevoConcurso();
    empezar(c);
    // Ni al convocar (el balón de la pista ya no cuenta) ni al avanzar de carro.
    expect(puedeTirar(c)).toBe(false);
    tomarBalon(c);
    expect(puedeTirar(c)).toBe(true);
    resolverTiro(c, true);
    expect(puedeTirar(c)).toBe(false);
  });

  it('el balón que devuelve el reboteador se marca mientras queden balones', () => {
    const c = nuevoConcurso();
    empezar(c);
    tomarBalon(c); // el balón del turno
    const trasCadaTiro: { balones: number; puede: boolean }[] = [];
    for (let tiro = 0; tiro < CONCURSO.balones; tiro++) {
      resolverTiro(c, false);
      // Lo que hace `main.ts` con el balón que vuelve a las manos: mientras al
      // carro le queden balones, el que devuelve el reboteador es uno de ellos.
      if (c.balones > 0) tomarBalon(c);
      trasCadaTiro.push({ balones: c.balones, puede: puedeTirar(c) });
    }
    expect(c.tiros).toBe(CONCURSO.balones);
    expect(trasCadaTiro).toEqual([
      { balones: 2, puede: true },
      { balones: 1, puede: true },
      // Carro vacío: el balón que vuelve ya no es de nadie y no da un tiro más.
      { balones: 0, puede: false },
    ]);
  });
});

describe('concurso de triples: la bocina', () => {
  /** Deja el reloj a 0 con un tiro ya en el aire. */
  const conLaBocinaSonada = () => {
    const c = nuevoConcurso();
    empezar(c);
    const p = en(0);
    tomarBalon(c);
    arrancarReloj(c);
    let agotado = false;
    for (let i = 0; i < 200 && !agotado; i++) agotado = avanzarReloj(c, 0.5);
    expect(agotado).toBe(true);
    return { c, p };
  };

  it('el tiempo agotado NO cierra el concurso: queda el balón en el aire', () => {
    const { c, p } = conLaBocinaSonada();
    expect(c.t).toBe(0);
    expect(enBocina(c)).toBe(true);
    expect(c.activo).toBe(true); // sigue abierto, esperando al balón
    // …pero ya no se lanza, ni se coge, ni se cambia de carro.
    expect(puedeTirar(c)).toBe(false);
    expect(puedeCoger(c, p.x, p.z)).toBe(false);
    c.balones = 0;
    const sig = en(1);
    expect(avanzarCarro(c, sig.x, sig.z)).toBe(false);
    expect(c.carro).toBe(0);
  });

  it('el tiro que venía del aire se resuelve y cuenta', () => {
    const { c } = conLaBocinaSonada();
    // La canasta la canta el aro, y `onScore` resuelve SÓLO con el concurso
    // activo: por eso la bocina lo deja abierto en vez de cerrarlo al sonar.
    expect(resolverTiro(c, true)).toBe(CONCURSO.puntos);
    expect(c.puntos).toBe(CONCURSO.puntos);
    expect(c.aciertos).toBe(1);
    expect(c.tiros).toBe(1);
    // Y el fallo también queda contado, y gasta su balón.
    expect(c.balones).toBe(CONCURSO.balones - 1);
    expect(resolverTiro(c, false)).toBe(0);
    expect(c.tiros).toBe(2);
    expect(c.balones).toBe(CONCURSO.balones - 2);
  });

  it('cierra al salir, no al sonar', () => {
    const { c } = conLaBocinaSonada();
    salir(c);
    expect(c.activo).toBe(false);
    expect(enBocina(c)).toBe(false);
    // Y con el concurso cerrado el balón vuelve a ser el de siempre.
    expect(puedeTirar(c)).toBe(true);
  });
});

describe('concurso de triples: el recorrido de los carros', () => {
  it('no se pasa de carro si no se está EN el siguiente', () => {
    const c = nuevoConcurso();
    empezar(c);
    c.balones = 0;
    const lejos = en(3);
    expect(avanzarCarro(c, lejos.x, lejos.z)).toBe(false);
    expect(c.carro).toBe(0);
  });

  it('al llegar al siguiente se rellena a tres balones', () => {
    const c = nuevoConcurso();
    empezar(c);
    c.balones = 0;
    const sig = en(1);
    expect(avanzarCarro(c, sig.x, sig.z)).toBe(true);
    expect(c.carro).toBe(1);
    expect(c.balones).toBe(CONCURSO.balones);
    expect(carroVacio(c)).toBe(false);
  });

  it('tras el quinto carro no hay siguiente: se acaba', () => {
    const c = nuevoConcurso();
    empezar(c);
    c.carro = 4;
    c.balones = 0;
    const ultimo = en(4);
    expect(quedanCarros(c)).toBe(false);
    expect(avanzarCarro(c, ultimo.x, ultimo.z)).toBe(false);
    terminar(c);
    expect(c.fin).toBe('carros');
    expect(c.activo).toBe(false);
  });

  it('salirse a mitad deja el estado limpio para la siguiente partida', () => {
    const c = nuevoConcurso();
    empezar(c);
    tomarBalon(c);
    arrancarReloj(c);
    resolverTiro(c, true);
    salir(c);
    expect(c.activo).toBe(false);
    expect(c.esperando).toBe(false);
    empezar(c);
    expect(c.puntos).toBe(0);
    expect(c.t).toBe(CONCURSO.segundos);
    expect(c.carro).toBe(0);
    expect(c.balones).toBe(CONCURSO.balones);
    expect(c.tiros).toBe(0);
    expect(c.fin).toBe(null);
  });
});
