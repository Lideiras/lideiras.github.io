import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { content } from '../src/data/content';
import type { L10n } from '../src/i18n';

const esc = (s: string): string => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
const safe = (u: string): string => (/^(https?:|mailto:)/i.test(u) ? u : '#');
/** Cada texto se emite en ambos idiomas; el CSS oculta el que no toca. */
const b = (v: L10n): string => `<span lang="es">${esc(v.es)}</span><span lang="en">${esc(v.en)}</span>`;
const L = (es: string, en: string): L10n => ({ es, en });

const html = `<!doctype html>
<html lang="es" data-l="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(content.person.name)} · ${esc(content.person.role.es)} / ${esc(content.person.role.en)}</title>
<meta name="description" content="${esc(content.person.role.es)} · ${esc(content.person.role.en)} · ${esc(content.person.location)}">
<link rel="canonical" href="/classic/">
<style>
@font-face{font-family:'Silkscreen';font-style:normal;font-weight:400;src:url('/classic/fonts/silkscreen-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'Silkscreen';font-style:normal;font-weight:700;src:url('/classic/fonts/silkscreen-latin-700-normal.woff2') format('woff2')}
:root{color-scheme:dark;--a:#ff6a1a;--panel:#111a33;--panel2:#1b2748;--line:#3c4a6e;--line-hi:#5a6b96;--muted:#9aa8c4;--shadow:#050810}
*{box-sizing:border-box}
html[data-l=es] [lang=en],html[data-l=en] [lang=es]{display:none}
/* Estética voxel: sin border-radius, bordes gruesos y sombra dura. */
body{margin:0;font:15px/1.65 'Inter',system-ui,sans-serif;background:#0b1020;color:#f1f5f9}
main{max-width:880px;margin:0 auto;padding:2rem 1rem 4rem}
h1,h2,h3{font-family:'Silkscreen','Bebas Neue',monospace;letter-spacing:.06em;line-height:1.25}
h1{font-size:2rem;margin:.2rem 0}
h2{border-bottom:4px solid var(--a);padding-bottom:.4rem;margin-top:2.5rem;font-size:1.15rem}
h3{font-size:1rem;margin:0 0 .3rem}
a{color:var(--a)}
.muted{color:var(--muted)}
.tag{display:inline-block;background:var(--panel2);border:3px solid var(--line);box-shadow:3px 3px 0 var(--shadow);padding:.1rem .5rem;margin:0 .25rem .25rem 0;font-size:.75rem}
article{border:3px solid var(--line);box-shadow:5px 5px 0 var(--shadow);background:var(--panel);padding:1rem;margin:1rem 0}
nav{display:flex;gap:1rem;flex-wrap:wrap;justify-content:space-between;align-items:center}
button{background:var(--a);color:#fff;border:3px solid #fff;box-shadow:5px 5px 0 var(--shadow);padding:.5rem 1rem;font-family:'Silkscreen',monospace;font-weight:700;cursor:pointer}
button:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 var(--shadow)}
a.big{display:inline-block;background:var(--a);color:#fff;border:3px solid #fff;box-shadow:5px 5px 0 var(--shadow);padding:.5rem 1rem;text-decoration:none;font-family:'Silkscreen',monospace;font-size:.85rem}
</style>
</head>
<body>
<main>
<nav><a class="big" href="/">${b(L('🏀 Jugar la versión interactiva', '🏀 Play the interactive version'))}</a><button id="lang" type="button">EN / ES</button></nav>
<header><h1>${esc(content.person.name)}</h1><p>${b(content.person.role)} · ${esc(content.person.location)}</p>${content.person.tagline ? `<p class="muted">${b(content.person.tagline)}</p>` : ''}</header>

<section id="about"><h2>${b(L('Sobre mí', 'About me'))}</h2>${content.about.paragraphs.map((p) => `<p>${b(p)}</p>`).join('')}</section>

<section id="projects"><h2>${b(L('Proyectos', 'Projects'))}</h2>${content.projects
  .map(
    (p) => `<article><h3>${esc(p.title)} <span class="muted">${p.year}</span></h3><p>${b(p.summary)}</p>${p.details ? `<p class="muted">${b(p.details)}</p>` : ''}<p>${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</p><p>${p.links.map((l) => `<a href="${esc(safe(l.url))}" rel="noopener noreferrer">${b(l.label)}</a>`).join(' · ')}</p></article>`,
  )
  .join('')}</section>

<section id="skills"><h2>Skills</h2>${content.skills
  .map((g) => `<h3>${b(g.name)}</h3><p>${g.items.map((i) => `<span class="tag">${esc(i.name)} ${i.level}/10</span>`).join('')}</p>`)
  .join('')}</section>

<section id="experience"><h2>${b(L('Experiencia y estudios', 'Experience and education'))}</h2>${content.timeline
  .map((x) => `<article><h3>${b(x.title)}</h3><p class="muted">${esc(x.org)} · ${esc(x.start)} – ${x.end ? esc(x.end) : b(L('Actualidad', 'Present'))}</p><p>${b(x.description)}</p></article>`)
  .join('')}</section>

<section id="contact"><h2>${b(L('Contacto', 'Contact'))}</h2><p><a href="mailto:${esc(content.person.email)}">${esc(content.person.email)}</a></p><p>${content.person.social
  .map((l) => `<a href="${esc(safe(l.url))}" rel="noopener noreferrer">${b(l.label)}</a>`)
  .join(' · ')}</p></section>
</main>
<script>
(function(){var r=document.documentElement,s;try{s=localStorage.getItem('court.lang')}catch(e){}
var l=s||((navigator.language||'es').slice(0,2)==='en'?'en':'es');r.dataset.l=l;r.lang=l;
document.getElementById('lang').onclick=function(){l=l==='es'?'en':'es';r.dataset.l=l;r.lang=l;try{localStorage.setItem('court.lang',l)}catch(e){}}})();
</script>
</body>
</html>
`;

mkdirSync('public/classic', { recursive: true });
writeFileSync('public/classic/index.html', html);

// La versión clásica es HTML plano: no pasa por Vite, así que la fuente pixel
// hay que copiarla a mano para que los títulos tengan el mismo aire voxel.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const fontSrc = join(root, 'node_modules/@fontsource/silkscreen/files');
const fontOut = 'public/classic/fonts';
mkdirSync(fontOut, { recursive: true });
let copied = 0;
for (const f of ['silkscreen-latin-400-normal.woff2', 'silkscreen-latin-700-normal.woff2']) {
  const from = join(fontSrc, f);
  if (existsSync(from)) {
    copyFileSync(from, join(fontOut, f));
    copied++;
  }
}
console.log(`✓ public/classic/index.html generado desde content.ts (${copied} fuentes pixel copiadas)`);
