import { describe, expect, it } from 'vitest';
import { content } from '../src/data/content';
import * as validador from '../scripts/validate-content';

/*
 * Cubre T10 («guardas de contenido») y la cobertura que pide T3 (`validate
 * --strict` tiene que NOMBRAR el tema que se queda sin párrafo). AC5 y AC6.
 *
 * Para poder comprobar las guardas hace falta que `validate-content.ts` exporte
 * la comprobación como una función que recibe un contenido cualquiera. Hoy el
 * script recorre el módulo real y llama a `process.exit`: no hay forma de
 * preguntarle «¿qué pasa si un nivel es 11?». Con la función exportada, estas
 * pruebas clonan el contenido, lo rompen a propósito y miran el mensaje.
 *
 * Importar el script ejecuta además su pasada sobre el contenido real, que es
 * inocua si el contenido es válido (solo imprime una línea por consola).
 */

type FnValidar = (contenido: unknown, ...resto: unknown[]) => unknown;

/** Primera función exportada que parezca la comprobación del contenido. */
function buscarValidador(): FnValidar {
  const mod = validador as unknown as Record<string, unknown>;
  const candidatos = ['validar', 'validarContent', 'validate', 'comprobar', 'check', 'revisar', 'default'];
  for (const nombre of candidatos) {
    if (typeof mod[nombre] === 'function') return mod[nombre] as FnValidar;
  }
  for (const v of Object.values(mod)) {
    if (typeof v === 'function') return v as FnValidar;
  }
  throw new Error(
    'scripts/validate-content.ts no exporta la comprobación del contenido. Sin una función que reciba un ' +
      '`content` cualquiera, las guardas de T10 no se pueden comprobar con test: hay que exportarla.',
  );
}

/** Acepta `string[]`, `{errors}`, `{ok, errors}` o un único string. */
function normalizar(salida: unknown): string[] {
  if (typeof salida === 'string') return [salida];
  if (Array.isArray(salida)) return salida.map((e) => (e instanceof Error ? e.message : String(e)));
  if (salida && typeof salida === 'object') {
    const o = salida as Record<string, unknown>;
    for (const k of ['errors', 'errores', 'problems', 'issues']) {
      if (Array.isArray(o[k])) return normalizar(o[k]);
    }
  }
  return [];
}

/**
 * Errores que devuelve el validador. El modo estricto se pasa de tres formas
 * (bandeja, objeto, por defecto) y se queda con la que más dice: así el test no
 * ata la firma exacta, pero sigue exigiendo que el validador rechace.
 */
function erroresDe(contenido: unknown): string[] {
  const fn = buscarValidador();
  // Se ensancha la firma a la forma mas general: el test no ata como son los
  // argumentos del validador, solo que rechaza lo que no debe pasar.
  const llamable = fn as (...a: unknown[]) => unknown;
  let mejor: string[] = [];
  for (const args of [[contenido, true], [contenido, { strict: true }], [contenido]]) {
    let salida: unknown;
    try {
      salida = llamable(...args);
    } catch (e) {
      throw new Error(`el validador ha lanzado con un contenido de prueba: ${String(e)}`);
    }
    const lista = normalizar(salida);
    if (lista.length > mejor.length) mejor = lista;
  }
  return mejor;
}

/** Copia profunda barata: el contenido es JSON plano. */
const clonar = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/** `about` como objeto abierto, para no atar el test a la forma que elija T3. */
const aboutAbierto = (c: { about: unknown }): Record<string, unknown> => c.about as Record<string, unknown>;

/** Si los temas de `about` están agrupados (`about.topics`). */
const esAgrupado = (about: Record<string, unknown>): boolean => Array.isArray(about.topics);

/** Ids de los temas declarados, o `[]` si todavía no lo están. */
function temasDeAbout(about: Record<string, unknown>): string[] {
  if (esAgrupado(about)) {
    return (about.topics as Record<string, unknown>[])
      .map((t) => ['id', 'tema', 'topic', 'key', 'theme'].map((k) => t[k]).find((v) => typeof v === 'string'))
      .filter((v): v is string => typeof v === 'string');
  }
  if (Array.isArray(about.paragraphs)) {
    return (about.paragraphs as Record<string, unknown>[])
      .map((p) => {
        const clave = Object.keys(p).find((k) => k !== 'es' && k !== 'en');
        if (!clave) return null;
        const v = p[clave];
        if (typeof v === 'string') return v;
        const anidado = v && typeof v === 'object' ? (v as Record<string, unknown>).id : undefined;
        return typeof anidado === 'string' ? anidado : null;
      })
      .filter((v): v is string => v !== null);
  }
  return [];
}

/** Escribe un texto (español) en el primer tema, sea cual sea la forma. */
function ponerTextoEnPrimerTema(contenido: { about: unknown }, valor: string): void {
  const about = aboutAbierto(contenido);
  if (esAgrupado(about)) {
    (about.topics as Record<string, unknown>[])[0]!['text'] = { es: valor, en: valor };
    return;
  }
  (about.paragraphs as Record<string, unknown>[])[0]!.es = valor;
}

