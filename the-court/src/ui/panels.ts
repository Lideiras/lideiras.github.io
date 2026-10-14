import { content, type Project, type SectionId, type TimelineItem } from '../data/content';
import { getLang, loc, t, tf, type UIKey } from '../i18n';
import { bindContactForm, renderContactForm } from './contactForm';

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

const MONTHS: Record<'es' | 'en', string[]> = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/**
 * `2025-02` → `feb 2025`.
 *
 * Los hitos guardan el mes en formato ISO porque es lo que ordena bien, pero
 * `2025-02 – Actualidad` se lee como un volcado de base de datos. Los valores
 * sin mes (`2019`) se dejan tal cual: no se les inventa un mes que no consta.
 */
const fmtDate = (d: string): string => {
  const m = /^(\d{4})-(\d{2})$/.exec(d);
  if (!m) return d;
  const month = MONTHS[getLang()][Number(m[2]) - 1];
  return month ? `${month} ${m[1]}` : d;
};

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
  const all = [...content.projects].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  const years = [...new Set(all.map((p) => p.year))];
  const grid = (list: Project[]): string => `<div class="grid">${list.map(projectCard).join('')}</div>`;
  return tabs([
    { label: `${t('tabs_all')} · ${all.length}`, html: grid(all) },
    ...years.map((y) => {
      const list = all.filter((p) => p.year === y);
      return { label: `${y} · ${list.length}`, html: grid(list) };
    }),
  ]);
}

