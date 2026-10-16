import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { content } from '../src/data/content';
import { UI } from '../src/i18n';

/*
 * Cubre T6, T7 y el final de T4, con los AC4, AC5 y AC7.
 *
 * Estas pruebas leen el HTML GENERADO por `build-classic.ts`
 * (`public/classic/index.html`), no el del juego: es la única forma de mirar la
 * superficie clásica sin DOM ni navegador. Y es justo donde se ve el problema
 * que se quiere arreglar — la clásica hoy dice `2025-02`, enseña `Skills` sin
 * traducir, deja seis `<p></p>` vacíos, no imprime los datos destacados de
 * «Sobre mí» y esconde el correo en la última sección.
 *
 * El fichero es un artefacto (`npm run classic` lo regenera). Si no existe, el
 * mensaje dice cómo generarlo en vez de reventar con un ENOENT.
 */

const CLASICA = fileURLToPath(new URL('../public/classic/index.html', import.meta.url));
const falta = 'Falta public/classic/index.html. Se genera con `npm run classic` (lo llama `npm run build`).';

const html = (): string => {
  if (!existsSync(CLASICA)) throw new Error(falta);
  return readFileSync(CLASICA, 'utf8');
};

/** El mismo escapado que hace `build-classic.ts` al escribir. */
const esc = (s: string): string => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

/** Porción del HTML de una sección, por su `id`. */
function seccion(id: string): string {
  const doc = html();
  const m = new RegExp(`<section id="${id}"[\\s\\S]*?</section>`).exec(doc);
  return m ? m[0] : '';
}

describe('T7 · la clásica no tiene párrafos vacíos', () => {
  it('no queda ningún <p></p> en el HTML', () => {
    const doc = html();
    const vacios = doc.match(/<p>\s*<\/p>/g) ?? [];
    /*
     * Salen de los proyectos sin enlaces: la plantilla mete siempre el `<p>` de
     * los enlaces, aunque la lista esté vacía. Visualmente no se nota (un
     * párrafo de altura cero), pero es markup basura y con seis huecos ya es
     * ruido para el que lee el código.
     */
    expect(vacios.length, `hay ${vacios.length} párrafos vacíos: quita el <p> cuando no haya nada que meter dentro`).toBe(0);
  });
});

describe('T7 · las fechas se muestran como fechas', () => {
  it('no sale ninguna fecha en crudo (2025-02)', () => {
    const hitos = seccion('experience');
    const crudas = hitos.match(/\b\d{4}-\d{2}\b/g) ?? [];
    expect(crudas.length, `la sección de experiencia suelta ${crudas.length} fechas en crudo (${crudas.slice(0, 3).join(', ')}…)`).toEqual([]);
  });

  it('sale al menos una fecha formateada (feb 2025)', () => {
    const hitos = seccion('experience');
    expect(hitos, 'no se encuentra la sección de experiencia en el HTML generado').toContain('feb 2025');
  });

  it('un hito sin fecha final se marca como actualidad', () => {
    const hitos = seccion('experience');
    expect(hitos, 'no se encuentra la sección de experiencia en el HTML generado').toContain(esc(UI.present.es));
  });
});

describe('T7 · cada sección lleva su título en los dos idiomas', () => {
  it('todos los <h2> traen <span lang="es"> y <span lang="en">', () => {
    const doc = html();
    const h2 = [...doc.matchAll(/<h2>([\s\S]*?)<\/h2>/g)].map((m) => m[1] ?? '');
    expect(h2.length, 'no se ha encontrado ningún <h2> en la clásica').toBeGreaterThan(0);
    const sinTraducir = h2.filter((cuerpo) => !cuerpo.includes('<span lang="es">') || !cuerpo.includes('<span lang="en">'));
    expect(sinTraducir, `estos <h2> no están bilingües: ${sinTraducir.join(' · ')}`).toEqual([]);
  });
});

describe('T7 · los datos y la jerarquía de la clásica', () => {
  it('cada hito lleva su etiqueta de tipo (Trabajo, Estudios, Deporte)', () => {
    const hitos = seccion('experience');
    const articulos = [...hitos.matchAll(/<article[\s>][\s\S]*?<\/article>/g)].map((m) => m[0]);
    expect(articulos.length, `la clásica imprime ${articulos.length} hitos y \`content.ts\` tiene ${content.timeline.length}`).toBe(
      content.timeline.length,
    );
    const etiquetas = [UI.kind_work, UI.kind_education, UI.kind_sport].flatMap((k) => [esc(k.es), esc(k.en)]);
    const sinEtiqueta = articulos.filter((a) => !etiquetas.some((e) => a.includes(e)));
    expect(sinEtiqueta.length, `${sinEtiqueta.length} hitos no dicen si son de trabajo, de estudios o de deporte`).toBe(0);
  });

  it('los detalles largos del proyecto van plegados', () => {
    const proyectos = seccion('projects');
    const conDetalles = content.projects.filter((p) => p.details).length;
    const plegados = [...proyectos.matchAll(/<details/g)].length;
    expect(plegados, `solo hay ${plegados} bloques plegados y ${conDetalles} proyectos tienen detalles`).toBeGreaterThanOrEqual(conDetalles);
  });

  it('el primer proyecto es el más reciente', () => {
    const proyectos = seccion('projects');
    const titulos = [...proyectos.matchAll(/<h3>([\s\S]*?)<\/h3>/g)].map((m) => (m[1] ?? '').replace(/<[^>]*>/g, '').trim());
    expect(titulos.length, 'no se han encontrado proyectos en la clásica').toBeGreaterThan(0);
    const masReciente = content.projects.reduce((a, b) => (b.year > a.year ? b : a));
    expect(
      titulos[0],
      `el primer proyecto es «${titulos[0]}» y el más reciente es «${masReciente.title}» (${masReciente.year})`,
    ).toBe(esc(masReciente.title));
  });
});

