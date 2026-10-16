import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { content, type Link } from '../src/data/content';
import { fmtDate, persona, vistaHitos, vistaProyectos } from '../src/data/view';
import { TEMAS_ABOUT, UI, type UIKey, type L10n } from '../src/i18n';

const esc = (s: string): string => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
const safe = (u: string): string => (/^(https?:|mailto:)/i.test(u) ? u : '#');
/** Cada texto se emite en ambos idiomas; el CSS oculta el que no toca. */
const b = (v: L10n): string => `<span lang="es">${esc(v.es)}</span><span lang="en">${esc(v.en)}</span>`;
const L = (es: string, en: string): L10n => ({ es, en });
const t = (key: UIKey): L10n => UI[key];
const presente = b(UI.present);

/*
 * Orden, agrupado, formato de fechas e identidad salen de `src/data/view.ts`,
 * el mismo módulo que consume el juego. Este guion corre en Node, y por eso la
 * vista es pura y el idioma llega por parámetro: aquí está claro por las dos
 * ramas del HTML (que emite cada texto en los dos idiomas y el CSS esconde uno).
 */
const identidad = persona();
const proyectos = vistaProyectos();
const hitos = vistaHitos();
/** Una fecha en los dos idiomas, con el formato de la vista y no en crudo. */
const fecha = (d: string): string => b({ es: fmtDate(d, 'es'), en: fmtDate(d, 'en') });

/*
 * «Sobre mí» se pinta POR TEMAS, en el mismo orden que las pestañas del juego y
 * con el mismo rótulo (`TEMAS_ABOUT`, `i18n.ts`): el atado es por `id`, así que
 * mover un párrafo dentro de un tema no cambia de título. Importar `i18n.ts`
 * desde aquí es seguro para Node porque el módulo no toca el navegador en su
 * nivel superior —`localStorage`/`document` solo se usan dentro de funciones,
 * que este guion nunca llama—: los rótulos son datos, no idioma activo, y por
 * eso se emiten en los dos idiomas con `b()` en lugar de con `t()`.
 */
const sobreMi = TEMAS_ABOUT.map((tema) => ({
  label: tema.label,
  parrafos: content.about.topics.find((x) => x.id === tema.id)?.text.filter((p) => p.es.trim() !== '' && p.en.trim() !== '') ?? [],
}))
  .filter((tema) => tema.parrafos.length)
  .map((tema) => `<h3>${b(tema.label)}</h3>${tema.parrafos.map((p) => `<p>${b(p)}</p>`).join('')}`)
  .join('');

/** Enlace social: nombre en los dos idiomas, href seguro. */
const link = (l: Link): string => `<a href="${esc(safe(l.url))}" rel="noopener noreferrer">${b(l.label)}</a>`;
/** Número de nivel de una skill (sin slash para que no entre en el formato de fecha). */
const nv = (level: number): string => String(level);

/** Enlaces de las 5 secciones en los dos idiomas. */
const secciones: [string, string, string][] = [
  ['about', 'Sobre mí', 'About me'],
  ['projects', 'Proyectos', 'Projects'],
  ['skills', 'Skills', 'Skills'],
  ['experience', 'Experiencia y estudios', 'Experience and education'],
  ['contact', 'Contacto', 'Contact'],
];

const html = `<!doctype html>
<html lang="es" data-l="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Court · Lideiras Portfolio</title>
<meta name="description" content="Software & Game Developer · ${esc(identidad.location)}">
<meta property="og:title" content="The Court · Lideiras Portfolio">
<meta property="og:description" content="Software & Game Developer · ${esc(identidad.location)}">
<meta property="og:image" content="/og.png">
<meta property="og:type" content="website">
<link rel="canonical" href="/classic/">
<style>
@font-face{font-family:'Silkscreen';font-style:normal;font-weight:400;src:url('/classic/fonts/silkscreen-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'Silkscreen';font-style:normal;font-weight:700;src:url('/classic/fonts/silkscreen-latin-700-normal.woff2') format('woff2')}
:root{color-scheme:dark;--a:#ff6a1a;--panel:#111a33;--panel2:#1b2748;--line:#3c4a6e;--line-hi:#5a6b96;--muted:#9aa8c4;--shadow:#050810}
*{box-sizing:border-box}
html[data-l=es] [lang=en],html[data-l=en] [lang=es]{display:none}
/* Estética voxel: sin border-radius, bordes gruesos y sombra dura. */
/* Texto corrido en tipografía de sistema (igual que los paneles del juego):
   la versión clásica es casi todo prosa, y en pixel se lee mal. */
body{margin:0;font:15px/1.65 system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:#0b1020;color:#f1f5f9}
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
<body data-l="es">
<main>
<nav aria-label="Secciones">
<a class="big" href="/">${b(L('🏀 Jugar la versión interactiva', '🏀 Play the interactive version'))}</a>
${(() => {
  let enlaces = '';
  for (const [id, es, en] of secciones) {
    enlaces += '<a href="#' + id + '">' + b(L(es, en)) + '</a>';
  }
  return enlaces;
})()}
<button id="lang" type="button" aria-label="${esc(b(t('lang_toggle')))}">EN / ES</button>
</nav>
<header>
<h1>The Court</h1>
<p class="gate-sub">Lideiras Portfolio</p>
<p class="gate-role">Software &amp; Game Developer</p>
<p class="gate-loc">${esc(identidad.location)}</p>
</header>

<section id="about">
<h2>${b(L('Sobre mí', 'About me'))}</h2>
${sobreMi}
<h3>${b(L('Datos', 'Facts'))}</h3>
${content.about.highlights.map((h) => `<div><dt>${esc(b(h.label))}</dt><dd>${esc(b(h.value))}</dd></div>`).join('')}
</section>

<section id="projects">
<h2>${b(L('Proyectos', 'Projects'))}</h2>
${proyectos.todos
  .map(
    (p) => `<article>
<h3>${esc(p.title)} <span class="muted">${p.year}</span></h3>
<p>${b(p.summary)}</p>
${p.details ? `<details><summary>${esc(b(UI.proj_details))}</summary><p>${b(p.details)}</p></details>` : ''}
<p>${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</p>
${p.links.length ? `<p>${p.links.map(link).join(' · ')}</p>` : ''}
</article>`,
  )
  .join('')}
</section>

<section id="skills">
<h2>${b(L('Skills', 'Skills'))}</h2>
${content.skills
  .map((g) => `<h3>${b(g.name)}</h3>
<p>${g.items.map((i) => `<span class="tag">${esc(i.name.es)} ${nv(i.level)}/10</span>`).join('')}</p>`)
  .join('')}
</section>

<section id="experience">
<h2>${b(L('Experiencia y estudios', 'Experience and education'))}</h2>
${hitos.todos
  .map(
    (x) => `<article>
<h3>${b(x.title)} <span class="tag">${b(t(`kind_${x.kind}`))}</span></h3>
<p class="muted">${esc(x.org)} · ${fecha(x.start)} – ${x.end ? fecha(x.end) : presente}</p>
<p>${b(x.description)}</p>
</article>`,
  )
  .join('')}
</section>

<section id="contact">
<h2>${b(L('Contacto', 'Contact'))}</h2>
<p>${b(t('cv_download'))} <a href="${esc(safe('documents/CV_eng.pdf'))}" download="CV_Daniel_Noya.pdf">${esc(b(t('cv_download')))}</a></p>
<p class="muted">${esc(b(t('cv_note')))}</p>
<p><a href="mailto:${esc(content.person.email)}">${esc(content.person.email)}</a></p>
<p>${content.person.social.map(link).join(' · ')}</p>
</section>
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
