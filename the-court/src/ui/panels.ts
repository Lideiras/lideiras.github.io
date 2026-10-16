import { content, type Project, type SectionId, type TimelineItem } from '../data/content';
import { fmtDate, persona, vistaHitos, vistaProyectos } from '../data/view';
import { getLang, loc, t, TEMAS_ABOUT, type UIKey } from '../i18n';
import { bindContactForm, renderContactForm } from './contactForm';

/** Un texto bilingüe en dos spans, igual que en la clásica. */
const b = (v: { es: string; en: string }): string => `<span lang="es">${esc(v.es)}</span><span lang="en">${esc(v.en)}</span>`;

export const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
const safeUrl = (u: string): string => (/^(https?:|mailto:)/i.test(u) ? u : '#');
export const sectionKey = (id: SectionId): UIKey => `section_${id}` as UIKey;

/** Carteles flotantes: cada sección tiene su propio texto de objeto. */
type SignKeys = { [K in SectionId]: `sign_${K}` }[SectionId];
export const signKey = (id: SectionId): SignKeys => `sign_${id}`;

/**
 * Si alguna clave `sign_*` no existe en `UI`, esto deja de compilar.
 * Sin esta comprobación el `as UIKey` anterior lo ocultaba y el fallo solo
 * aparecía en runtime (el cartel se renderizaba y reventaba la carga).
 */
export type SignKeysExist = Extract<SignKeys, UIKey> extends SignKeys ? true : never;
const _signKeysChecked: SignKeysExist = true;
void _signKeysChecked;

/** Marcadores de la 6.ª sección (la canasta derecha). main.ts los rellena. */
export interface GameStats {
  made: number;
  attempted: number;
  visited: number;
  total: number;
  /** Mejor concurso de triples, en puntos (0 = todavía no se ha jugado). */
  contestBest: number;
}
export const statsSource: { get: () => GameStats | null } = { get: () => null };

/* ---------------------------------------------------------------------------
 * Pestañas
 * ------------------------------------------------------------------------- */

interface Tab {
  label: string;
  html: string;
}

/** Contador de identificadores: cada apertura de panel tiene ids propios. */
let tabSeq = 0;

/**
 * Un juego de pestañas accesible, en el patrón ARIA completo.
 *
 * Antes cada sección era una lista larga y seguida: los diez proyectos, los seis
 * grupos de skills y los once hitos caían en la misma columna, con los párrafos
 * en tipografía pixel y todo en mayúsculas. Separar por pestañas es lo que
 * permite que cada bloque respire; los `role`/`aria-*` son para que la separación
 * no cueste accesibilidad:
 *
 *   · `role="tablist"` con un `aria-label` que dice de qué son las pestañas;
 *   · cada pestaña con `aria-selected` y `aria-controls` a su panel;
 *   · cada panel con `role="tabpanel"` y `aria-labelledby` a su pestaña;
 *   · foco móvil (`tabindex` 0 sólo en la activa) y flechas ←/→ + Inicio/Fin,
 *     que es el teclado que espera cualquier lector de pantalla.
 */
function tabs(items: Tab[]): string {
  // Sin nada que separar no se dibuja ni la barra: una pestaña sola es ruido.
  if (items.length <= 1) return items[0]?.html ?? '';
  const uid = `t${++tabSeq}`;
  const list = items
    .map(
      (it, i) =>
        `<button type="button" role="tab" id="${uid}-t${i}" aria-controls="${uid}-p${i}" aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? 0 : -1}">${esc(it.label)}</button>`,
    )
    .join('');
  const panels = items
    .map(
      (it, i) =>
        `<div class="tabpanel" role="tabpanel" id="${uid}-p${i}" aria-labelledby="${uid}-t${i}" tabindex="0"${i === 0 ? '' : ' hidden'}>${it.html}</div>`,
    )
    .join('');
  return `<div class="tabs" data-tabs>
    <div class="tabs__list" role="tablist" aria-label="${esc(t('tabs_label'))}">${list}</div>
    <div class="tabs__panels">${panels}</div>
  </div>`;
}

/**
 * Conecta las pestañas ya pintadas.
 *
 * Se llama DESPUÉS de escribir el `innerHTML` del panel, porque los nodos que
 * hay que escuchar no existen hasta entonces. Además de mover el foco, cada
 * cambio devuelve el cuerpo del panel al principio: si no, cambiar de pestaña
 * estando a media página deja al lector leyendo el final de otra lista (la barra
 * se queda pegada arriba, así que volver al principio no esconde las pestañas).
 */
