import { content, type SectionId } from '../data/content';
import { loc, t, type UIKey } from '../i18n';
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
}
export const statsSource: { get: () => GameStats | null } = { get: () => null };

const link = (l: { label: { es: string; en: string }; url: string }): string =>
  `<a class="chip chip--link" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener noreferrer">${esc(loc(l.label))}</a>`;

const RENDER: Record<SectionId, () => string> = {
  projects: () =>
    `<div class="grid">${content.projects
      .map(
        (p) => `<article class="card">
          <header><h3>${esc(p.title)}</h3><span class="muted">${p.year}</span></header>
          <p>${esc(loc(p.summary))}</p>
          ${p.details ? `<p class="muted">${esc(loc(p.details))}</p>` : ''}
          <p class="chips">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</p>
          <p class="chips">${p.links.map(link).join('')}</p>
        </article>`,
      )
      .join('')}</div>`,

  skills: () =>
    content.skills
      .map(
        (g) => `<section class="skillgroup"><h3>${esc(loc(g.name))}</h3>
        ${g.items
          .map(
            (i) => `<div class="stat"><span>${esc(i.name)}</span>
              <div class="bar" role="meter" aria-valuemin="1" aria-valuemax="10" aria-valuenow="${i.level}" aria-label="${esc(t('skills_level'))}: ${i.level}/10"><i style="width:${i.level * 10}%"></i></div></div>`,
          )
          .join('')}</section>`,
      )
      .join(''),

  stats: () => {
    const s = statsSource.get();
    if (!s) return `<p class="muted">${esc(t('stats_empty'))}</p>`;
    const pct = s.attempted > 0 ? Math.round((s.made / s.attempted) * 100) : null;
    return `<dl class="highlights">
      <div><dt>${esc(t('stats_shots'))}</dt><dd>${s.made}</dd></div>
      <div><dt>${esc(t('stats_attempts'))}</dt><dd>${s.attempted}</dd></div>
      <div><dt>${esc(t('stats_accuracy'))}</dt><dd>${pct === null ? esc(t('stats_left')) : `${pct}%`}</dd></div>
      <div><dt>${esc(t('stats_sections'))}</dt><dd>${s.visited} / ${s.total}</dd></div>
    </dl>`;
  },

  about: () => `
    <div class="playercard">
      <div class="jersey" aria-label="${esc(t('about_number'))}">${esc(content.person.jerseyNumber)}</div>
      <div><h3>${esc(content.person.name)}</h3><p class="muted">${esc(loc(content.person.role))} · ${esc(content.person.location)}</p></div>
    </div>
    ${content.about.paragraphs.map((p) => `<p>${esc(loc(p))}</p>`).join('')}
    <dl class="highlights">${content.about.highlights.map((h) => `<div><dt>${esc(loc(h.label))}</dt><dd>${esc(loc(h.value))}</dd></div>`).join('')}</dl>`,

  experience: () =>
    `<ol class="timeline">${content.timeline
      .map(
        (it) => `<li><span class="badge badge--${it.kind}">${esc(t(`kind_${it.kind}` as UIKey))}</span>
          <h3>${esc(loc(it.title))}</h3>
          <p class="muted">${esc(it.org)} · ${esc(it.start)} – ${it.end ? esc(it.end) : esc(t('present'))}</p>
          <p>${esc(loc(it.description))}</p></li>`,
      )
      .join('')}</ol>`,

  contact: () => `
    <p class="lead">${esc(t('interview_sub'))}</p>
    <div class="cv-download">
      <a class="chip chip--link" href="documents/CV_eng.pdf" download="CV_Daniel_Noya.pdf">
        ${esc(t('cv_download'))}
      </a>
      <span class="cv-download__note">${esc(t('cv_note'))}</span>
    </div>
    ${renderContactForm()}
    <h3>${esc(t('contact_direct'))}</h3>
    <p class="chips"><a class="chip chip--link" href="mailto:${esc(content.person.email)}">${esc(content.person.email)}</a>${content.person.social.map(link).join('')}</p>`,
};

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
    if (id === 'contact') bindContactForm(this.el);
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
      const f = [...this.el.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea')].filter((n) => !n.classList.contains('hp'));
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
