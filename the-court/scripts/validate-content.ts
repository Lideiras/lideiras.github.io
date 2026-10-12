import { content } from '../src/data/content';

const strict = process.argv.includes('--strict');
const errors: string[] = [];
const warnings: string[] = [];

function walk(node: unknown, path: string): void {
  if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${path}[${i}]`));
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
      walk(v, `${path}.${k}`);
    }
    return;
  }
  if (typeof node === 'string' && node.includes('[[')) (strict ? errors : warnings).push(`${path} contiene un marcador [[PENDIENTE]]`);
}

function unique(label: string, ids: string[]): void {
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) errors.push(`${label}: ids duplicados ${dup.join(', ')}`);
}

walk(content, 'content');
unique('projects', content.projects.map((p) => p.id));
unique('skills', content.skills.map((s) => s.id));
unique('timeline', content.timeline.map((x) => x.id));
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(content.person.email)) errors.push('person.email inválido');
if (content.person.initials.length > 3) errors.push('person.initials: máximo 3 caracteres');
if (strict && content.person.name === 'Tu Nombre') errors.push('person.name sigue siendo el valor de ejemplo');

warnings.forEach((w) => console.warn(`⚠ ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✗ ${e}`));
  process.exit(1);
}
console.log(`✓ content.ts válido (${content.projects.length} proyectos, ${content.skills.length} grupos de skills, ${content.timeline.length} hitos)`);