export function bindTabs(root: HTMLElement): void {
  const body = root.querySelector<HTMLElement>('.panel__body');
  for (const box of root.querySelectorAll<HTMLElement>('[data-tabs]')) {
    const list = box.querySelector<HTMLElement>('[role="tablist"]');
    if (!list) continue;
    const list2 = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];

    const select = (i: number, focus: boolean): void => {
      for (const [j, btn] of list2.entries()) {
        const on = i === j;
        btn.setAttribute('aria-selected', String(on));
        btn.tabIndex = on ? 0 : -1;
        const id = btn.getAttribute('aria-controls');
        const panel = id ? box.querySelector<HTMLElement>(`#${id}`) : null;
        if (panel) panel.hidden = !on;
      }
      if (focus) list2[i]?.focus();
      if (body) body.scrollTop = 0;
    };

    list.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('[role="tab"]');
      if (!btn) return;
      const i = list2.indexOf(btn);
      if (i >= 0) select(i, false);
    });

    list.addEventListener('keydown', (e) => {
      const cur = list2.indexOf(document.activeElement as HTMLElement);
      if (cur < 0) return;
      const last = list2.length - 1;
      let next = -1;
      if (e.key === 'ArrowRight') next = cur === last ? 0 : cur + 1;
      else if (e.key === 'ArrowLeft') next = cur === 0 ? last : cur - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      if (next < 0) return;
      e.preventDefault();
      select(next, true);
    });
  }
}

/* ---------------------------------------------------------------------------
 * Piezas compartidas
 * ------------------------------------------------------------------------- */

const link = (l: { label: { es: string; en: string }; url: string }): string =>
  `<a class="chip chip--link" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener noreferrer">${esc(loc(l.label))}</a>`;

/**
 * El orden, el agrupado y el formato de las fechas están en `data/view.ts`, no
 * aquí: la versión clásica genera su HTML con el mismo módulo, y si el juego
 * decidiera el orden por su cuenta las dos superficies empezarían a divergir
 * sin que nada lo notara. El idioma sigue llegando por parámetro —esta es la
 * superficie que lo sabe—; la vista no lo lee de ninguna parte.
 */
const fecha = (d: string): string => fmtDate(d, getLang());

const highlights = (items: { label: { es: string; en: string }; value: { es: string; en: string } }[]): string =>
  `<dl class="highlights">${items
    .map((h) => `<div><dt>${esc(loc(h.label))}</dt><dd>${esc(loc(h.value))}</dd></div>`)
    .join('')}</dl>`;

/* ---------------------------------------------------------------------------
 * Secciones
 * ------------------------------------------------------------------------- */

const projectCard = (p: Project): string => `
  <article class="card proj">
    <header><h3>${esc(p.title)}</h3><span class="proj__year">${p.year}</span></header>
    <p class="proj__summary">${esc(loc(p.summary))}</p>
    ${
      p.details
        ? `<details class="proj__more"><summary>${esc(t('proj_details'))}</summary><p>${esc(loc(p.details))}</p></details>`
        : ''
    }
    <p class="chips">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</p>
    ${p.links.length ? `<p class="chips">${p.links.map(link).join('')}</p>` : ''}
  </article>`;

/** Proyectos: una pestaña por año (el más reciente primero) y una con todo. */
function renderProjects(): string {
  const { todos, porAnio } = vistaProyectos();
  const grid = (list: Project[]): string => `<div class="grid">${list.map(projectCard).join('')}</div>`;
  return tabs([
    { label: `${t('tabs_all')} · ${todos.length}`, html: grid(todos) },
    ...porAnio.map((g) => ({ label: `${g.year} · ${g.items.length}`, html: grid(g.items) })),
  ]);
}

/** Skills: una pestaña por grupo, con el nivel en número además de la barra. */
function renderSkills(): string {
  return tabs(
    content.skills.map((g) => ({
      label: b(g.name),
      html: `<h3 class="tabpanel__title">${esc(b(g.name))}</h3><ul class="skills">${g.items
        .map(
          (i) => `<li class="stat">
        <span class="stat__name">${esc(b(i.name))}</span>
        <span class="bar" role="meter" aria-valuemin="1" aria-valuemax="10" aria-valuenow="${i.level}" aria-label="${esc(t('skills_level'))}: ${esc(b(i.name))} ${i.level}/10"><i style="width:${i.level * 10}%"></i></span>
        <b class="stat__lv">${i.level}<small>/10</small></b>
      </li>`,
        )
        .join('')}</ul>`,
    })),
  );
}