describe('T6 · el contacto se ve sin recorrer la página', () => {
  it('el correo aparece antes de la sección de proyectos', () => {
    const doc = html();
    const correo = doc.indexOf(`mailto:${content.person.email}`);
    const proyectos = doc.indexOf('<section id="projects"');
    expect(correo, `no sale un mailto:${content.person.email} en la clásica`).toBeGreaterThan(-1);
    expect(
      correo,
      'el correo sale DESPUÉS de la sección de proyectos: hay que bajar hasta el final para poder escribir',
    ).toBeLessThan(proyectos);
  });

  it('el nav lleva las cinco anclas que saltan a las secciones', () => {
    const doc = html();
    const nav = /<nav>[\s\S]*?<\/nav>/.exec(doc)?.[0] ?? '';
    expect(nav, 'no se ha encontrado el <nav> de la clásica').not.toBe('');
    const secciones = ['about', 'projects', 'skills', 'experience', 'contact'];
    const faltan = secciones.filter((id) => !nav.includes(`href="#${id}"`));
    expect(faltan, `el nav no salta a: ${faltan.join(', ')}`).toEqual([]);
  });

  it('el botón de idioma tiene aria-label', () => {
    const doc = html();
    const boton = /<button[^>]*id="lang"[^>]*>/.exec(doc)?.[0] ?? '';
    expect(boton, 'no se ha encontrado el botón de idioma').not.toBe('');
    expect(boton, 'el botón de idioma no dice para qué sirve a un lector de pantalla').toMatch(/aria-label/);
  });
});

describe('T7 · metadatos de la clásica', () => {
  it('trae los og:* que comparte en redes', () => {
    const doc = html();
    // Los tres que ya trae el `index.html` de la raíz: al compartir en redes
    // sale la tarjeta sin título ni imagen si faltan.
    for (const prop of ['og:title', 'og:description', 'og:image']) {
      expect(doc, `falta <meta property="${prop}"> en la clásica`).toContain(`property="${prop}"`);
    }
  });
});

describe('AC4 · la clásica sale de `content.ts`, sin recortes', () => {
  it('todo el texto del contenido aparece en el HTML generado', () => {
    const doc = html();
    const faltan: string[] = [];
    const ambos = (v: { es: string; en: string }, donde: string): void => {
      if (!doc.includes(esc(v.es))) faltan.push(`${donde}.es`);
      if (!doc.includes(esc(v.en))) faltan.push(`${donde}.en`);
    };

    const about = content.about as unknown as Record<string, unknown>;
    const parrafos = Array.isArray(about.paragraphs) ? (about.paragraphs as { es: string; en: string }[]) : [];
    if (!parrafos.length) faltan.push('about.paragraphs');
    parrafos.forEach((p, i) => ambos(p, `about.paragraphs[${i}]`));

    const highlights = Array.isArray(about.highlights) ? (about.highlights as { label: { es: string; en: string }; value: { es: string; en: string } }[]) : [];
    if (!highlights.length) faltan.push('about.highlights');
    highlights.forEach((h, i) => {
      ambos(h.label, `about.highlights[${i}].label`);
      ambos(h.value, `about.highlights[${i}].value`);
    });
    content.projects.forEach((p, i) => {
      ambos(p.summary, `projects[${i}].summary`);
      if (p.details) ambos(p.details, `projects[${i}].details`);
    });
    content.timeline.forEach((x, i) => ambos(x.description, `timeline[${i}].description`));

    /*
     * Las fechas no se buscan en crudo porque ya se comprueban formateadas más
     * arriba: `2025-02` no puede aparecer literally si el requisito es `feb
     * 2025`. Los años de los proyectos sí, porque salen tal cual.
     */
    if (!doc.includes(String(Math.max(...content.projects.map((p) => p.year))))) faltan.push('projects[].year');

    expect(faltan, `estos textos de \`content.ts\` no salen en la clásica: ${faltan.join(', ')}`).toEqual([]);
  });
});