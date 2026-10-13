import type { SectionId } from '../data/content';
import { SECTION_IDS, SWEET_SPOT } from '../game/config';
import type { Input } from '../game/input';
import { getLang, setLang, t, type UIKey } from '../i18n';
import { esc, sectionKey } from './panels';

export interface HudCallbacks {
  onMenuSelect(id: SectionId): void;
  onToggleMute(): boolean; // devuelve el nuevo estado muted
}

/**
 * Un rótulo de rumbo y su última posición pedida, en píxeles.
 *
 * La posición se GUARDA en vez de escribirse al vuelo porque el recorte y la
 * separación necesitan conocer todos los rótulos a la vez: mover uno depende de
 * dónde hayan caído los otros, así que la colocación va en dos pasadas
 * (`placeLabel` pide, `layoutLabels` decide).
 */
interface HudLabel {
  el: HTMLElement;
  key: UIKey;
  text: HTMLElement;
  dist: HTMLElement;
  arrow: HTMLElement;
  x: number;
  y: number;
  /** `true` cuando está DENTRO de pantalla: cuelga de su punto en vez de centrarse. */
  bottom: boolean;
}

const clampNum = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));

/*
 * ICONOS DIBUJADOS, no emoji.
 *
 * El botón de sonido usaba 🔊/🔇 y el menú ☰: los tres son glifos del sistema,
 * así que cambian de forma, de color y de grosor según la plataforma (y en
 * algunas versiones de Windows salen a color, en medio de una interfaz pixel de
 * dos colores). Estos son rectángulos y triángulos sobre una rejilla de 16 px,
 * con `shape-rendering: crispEdges` para que el borde quede a píxel entero, y
 * heredan el color del botón con `currentColor`.
 */
const ICON = {
  sound:
    '<svg viewBox="0 0 16 16" width="19" height="19" aria-hidden="true" shape-rendering="crispEdges">' +
    '<rect x="2" y="6" width="3" height="4" fill="currentColor"/>' +
    '<path d="M5 6 L9 3 L9 13 L5 10 Z" fill="currentColor"/>' +
    '<path d="M11 5 L12.5 5 L12.5 11 L11 11 Z" fill="currentColor"/>' +
    '<path d="M14 4 L15 4 L15 12 L14 12 Z" fill="currentColor"/></svg>',
  muted:
    '<svg viewBox="0 0 16 16" width="19" height="19" aria-hidden="true" shape-rendering="crispEdges">' +
    '<rect x="2" y="6" width="3" height="4" fill="currentColor"/>' +
    '<path d="M5 6 L9 3 L9 13 L5 10 Z" fill="currentColor"/>' +
    '<path d="M11 5 L13 7 M13 5 L11 7" stroke="currentColor" stroke-width="1.6" fill="none"/>' +
    '<path d="M11 9 L13 11 M13 9 L11 11" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',
  menu:
    '<svg viewBox="0 0 16 16" width="19" height="19" aria-hidden="true" shape-rendering="crispEdges">' +
    '<rect x="2" y="3" width="12" height="2" fill="currentColor"/>' +
    '<rect x="2" y="7" width="12" height="2" fill="currentColor"/>' +
    '<rect x="2" y="11" width="12" height="2" fill="currentColor"/></svg>',
} as const;

