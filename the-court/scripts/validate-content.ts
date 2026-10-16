import { basename } from 'node:path';
import { content, type Content } from '../src/data/content';
import { TEMAS_ABOUT, type L10n } from '../src/i18n';

export interface ResultadoValidacion {
  errors: string[];
  warnings: string[];
}

function walk(node: unknown, path: string, strict: boolean, errors: string[], warnings: string[]): void {
  if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${path}[${i}]`, strict, errors, warnings));
  if (node && typeof node === 'object') {
    const o = node as Record<string, unknown>;
    const isL10n = typeof o.es === 'string' && typeof o.en === 'string' && Object.keys(o).length === 2;
    if (isL10n) {
      for (const lang of ['es', 'en'] as const) {
        const v = (o[lang] as string).trim();
        if (!v) errors.push(`${path}.${lang} está vacío`);
        if (v.includes('[[')) (strict ? errors : warnings).push(`${path}.${lang} contiene un marcador [[PENDIENTE]]`);
      }
      return;
    }
    for (const [k, v] of Object.entries(o)) {
      if (k === 'url' && typeof v === 'string' && !/^(https?:\/\/|mailto:)/.test(v)) errors.push(`${path}.url no es http(s)/mailto: ${v}`);
      walk(v, `${path}.${k}`, strict, errors, warnings);
    }
    return;
  }
  if (typeof node === 'string' && node.includes('[[')) (strict ? errors : warnings).push(`${path} contiene un marcador [[PENDIENTE]]`);
}

function unique(label: string, ids: string[], errors: string[]): void {
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) errors.push(`${label}: ids duplicados ${dup.join(', ')}`);
}

/**
 * Los párrafos con texto de verdad de un tema declarado, o `[]` si no los tiene.
 *
 * Se leen por la forma (`text` es una lista de `{es, en}`) y no por el tipo:
 * esta función existe para poder responder «¿qué pasa con un contenido roto?»,
 * que es justo el caso en el que la forma ya no es la que declara `content.ts`.
 */
function parrafosDe(tema: unknown): L10n[] {
  if (!tema || typeof tema !== 'object') return [];
  const texto = (tema as { text?: unknown }).text;
  if (!Array.isArray(texto)) return [];
  return texto.filter((p): p is L10n => {
    if (!p || typeof p !== 'object') return false;
    const v = p as Partial<L10n>;
    return typeof v.es === 'string' && v.es.trim() !== '' && typeof v.en === 'string' && v.en.trim() !== '';
  });
}

/**
 * Cobertura de «Sobre mí»: cada tema del catálogo (`TEMAS_ABOUT`, `i18n.ts`)
 * tiene que tener su párrafo en `content.about.topics`.
 *
 * El mensaje NOMBRA el `id` que se ha quedado sin texto. Antes, el reparto era
 * posicional y un párrafo sin escribir no se notaba: la pestaña salía vacía o,
 * peor, con el texto del tema de al lado. Con el atado por `id`, quitar un tema
 * es un error que se puede decir en voz alta —«falta el párrafo de `web`»— y no
 * un hueco en blanco en mitad del panel.
 */
function coberturaTemas(c: Content, errors: string[]): void {
  const topics = Array.isArray(c?.about?.topics) ? c.about.topics : [];
  for (const tema of TEMAS_ABOUT) {
    if (!parrafosDe(topics.find((x) => x?.id === tema.id)).length) {
      errors.push(`about.topics: el tema «${tema.id}» no tiene ningún párrafo`);
    }
  }
  unique('about.topics', topics.map((x) => String(x?.id)), errors);
}

/**
 * La comprobación, como FUNCIÓN y sin salir del proceso.
 *
 * Se exporta porque las guardas solo se pueden probar con un contenido
 * cualquiera («¿qué pasa si el nivel es 11?»): si el script solo recorriera el
 * `content.ts` del repo y llamara a `process.exit`, no habría manera de
 * preguntarle nada. El CLI de `npm run validate -- --strict` sigue igual: lo
 * de abajo es el que imprime y sale.
 */
export function validar(c: Content, strict = false): ResultadoValidacion {
  const errors: string[] = [];
  const warnings: string[] = [];
  walk(c, 'content', strict, errors, warnings);
  unique('projects', c.projects.map((p) => p.id), errors);
  unique('skills', c.skills.map((s) => s.id), errors);
  unique('timeline', c.timeline.map((x) => x.id), errors);
  coberturaTemas(c, errors);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.person.email)) errors.push('person.email inválido');
  if (c.person.initials.length > 3) errors.push('person.initials: máximo 3 caracteres');
  if (strict && c.person.name === 'Tu Nombre') errors.push('person.name sigue siendo el valor de ejemplo');
  for (const g of c.skills) {
    if (!g.items.length) errors.push(`skills.${g.id}: grupo sin items`);
    for (const i of g.items) {
      if (!(i.level >= 1 && i.level <= 10)) errors.push(`skills.${g.id}.${i.name}: nivel fuera de 1-10`);
    }
  }
  for (const p of c.projects) {
    if (!p.title.trim()) errors.push(`proyectos.${p.id}: título vacío`);
    if (strict) {
      if (p.summary.es.trim().length > 200) errors.push(`proyectos.${p.id}: resumen ES > 200 car.`);
      if (p.summary.en.trim().length > 200) errors.push(`proyectos.${p.id}: resumen EN > 200 car.`);
      if (p.details && p.details.es.trim().length > 600) errors.push(`proyectos.${p.id}: detalles ES > 600 car.`);
      if (p.details && p.details.en.trim().length > 600) errors.push(`proyectos.${p.id}: detalles EN > 600 car.`);
    }
  }
  return { errors, warnings };
}

/**
 * ¿Se está ejecutando esto como comando? Importado desde un test, el módulo no
 * debe imprimir ni (mucho menos) matar el proceso de vitest: solo se exporta la
 * comprobación. Se mira el nombre del script de entrada porque es lo único que
 * distingue «lo he ejecutado» de «lo he importado».
 */
function esCli(): boolean {
  const entrada = process.argv[1];
  return Boolean(entrada) && basename(entrada).startsWith('validate-content');
}

if (esCli()) {
  const strict = process.argv.includes('--strict');
  const { errors, warnings } = validar(content, strict);
  warnings.forEach((w) => console.warn(`⚠ ${w}`));
  if (errors.length) {
    errors.forEach((e) => console.error(`✗ ${e}`));
    process.exit(1);
  }
  console.log(`✓ content.ts válido (${content.projects.length} proyectos, ${content.skills.length} grupos de skills, ${content.timeline.length} hitos)`);
}
