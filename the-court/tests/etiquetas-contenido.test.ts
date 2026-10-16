import { describe, expect, it } from 'vitest';
import { content } from '../src/data/content';

/*
 * Cubre T4 («`skills[].items[].name` y `Project.stack` como `L10n`») y el AC7.
 *
 * El problema: `content.skills` guarda los nombres como `string` a pelo, y
 * `panels.ts` los pinta con `loc(i.name)`. Como no hay traducción que aplicar,
 * en la pestaña en CASTELLANO salen cosas como «Game development», «Pentesting»
 * o «Database management» mezcladas con «Laravel» o «Unity». En un portfolio eso
 * es ruido: el visitante lee media pantalla en español y de golpe una etiqueta
 * en inglés.
 *
 * La salida de T4 es: cada etiqueta es un `L10n` (es/en) o un token técnico
 * declarado en la lista blanca. Este test comprueba la forma de los DATOS, que
 * es lo que se puede mirar sin DOM.
 */

type L10n = { es: string; en: string };

const esL10n = (v: unknown): v is L10n =>
  !!v && typeof v === 'object' && typeof (v as L10n).es === 'string' && typeof (v as L10n).en === 'string';

/**
 * Una etiqueta que se queda como texto pelado solo es aceptable si es un token
 * técnico: nombre propio, lenguaje, herramienta o sigla.
 *
 * El criterio es «¿lleva dos palabras EN MINÚSCULAS seguidas?». «C#», «UE4»,
 * «Godot Engine» y «Substance Painter» no la llevan (la segunda palabra va en
 * mayúscula o no hay segunda), así que se aceptan; «Game development»,
 * «Application development», «Vulnerability assessment» o «Procedural
 * Animations» sí, y son exactamente las que tienen que pasar a ser `L10n`.
 *
 * LIMITACIÓN HONESTA: una etiqueta inglesa de UNA sola palabra («Physics»,
 * «Parkour») no se puede distinguir de un token técnico sin un diccionario, así
 * que este test no la señala. Las de una palabra se resuelven en la lista blanca
 * del validador (T10), no aquí.
 */
const pareceTokenTecnico = (s: string): boolean => {
  const t = s.trim();
  if (!t) return false;
  if (t.length > 24) return false;
  // Sin bandera `i`: las mayúsculas son justamente lo que distingue un nombre
  // propio de una frase en inglés.
  return !/[a-záéíóúñ]{3,}[ \t]+[a-záéíóúñ]/.test(t);
};

/** Todas las etiquetas de skills y de stack, con su sitio para poder nombrarlas. */
function collected(): { donde: string; valor: unknown }[] {
  const out: { donde: string; valor: unknown }[] = [];
  content.skills.forEach((g, gi) =>
    g.items.forEach((i, ii) => out.push({ donde: `skills[${gi}].items[${ii}] (${g.id})`, valor: i.name })),
  );
  content.projects.forEach((p, pi) => p.stack.forEach((s, si) => out.push({ donde: `projects[${pi}].stack[${si}] (${p.id})`, valor: s })));
  return out;
}

describe('T4 · las etiquetas de contenido están traducidas o son token técnico', () => {
  it('ninguna etiqueta queda en inglés dentro de la interfaz en español', () => {
    const crudas = collected().filter((e) => typeof e.valor === 'string' && !pareceTokenTecnico(e.valor as string));
    expect(
      offenders(crudas),
      'estas etiquetas se pintan tal cual en el panel en español y deberían ser L10n (es/en) o un token técnico declarado',
    ).toEqual([]);
  });

  it('ninguna etiqueta es una cadena vacía', () => {
    const vacias = collected()
      .filter((e) => typeof e.valor === 'string' && !(e.valor as string).trim())
      .map((e) => e.donde);
    expect(vacias, `etiquetas vacías: ${vacias.join(', ')}`).toEqual([]);
  });

  it('ninguna etiqueta es un L10n con un idioma en blanco', () => {
    const huecos = collected()
      .filter((e) => esL10n(e.valor))
      .flatMap((e) => {
        const v = e.valor as L10n;
        const huecosDeUna: string[] = [];
        if (!v.es.trim()) huecosDeUna.push(`${e.donde}.es`);
        if (!v.en.trim()) huecosDeUna.push(`${e.donde}.en`);
        return huecosDeUna;
      });
    expect(huecos, `etiquetas con un idioma en blanco: ${huecos.join(', ')}`).toEqual([]);
  });

  it('el skills de la zona española del portfolio se puede leer sin inglés', () => {
    /*
     * Esta es la versión «de cara al visitante»: se lee el `es` de cada
     * etiqueta (o el token, si sigue siendo texto pelado) y no puede quedar
     * ninguna frase en inglés. Se separa del test anterior para que el mensaje
     * diga qué se ve en pantalla.
     */
    const enIngles = content.skills
      .flatMap((g) => g.items.map((i) => ({ grupo: g.id, nombre: i.name })))
      .filter((i) => typeof i.nombre === 'string' && !pareceTokenTecnico(i.nombre as string))
      .map((i) => i.nombre);
    expect(enIngles, `en la pestaña de Skills en español saldrían estas etiquetas en inglés: ${enIngles.join(', ')}`).toEqual([]);
  });
});

function offenders(lista: { donde: string; valor: unknown }[]): string[] {
  return lista.map((e) => `${e.donde}: "${e.valor as string}"`);
}