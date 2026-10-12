import type { SectionId } from '../data/content';
import { SECTION_IDS, SWEET_SPOT } from '../game/config';
import type { Input } from '../game/input';
import { getLang, setLang, t, type UIKey } from '../i18n';
import { esc, sectionKey } from './panels';

export interface HudCallbacks {
  onMenuSelect(id: SectionId): void;
  onToggleMute(): boolean; // devuelve el nuevo estado muted
}

export class Hud {
  /**
   * Una etiqueta por sección. Guardo las tres piezas por separado porque
   * `refreshText` sólo debe reescribir el TEXTO: si asignara `textContent` al
   * elemento completo se llevaría por delante la flecha y la distancia.
   */
  private labels = new Map<
    string,
    { el: HTMLElement; key: UIKey; text: HTMLElement; dist: HTMLElement; arrow: HTMLElement }
  >();
  private prompt!: HTMLElement;
  private meter!: HTMLElement;
  private needle!: HTMLElement;
  private sweet!: HTMLElement;
  private chargeEl!: HTMLElement;
  private recordEl!: HTMLElement;
  private toastEl!: HTMLElement;
  private live!: HTMLElement;
  private progress!: HTMLElement;
  private menu!: HTMLElement;
  private muteBtn!: HTMLButtonElement;
  private toastTimer = 0;
  private progressValue = 0;
  private muted: boolean;