const timelineItem = (it: TimelineItem): string => `
  <li>
    <header>
      <span class="badge badge--${it.kind}">${esc(t(`kind_${it.kind}` as UIKey))}</span>
      <span class="tl__when">${esc(fecha(it.start))} – ${it.end ? esc(fecha(it.end)) : esc(t('present'))}</span>
    </header>
    <h3>${esc(loc(it.title))}</h3>
    <p class="tl__org">${esc(it.org)}</p>
    <p>${esc(loc(it.description))}</p>
  </li>`;

/** Experiencia: todo (lo más reciente primero), y luego por tipo de hito. */
function renderExperience(): string {
  const { todos, porTipo } = vistaHitos();
  const list = (items: TimelineItem[]): string => `<ol class="timeline">${items.map(timelineItem).join('')}</ol>`;
  return tabs([
    { label: `${t('tabs_all')} · ${todos.length}`, html: list(todos) },
    ...porTipo.map((g) => ({ label: `${t(`kind_${g.kind}` as UIKey)} · ${g.items.length}`, html: list(g.items) })),
  ]);
}

/**
 * Sobre mí: una pestaña por TEMA declarado.
 *
 * El atado es por `id`, no por posición: el catálogo de temas y sus rótulos
 * viven en `TEMAS_ABOUT` (`i18n.ts`) y cada párrafo DICE de qué tema es
 * (`content.about.topics`). Mover, quitar o añadir un párrafo dentro de un
 * tema ya no puede reetiquetar ninguna pestaña; lo único que puede es dejar un
 * tema sin texto, y un tema sin texto no dibuja pestaña (ni huecos ni pestañas
 * mudas). Las tarjetas de datos van aparte para que los párrafos no compitan
 * con cifras.
 */
function renderAbout(): string {
  const p = persona();
  const card = `<div class="playercard">
    <div class="jersey" aria-label="${esc(t('about_number'))}">${esc(p.jerseyNumber)}</div>
    <div><h3>${esc(p.name)}</h3><p class="muted">${esc(loc(p.role))} · ${esc(p.location)}</p></div>
  </div>`;

  const items: Tab[] = [];
  for (const tema of TEMAS_ABOUT) {
    const parrafos = content.about.topics.find((x) => x.id === tema.id)?.text.filter((x) => x.es.trim() !== '' && x.en.trim() !== '') ?? [];
    if (!parrafos.length) continue;
    items.push({
      label: loc(tema.label),
      html: parrafos.map((x) => `<p class="prose">${esc(loc(x))}</p>`).join(''),
    });
  }
  items.push({ label: t('tab_facts'), html: highlights(content.about.highlights) });
  return card + tabs(items);
}

/** Récord: cifras grandes y un aviso que invita a jugar si aún no hay nada. */
function renderStats(): string {
  const s = statsSource.get();
  if (!s) return `<p class="lead">${esc(t('stats_empty'))}</p>`;
  const pct = s.attempted > 0 ? `${Math.round((s.made / s.attempted) * 100)}%` : esc(t('stats_left'));
  const cards = `<dl class="highlights highlights--big">
      <div><dt>${esc(t('stats_shots'))}</dt><dd>${s.made}</dd></div>
      <div><dt>${esc(t('stats_attempts'))}</dt><dd>${s.attempted}</dd></div>
      <div><dt>${esc(t('stats_accuracy'))}</dt><dd>${pct}</dd></div>
      <div><dt>${esc(t('stats_sections'))}</dt><dd>${s.visited} / ${s.total}</dd></div>
      <div><dt>${esc(t('stats_contest'))}</dt><dd>${s.contestBest > 0 ? s.contestBest : esc(t('stats_left'))}</dd></div>
    </dl>`;
  // Sin tiros no hay récord: en vez de una tabla de ceros, se explica qué hacer.
  if (s.attempted === 0 && s.made === 0) {
    return `<p class="lead">${esc(t('stats_empty'))}</p>${cards}<p class="muted">${esc(t('stats_hint'))}</p>`;
  }
  return `${cards}<p class="muted">${esc(t('stats_hint'))}</p>`;
}

/* ---------------------------------------------------------------------------
 * Contacto: una sola composición (CV, contacto directo y formulario)
 * ------------------------------------------------------------------------- */

