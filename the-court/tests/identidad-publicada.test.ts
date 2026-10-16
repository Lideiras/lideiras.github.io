import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { content } from '../src/data/content';

/*
 * Cubre T11 («verificación de identidad de lo publicado») y el cierre de T1
 * (el shadow de `public/` sobre `dist/`). AC4 y AC6.
 *
 * La raíz del repo es una COPIA del build y la copia es manual. Lo único que
 * avisa de que se ha quedado vieja es esta comprobación: hoy `index.html` de la
 * raíz no lleva el puesto en español ni la ubicación, o sea que la primera
 * pantalla del sitio publicado no identifica a la persona con la misma fuente
 * que el juego. Estos tests SOLO LEEN: `AGENTS.md` declara la raíz de solo
 * lectura y automatizar su escritura está vetado.
 *
 * Si algún día se cambia `person.name` en `content.ts`, esto falla a propósito.
 * La reparación es republicar, no editar la raíz a mano.
 */

const raiz = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

/** Los cuatro datos con los que alguien tiene que saber a quién está leyendo. */
function identidad(): { etiqueta: string; valor: string }[] {
  return [
    { etiqueta: 'person.name', valor: content.person.name },
    { etiqueta: 'person.role.es', valor: content.person.role.es },
    { etiqueta: 'person.role.en', valor: content.person.role.en },
    { etiqueta: 'person.location', valor: content.person.location },
  ];
}

const leer = (p: string): string => {
  if (!existsSync(p)) throw new Error(`Falta ${p}: sin esa superficie no se puede comprobar la identidad de lo publicado.`);
  return readFileSync(p, 'utf8');
};

const SUPERFICIES: { donde: string; fichero: string }[] = [
  { donde: 'index.html (raíz)', fichero: raiz('../../index.html') },
  { donde: 'classic/index.html (raíz)', fichero: raiz('../../classic/index.html') },
  { donde: 'public/classic/index.html (generado)', fichero: raiz('../public/classic/index.html') },
];

describe('T11 · lo publicado identifica a la persona con los datos de `content.ts`', () => {
  for (const { donde, fichero } of SUPERFICIES) {
    it(`${donde} lleva nombre, puesto en los dos idiomas y ubicación`, () => {
      const doc = leer(fichero);
      const faltan = identidad().filter((d) => !doc.includes(d.valor));
      expect(
        faltan.map((d) => d.etiqueta),
        `a ${donde} le faltan datos de \`content.ts\`: ${faltan.map((d) => `${d.etiqueta} ("${d.valor}")`).join(', ')}`,
      ).toEqual([]);
    });
  }
});

describe('T11 · la raíz carga un chunk de entrada que existe', () => {
  it('el index.html de la raíz apunta a un assets/*.js que está en el disco', () => {
    const doc = leer(raiz('../../index.html'));
    const scripts = [...doc.matchAll(/src="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1] ?? '');
    expect(scripts.length, 'el index.html de la raíz no carga ningún /assets/*.js').toBeGreaterThan(0);

    const router = fileURLToPath(new URL('../../', import.meta.url));
    const rotos = scripts.filter((s: string) => !existsSync(join(router, s.replace(/^\//, ''))));
    expect(rotos, `estos scripts que carga la raíz no existen en \`assets/\`: ${rotos.join(', ')}`).toEqual([]);
  });
});

describe('T1 · nada en `public/` pisa la salida del build', () => {
  it('no hay un `public/index.html` que Vite copie a `dist/` encima del generado', () => {
    const sobra = raiz('../public/index.html');
    /*
     * MEDIDO, no supuesto: se puso un marcador en `the-court/index.html`, se
     * reconstruyo y el marcador LLEGO a `dist/index.html`, que quedo mas largo
     * que `public/index.html`. O sea que Vite escribe su `index.html` DESPUES de
     * copiar `public/`: este fichero NO lo pisaba. Era un build viejo dead que si
     * multiplicaba el bundle (`public/assets/assets/` -> `dist/assets/assets/`,
     * 794.564 bytes, el 43% de `dist/`), pero no rompia la salida.
     *
     * El test se queda como guarda contra que vuelva a colarse un `public/` que
     * no lo genera el build; el comentario va con lo medido para que nadie lo
     * lea como un fallo de sombra que nunca existio.
     */
    expect(
      existsSync(sobra),
      'the-court/public/index.html vuelve a existir: es un build viejo, no un fuente, y Vite lo copia a dist/',
    ).toBe(false);
  });
});