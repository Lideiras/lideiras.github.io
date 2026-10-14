import * as THREE from 'three';

/**
 * Estela de fuego del balón (modo TAKEOVER).
 *
 * ESTA ES LA FORMA MÁS BARATA QUE EXISTE, y en este proyecto la barata es la
 * única aceptable: la máquina de referencia es una Intel HD 4600 de 2012, con
 * un coste por píxel de ~22,4 ms. Cualquier cosa que multiplicase el número de
 * llamadas de dibujo se notaría en la mediana.
 *
 * Por eso es un `THREE.Points` con un ÚNICO buffer de posiciones y colores:
 *
 *   · UNA llamada de dibujo para toda la estela, aunque añada o quite celdas de
 *     por dentro. Una cinta de cubitos sería una llamada por cubito.
 *   · `AdditiveBlending` + `depthWrite: false`: la llama se suma a lo que hay
 *     detrás sin borrarlo, que es lo que produce el resplandor sin necesidad de
 *     ningún mapa de luz ni transparencias ordenadas.
 *   · `castShadow = false` y sin material de sombra: el mapa de sombras de este
 *     juego es ESTÁTICO (`shadowMap.autoUpdate = false`, horneado una vez) y nada
 *     que se mueva puede proyectar. Una llama que proyectara sombra rompería el
 *     horneado entero.
 *   · Sin luces: los colores van en el atributo `color`, no calculados. Una
 *     `PointsMaterial` con luces costaría un programa de más por subir.
 *
 * El buffer es CIRCULAR: se va escribiendo la cabeza y al llegar al final se
 * vuelve al principio, sin reordenar ni reservar memoria.
 */

/** Puntos en la estela. 28 es lo que se ve con cola sin llegar a arrastrar. */
const N = 28;

/** Segundos que tarda un punto en apagarse por completo. */
const VIDA = 0.45;

export class FireTrail {
  readonly object: THREE.Points;

  private readonly pos = new Float32Array(N * 3);
  private readonly col = new Float32Array(N * 3);
  private readonly age = new Float32Array(N);
  private readonly posAttr: THREE.BufferAttribute;
  private readonly colAttr: THREE.BufferAttribute;

  /** Índice del punto más reciente. */
  private head = 0;
  /** Puntos escritos alguna vez (el buffer arranca apagado, todo a 0 = origen). */
  private escritos = 0;
  /** 0 = sin fuego, 1 = fuego pleno. Lo interpola quien lo llama. */
  private intensidad = 0;

  constructor() {
    const geo = new THREE.BufferGeometry();
    this.posAttr = new THREE.BufferAttribute(this.pos, 3);
    this.colAttr = new THREE.BufferAttribute(this.col, 3);
    // `setUsage(DynamicDrawUsage)`: el búfer se reescribe entero cada fotograma
    // y así el driver lo sube a VRAM por la vía rápida en vez de por la lenta.
    this.posAttr.setUsage(THREE.DynamicDrawUsage);
    this.colAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.posAttr);
    geo.setAttribute('color', this.colAttr);
    // Se escriben N puntos siempre; los apagados se pintan de negro, que con
    // mezcla aditiva es indistinguible de no estar. Así el `drawRange` es
    // constante y no hay que tocar la cuenta de vértices cada fotograma.
    geo.setDrawRange(0, N);

    const mat = new THREE.PointsMaterial({
      size: 0.34,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });

    this.object = new THREE.Points(geo, mat);
    this.object.visible = false;
    this.object.castShadow = false;
    this.object.receiveShadow = false;
    // La estela se dibuja aunque la cámara la mire de lejos: los puntos van con
    // la cámara y no hay nada que descartar, y un frustum mal calculado aquí
    // haría que la llama apareciera y desapareciera al orbitar.
    this.object.frustumCulled = false;
  }

  /**
   * Enciende o apaga el fuego.
   *
   * `k` entre 0 y 1. No se guarda como un interruptor: al apagar hay que
   * dejar que los puntos ya escritos se apaguen solos, que es lo que hace
   * `update` con el multiplicador.
   */
  setIntensity(k: number): void {
    this.intensidad = Math.max(0, Math.min(1, k));
    if (this.intensidad > 0) this.object.visible = true;
  }

  get on(): boolean {
    return this.intensidad > 0;
  }

  /**
   * Añade una muestra de la posición del balón y envejece lo demás.
   *
   * Sólo se escribe si hay fuego Y el balón se está moviendo de verdad: con el
   * balón parado en la mano, oipartiendo| una muestra por fotograma, el fuego se
   * acumularía en un punto y parecería una luz pegada al jugador en vez de una
   * estela.
   */
  update(dt: number, centro: THREE.Vector3, velocidad: number): void {
    const k = this.intensidad;
    if (k <= 0) {
      // Sin fuego: seguir envejeciendo hasta apagarlo del todo, y entonces
      // esconder el objeto para no pagar ni una llamada de dibujo.
      let vivos = 0;
      for (let i = 0; i < N; i++) {
        if (this.age[i] < VIDA) {
          this.age[i] += dt;
          this.col[i * 3] = 0;
          this.col[i * 3 + 1] = 0;
          this.col[i * 3 + 2] = 0;
          vivos++;
        }
      }
      this.colAttr.needsUpdate = true;
      if (vivos === 0) this.object.visible = false;
      return;
    }

    // El fuego sale a partir de una velocidad mínima: por debajo de eso el
    // balón está en la mano y la «estela» sería un punto.
    const minVel = 1.2;
    const paso = Math.max(dt, 1 / 120);
    const muestras = velocidad > minVel ? Math.max(1, Math.min(4, Math.ceil(paso * 60))) : 0;

    for (let m = 0; m < muestras; m++) {
      const t = muestras > 1 ? m / muestras : 0;
      this.head = (this.head + 1) % N;
      this.escritos = Math.min(N, this.escritos + 1);
      const i = this.head * 3;
      // Se retrasa un poco cada muestra para que el fuego «salga» del balón en
      // vez de estar clavado en él.
      this.pos[i] = centro.x;
      this.pos[i + 1] = centro.y;
      this.pos[i + 2] = centro.z;
      this.age[this.head] = -t * 0.02;
      this.col[i] = k;
      this.col[i + 1] = k * 0.82;
      this.col[i + 2] = k * 0.34;
    }

    for (let i = 0; i < N; i++) {
      if (this.age[i] >= VIDA) {
        this.col[i * 3] = 0;
        this.col[i * 3 + 1] = 0;
        this.col[i * 3 + 2] = 0;
        continue;
      }
      this.age[i] += dt;
      const v = 1 - this.age[i] / VIDA;
      const f = v * v * k; // al cuadrado: el resto de la llama se apaga deprisa
      this.col[i * 3] = f;
      this.col[i * 3 + 1] = f * 0.62;
      this.col[i * 3 + 2] = f * 0.16;
    }

    this.posAttr.needsUpdate = true;
    this.colAttr.needsUpdate = true;
  }

  dispose(): void {
    this.object.geometry.dispose();
    (this.object.material as THREE.Material).dispose();
  }
}