describe('T10 · las guardas del contenido rechazan lo que no puede pasar', () => {
  it('el contenido real pasa sus propias guardas', () => {
    const errores = erroresDe(content);
    expect(errores.join(' | '), `el contenido que hay en el repo no pasa las guardas: ${errores.join(' | ')}`).toEqual([]);
  });

  it('rechaza un nivel de skill fuera de 1-10', () => {
    const roto = clonar(content);
    (roto.skills[0]!.items[0] as unknown as { level: number }).level = 11;
    const errores = erroresDe(roto);
    expect(errores.length, 'un nivel 11 pasa el validador sin decir nada').toBeGreaterThan(0);
    expect(errores.join(' '), `el mensaje "${errores.join(' | ')}" no dice el campo ni el motivo`).toMatch(/nivel|level|skills|languages|1\s*-\s*10/i);
  });

  it('rechaza un nivel por debajo de 1', () => {
    const roto = clonar(content);
    (roto.skills[0]!.items[0] as unknown as { level: number }).level = 0;
    expect(erroresDe(roto).length, 'un nivel 0 pasa el validador sin decir nada').toBeGreaterThan(0);
  });

  it('rechaza un grupo de skills vacío', () => {
    const roto = clonar(content);
    roto.skills[0]!.items = [];
    expect(erroresDe(roto).length, 'un grupo de skills sin ninguna skill pasa el validador').toBeGreaterThan(0);
  });

  it('rechaza un proyecto sin título', () => {
    const roto = clonar(content);
    roto.projects[0]!.title = '   ';
    expect(erroresDe(roto).length, 'un proyecto con el título en blanco pasa el validador').toBeGreaterThan(0);
  });

  it('rechaza un tema de `about` sin texto', () => {
    const about = aboutAbierto(content);
    expect(temasDeAbout(about).length, 'no hay temas declarados en `about`: primero T3, después la cobertura').toBeGreaterThan(0);

    const roto = clonar(content);
    ponerTextoEnPrimerTema(roto, '');
    expect(erroresDe(roto).length, 'un tema con el texto vacío pasa el validador').toBeGreaterThan(0);
  });

  it('rechaza ids duplicados en los temas de `about`', () => {
    const about = aboutAbierto(content);
    expect(temasDeAbout(about).length, 'no hay temas declarados en `about` (T3)').toBeGreaterThan(0);

    const roto = clonar(content);
    const destino = aboutAbierto(roto);
    if (esAgrupado(destino)) {
      (destino.topics as unknown[]).push(clonar((destino.topics as unknown[])[0]));
    } else {
      const ps = destino.paragraphs as Record<string, unknown>[];
      ps.push({ ...ps[0]! });
    }
    const errores = erroresDe(roto);
    expect(errores.length, 'dos temas con el mismo id pasan el validador').toBeGreaterThan(0);
    expect(errores.join(' '), `el mensaje "${errores.join(' | ')}" no dice que hay un id repetido`).toMatch(/duplicad|repetid|duplicate/i);
  });
});

describe('T3 · el validador nombra el tema que se queda sin párrafo', () => {
  it('avisa cuando un tema declarado no tiene ningún párrafo', () => {
    const roto = clonar(content);
    const destino = aboutAbierto(roto);
    expect(esAgrupado(destino), 'los temas de `about` no están declarados todavía: esto no se puede comprobar (T3)').toBe(true);

    const topics = destino.topics as Record<string, unknown>[];
    const victima = topics[0]!;
    const id = String(['id', 'tema', 'topic', 'key', 'theme'].map((k) => victima[k]).find((v) => typeof v === 'string'));
    topics.splice(0, 1);

    const errores = erroresDe(roto);
    expect(errores.length, `el tema «${id}» se ha quedado sin párrafos y el validador no dice nada`).toBeGreaterThan(0);
    expect(errores.join(' '), `el mensaje "${errores.join(' | ')}" no nombra el tema que se quedó sin párrafo («${id}»)`).toContain(id);
  });
});

describe('T10 · en --strict salen las reglas de longitud', () => {
  const largo = (n: number): string => 'a'.repeat(n);

  it('rechaza un resumen de más de 200 caracteres', () => {
    const roto = clonar(content);
    roto.projects[0]!.summary.es = largo(260);
    expect(erroresDe(roto).length, 'un resumen de 260 caracteres pasa incluso en --strict').toBeGreaterThan(0);
  });

  it('rechaza detalles de más de 600 caracteres', () => {
    const roto = clonar(content);
    roto.projects[0]!.details!.es = largo(700);
    expect(erroresDe(roto).length, 'unos detalles de 700 caracteres pasan incluso en --strict').toBeGreaterThan(0);
  });

  it('rechaza un párrafo de más de 700 caracteres sin punto final', () => {
    const roto = clonar(content);
    ponerTextoEnPrimerTema(roto, largo(760));
    expect(erroresDe(roto).length, 'un párrafo de 760 caracteres sin punto final pasa incluso en --strict').toBeGreaterThan(0);
  });
});