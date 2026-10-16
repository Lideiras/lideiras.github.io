import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/*
 * Cubre T8 (escala de lectura), T12 (la entrevista, a tamaño de lectura), T13
 * (que los paneles respiren) y el `.skip` de T9. AC2 y AC3.
 *
 * ATENCIÓN, y hay que decirlo claro: esto NO es una captura de pantalla. Es una
 * lectura del TEXTO de `styles.css`: comprueba que una regla declara un tamaño
 * de letra, un ancho o un margen por encima de un número medido, no que el
 * resultado se vea bien en un píxel concreto. Automatiza la mitad verificable
 * de la petición del propietario (que la navegación y la entrevista dejen de
 * estar en letra diminuta y en media pantalla); el resto —que no haya solapes ni
 * truncados a 320/828/1440 px— está en `state/verificacion-manual.md` y hay que
 * mirarlo en el navegador.
 *
 * Los números salen de la medición que hizo el diagnóstico:
 *   · `.tabs__list button` a `.72rem` en pixel = 11,5 px a 16 px de raíz.
 *   · `.label` a `.7rem` en móvil.
 *   · la caja de la entrevista en `min(460px, 100%)` x `min(100%, 40dvh)`
 *     frente a los `920px` x `72dvh` del panel normal.
 *   · `.panel__body .prose + .prose` a `.9rem` para texto a `1rem/1.6`.
 */

const CSS = readFileSync(fileURLToPath(new URL('../src/styles.css', import.meta.url)), 'utf8');

/** El CSS sin comentarios: los comentarios tienen llaves y confunden la troceadora. */
const limpio = CSS.replace(/\/\*[\s\S]*?\*\//g, '');

type Regla = { selector: string; cuerpo: string };

/** Reglas de un solo nivel (los `@media` se leen por dentro, que es lo que importa aquí). */
function reglas(): Regla[] {
  const out: Regla[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(limpio))) {
    out.push({ selector: (m[1] ?? '').replace(/\s+/g, ' ').trim(), cuerpo: m[2] ?? '' });
  }
  return out;
}

const todas = reglas();
const normalizar = (s: string): string => s.replace(/\s+/g, ' ').trim();

/** Declaraciones de todas las reglas cuyo selector es exactamente este. */
const declaracionesDe = (selector: string): string[] =>
  todas.filter((r) => r.selector.split(',').map(normalizar).includes(selector)).map((r) => r.cuerpo);

const propiedades = (selector: string, propiedad: string): string[] => {
  const re = new RegExp(`(?:^|;)\\s*${propiedad}\\s*:\\s*([^;]+)`, 'gi');
  const out: string[] = [];
  for (const cuerpo of declaracionesDe(selector)) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(cuerpo))) out.push((m[1] ?? '').trim());
  }
  return out;
};

/** Un tamaño en rem/px a unidades de rem. `null` si no es un número (var, clamp…). */
function enRem(valor: string): number | null {
  const px = /^([\d.]+)px$/.exec(valor);
  if (px) return Number(px[1]) / 16;
  const rem = /^([\d.]+)rem$/.exec(valor);
  if (rem) return Number(rem[1]);
  return null;
}

/** Tamaños declarados que quedan por debajo del suelo pedido. */
function porDebajoDe(selector: string, sueloRem: number): string[] {
  return propiedades(selector, 'font-size')
    .map((v) => ({ v, rem: enRem(v) }))
    .filter((x): x is { v: string; rem: number } => x.rem !== null && x.rem < sueloRem - 1e-9)
    .map((x) => `${x.v} (${(x.rem * 16).toFixed(2)} px)`);
}