/** Skills: una pestaña por grupo, con el nivel en número además de la barra. */
function renderSkills(): string {
  return tabs(
    content.skills.map((g) => ({
      label: loc(g.name),
      html: `<h3 class="tabpanel__title">${esc(loc(g.name))}</h3><ul class="skills">${g.items
        .map(
          (i) => `<li class="stat">
        <span class="stat__name">${esc(i.name)}</span>
        <span class="bar" role="meter" aria-valuemin="1" aria-valuemax="10" aria-valuenow="${i.level}" aria-label="${esc(t('skills_level'))}: ${esc(i.name)} ${i.level}/10"><i style="width:${i.level * 10}%"></i></span>
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
      <span class="tl__when">${esc(fmtDate(it.start))} – ${it.end ? esc(fmtDate(it.end)) : esc(t('present'))}</span>
    </header>
    <h3>${esc(loc(it.title))}</h3>
    <p class="tl__org">${esc(it.org)}</p>
    <p>${esc(loc(it.description))}</p>
  </li>`;

/** Experiencia: todo (lo más reciente primero), y luego por tipo de hito. */
function renderExperience(): string {
  const all = [...content.timeline].sort((a, b) => (a.start < b.start ? 1 : a.start > b.start ? -1 : 0));
  const list = (items: TimelineItem[]): string => `<ol class="timeline">${items.map(timelineItem).join('')}</ol>`;
  const kinds = ['work', 'education', 'sport'] as const;
  return tabs([
    { label: `${t('tabs_all')} · ${all.length}`, html: list(all) },
    ...kinds
      .map((k) => ({ k, items: all.filter((x) => x.kind === k) }))
      .filter((g) => g.items.length > 0)
      .map((g) => ({ label: `${t(`kind_${g.k}` as UIKey)} · ${g.items.length}`, html: list(g.items) })),
  ]);
}

/**
 * Sobre mí: un párrafo (o tema) por pestaña.
 *
 * El reparto es POSICIONAL sobre `content.about.paragraphs`, así que:
 *   · si un tema no tiene párrafo, su pestaña no se dibuja (no hay huecos);
 *   · si el propietario añade párrafos nuevos, los extras caen en la última
 *     pestaña en lugar de desaparecer del panel.
 * Las tarjetas de datos van aparte para que los párrafos no compitan con cifras.
 */
function renderAbout(): string {
  const ps = content.about.paragraphs;
  const groups: { label: string; idx: number[] }[] = [
    { label: t('tab_intro'), idx: [0] },
    { label: t('tab_web'), idx: [1] },
    { label: t('tab_games'), idx: [2] },
    { label: t('tab_security'), idx: [3] },
    { label: t('tab_offcourt'), idx: [4] },
  ];
  const known = new Set(groups.flatMap((g) => g.idx));
  const extra = ps.map((_, i) => i).filter((i) => !known.has(i));
  if (extra.length) groups[groups.length - 1]!.idx.push(...extra);

  const card = `<div class="playercard">
    <div class="jersey" aria-label="${esc(t('about_number'))}">${esc(content.person.jerseyNumber)}</div>
    <div><h3>${esc(content.person.name)}</h3><p class="muted">${esc(loc(content.person.role))} · ${esc(content.person.location)}</p></div>
  </div>`;

  const items: Tab[] = groups
    .filter((g) => g.idx.some((i) => ps[i]))
    .map((g) => ({
      label: g.label,
      html: g.idx.map((i) => (ps[i] ? `<p class="prose">${esc(loc(ps[i]!))}</p>` : '')).join(''),
    }));
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
 * Entrevista: diálogo con el entrevistador y formulario al final (lote B)
 * ------------------------------------------------------------------------- */

/**
 * Un turno del guion: lo que dice el entrevistador y, si toca, las dos
 * respuestas entre las que elige el jugador.
 *
 * El guion es una LISTA DE DATOS y no una cascada de `if`: así el orden de la
 * conversación se lee de un vistazo, cada línea es una clave de traducción (y
 * por tanto falta una traducción = falla el build) y añadir una pregunta es
 * añadir un objeto sin tocar la máquina de estados.
 *
 * Los turnos son dos variantes y no dos campos opcionales del mismo objeto: con
 * `host?` y `dato?` los dos a la vez —o ninguno— compilaría, y un turno sin texto
 * saldría como una línea vacía en mitad de la entrevista.
 */
type DlgTurno =
  | { host: UIKey; opciones?: [UIKey, UIKey] }
  | { dato: DlgDato; opciones?: [UIKey, UIKey] };

/** Los dos comentarios que salen de lo que el jugador ha hecho en la pista. */
type DlgDato = 'tiros' | 'concurso';

/**
 * La frase del entrevistador sobre la partida del jugador.
 *
 * Los números salen del MISMO origen que el panel del récord (`statsSource`, que
 * es lo que `main.ts` tiene cargado del navegador): no hay una segunda cuenta que
 * se pueda quedar desfasada de la que ve el jugador en la sexta sección. Sin
 * datos —o con la partida sin empezar— la frase es la de la ausencia, que es lo
 * que hace que el diálogo cambie según lo que haya hecho: a un recién llegado no
 * se le felicita por un cero.
 */
function lineaDato(qué: DlgDato): string {
  const s = statsSource.get();
  if (qué === 'tiros') {
    if (!s || s.attempted === 0) return t('dlg_data_shots_none');
    return tf('dlg_data_shots', {
      made: s.made,
      attempted: s.attempted,
      pct: Math.round((s.made / s.attempted) * 100),
    });
  }
  if (!s || s.contestBest === 0) return t('dlg_data_contest_none');
  return tf('dlg_data_contest', { best: s.contestBest });
}

const GUION: DlgTurno[] = [
  { host: 'dlg_open' },
  /*
   * Lo primero que comenta un entrevistador que acaba de ver el partido son los
   * números: van aquí, antes de las preguntas, y son los que hacen que la misma
   * entrevista se lea distinta en la segunda visita.
   */
  { dato: 'tiros' },
  { dato: 'concurso' },
  { host: 'dlg_q1', opciones: ['dlg_a1a', 'dlg_a1b'] },
  { host: 'dlg_r1' },
  { host: 'dlg_q2', opciones: ['dlg_a2a', 'dlg_a2b'] },
  { host: 'dlg_r2' },
  { host: 'dlg_q3', opciones: ['dlg_a3a', 'dlg_a3b'] },
  { host: 'dlg_r3' },
];

/**
 * Contacto: la conversación del entrevistador por delante del formulario.
 *
 * El formulario NO desaparece: sigue siendo el mismo (`renderContactForm`) y se
 * envía igual, con su validación y su límite de un mensaje por minuto. Lo que
 * cambia es dónde aparece: al final del diálogo, que es lo que pidió el
 * propietario («en vez de ser un formulario, que aparezca un diálogo entre el
 * entrevistador y el personaje»). El botón de saltar existe para quien sólo
 * quiere dejar sus datos, y se esconde en cuanto el formulario está a la vista.
 */
export function renderInterview(): string {
  return `<div class="dlg" data-dlg>
    <div class="dlg__log" data-dlg-log role="log" aria-live="polite" aria-label="${esc(t('dlg_label'))}" tabindex="-1"></div>
    <div class="dlg__choices" data-dlg-choices></div>
    <div data-dlg-after hidden>
      <h3 class="tabpanel__title dlg__form-title">${esc(t('dlg_form_title'))}</h3>
      ${renderContactForm()}
    </div>
    <button type="button" class="btn dlg__skip" data-dlg-skip>${esc(t('dlg_skip'))}</button>
  </div>`;
}

/**
 * Conecta el diálogo: escribe las líneas, ofrece las respuestas y al final
 * enseña el formulario.
 *
 * Va a base de nodos creados y `textContent` (nada de `innerHTML` con texto del
 * guion): así no hay forma de que una traducción con un `<` rompa la tarjeta, y
 * el `role="log"` con `aria-live="polite"` va anunciando cada intervención sin
 * que haya que hacer nada más para que un lector de pantalla siga la entrevista.
 */
export function bindInterview(root: HTMLElement): void {
  const box = root.querySelector<HTMLElement>('[data-dlg]');
  if (!box) return;
  const log = box.querySelector<HTMLElement>('[data-dlg-log]')!;
  const choices = box.querySelector<HTMLElement>('[data-dlg-choices]')!;
  const after = box.querySelector<HTMLElement>('[data-dlg-after]')!;
  const skip = box.querySelector<HTMLButtonElement>('[data-dlg-skip]')!;
  let turno = 0;
  let timer = 0;

  const linea = (quien: string, texto: string, jugador: boolean): void => {
    const el = document.createElement('div');
    el.className = `dlg__line${jugador ? ' dlg__line--player' : ''}`;
    const who = document.createElement('span');
    who.className = 'dlg__who';
    who.textContent = quien;
    const p = document.createElement('p');
    p.className = 'dlg__text';
    p.textContent = texto;
    el.append(who, p);
    log.appendChild(el);
    el.scrollIntoView({ block: 'nearest' });
  };

  /** Cierra la conversación y enseña el formulario. */
  const revelar = (): void => {
    window.clearTimeout(timer);
    choices.replaceChildren();
    if (!after.hidden) return;
    after.hidden = false;
    /*
     * Y el cuadro CRECE: durante la conversación la tarjeta se queda en el tercio
     * inferior (una esquina de plató, para no tapar al entrevistador ni al
     * personaje, que es lo que se está mirando) y al aparecer el formulario
     * necesita el alto de siempre para que quepan los campos. La clase va aquí,
     * pegada al `hidden` que acaba de cambiar: es el mismo cambio de estado y no
     * hay una segunda bandera que se pueda quedar desfasada.
     */
    box.closest('.panel__card')?.classList.add('panel__card--form');
    skip.hidden = true;
    after.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  };

  const siguiente = (): void => {
    const t2 = GUION[turno++];
    if (!t2) {
      revelar();
      return;
    }
    linea(t('dlg_host'), 'dato' in t2 ? lineaDato(t2.dato) : t(t2.host), false);
    if (!t2.opciones) {
      // Pausa corta entre dos intervenciones del entrevistador: sin ella, la
      // réplica y la pregunta siguiente caían en el mismo fotograma y se leían
      // como una sola frase larga.
      timer = window.setTimeout(() => {
        if (box.isConnected) siguiente();
      }, 520);
      return;
    }
    for (const key of t2.opciones) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn';
      b.textContent = t(key);
      b.addEventListener('click', () => {
        choices.replaceChildren();
        linea(content.person.name, t(key), true);
        /*
         * El foco vuelve al registro y NO se queda en el botón borrado: al
         * desaparecer el botón, el navegador deja el foco en el `body` y la
         * trampa de foco del panel deja de reconocer el ciclo (el «último»
         * elemento ya no es el que tenía el foco), así que el tabulador se
         * escapaba del diálogo.
         */
        log.focus();
        timer = window.setTimeout(() => {
          if (box.isConnected) siguiente();
        }, 380);
      });
      choices.appendChild(b);
    }
  };

  skip.addEventListener('click', revelar);
  siguiente();
}

/** Contacto: el CV siempre a la vista, y la entrevista separada del resto. */
function renderContact(): string {
  return `<div class="cv-download">
    <a class="chip chip--link" href="documents/CV_eng.pdf" download="CV_Daniel_Noya.pdf">${esc(t('cv_download'))}</a>
    <span class="cv-download__note">${esc(t('cv_note'))}</span>
  </div>${tabs([
    { label: t('tab_message'), html: renderInterview() },
    {
      label: t('tab_direct'),
      html: `<h3 class="tabpanel__title">${esc(t('contact_direct'))}</h3>
      <p class="chips"><a class="chip chip--link" href="mailto:${esc(content.person.email)}">${esc(content.person.email)}</a>${content.person.social.map(link).join('')}</p>`,
    },
  ])}`;
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
    const title = id === 'contact' ? t('interview_title') : t(sectionKey(id));
    this.el.innerHTML = `<div class="panel__card panel--${id}" role="dialog" aria-modal="true" aria-labelledby="panel-title">
      <header class="panel__head"><h2 id="panel-title">${esc(title)}</h2>
      <button type="button" class="panel__close" data-close aria-label="${esc(t('close'))}">✕</button></header>
      <div class="panel__body">${RENDER[id]()}</div></div>`;
    this.el.hidden = false;
    if (id === 'contact') {
      bindContactForm(this.el);
      bindInterview(this.el);
    }
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