  constructor(private root: HTMLElement, private cb: HudCallbacks, muted: boolean) {
    this.muted = muted;
    this.root.innerHTML = `
      <div class="hud">
        <div class="hud__top">
          <span class="chip" data-progress></span>
          <div class="hud__buttons">
            <button type="button" class="icon" data-mute></button>
            <button type="button" class="icon" data-lang></button>
            <button type="button" class="icon" data-menu-btn aria-haspopup="true" aria-expanded="false"></button>
          </div>
        </div>
        <nav class="menu" data-menu hidden></nav>
        <div class="hud__labels" data-labels></div>
        <div class="hud__record" data-record hidden>
          <span class="hud__record-tag"></span><span class="hud__record-num" data-record-num></span>
        </div>
        <div class="prompt" data-prompt hidden></div>
        <div class="meter" data-meter hidden aria-hidden="true"><i class="charge" data-charge></i><i class="sweet" data-sweet style="left:${((0.5 - SWEET_SPOT / 2) * 100).toFixed(1)}%;width:${(SWEET_SPOT * 100).toFixed(1)}%"></i><span class="ticks"></span><b class="needle" data-needle></b></div>
        <div class="toast" data-toast hidden></div>
        <div class="sr-only" data-live aria-live="polite"></div>
      </div>`;
    const q = <T extends HTMLElement>(s: string): T => this.root.querySelector<T>(s)!;
    this.prompt = q('[data-prompt]');
    this.meter = q('[data-meter]');
    this.needle = q('[data-needle]');
    this.sweet = q('[data-sweet]');
    this.chargeEl = q('[data-charge]');
    this.recordEl = q('[data-record]');
    q('[data-record] .hud__record-tag').textContent = t('record_chip');
    this.toastEl = q('[data-toast]');
    this.live = q('[data-live]');
    this.progress = q('[data-progress]');
    this.menu = q('[data-menu]');
    this.muteBtn = q<HTMLButtonElement>('[data-mute]');

    q('[data-lang]').addEventListener('click', () => setLang(getLang() === 'es' ? 'en' : 'es'));
    this.muteBtn.addEventListener('click', () => {
      this.muted = this.cb.onToggleMute();
      this.refreshText();
    });
    const menuBtn = q<HTMLButtonElement>('[data-menu-btn]');
    menuBtn.addEventListener('click', () => {
      const open = this.menu.hidden;
      this.menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    this.menu.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-section]');
      if (!b) return;
      this.menu.hidden = true;
      menuBtn.setAttribute('aria-expanded', 'false');
      this.cb.onMenuSelect(b.dataset.section as SectionId);
    });
    window.addEventListener('langchange', () => this.refreshText());
    this.refreshText();
  }

  private refreshText(): void {
    const q = (s: string): HTMLElement => this.root.querySelector<HTMLElement>(s)!;
    q('[data-lang]').textContent = getLang() === 'es' ? 'EN' : 'ES';
    q('[data-lang]').setAttribute('aria-label', t('lang_toggle'));
    this.muteBtn.textContent = this.muted ? '🔇' : '🔊';
    this.muteBtn.setAttribute('aria-label', this.muted ? t('unmute') : t('mute'));
    const mb = q('[data-menu-btn]');
    mb.textContent = '☰';
    mb.setAttribute('aria-label', t('menu'));
    this.menu.innerHTML =
      `<p class="menu__title">${esc(t('menu_title'))}</p>` +
      SECTION_IDS.map((id) => `<button type="button" data-section="${id}">${esc(t(sectionKey(id)))}</button>`).join('') +
      `<a href="/classic/">${esc(t('classic'))}</a>`;
    this.progress.textContent = `${t('progress')} ${this.progressValue}/${SECTION_IDS.length}`;
    for (const { text, key } of this.labels.values()) text.textContent = t(key);
    this.recordEl.querySelector('.hud__record-tag')!.textContent = t('record_chip');
  }

  addLabel(id: string, key: UIKey): void {
    const el = document.createElement('div');
    el.className = 'label';
    // Flecha + texto + distancia. La flecha sólo se ve cuando la sección queda
    // fuera de pantalla: dentro de pantalla estorba, porque la etiqueta ya está
    // encima del cartel y la dirección se lee sola.
    el.innerHTML =
      '<i class="label__arrow"></i><span class="label__text"></span><span class="label__dist"></span>';
    el.querySelector('.label__text')!.textContent = t(key);
    this.root.querySelector('[data-labels]')!.appendChild(el);
    this.labels.set(id, {
      el,
      key,
      text: el.querySelector('.label__text') as HTMLElement,
      dist: el.querySelector('.label__dist') as HTMLElement,
      arrow: el.querySelector('.label__arrow') as HTMLElement,
    });
  }

  /**
   * Coloca una etiqueta en píxeles de pantalla.
   *
   * `angle` es la dirección hacia la sección medida en el plano del suelo
   * respecto a hacia dónde mira la cámara: 0 = recto, ±π = a la espalda. Sólo
   * se usa cuando la sección queda fuera de pantalla, que es cuando el jugador
   * necesita la pista.
   */
  placeLabel(id: string, x: number, y: number, onScreen: boolean, angle: number, dist: number): void {
    const l = this.labels.get(id);
    if (!l) return;
    l.el.style.display = '';
    l.el.classList.toggle('label--edge', !onScreen);
    // En el borde se centra sobre el punto de anclaje; dentro de pantalla se
    // levanta sobre el cartel, que es lo que espera el ojo.
    const anchor = onScreen ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)';
    l.el.style.transform = `${anchor} translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    l.arrow.style.transform = `rotate(${angle.toFixed(3)}rad)`;
    const d = `${Math.round(dist)} m`;
    if (l.dist.textContent !== d) l.dist.textContent = d;
  }

  /** Marca las secciones todavía bloqueadas (Projects hasta encestar). */
  setLabelLocked(id: string, locked: boolean): void {
    this.labels.get(id)?.el.classList.toggle('label--locked', locked);
  }

  hideLabel(id: string, hidden: boolean): void {
    const l = this.labels.get(id);
    if (l) l.el.style.display = hidden ? 'none' : '';
  }

  /**
   * Récord permanente, abajo a la derecha.
   *
   * Antes el marcador solo vivía dentro del panel de Récord, o sea que para
   * saber cuánto llevabas (-> los tiros) tenías que entrar en la sección, y
   * y entrar en la sección te gastaba una zona de la pista. Con esto está
   * siempre a la
   * vista, que es de lo que sirve un marcador.
   */
  setRecord(made: number, attempted: number): void {
    this.recordEl.hidden = false;
    const pct = attempted > 0 ? Math.round((made / attempted) * 100) : 0;
    const txt = `${made}/${attempted}${attempted > 0 ? ` · ${pct}%` : ''}`;
    const num = this.recordEl.querySelector('[data-record-num]') as HTMLElement;
    if (num.textContent !== txt) num.textContent = txt;
  }

  setProgress(n: number): void {
    this.progressValue = n;
    this.progress.textContent = `${t('progress')} ${n}/${SECTION_IDS.length}`;
  }

  setPrompt(text: string | null): void {
    this.prompt.hidden = text === null;
    if (text !== null && this.prompt.textContent !== text) this.prompt.textContent = text;
  }

  /**
   * `sweet` es la anchura de la zona verde en fracción del medidor (0..1).
   *
   * Es un PARÁMETRO y no una constante porque la zona se estrecha con la
   * distancia al aro: antes estaba fijada en el HTML al construir el HUD, así
   * que la dificultad cambiaba en el cálculo pero el jugador veía siempre la
   * misma barra verde y no tenía forma de notarlo.
   */
  showMeter(value: number | null, sweet = SWEET_SPOT, charge = 0, center = 0.5): void {
    this.meter.hidden = value === null;
    if (value === null) {
      this.meter.classList.remove('meter--full');
      return;
    }
    // Barra de calentamiento: crece de izquierda a derecha mientras se mantiene
    // el disparo pulsado. Antes el medidor sólo movía la aguja, así que la
    // espera se leía como una pantalla estática y no había forma de saber
    // cuánto se llevaba cargado ni cuándo tocaba soltar.
    const pct = Math.max(0, Math.min(1, charge));
    this.chargeEl.style.width = `${(pct * 100).toFixed(1)}%`;
    this.meter.classList.toggle('meter--full', pct >= 0.999);
    this.needle.style.left = `${(value * 100).toFixed(1)}%`;
    // La zona verde se desplaza de lado a lado, así que su `left` ya no es la
    // mitad menos la mitad del ancho: es el centro que le toca ahora mismo.
    const w = Math.max(2, sweet * 100);
    this.sweet.style.left = `${(center * 100 - w / 2).toFixed(1)}%`;
    this.sweet.style.width = `${w.toFixed(1)}%`;
  }

  toast(text: string, ms = 2400): void {
    this.toastEl.textContent = text;
    this.toastEl.hidden = false;
    this.live.textContent = text;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => (this.toastEl.hidden = true), ms);
  }

  /** Joystick virtual + botones TIRO / ACCIÓN para pantallas táctiles. */
  mountTouch(input: Input): void {
    const wrap = document.createElement('div');
    wrap.className = 'touch';
    wrap.innerHTML = `
      <div class="joy" data-joy><div class="stick" data-stick></div></div>
      <div class="touch__btns">
        <button type="button" class="btn-round" data-act>E</button>
        <button type="button" class="btn-round btn-round--big" data-shoot>🏀</button>
      </div>`;
    this.root.appendChild(wrap);

    const joy = wrap.querySelector<HTMLElement>('[data-joy]')!;
    const stick = wrap.querySelector<HTMLElement>('[data-stick]')!;
    const R = 48;
    let pid: number | null = null;
    const set = (e: PointerEvent): void => {
      const r = joy.getBoundingClientRect();
      let dx = e.clientX - (r.left + r.width / 2);
      let dy = e.clientY - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy);
      if (len > R) {
        dx = (dx / len) * R;
        dy = (dy / len) * R;
      }
      stick.style.transform = `translate(${dx}px, ${dy}px)`;
      input.joy = { x: dx / R, y: dy / R };
    };
    const end = (): void => {
      pid = null;
      stick.style.transform = '';
      input.joy = { x: 0, y: 0 };
    };
    joy.addEventListener('pointerdown', (e) => {
      pid = e.pointerId;
      joy.setPointerCapture(pid);
      set(e);
    });
    joy.addEventListener('pointermove', (e) => pid === e.pointerId && set(e));
    joy.addEventListener('pointerup', end);
    joy.addEventListener('pointercancel', end);

    const shoot = wrap.querySelector<HTMLElement>('[data-shoot]')!;
    shoot.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      input.shootHeld = true;
    });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave'] as const) shoot.addEventListener(ev, () => (input.shootHeld = false));
    wrap.querySelector<HTMLElement>('[data-act]')!.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      input.pressInteract();
    });
  }
}