/**
 * Contacto: TODO lo que hay que poder hacer sin salir del panel.
 *
 * Hasta aquí el contacto eran dos PESTAÑAS («Entrevista» y «Contacto directo») y
 * la entrevista además traía el formulario al final. Con el cuadro de
 * conversación fuera del panel (`ui/dialogue.ts`) la entrevista ya no es una
 * pestaña, así que no queda nada que tabulizar: esto es una columna y ya.
 *
 * El formulario NO desaparece: sigue siendo el mismo (`renderContactForm`), se
 * conecta igual (`bindContactForm`) y se manda con la misma validación y el
 * mismo límite de un mensaje por minuto. Lo que cambia es que se llega desde el
 * menú sin tener que ver antes la conversación, y que desde el reportero se
 * llega después. Es la misma Ruta A en los dos casos.
 */
function renderContact(): string {
  return `<div class="cv-download">
    <a class="chip chip--link" href="documents/CV_eng.pdf" download="CV_Daniel_Noya.pdf">${esc(t('cv_download'))}</a>
    <span class="cv-download__note">${esc(t('cv_note'))}</span>
  </div>
  <h3 class="tabpanel__title">${esc(t('contact_direct'))}</h3>
  <p class="chips"><a class="chip chip--link" href="mailto:${esc(content.person.email)}">${esc(content.person.email)}</a>${content.person.social.map(link).join('')}</p>
  ${renderContactForm()}`;
}

const RENDER: Record<SectionId, () => string> = {
  projects: renderProjects,
  skills: renderSkills,
  stats: renderStats,
  about: renderAbout,
  experience: renderExperience,
  contact: renderContact,
};

/* ---------------------------------------------------------------------------
 * Panel
 * ------------------------------------------------------------------------- */

export class PanelManager {
  private el: HTMLElement;
  private current: SectionId | null = null;
  private opener: HTMLElement | null = null;

  constructor(parent: HTMLElement, private onClose: () => void) {
    this.el = document.createElement('div');
    this.el.className = 'panel';
    this.el.hidden = true;
    parent.appendChild(this.el);
    this.el.addEventListener('click', (e) => {
      if (e.target === this.el || (e.target as HTMLElement).closest('[data-close]')) this.close();
    });
    document.addEventListener('keydown', this.onKey);
  }

  get isOpen(): boolean {
    return this.current !== null;
  }

  open(id: SectionId): void {
    this.opener = document.activeElement as HTMLElement | null;
    this.current = id;
    /*
     * El título del contacto ya no es el de la entrevista: la conversación se ha
     * ido al cuadro de fuera y este panel es, en las dos rutas, lo mismo —descargar
     * el CV, escribir al correo y mandar el formulario—. Ponerle «Entrevista en
     * directo» mentía sobre todo en la ruta del menú, donde no hay entrevista.
     */
    const title = t(sectionKey(id));
    this.el.innerHTML = `<div class="panel__card panel--${id}" role="dialog" aria-modal="true" aria-labelledby="panel-title">
      <header class="panel__head"><h2 id="panel-title">${esc(title)}</h2>
      <button type="button" class="panel__close" data-close aria-label="${esc(t('close'))}">✕</button></header>
      <div class="panel__body">${RENDER[id]()}</div></div>`;
    this.el.hidden = false;
    /*
     * El contacto ya no trae conversación dentro: la entrevista es el cuadro de
     * `ui/dialogue.ts`, que vive fuera del panel y sólo se abre al entrar por la
     * zona del reportero. Aquí sólo se conecta el formulario, que es lo único
     * que este panel tiene que saber hacer.
     */
    if (id === 'contact') bindContactForm(this.el);
    bindTabs(this.el);
    this.el.querySelector<HTMLElement>('[data-close]')?.focus();
  }

  close(): void {
    if (!this.current) return;
    this.current = null;
    this.el.hidden = true;
    this.el.innerHTML = '';
    this.opener?.focus?.();
    this.onClose();
  }

  private onKey = (e: KeyboardEvent): void => {
    if (!this.current) return;
    if (e.key === 'Escape') {
      this.close();
      return;
    }
    if (e.key === 'Tab') {
      // El filtro descarta el honeypot y todo lo que no se ve: los campos de una
      // pestaña oculta y los enlaces de un `<details>` plegado siguen en el DOM
      // pero no son alcanzables con el tabulador. Sin filtrarlos, el último
      // elemento «de la lista» podía ser uno invisible y el foco se escapaba del
      // diálogo. `summary` entra en la lista porque es focusable de verdad.
      const f = [...this.el.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,summary')].filter(
        (n) => !n.classList.contains('hp') && n.offsetParent !== null,
      );
      if (!f.length) return;
      const first = f[0]!;
      const last = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
}