export class Hud {
  /**
   * Una etiqueta por sección. Guardo las tres piezas por separado porque
   * `refreshText` sólo debe reescribir el TEXTO: si asignara `textContent` al
   * elemento completo se llevaría por delante la flecha y la distancia.
   */
  private labels = new Map<string, HudLabel>();
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
  private menuBtn!: HTMLButtonElement;
  private muteBtn!: HTMLButtonElement;
  private toastTimer = 0;
  private progressValue = 0;
  private muted: boolean;
  /* Estado de cada sección para el menú: visitada o bloqueada (las zonas de
     tiro que aún no se han descubierto). El progreso del chip ya se veía, pero
     la lista del menú era plana: no había forma de saber qué faltaba. */
  private visited = new Set<string>();
  private locked = new Set<string>();

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
    this.menuBtn = q<HTMLButtonElement>('[data-menu-btn]');
    this.menuBtn.addEventListener('click', () => {
      const open = this.menu.hidden;
      this.menu.hidden = !open;
      this.menuBtn.setAttribute('aria-expanded', String(open));
    });
    this.menu.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-section]');
      if (!b) return;
      this.closeMenu();
      this.cb.onMenuSelect(b.dataset.section as SectionId);
    });
    // Cerrar con Esc y con un clic fuera.
    //
    // Antes sólo lo cerraba su propio botón, así que el menú se quedaba abierto
    // tapando la pista mientras se jugaba. Con el panel abierto el Esc lo captura
    // el propio panel (que se cierra primero), y eso es lo que espera cualquiera
    // que haya usado un diálogo.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.menu.hidden) this.closeMenu();
    });
    document.addEventListener('pointerdown', (e) => {
      if (this.menu.hidden) return;
      const t = e.target as HTMLElement;
      if (this.menu.contains(t) || this.menuBtn.contains(t)) return;
      this.closeMenu();
    });
    window.addEventListener('langchange', () => this.refreshText());
    this.refreshText();
  }

  private refreshText(): void {
    const q = (s: string): HTMLElement => this.root.querySelector<HTMLElement>(s)!;
    q('[data-lang]').textContent = getLang() === 'es' ? 'EN' : 'ES';
    q('[data-lang]').setAttribute('aria-label', t('lang_toggle'));
    this.muteBtn.innerHTML = this.muted ? ICON.muted : ICON.sound;
    this.muteBtn.setAttribute('aria-label', this.muted ? t('unmute') : t('mute'));
    this.menuBtn.innerHTML = ICON.menu;
    this.menuBtn.setAttribute('aria-label', t('menu'));
    this.refreshMenu();
    this.progress.textContent = `${t('progress')} ${this.progressValue}/${SECTION_IDS.length}`;
    for (const { text, key } of this.labels.values()) text.textContent = t(key);
    this.recordEl.querySelector('.hud__record-tag')!.textContent = t('record_chip');
  }

  private closeMenu(): void {
    this.menu.hidden = true;
    this.menuBtn.setAttribute('aria-expanded', 'false');
  }

  /**
   * Lista del menú con el estado de cada sección: ✓ visitada, ○ pendiente,
   * 🔒 bloqueada (una zona de tiro que todavía no se ha descubierto).
   *
   * La marca va con `aria-hidden` y el estado se repite en un texto para
   * lectores de pantalla: un ✓ dentro de un botón no dice nada si se lee en voz
   * alta. NO se usa `role="menu"`: eso obliga al patrón completo de menú con
   * flechas y `menuitem`, y unos botones de verdad dentro de un `<nav>` ya son
   * navegables con el tabulador, que es lo que la gente hace.
   */
  private refreshMenu(): void {
    const items = SECTION_IDS.map((id) => {
      const done = this.visited.has(id);
      const locked = !done && this.locked.has(id);
      const state = done ? 'done' : locked ? 'locked' : 'open';
      const mark = done ? '✓' : locked ? '✕' : '○';
      const label = t(done ? 'state_done' : locked ? 'state_locked' : 'state_open');
      return `<button type="button" data-section="${id}" class="menu__item menu__item--${state}">
        <span class="menu__mark" aria-hidden="true">${mark}</span>${esc(t(sectionKey(id)))}
        <span class="sr-only"> — ${esc(label)}</span></button>`;
    }).join('');
    this.menu.innerHTML = `<p class="menu__title">${esc(t('menu_title'))}</p>${items}<a href="/classic/">${esc(t('classic'))}</a>`;
  }

  /** Estado de las secciones para el menú (y el contador de progreso). */
  setMenuState(visited: Iterable<string>, locked: Iterable<string>): void {
    this.visited = new Set(visited);
    this.locked = new Set(locked);
    this.refreshMenu();
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
      // Posición provisional: el primer `layoutLabels` la sobrescribe en el
      // mismo fotograma en el que se construye el rótulo.
      x: 0,
      y: 0,
      bottom: false,
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
    l.x = x;
    l.y = y;
    l.bottom = onScreen;
    l.arrow.style.transform = `rotate(${angle.toFixed(3)}rad)`;
    const d = `${Math.round(dist)} m`;
    if (l.dist.textContent !== d) l.dist.textContent = d;
  }

  /**
   * Recorta y separa los rótulos de rumbo dentro del viewport.
   *
   * Antes el recorte se hacía en coordenadas normalizadas con un margen FIJO
   * (0,84) que no sabía nada del tamaño del rótulo, y no había ninguna
   * separación entre rótulos. Medido con `getBoundingClientRect()`:
   *
   *   · a 828 px de ancho, 3 de los 6 salían fuera de pantalla (Proyectos
   *     −29 px por la izquierda, Experiencia −22 px, Entrevístame +28 px por la
   *     derecha);
   *   · a 1440 px, «Skills/Stats» y «Experiencia» se solapaban.
   *
   * Aquí se mide la caja REAL de cada rótulo (con el ancho que le da el texto
   * traducido, que cambia entre español e inglés), se mete dentro de la pantalla
   * con un margen, se le resta el sitio que ocupan la barra superior, el récord
   * y el aviso, y después los que se pisan se empujan en vertical. La lectura de
   * tamaños va en una pasada y la escritura en otra: si se leyera y escribiera
   * por rótulo, cada `offsetWidth` forzaría un reflow completo.
   */
  layoutLabels(viewW: number, viewH: number): void {
    const MARGIN = 10;
    const GAP = 6;
    // Zonas ocupadas por el propio HUD: barra de arriba (récord y botones) y
    // franja de abajo (récord, aviso y medidor).
    const TOP = 58;
    const BOTTOM = 104;
    const boxes: { l: HudLabel; x: number; y: number; w: number; h: number }[] = [];
    for (const l of this.labels.values()) {
      if (l.el.style.display === 'none') continue;
      const w = l.el.offsetWidth;
      const h = l.el.offsetHeight;
      // Dentro de pantalla el rótulo cuelga de su punto (ancla abajo); en el
      // borde se centra sobre él.
      const top = l.bottom ? h : h / 2;
      const bot = l.bottom ? 0 : h / 2;
      boxes.push({
        l,
        w,
        h,
        x: clampNum(l.x, MARGIN + w / 2, viewW - MARGIN - w / 2),
        y: clampNum(l.y, TOP + top, viewH - BOTTOM - bot),
      });
    }

    for (let pass = 0; pass < 3; pass++) {
      let moved = false;
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i]!;
          const b = boxes[j]!;
          if (Math.abs(a.x - b.x) >= (a.w + b.w) / 2 + GAP) continue;
          const aTop = a.y - (a.l.bottom ? a.h : a.h / 2);
          const aBot = a.y + (a.l.bottom ? 0 : a.h / 2);
          const bTop = b.y - (b.l.bottom ? b.h : b.h / 2);
          const bBot = b.y + (b.l.bottom ? 0 : b.h / 2);
          if (bTop >= aBot + GAP || aTop >= bBot + GAP) continue;
          // Se pisan: baja el de abajo y, si ya no cabe, sube el de arriba.
          const push = aBot + GAP - bTop;
          const bMax = viewH - BOTTOM - (b.l.bottom ? 0 : b.h / 2);
          const bNext = b.y + push;
          if (bNext <= bMax) {
            b.y = bNext;
          } else {
            b.y = bMax;
            const over = bNext - bMax;
            const aMin = TOP + (a.l.bottom ? a.h : a.h / 2);
            a.y = Math.max(aMin, a.y - over);
          }
          moved = true;
        }
      }
      if (!moved) break;
    }

    for (const b of boxes) {
      const anchor = b.l.bottom ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)';
      b.l.el.style.transform = `${anchor} translate(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px)`;
    }
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