describe('T8 · la navegación de los paneles deja de estar en letra diminuta', () => {
  it('`.tabs__list button` no baja de 0.8rem', () => {
    expect(declaracionesDe('.tabs__list button').length, 'no se encuentra la regla `.tabs__list button` en styles.css').not.toEqual([]);
    const bajos = porDebajoDe('.tabs__list button', 0.8);
    expect(bajos, `las pestañas están en ${bajos.join(', ')}: es la navegación de un panel con diez proyectos`).toEqual([]);
  });

  it('`.label` no baja de 0.8rem', () => {
    const bajos = porDebajoDe('.label', 0.8);
    expect(bajos, `.label está en ${bajos.join(', ')}`).toEqual([]);
  });

  it('la fecha de un hito (`.tl__when`) no baja de 0.8rem', () => {
    expect(declaracionesDe('.tl__when').length, 'no se encuentra la regla `.tl__when`').not.toEqual([]);
    expect(porDebajoDe('.tl__when', 0.8), `.tl__when está en ${porDebajoDe('.tl__when', 0.8).join(', ')}`).toEqual([]);
  });

  it('«Detalles del proyecto» (`.proj__more summary`) no baja de 0.8rem', () => {
    expect(declaracionesDe('.proj__more summary').length, 'no se encuentra la regla `.proj__more summary`').not.toEqual([]);
    expect(porDebajoDe('.proj__more summary', 0.8), `.proj__more summary está en ${porDebajoDe('.proj__more summary', 0.8).join(', ')}`).toEqual([]);
  });

  it('`.tabs__list` tiene alto máximo y scroll (diez pestañas no estiran la barra)', () => {
    const props = declaracionesDe('.tabs__list').join(';');
    expect(props, '`.tabs__list` no declara `max-height`: con muchas pestañas la barra crece sin límite').toMatch(/max-height/);
    expect(props, '`.tabs__list` no declara `overflow`: sin scroll la barra se come el panel').toMatch(/overflow/);
  });
});

describe('T12 · la entrevista está a tamaño de lectura', () => {
  const ANCHO_MIN = 600;
  const ALTO_MIN = 60;

  it('la caja de la conversación se ha hecho más ancha que media pantalla', () => {
    const anchos = propiedades("body[data-mode='interview'] .panel__card", 'width');
    expect(anchos.length, 'no se encuentra la regla de la caja de la entrevista').not.toEqual([]);
    const estrechos = anchos.filter((v) => {
      const m = /min\(\s*([\d.]+)px/.exec(v);
      return m !== null && Number(m[1]) < ANCHO_MIN;
    });
    expect(estrechos, `la caja de la entrevista se queda en ${estrechos.join(', ')}: la mitad de ancho`).toEqual([]);
  });

  it('y más alta del 40dvh que la deja ahora', () => {
    const altos = propiedades("body[data-mode='interview'] .panel__card", 'max-height');
    expect(altos.length, 'no se encuentra el alto de la caja de la entrevista').not.toEqual([]);
    const bajos = altos.filter((v) => {
      const m = /([\d.]+)dvh/.exec(v);
      return m !== null && Number(m[1]) < ALTO_MIN;
    });
    expect(bajos, `la conversación se queda en ${bajos.join(', ')}: el entrevistador se corta`).toEqual([]);
  });
});

describe('T13 · los paneles respiran', () => {
  it('el ritmo entre párrafos de «Sobre mí» ha subido desde .9rem', () => {
    const margenes = propiedades('.panel__body .prose + .prose', 'margin-top');
    expect(margenes.length, 'no se encuentra la regla `.panel__body .prose + .prose`').not.toEqual([]);
    const flojos = margenes.filter((v) => {
      const r = enRem(v);
      return r !== null && r <= 0.9;
    });
    expect(flojos, `el ritmo vertical sigue en ${flojos.join(', ')} para texto a 1rem/1.6`).toEqual([]);
  });

  it('la rejilla de tarjetas abre más que el hueco de 1rem', () => {
    const gaps = propiedades('.grid', 'gap');
    expect(gaps.length, 'no se encuentra la regla `.grid`').not.toEqual([]);
    const justos = gaps.filter((v) => {
      const r = enRem(v);
      return r !== null && r <= 1;
    });
    expect(justos, `el hueco entre tarjetas sigue en ${justos.join(', ')}`).toEqual([]);
  });
});

describe('T9 · el enlace de salto existe de verdad', () => {
  it('`styles.css` define la clase `.skip` que usa el index.html', () => {
    /*
     * `index.html` tiene `<a class="skip" href="/classic/">` desde antes de que
     * existiera la regla: un enlace de salto que no está oculto hasta recibir el
     * foco se lee como un banner en medio del juego, y uno que no existe no
     * sirve de nada (AC3).
     */
    expect(/\.skip\b/.test(limpio), 'la clase `.skip` del enlace de salto no está definida en styles.css').toBe(true);
  });
});