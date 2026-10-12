const MOVE_KEYS: Record<string, [number, number]> = {
  KeyW: [0, -1], ArrowUp: [0, -1],
  KeyS: [0, 1], ArrowDown: [0, 1],
  KeyA: [-1, 0], ArrowLeft: [-1, 0],
  KeyD: [1, 0], ArrowRight: [1, 0],
};

/** Teclado + controles táctiles. Mundo: +X derecha, +Z hacia la cámara (abajo en pantalla). */
export class Input {
  private keys = new Set<string>();
  private interactFlag = false;
  private enabled = true;
  joy = { x: 0, y: 0 };
  shootHeld = false;

  constructor() {
    window.addEventListener('keydown', this.onDown);
    window.addEventListener('keyup', this.onUp);
    window.addEventListener('blur', this.reset);
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onDown);
    window.removeEventListener('keyup', this.onUp);
    window.removeEventListener('blur', this.reset);
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (!on) this.reset();
  }

  /** Vector de movimiento con magnitud ≤ 1. */
  move(): { x: number; z: number } {
    if (!this.enabled) return { x: 0, z: 0 };
    let x = this.joy.x;
    let z = this.joy.y;
    for (const k of this.keys) {
      const v = MOVE_KEYS[k];
      if (v) {
        x += v[0];
        z += v[1];
      }
    }
    const len = Math.hypot(x, z);
    return len > 1 ? { x: x / len, z: z / len } : { x, z };
  }

  pressInteract(): void {
    if (this.enabled) this.interactFlag = true;
  }

  consumeInteract(): boolean {
    const v = this.interactFlag;
    this.interactFlag = false;
    return v;
  }

  private reset = (): void => {
    this.keys.clear();
    this.joy = { x: 0, y: 0 };
    this.shootHeld = false;
    this.interactFlag = false;
  };

  private isTyping(e: KeyboardEvent): boolean {
    const el = e.target as HTMLElement | null;
    return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  }

  private onDown = (e: KeyboardEvent): void => {
    if (!this.enabled || this.isTyping(e)) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) this.shootHeld = true;
      return;
    }
    if (e.code === 'KeyE' && !e.repeat) this.interactFlag = true;
    if (e.code in MOVE_KEYS) {
      e.preventDefault();
      this.keys.add(e.code);
    }
  };

  private onUp = (e: KeyboardEvent): void => {
    if (e.code === 'Space') this.shootHeld = false;
    this.keys.delete(e.code);
  };
}
