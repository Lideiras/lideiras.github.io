import * as THREE from 'three';
import { content, type SectionId } from '../data/content';
import { t } from '../i18n';
import { DialogueBox } from '../ui/dialogue';
import { Hud } from '../ui/hud';
import { PanelManager, sectionKey, signKey, statsSource } from '../ui/panels';
import { Sfx } from './audio';
import { Ball } from './ball';
import { ARENA_LAMPS, buildCourt, buildCourtLines, buildScoreboard } from './builders/court';
import {
  RECOGE_TIME, animateHuman, buildHuman, handWorld, holdPeso, mezclaPeso, poseCelebrate, poseDunk, poseLejano,
  poseShoot, regateAltura, recogePeso,
} from './builders/human';
import { batchStaticMeshes } from './builders/batch';
import { NET, buildBallCart, buildBench, buildHoop, buildScorerTable, buildTunnel, buildZoneRing, createBallMesh } from './builders/props';
import { PLAYER_RADIUS, buildColliders, resolveCircle } from './collide';
import { loadModel, normalize } from './assets';
import { VOXEL_MATERIAL, canvasTexture, noCastShadow } from './builders/util';
import { animateTvOperator, animateTvReporter, buildInterviewSet } from './builders/tv';
import { comentar, nuevoComentarista, type Suceso } from './commentary';
import {
  BALL, CAMERA, CARRITO, CONCURSO, CONCURSO_SIDE,
  DUNK_RANGE, DUNK_RUN_MIN, LONG_RANGE, TRIPLES,
  SECTION_CAMERA, HAND_SWITCH_ANGLE, INTERVIEW, PLAYER, RIM, SECTION_IDS, SHOOT_JUMP, SHOOT_RANGE,
  TAKEOVER_HITS,
  ZONES, rimX, type Side, type Zone,
} from './config';
import {
  avanzarCarro, avanzarReloj, arrancarReloj, carroVacio, empezar, enBocina, nuevoConcurso, puedeCoger, puedeTirar,
  quedanCarros, resolverTiro, salir, tomarBalon, terminar,
} from './contest';
import { dunkPose, dunkX, dunkY, dunkZ, newDunk, puedeMate, startDunk, stepDunk } from './dunk';
import { FireTrail } from './fireTrail';
import { Input } from './input';
import { launchJump, newJump, stepJump } from './jump';
import { applyShotError, difficultyAt, evaluateMeter, meterAt, solveShot, sweetCenterAt, sweetSpotAt } from './shot';

/**
 * `attract` es el estado en el que el juego EXISTE pero no se juega: la escena
 * ya está construida y horneada (`createGame` la deja lista antes de devolver)
 * y el bucle ya está girando, pero el jugador no controla nada.
 *
 * No hizo falta tocar nada de la lógica para conseguirlo: `update()` ya se
 * cierra con `const playing = mode === 'play'` y `setMode` desactiva el input
 * fuera de `play`. Añadir el caso apaga el juego, no lo apaga a medias.
 */
type Mode = 'play' | 'panel' | 'interview' | 'attract';
export interface GameHandle { beginAttract(): void; start(): void; dispose(): void }

const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
/**
 * Diferencia angular con signo, metida en (-π, π].
 *
 * Sin esto, dos ángulos a 350° y a 10° darían una diferencia de -340° en vez
 * de +20°, y cualquier comparación o interpolación angular se iría por las
 * ramas equivocadas. Sale del `atan2(sen, cos)` que ya usaba el lerp.
 */
const wrapPi = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
const lerpAngle = (a: number, b: number, k: number): number => a + wrapPi(b - a) * k;
/*
 * Cede el turno un fotograma, para que el loader pueda pintar entre fases.
 *
 * Con la pestaña OCULTA no hay fotogramas (`requestAnimationFrame` se para), y
 * la carga se quedaba esperando uno para siempre: si alguien abre el juego en
 * una pestaña de fondo, no termina de cargar hasta que la mira. En ese caso se
 * cede con temporizador: el fotograma no se va a pintar igualmente, pero la
 * carga avanza y el juego está listo al cambiar de pestaña.
 */
const nextFrame = (): Promise<void> =>
  document.hidden
    ? new Promise((r) => setTimeout(r, 0))
    : new Promise((r) => requestAnimationFrame(() => r()));

function loadSet(key: string): Set<SectionId> {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown;
    return new Set((Array.isArray(raw) ? raw : []).filter((x): x is SectionId => SECTION_IDS.includes(x as SectionId)));
  } catch {
    return new Set();
  }
}
function saveSet(key: string, s: Set<SectionId>): void {
  try {
    localStorage.setItem(key, JSON.stringify([...s]));
  } catch {
    /* ignorar */
  }
}

/** Récord de la 6.ª sección (canasta derecha). Persiste entre visitas. */
function loadStats(): { made: number; attempted: number } {
  try {
    const raw = JSON.parse(localStorage.getItem('court.stats') ?? '{}') as { made?: unknown; attempted?: unknown };
    return {
      made: typeof raw.made === 'number' && raw.made >= 0 ? raw.made : 0,
      attempted: typeof raw.attempted === 'number' && raw.attempted >= 0 ? raw.attempted : 0,
    };
  } catch {
    return { made: 0, attempted: 0 };
  }
}
function saveStats(s: { made: number; attempted: number }): void {
  try {
    localStorage.setItem('court.stats', JSON.stringify(s));
  } catch {
    /* almacenamiento bloqueado: el récord no persiste, el juego sigue */
  }
}

/**
 * Mejor concurso de triples, guardado aparte del récord de tiros.
 *
 * Son dos marcas distintas y no se mezclan: el récord cuenta la vida entera del
 * jugador (y crece tirada a tirada), y el concurso es una partida de 60 s. Si
 * vivieran en la misma cifra, entrar al concurso una vez destrozaría el
 * porcentaje de acierto del récord y viceversa.
 */
function loadMejorConcurso(): number {
  try {
    const v = Number(localStorage.getItem('court.contest') ?? 0);
    return Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;
  } catch {
    return 0;
  }
}
function saveMejorConcurso(v: number): void {
  try {
    localStorage.setItem('court.contest', String(v));
  } catch {
    /* almacenamiento bloqueado: la marca no persiste, el juego sigue */
  }
}

export async function createGame(opts: { canvas: HTMLCanvasElement; onProgress: (p: number) => void }): Promise<GameHandle> {
  const { canvas, onProgress } = opts;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  /*
   * INTERRUPTORES DE URL.
   *
   * Se leen AQUÍ, al principio, y no donde se usan, porque dos de ellos
   * condicionan cosas que pasan MUCHO antes: `?nolambert=1` decide el material
   * de todas las mallas del mundo y tiene que estar resuelto antes de hornear
   * sombras y de precompilar, y `?perf=1` enciende un log que va desde el primer
   * fotograma. Declararlos aquí y leerlos donde hacen falta evita el
   * "temporal dead zone" de un `const` declarado más abajo y deja la lista
   * entera a la vista en un solo sitio.
   *
   *  · `?nobatch=1`   — no funde las mallas estáticas (abajo, junto al fundido).
   *  · `?nopre=1`     — no precompila (abajo, junto a la precarga).
   *  · `?noprewarm=1` — precompila pero NO dibuja cada vista.
   *  · `?nolambert=1` — devuelve el voxel a `MeshStandardMaterial`.
   *  · `?perf=1`      — heartbeat de rendimiento en producción.
   *
   * Los tres primeros son SÓLO DESARROLLO, como estaban. `?nolambert=1` también
   * (es un interruptor de medición, y en producción nadie va a comparar dos
   * builds). `?perf=1` es el único que se respeta fuera de desarrollo, y porque
   * en producción NUNCA sale por defecto: la consola de un jugador que no ha
   * pedido nada no se llena con una línea cada dos segundos.
   */
  const parametrosDev = new URLSearchParams(location.search);
  const sinLambert = import.meta.env.DEV && parametrosDev.has('nolambert');
  const verPerf = import.meta.env.DEV || parametrosDev.has('perf');

  /*
   * `?escala=N` SÍ se respeta fuera de desarrollo, como `?perf`.
   *
   * Es el interruptor con el que el usuario puede hacer el A/B de la nitidez
   * inicial en SU máquina sin que nadie tenga que tocar el código ni esperar a
   * un build nuevo: `?escala=1` para el comportamiento viejo (cascada desde 1,0)
   * y `?escala=0.7` para el nuevo. Los interruptores de arriba son de
   * diagnóstico interno —reproducen síntomas que ya están arreglados—; este mide
   * una decisión que afecta a lo que se ve, y eso hay que poder hacerlo sin
   * reconstruir.
   */

  /*
   * ESCALA DE PARTIDA, Y POR QUÉ NO ES LA DEL `devicePixelRatio`.
   * =========================================================
   *
   * El techo era `min(devicePixelRatio, 1,5 en táctil / 2 en ratón)` y dejaba
   * que la calidad adaptativa DESCUBRIERA sola lo que la máquina puede. En el
   * equipo del propietario (Intel HD 4600 de 2012, ANGLE/D3D11) el log da la
   * cascada 1,0 → 0,9 → 0,8 → 0,7 con una decisión cada ~1,3 s: unos 7 s
   * entrando con la imagen borrosa, que es lo que se ha reportado más de una vez.
   *
   * La cascada no es un fallo —es el mecanismo funcionando, y hace bien su
   * trabajo: cada peldaño exige TRES decisiones seguidas y luego hay que
   * aguantar 20 s para reintentar el techo— es una espera. Y se puede ahorrar.
   *
   * ────────────────────────────────────────────────────────────────────────────
   * CÓMO SE AHORRA: MIDIENDO, NO ADIVINANDO
   * ────────────────────────────────────────────────────────────────────────────
   *
   * Hubo aquí una heurística sobre el NOMBRE de la GPU (`hardwareFlojo()`:
   * reglas sobre "Intel HD Graphics 4000", "Adreno 3xx", "Mali-T7"…). Se ha
   * QUITADO, y el motivo es que fallaba justo en el caso que importaba:
   *
   *   · normalizaba el nombre borrando los grupos entre paréntesis con
   *     `/\([^)]*\)/g`, y ANGLE **anida** paréntesis: en
   *     `ANGLE (Intel, Intel(R) HD Graphics 4600 (0x…412), D3D11)` esa
   *     expresión se come `(Intel, Intel(R)` COMPLETO. La cadena acababa siendo
   *     `"angle hd graphics 4600 direct3d11 d3d11"`, sin la palabra "intel", y
   *     ninguna de las cuatro reglas casaba. Log del propietario:
   *     `escala inicial 1 … sin cambios respecto a antes`, en una tarjeta que
   *     era exactamente el caso que la heurística buscaba.
   *   · y, más en general, una lista de nombres es una apuesta sobre el
   *     hardware que cada usuario tiene. Falla en las dos direcciones y no
   *     aprende de nada.
   *
   * Lo que hay en su lugar es una MEDIDA, y sale gratis: durante la precarga ya
   * se dibujan las siete vistas para subir los búferes de geometría. Con la
   * escena ya calentada, un fotograma medido en el encuadre real de juego ES el
   * coste de régimen de esa máquina, y de ahí sale la escala de partida. Cero
   * listas, cero falsos positivos, y funciona con el hardware de mañana.
   *
   * LO QUE CAMBIA, y es lo único:
   *
   *  · el punto de partida (`pixelRatio` al construir el renderer), y
   *  · el techo, porque `ESCALA_MAX` se deriva de `pixelRatio`.
   *
   * NO se toca `ESCALA_MIN`, ni los umbrales de `calidad()`, ni los 45
   * fotogramas de calentamiento, ni el mecanismo de `techoFallido` y sus
   * reintentos, ni el muestreo de coste de `frame()`. La calidad adaptativa
   * sigue teniendo todo el mando: si el hardware identificado como flojo acaba
   * dando 60 fps de sobra, la escalada sube sola hasta el techo, y si el
   * hardware desconocido es en realidad flojo, la cascada sigue igual que
   * antes. Sólo cambia de dónde parte y hasta dónde puede llegar.
   *
   * ────────────────────────────────────────────────────────────────────────────
   * LO QUE EL JUGADOR NOTA (y hay que decirlo, porque no es gratis)
   * ────────────────────────────────────────────────────────────────────────────
   *
   * En ese hardware la imagen entra YA a 0,7 de resolución en lugar de entrar a
   * 1,0 e irse bajando durante los primeros segundos. Es más borrosa de
   * entrada, desde el primer fotograma y hasta que la escalada suba. Es
   * exactamente lo que se ha pedido («tarda en tener fluidez»), y visualmente NO
   * cambia ni un vértice, ni un color, ni una luz: la misma escena, la misma
   * cámara y las mismas luces, dibujadas con menos píxeles.
   *
   * La escala sale de `elegirEscalaInicial()`, que la MIDE durante la precarga
   * (ver el bloque de arriba). Antes de este cambio salía aquí de
   * `devicePixelRatio` y la decidía la cascada; ahora se mide, y `?escala=N`
   * permite forzarla para comparar a ojo.
   */
  const ESCALA_MIN = 0.7;

  interface LecturaGpu {
    /** Nombre del renderer, o '' si el navegador no lo ha dado. */
    renderer: string;
    vendor: string;
    /** Valores crudos, para poder decir «ENMASCARADO» y enseñar lo que vino. */
    rendererCrudos: string[];
    vendorCrudos: string[];
  }

  /**
   * Nombre real de la GPU, o la cadena vacía si no se puede saber.
   *
   * Se lee UNA vez y la usan dos cosas: la escala de partida de arriba y el
   * bloque `[gpu]` del final. Vive aquí, y no en el bloque del log, porque la
   * escala hay que decidirla ANTES de construir nada —si no, el primer fotograma
   * de la partida se dibuja al escalado viejo y luego baja, que es justo la
   * cascada que se quiere quitar.
   *
   * Las dos vías (extensión y `gl.RENDERER`/`gl.VENDOR`) y el descarte de los
   * valores que son enums disfrazados están explicados en el bloque del log.
   */
  function leerGpu(): LecturaGpu {
    const g = renderer.getContext();
    const ext = g.getExtension('WEBGL_debug_renderer_info') as {
      UNMASKED_RENDERER_WEBGL?: number;
      UNMASKED_VENDOR_WEBGL?: number;
    } | null;
    const param = (p: number | undefined): string => {
      if (p === undefined) return '';
      try {
        const v: unknown = g.getParameter(p);
        return v === null || v === undefined ? '' : String(v);
      } catch {
        return '';
      }
    };
    const esNombre = (s: string): boolean =>
      s.length > 0 && !/^\d+$/.test(s) && !/^0x[0-9a-f]+$/i.test(s) && s !== 'null' && s !== 'undefined';
    const rendererCrudos = [param(ext?.UNMASKED_RENDERER_WEBGL), param(g.RENDERER)];
    const vendorCrudos = [param(ext?.UNMASKED_VENDOR_WEBGL), param(g.VENDOR)];
    return {
      renderer: rendererCrudos.find(esNombre) ?? '',
      vendor: vendorCrudos.find(esNombre) ?? '',
      rendererCrudos,
      vendorCrudos,
    };
  }

  /*
   * La decisión en sí va DESPUÉS de crear el renderer, porque leer el nombre de
   * la GPU es pedirle algo al contexto WebGL. Lo que se declara aquí es sólo lo
   * que esa decisión usa: el suelo de la calidad adaptativa y las reglas para
   * reconocer un hardware flojo.
   */

  /**
   * Paleta de cielo y luz, en la línea de Trove: cielo saturado, sol cálido
   * y rebote frío del suelo. Centralizado aquí para que no se repartan
   * colores sueltos por el código.
   */
  const SKY = {
    // Techo del pabellón, no cielo: dentro no se ve el exterior, así que el
    // fondo es oscuro y toda la luz de la escena es artificial.
    sky: 0x101a2c,
    horizon: 0x1e2a44,
    skyLight: 0xfff4d6, // luz cenital cálida
    groundBounce: 0x6f7fb5, // rebote frío del parqué
    sun: 0xfff1cf,
    fill: 0x9fc4ff,
  } as const;

  onProgress(0.05);
  /*
   * TIPOGRAFÍAS ANTES DE QUE EXISTA NADA QUE LAS USE.
   *
   * Antes sólo se esperaba a Bebas Neue, que es la de respaldo para textos
   * largos. La que de verdad pinta el HUD es Silkscreen, y ésa se quedaba
   * bajando en segundo plano: el HUD se construía, `layoutLabels()` medía el
   * `offsetWidth` de los seis rótulos con la tipografía de reserva, y un
   * fotograma después la de verdad llegaba y **todo el ancho estaba mal**.
   *
   * Con eso no sólo las etiquetas salían en el sitio durante un instante: cada
   * cambio de fuente invalida el texto y obliga al navegador a rehacer el
   * diseño de la página, y eso es un pico de CPU de varios milisegundos con el
   * bucle de juego corriendo. Es parte de los "primeros segundos a tirones".
   */
  await Promise.all([
    document.fonts.load('48px "Bebas Neue"'),
    document.fonts.load('700 16px "Silkscreen"'),
    document.fonts.load('400 16px "Silkscreen"'),
  ]).catch(() => undefined);

  // ───────── Renderer, escena, cámara, luces
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });

  /*
   * Y AQUÍ, ya con el contexto, el techo y el punto de partida. Va en este punto,
   * y no más arriba, por una razón de orden de ejecución y no de gusto: leer el
   * renderer es una llamada al contexto WebGL, y el contexto no existe hasta
   * esta línea.
   *
   * El punto de partida es el de siempre (`devicePixelRatio` con tope) porque la
   * decisión de verdad se toma DESPUÉS, con la escena ya construida y calentada:
   * ver `elegirEscalaInicial()`, que mide un fotograma en el encuadre real de
   * juego durante la precarga y de ahí sale la escala con la que se entra. Esta
   * línea sólo pone el techo.
   */
  const gpu = leerGpu();
  const pixelRatioNativo = Math.min(window.devicePixelRatio, coarse ? 1.5 : 2);
  let pixelRatio = pixelRatioNativo;
  let motivoEscala = `devicePixelRatio con tope ${coarse ? 1.5 : 2}`;
  const escalaForzada = parametrosDev.has('escala');
  if (escalaForzada) {
    const pedida = Number(parametrosDev.get('escala'));
    if (Number.isFinite(pedida) && pedida > 0) {
      pixelRatio = clamp(pedida, 0.5, 3);
      motivoEscala = `forzada por ?escala=${parametrosDev.get('escala')}`;
    } else {
      console.warn(`[gpu] ?escala=${parametrosDev.get('escala')} no es un número mayor que 0; se ignora`);
    }
  }
  console.info(
    `[gpu] ${gpu.renderer || '(el navegador no ha dado el nombre de la GPU)'} · ` +
      `escala de partida ${pixelRatio} (${motivoEscala}) · ` +
      `la definitiva la mide la precarga (elegirEscalaInicial)`,
  );

  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  /*
   * MAPA DE SOMBRAS ESTÁTICO.
   *
   * Medido en la GPU del panel (Intel HD 4600, ANGLE/D3D11) con un contador a
   * nivel de WebGL, no con `renderer.info`: `info` NO cuenta el pase de sombras,
   * porque en Three.js `info.reset()` va DESPUÉS de `shadowMap.render()`.
   *
   * El pase de sombras costaba **173 draw calls y 367.480 triángulos en cada
   * fotograma**: entre el 61 % y el 79 % de las llamadas de dibujo del fotograma
   * entero (269 en la vista de juego, 219-275 en las seis secciones) y el 47 %
   * de los triángulos enviados. Y no se veía ni un píxel de ese trabajo:
   * comparando el fotograma con el mapa recién horneado contra el mismo con
   * `shadowMap.enabled = false` (que quita `USE_SHADOWMAP` del shader), la
   * diferencia máxima por canal en las 7 vistas medidas es **0**. La causa es la
   * dirección de la luz: el foco del techo está en la vertical, así que cada
   * objeto proyecta su sombra justo debajo de sí mismo, donde su propio cuerpo
   * la tapa, y el sesgo (`bias` + `normalBias`) termina de borrarla.
   *
   * Por eso el mapa se hornea A DEMANDA (`bakeShadows()`) en vez de cada frame.
   * Para que un solo horneado siga siendo correcto indefinidamente, ningún
   * objeto que se mueva puede proyectar: el jugador (41.586 triángulos), el
   * balón y los dos actores del plató se quedan fuera del mapa (ver abajo).
   * Después de eso el horneado dibujó **65 draw calls y 198.932 triángulos** en
   * vez de 173 y 367.480. Tras el fundido de mallas estáticas (BITACORA §3l) y la
   * limpieza de proyectantes de §3j, la medida de hoy del horneado es **9 draw
   * calls y 281.388 triángulos**, y no queda ningún proyectante que se mueva.
   *
   * Si algún día se inclina la luz para que las sombras se vean (fase 3 del
   * informe), hay que volver a activar `castShadow` en esos cuatro objetos
   * móviles y rehornear al moverlos: entonces el mapa estático deja de ser
   * válido y el recorte de draw calls hay que buscarlo en otro sitio.
   */
  renderer.shadowMap.autoUpdate = false;
  // Trove es una escena luminosa y saturada. ACES con exposición 1 lo apagaba y
  // desaturaba; se sube la exposición y se deja que el color quede vivo.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // 1,18 era la exposición de una escena diurna. En un pabellón la luz
  // artificial tiene que destacar sobre un entorno oscuro: bajarla hace que el
  // contraste entre pista iluminada y graderío apagado sea evidente.
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  // Cielo de mediodía, no un vacío negro. Es el cambio de mayor impacto: en Trove
  // el horizonte siempre es color, nunca oscuridad.
  scene.background = new THREE.Color(SKY.sky);
  scene.fog = new THREE.Fog(SKY.horizon, 38, 96);
  const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 120);

  /*
   * ILUMINACIÓN DE PABELLÓN CUBIERTO.
   *
   * La versión anterior añadía luces ENCIMA de las de exterior: la escena
   * quedaba algo más brillante, pero con el mismo carácter de pista al aire
   * libre. Un pabellón no se ilumina así. Aquí se quita el sol del todo y toda
   * la luz sale de focos altos, que es lo que cambia la imagen:
   *
   *  · **No hay sol.** La pista está bajo techo: ninguna luz viene de fuera.
   *  · **Las sombras caen sesgadas**, desde el lado de la cámara: es una
   *    batería de focos colgada de un lado del techo, no el sol. El sesgo es lo
   *    que se ve en cualquier pabellón y lo que hace que los objetos se lean
   *    apoyados en el suelo en vez de flotando.
   *  · **Luz que viene de puntos concretos**: los focos colgantes del techo están
   *    encima de la pista y la iluminan por conos, no entera. De eso sale el
   *    contraste entre pista y graderío: lo que está bajo un cono se ve claro y
   *    las gradas, fuera del alcance de todos, quedan apagadas.
   *  · **Tono cálido** de halogenuro metálico (ámbar pálido), no el azul del
   *    cielo.
   */

  /*
   * FOCO CLAVE, INCLINADO. Es la corrección estética de más impacto.
   *
   * Estaba en (1,5, 42, 3), prácticamente en la vertical. Con una luz vertical
   * cada objeto proyecta su sombra JUSTO DEBAJO de sí mismo, donde su propio
   * cuerpo la tapa, así que la escena no tenía ni una sombra visible: medido, el
   * pase de sombras entero dejaba el fotograma idéntico (0 píxeles de
   * diferencia) en las 7 vistas. Eso no es «poca sombra», es no tener ninguna, y
   * es lo que hacía que el jugador, el balón y el atrezo parecieran flotar.
   *
   * A (10, 34, 12) la luz entra sesgada unos 24°, como una batería de focos
   * colgada de un lado del techo. La misma escena pasa a estar apoyada: las
   * sombras caen al lado contrario del foco y se leen la canasta, el banquillo,
   * la mesa, el túnel y hasta las gradas.
   *
   * El mapa sigue siendo ESTÁTICO (ver arriba): lo que proyecta es la
   * arquitectura, que no se mueve. El jugador y el balón —lo único que cambia de
   * sitio— llevan su propia sombra de contacto.
   *
   * Intensidad 1,30 (era 2,0), medida y no a ojo: a 2,9 el suelo se quemaba (el
   * tonemapping comprime las altas luces y el parqué #d9a05b acababa al mismo
   * valor que las líneas #fdf6e8, así que la pista se leía como una mancha beis
   * sin dibujo). Y ha bajado otra vez al aparecer los conos de la batería, que
   * son los que iluminan el parqué ahora: con la direccional en 2,0 y los cuatro
   * focos encima el suelo subió de 2,32 a 3,1 de irradiancia, justo al lado de
   * aquel valor quemado.
   *
   * Lo que se pierde al bajar la direccional es elcontraste de la sombra (sólo
   * ella proyecta): el mismo punto pasa de 0,23 a ~0,55 de brillo al entrar en
   * sombra. Es el precio de que la luz del suelo venga de sitios y la sombra
   * siga viniendo de una sola. Si al verlo en pantalla las sombras se leen
   * flojas, el ajuste es un número: subir la direccional y bajar `intensidad`
   * de los focos en la misma proporción, sin tocar nada más.
   *
   * OJO: el 1,30 de este bloque ya NO es el valor vivo — se recalibró a 0,80 al
   * bajar el parqué del hombro de la curva de tonos. Ver el bloque siguiente.
   */
  /*
   * RECALIBRADO DEL SUELO: POR QUÉ ESTAS TRES INTENSIDADES SON ESTAS.
   *
   * Que los charcos de luz "no se ven en el parqué" NO era un fallo de dibujo:
   * era aritmética. `paintLampPools` (court.ts) pinta el charco como ALBEDO más
   * claro, y con el suelo en 2,09 de irradiancia el parqué ya salía del tonemapping
   * en el HOMBRO de la curva: parqué 0,694 lineal x 2,09 = 1,45, y con ACES y
   * exposición 1,05 eso es ~235/255. El centro del charco, con albedo 0,760,
   * daba 237. DOS NIVELES de diferencia: un charco "más claro que un suelo ya
   * quemado" es invisible por construcción, y da igual cuántas veces lo pintes
   * mientras la dirección sea "más claro".
   *
   * Así que el arreglo es de dos partes y las dos hacen falta: bajar la
   * irradiancia del suelo para devolverle RECORRIDO a la curva, y dar al charco
   * un anillo OSCURO (court.ts), no sólo un centro claro.
   *
   * Irradiancia sobre el parqué, luz por luz (la de los focos es
   * 12 / 11,92^1,2, sin cambios; el resto baja):
   *
   *                    antes                              ahora
   *   techo      1,30 x dot 0,904 = 1,175   ->   0,80 x 0,904 = 0,723
   *   2 focos     12 / 11,92^1,2     = 0,500   ->   (intactos)  = 0,500
   *   relleno     0,50 x dot 0,22  = 0,110   ->   0,40 x 0,22  = 0,088
   *   hemisférica 0,30                 = 0,300   ->   0,22         = 0,220
   *   ------------------------------------------------------
   *   TOTAL                            2,085                   1,531
   *
   * El reparto lo manda la cenital: era el 56 % del total y la que aplanaba el
   * suelo, y en un pabellón la pista la iluminan los focos, no una direccional
   * vertical. El relleno y la hemisférica bajan poco y en la dirección correcta
   * (el relleno es el que alisa el lado visible de las caras). Los dos focos se
   * quedan intactos: son el componente "pabellón" y el charco va debajo.
   *
   * Resultado, con el albedo del parqué (0,694 lineal) y el del anillo pintado:
   *
   *     parqué normal   1,531 x 0,694 = 1,06  -> ACES -> 230/255
   *     centro charco   1,531 x 0,778 = 1,19  -> ACES -> 233/255
   *     anillo oscuro   1,531 x 0,346 = 0,53  -> ACES -> 202/255
   *
   * Centro contra anillo: 31 niveles, que es lo que hace que las zonas
   * iluminadas se lean como PUNTOS. Nótese que subir el alfa del centro ya no
   * compra casi nada (0,28 -> 0,38 delata un nivel): es el hombro de la curva, y
   * por eso el recorrido se gana abajo, en el anillo.
   *
   * `toneMappingExposure` NO se toca (sigue en 1,05): bajarla apagaría también el
   * plató y las gradas y se perdería el contraste de pabellón. La exposición es
   * el último recurso, no la solución.
   */
  const ceiling = new THREE.DirectionalLight(0xfff2dc, 0.8);
  ceiling.position.set(10, 34, 12);
  ceiling.castShadow = true;
  ceiling.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  /*
   * El frustum de la cámara de sombras SE QUEDA COMO ESTABA, y es una decisión
   * medida, no una omisión.
   *
   * El informe proponía ajustarlo a la pista (±19 x ±16 m, near 32, far 48) en
   * vez de a toda la escena (48 x 40 m, near 5, far 90). Se probó, y tiene un
   * efecto que no se ve venir: al recortar `near`/`far` de 85 m a 16 m, el rango
   * de profundidad se reduce 5,3 veces, y con él el sesgo de profundidad
   * efectivo (`bias` va en unidades del rango) y el radio de la PCF en metros al
   * afinar el texel de 2,34 cm a 1,86 cm. El resultado: reaparecen las sombras
   * que el sesgo grande estaba tapando (auto-sombra de gradas, vallas, banquillo,
   * postes y muro del plató).
   *
   * Medido con la sonda de dev, comparando el fotograma contra el mismo SIN pase
   * de sombras (`shadowMap.enabled = false`, que quita `USE_SHADOWMAP` del
   * shader):
   *
   *   · frustum original + `bias` original .............. 0 píxeles de diferencia
   *     (las 7 vistas: juego + las 6 secciones)
   *   · frustum ajustado + `bias` compensado ×5,3 ....... hasta 29.575 píxeles,
   *     61 niveles de diferencia por canal
   *
   * Y no compra nada a cambio: con el frustum ajustado el horneado dibuja
   * EXACTAMENTE los mismos 65 draw calls y 198.932 triángulos que con el
   * original, porque los 65 proyectantes que quedan (gradas, vallas, aros,
   * banquillo, túnel, mesa) están dentro de los dos marcos. Es decir: ajustarlo
   * sólo cambia el aspecto y el coste lo decide la lista de proyectantes.
   *
   * Se deja como estaba hasta que la luz se incline (fase 3 del informe):
   * entonces habrá que decidir el frustum y el `bias` JUNTOS, midiendo, porque
   * las sombras serán el objetivo y no un artefacto que hay que dejar quieto.
   */
  // El marco cubre el PABELLÓN, no sólo la pista: con la luz sesgada, las
  // gradas son las que reciben la sombra del público y de las torres, y son la
  // mitad del fondo en las seis secciones. Caben las gradas (±29,6 m), las
  // vallas (±17,8) y las cuatro torres (±26,8). El terreno de 180 m y la
  // vegetación se quedan fuera, que es lo que se quiere.
  //
  // `bias` va en unidades del rango de profundidad (105 m aquí), así que bajarlo
  // de -0,0004 a -0,0002 deja el sesgo en 2,1 cm de mundo: con la luz inclinada
  // las sombras tienen que SOBREVIVIR al sesgo, no desaparecer por él.
  Object.assign(ceiling.shadow.camera, { left: -30, right: 30, top: 26, bottom: -26, near: 5, far: 110 });
  // Three sólo recalcula la matriz de proyección al crear el mapa, así que si
  // estos números se tocan en caliente (desde la consola) hay que forzarla.
  ceiling.shadow.camera.updateProjectionMatrix();
  ceiling.shadow.bias = -0.0002;
  // `normalBias` quita el patrón de tejas en superficies voxel: desplaza la
  // muestra a lo largo de la normal del bloque en vez de a lo largo del rayo.
  ceiling.shadow.normalBias = 0.05;
  scene.add(ceiling);

  /*
   * Las cuatro baterías direccionales de las torres se han ELIMINADO (ver el
   * bloque de los focos, más abajo). Sus dos sustitutos eran: conos reales en los
   * focos colgantes y menos nivel en todo lo demás. El hueco de las esquinas es
   * intencionado —una direccional desde (±26, 15, ±18) ilumina el perímetro igual
   * que la pista y lo que deja es EXACTAMENTE el graderío apagado—.
   */

  /*
   * LA DIRECCIONAL DE REBOTE SE HA ELIMINADO (fase 3: ocho luces -> cinco).
   *
   * Era una direccional cálida (0xffd9a8, 0,45) desde (-6, -12, -4), o sea desde
   * ABAJO, para que las caras inferiores de los modelos no quedaran muertas.
   * Se quita porque es una luz ENTERA que se evalúa en cada fragmento de cada
   * malla, y su trabajo está cubierto por dos cosas que ya existían y no cuestan
   * nada por fragmento:
   *
   *  · **El rebote del parqué ya está PINTADO.** `paintLampPools` (court.ts,
   *    `drawFloor`) escribe los charcos de los doce focos en la textura del
   *    suelo, así que la lectura de "luz que sale de puntos concretos y vuelve
   *    del suelo" está en la textura, no en una luz.
   *  · **La hemisférica ES un rebote difuso.** En Three.js la hemisférica
   *    mezcla cielo (0xfff4d6) y suelo (0x3a4668) según la normal de la cara:
   *    cualquier cara que mire hacia abajo recibe el color de suelo, que es
   *    exactamente el rebote del parqué. Bajarla era la palanca del contraste;
   *    quitarla sería tirar esa palanca, y aquí no hace falta: la hemisférica
   *    se queda en 0,30.
   *
   * NO compensa nada: ni se sube la hemisférica ni el relleno, porque ajustar
   * intensidades a ojo sin tener la imagen delante es exactamente el tipo de
   * ajuste que después nadie sabe por qué está. Si al verlo en pantalla la
   * escena queda más apagada, el sitio correcto es la exposición global
   * (`renderer.toneMappingExposure`, arriba), que es UN número y no cinco.
   *
   * Lo que se pierde, y se acepta: el tinte cálido 0xffd9a8 en las caras
   * inferiores, que la hemisférica sustituye con un azul más frío. Y una
   * comodidad: no proyectaba (`castShadow` por defecto en `false`), así que el
   * mapa de sombras horneado sigue siendo EXACTAMENTE el mismo y no hay que
   * rehornear nada por este cambio.
   */

  /*
   * Relleno frío, casi horizontal, y DEL LADO DE LA CÁMARA.
   *
   * La posición importa más que la intensidad, y seIció el lado. La cámara de
   * juego está en `CAMERA.offset = [0, 12.4, 10.2]`: siempre en +Z mirando a
   * -Z. Con el relleno en -Z ilumina exactamente las caras que el jugador NO
   * ve, y las que sí ve quedan solo con la hemisférica: el naranja del balón
   * salía marrón y las caras del personaje se veían planas.
   *
   * Por eso va en (10, 5, 18): delante del jugador, algo a la derecha y bajo,
   * que es de donde llega la luz en un pabellón real (los focos de la grada
   * opuesta) y no un foco plano pegado al objetivo.
   *
   * Intensidad 0,50 -> 0,40 con el recalibrado del suelo (arriba). Baja poco y
   * en la dirección correcta: el relleno es el que alisa el lado visible de las
   * caras, así que es parte del suelo que aplana. Si el parqué se viera apagado,
   * el sitio a recuperar es ESTE número, no el de la cenital (que es el 56 % del
   * total) ni la exposición.
   */
  const fill = new THREE.DirectionalLight(0xbfd4ff, 0.4);
  fill.position.set(10, 5, 18);
  scene.add(fill);

  // Hemisférica: el rebote difuso de gradas y parqué.
  //
  // Sigue siendo baja para que el pabellón se lea como cubierto, pero a 0,15
  // las caras que no ven el techo quedaban planas y sin color.
  // Bajada de 0,55 a 0,38 con el foco clave ya sesgado, porque una hemisférica
  // alta plancha las sombras; y de 0,38 a 0,30 al aparecer los conos de la
  // batería: la hemisférica es la única luz que llega IGUAL a la pista y a las
  // gradas, así que es justo la que hay que bajar para que el contraste entre
  // ambas se abra.
  // Y de 0,30 a 0,22 con el recalibrado del suelo (arriba), por la misma razón y
  // en el mismo sentido: bajar el suelo es lo que le devuelve recorrido a la
  // curva de tonos, y bajar la luz que llega igual a pista y a gradas es lo que
  // abre el contraste entre ambas.
  const hemi = new THREE.HemisphereLight(0xfff4d6, 0x3a4668, 0.22);
  scene.add(hemi);

  /*
   * ILUMINACIÓN DE PABELLÓN, FASE 2: LOS FOCOS APORTAN LUZ DE VERDAD.
   *
   * Antes de este cambio los doce focos colgantes eran un color de vértice sobre
   * `VOXEL_MATERIAL`: un bloque más del techo. Se veían apagados y, apagando o
   * quitando la batería, la imagen no cambiaba en ningún pixel. Ahora la batería
   * es lo que ilumina la pista y el resto del rig se recorta para pagarle el
   * sitio. El recuento de luces NO ha subido en esta fase: sigue habiendo 8.
   * (La fase 3, más abajo, los baja a 5: aquí se describe el estado intermedio
   * en el que se decidió qué es lo que la batería tenía que sustituir.)
   *
   * Antes (8): 1 direccional de techo con sombra + 4 direccionales de torre
   *            + rebote + relleno + hemisférica.
   * Ahora(8): 1 direccional de techo con sombra + 4 `SpotLight` de la batería
   *            + rebote + relleno + hemisférica.
   *
   * Lo que se recorta y por qué:
   *
   *  · **Las cuatro direccionales de torre, enteras.** Eran 0,7 cada una desde
   *    (±26, 15, ±18) apuntando al centro, y hacían un trabajo que los focos
   *    colgantes hacen mejor y más caro de replicar: una direccional ilumina
   *    TODO igual, pista y gradas, que es justo lo contrario de un pabellón. Se
   *    sustituyen una a una por conos reales, así que el número de luces es el
   *    mismo y el coste por fragmento también (7 luces puntuales en ambos casos).
   *  · **La direccional de techo, de 2,0 a 1,30.** Sigue siendo la llave y la
   *    ÚNICA que proyecta sombra (el mapa se hornea una vez: cuatro mapas más
   *    serían cuatro horneados), pero deja de ser la que ilumina el suelo, que
   *    ahora es tarea de los conos. Sin esto el parqué se quemaría: con 2,9 de
   *    direccional el tonemapping comprimía el suelo y las líneas de pista al
   *    mismo valor (ver el comentario de más abajo) y la pista se leía como una
   *    mancha beis.
   *  · **Relleno 0,62 -> 0,50 y hemisférica 0,38 -> 0,30.** Las dos estaban
   *    calibradas contra un suelo que llevaba toda la luz; bajarlas mantiene el
   *    contraste pista-fondo y evita que el relleno se coma el charco de los
   *    focos en la banda lateral. El rebote (0,45) se quedaba igual en esta
   *    fase: va desde abajo y no toca el suelo, así que no competía por el mismo
   *    nivel. La fase 3 de más abajo lo elimina entera.
   */
  /*
   * ILUMINACIÓN DE PABELLÓN, FASE 3: DE OCHO LUCES A CINCO.
   *
   * MOTIVO, medido en la máquina del dueño con el voxel ya en
   * `MeshLambertMaterial` y las ocho luces de la fase 2: el fotograma se ajusta
   * casi exactamente a
   *
   *     t = 7,2 ms (fijo: CPU + vértices) + 28,2 ms × escala²
   *
   * o sea 35,4 ms a escala 1,0 · 30,5 a 0,9 · 26,4 a 0,8 · ~21 a 0,7 (medido:
   * 35,4 / 30,5 / 26,4 / ~21, que es la curva entera). Veintiocho de los
   * treinta y cinco milisegundos son COSTE POR PÍXEL, y para llegar a 16,7 ms
   * harían falta escala 0,58: por debajo del suelo de `ESCALA_MIN` (0,7), o
   * sea que con ocho luces esta máquina no llega a 60 fps ni a resolución
   * mínima. No es un fallo de la calidad adaptativa: en un shader forward la
   * lista de luces se recorre en CADA fragmento de CADA malla, y eso no lo
   * arregla bajar la resolución.
   *
   * Cuantas menos luces, menos coste por fragmento, y el reparto sale
   * proporcional: con cinco luces la cuenta da `t = 7,2 + 19·s²`, o sea 60 fps
   * justo en el suelo de 0,7. Ese es todo el motivo del cambio; la exposición,
   * los umbrales de `calidad()` y `ESCALA_MIN`/`ESCALA_MAX` NO se tocan.
   *
   * EL RECUENTO PASA DE 8 A 5:
   *
   *   Antes (8): techo con sombra + 4 `SpotLight` + rebote + relleno
   *              + hemisférica.
   *   Ahora (5): techo con sombra + 2 `SpotLight` + relleno + hemisférica.
   *
   * Lo que se quita:
   *
   *  · **La direccional de rebote, entera** (arriba está el porqué de que no
   *    eche de menos: los charcos pintados en el parqué y la hemisférica).
   *  · **Dos de los cuatro `SpotLight`**, los de la fila `z = -8,5`. Se quedan
   *    los dos de `z = +2,5` (x = ±3,2) y el porqué está en el filtro, abajo.
   *
   * Lo que NO cambia: los doce paneles del techo siguen siendo emisivos y los
   * doce charcos siguen pintados en el parqué (todo eso es court.ts y no se
   * toca), así que la lectura de "pabellón iluminado por puntos" se conserva
   * entera aunque sólo dos de los doce proyecten un cono real.
   */
  /*
   * LOS DOS FOCOS QUE SE QUEDAN: los de la fila `z = +2,5`, o sea los dos más
   * cercanos a la cámara de juego.
   *
   * La cámara de juego va SIEMPRE en +Z mirando a -Z (`CAMERA.offset =
   * [0, 12,4, 10,2]`), así que "la fila del lado de la cámara" es `z > 0` y el
   * filtro es la regla del juego, no un número escrito a mano.
   *
   * Por qué esos dos:
   *
   *  · **Su charco cae en la franja que encuadra la cámara.** El objetivo de la
   *    cámara está acotado a `CAMERA.minZ = -4` … `CAMERA.maxZ = 5` (config.ts):
   *    la banda central de la pista por la que pasa el juego y en la que la
   *    cámara se centra. El charco de `z = +2,5` cae dentro de esa banda y es el
   *    que alumbra donde están los pies del jugador y el balón; el de
   *    `z = -8,5` queda 4,5 m por detrás de su borde más lejano.
   *  · **Es el que más se ve.** Con la cámara a 12,4 m de altura y 32° de fov
   *    mirando a unos 49° de caída, el charco de `z = +2,5` cae en la mitad baja
   *    del encuadre, que es la parte más grande de la pantalla: ahí un cono
   *    quitado se nota, y el fondo lejano es grada, que tiene que quedarse
   *    oscuro.
   *  · **Se quita una pareja, no media batería.** Los dos que quedan son uno a
   *    cada lado del eje de la pista, así que la imagen conserva el mismo
   *    reparto izquierda/derecha que antes; si se hubieran quitado los dos del
   *    mismo lado, el otro se quedaría sin pareja.
   *
   * Lo que pasa con la fila que se va: NO se queda sin luz. El cono de un foco
   * a 11,92 m con 49° de semángulo abarca ±14 m de radio, y el punto de la fila
   * eliminada más cercano a la que se queda está a 11 m de ella, o sea a 42,7°
   * del eje del cono: DENTRO. Le llega el derrame del otro cono, atenuado por la
   * penumbra (0,7) y por la ventana de `distance`, y encima sigue el charco
   * PINTADO en la textura del suelo y el panel emisivo encendido. El fondo
   * pierde intensidad de foco, no su lectura.
   *
   * Las intensidades NO se suben para compensar los dos focos que se van (12 se
   * queda en 12): ver el bloque de la direccional de rebote más arriba.
   */
  const focos: THREE.SpotLight[] = [];
  for (const lamp of ARENA_LAMPS.filter((l) => l.z > 0)) {
    /*
     * PARÁMETROS DEL CONO, y de dónde sale cada número.
     *
     * En Three.js las luces puntuales son FÍSICAS: la irradiancia que llega a un
     * fragmento es `intensidad / d^decay`, atenuada por la ventana de `distance`.
     * Con el foco a 11,92 m del parqué y `decay` 1,2, el suelo justo debajo recibe
     * `12 / 11,92^1,2 = 0,49` por unidad de intensidad (la ventana de `distance`
     * apenas toca: (1-(11,92/30)^4)^2 = 0,94). Con `intensidad = 12` el charco
     * del centro del círculo vale ~5,9 y en el borde de la pista, a 16 m, ~3,4:
     * o sea, el cono NO aporta un nivel uniforme y por eso se ven los charcos.
     *
     *  · `angle` 0,85 rad (~49°): el suelo del cono abarca ±14 m desde el foco.
     *    Con 0,55 (el valor habitual) serían ±7,6 m y quedaría un agujero oscuro
     *    entre conos en mitad de la pista, que es justo lo que hay que evitar.
     *  · `penumbra` 0,7: el 30 % interior del cono va a plena intensidad y el 70 %
     *    exterior se funde. Con los conos solapándose, una penumbra alta es lo
     *    que los cose entre sí y quita el corte de disco.
     *  · `distance` 30: la ventana `(1-(d/30)^4)^2` deja el primer peldaño de la
     *    grada (x = ±16,2, a 17,5 m del foco) con menos del 2 % del cono, así que
     *    las gradas se quedan oscuras aunque el cono llegue. ES EL QUE CONVIRTE
     *    "pista iluminada" en "pabellón", no la intensidad.
     *  · `castShadow` NO se activa, y no por pereza: el mapa de sombras es
     *    estático y se hornea UNA vez al final de la carga, así que un foco con
     *    sombra serían dos mapas más que hornear y hornearlos cada frame era
     *    justo lo que costó 173 draw calls por fotograma (ver el mapa de sombras).
     *    Los focos son proyectantes que no se mueven, así que un día se podrían
     *    hornear de verdad; hoy no cabe en el presupuesto. QUITAR focos no cambia
     *    esto: ninguno proyectaba, de modo que el mapa horneado sigue siendo
     *    exactamente el mismo y no hay que rehornear nada por este cambio.
     */
    const foco = new THREE.SpotLight(0xffe3b8, 12, 30, 0.85, 0.7, 1.2);
    foco.position.set(lamp.x, lamp.y, lamp.z);
    // Vertical: los focos cuelgan rectos del techo y apuntan al suelo. Inclinarlos
    // concentraría el charco en el centro de la pista y dejaría las bandas
    // laterales a oscuras, que es justo lo que hay que evitar.
    foco.target.position.set(lamp.x, 0, lamp.z);
    foco.castShadow = false;
    scene.add(foco, foco.target);
    focos.push(foco);
  }

  /*
   * EL RECUENTO SE CUENTA, NO SE ESCRIBE.
   *
   * El número de luces que evalúa el shader forward es la suma de las que hay en
   * la escena, así que sale de los objetos: techo + relleno + hemisférica + los
   * focos. Si algún día se quita o se añade una luz sin tocar esta línea, el
   * log seguiría diciendo la verdad.
   */
  const lucesTotales = focos.length + 3; // techo + relleno + hemisférica
  console.info(
    `[lights] PABELLON-v3 -> ${lucesTotales} luces: techo=${ceiling.intensity} (sombras ${ceiling.castShadow}) ` +
      `focos=${focos.length}x${focos[0]?.intensity} ang=${focos[0]?.angle} (fila z>0) ` +
      `relleno=${fill.intensity} hemisferica=${hemi.intensity} · ` +
      `suelo≈1,53 (antes 2,09): techo 0,723 + focos 0,500 + relleno 0,088 + hemi 0,220 · ` +
      `ACES+1,05: parquet ~230/255, centro-charco ~233, anillo-oscuro ~202 (31 niveles) · ` +
      `rebote-direccional=ELIMINADO (charcos pintados + hemisférica) torres-direccionales=ELIMINADAS sol=ELIMINADO`,
  );
  onProgress(0.2);
  await nextFrame();

  // ───────── Assets .glb (con fallback procedural si no cargan)
  onProgress(0.3);
  /*
   * SÓLO SE CARGA EL BALÓN.
   *
   * Antes se descargaba también `voxel-court.glb` (7,80 MB de los ~9 MB de la
   * carga inicial) para aprovechar UNA de sus mallas: el suelo. Y esa malla trae
   * una paleta de 256x1 px con DOS tonos planos y sin marcaje, así que el juego
   * tenía que completarla dibujando sus líneas encima. Es decir: 7,8 MB y el
   * voxelizado de 43.094 celdas a 0,1 m para un fondo que el suelo procedural
   * —parqué dibujado por código, con su zona y sus líneas— ya daba.
   *
   * El balón (63 KB) sí se usa: su FORMA alimenta el voxelizador.
   */
  const ballGLB = await loadModel('models/ball.glb');
  console.info(`[court] glTF cargado: balon=${!!ballGLB}`);
  if (ballGLB) normalize(ballGLB.scene, { targetSize: BALL.radius * BALL.visualScale * 2 });
  onProgress(0.45);
  await nextFrame();

  // ───────── Mundo
  const courtGroup = buildCourt(content.person.initials, renderer.capabilities.getMaxAnisotropy());
  scene.add(courtGroup);
  /**
   * Uniforme del balanceo del público. Lo avanza `update()` con el reloj de la
   * escena; es un único uniforme que comparten las cinco piezas del graderío.
   */
  const crowdTime = courtGroup.userData.crowdTime as { value: number } | undefined;
  // Las LÍNEAS y la ZONA van en esta capa transparente a 4 mm sobre el parqué.
  // Se comprobó muestreando el píxel de la textura del suelo: la zona que pinta
  // `drawFloor` cae bajo la pista procedural y no se ve, así que el dibujo que
  // se lee es el de `buildCourtLines`.
  scene.add(buildCourtLines(content.person.initials, renderer.capabilities.getMaxAnisotropy()));
  // Los atrezos se guardan en variables: al final de la carga entran, junto a la
  // cancha y el plató, en el fundido de mallas estáticas (`batch.ts`).
  const hoopL = buildHoop(-1);
  const hoopR = buildHoop(1);
  const benchProp = buildBench();
  const tunnelProp = buildTunnel();
  const scorerTable = buildScorerTable();
  // Marcador colgado del techo, sobre el centro de la pista. Su estructura entra
  // en el fundido del arranque; las dos pantallas (un material con textura) no.
  //
  // La anisotropía máxima se le pasa AQUÍ y no dentro del constructor porque la
  // necesita el renderer, que no existe fuera de esta función: la textura del
  // marcador se quedaba sin `anisotropy` (1 por defecto) y se veía cortada en
  // escorzo, con las esquinas de los dígitos comidas justo en el ángulo desde el
  // que más se mira: el encuadre de juego, que mira el tablero de abajo.
  const scoreboard = buildScoreboard(renderer.capabilities.getMaxAnisotropy());
  /*
   * EL CARRITO DEL CONCURSO DE TRIPLES (lote B).
   *
   * En la pista hay UNO: el de la esquina, que es el que se pulsa con E y, además,
   * el PRIMER carro del recorrido (`TRIPLES[0]`): llegar, pulsar E y tirar desde
   * ahí mismo, sin un carro de adorno al lado. Los otros cuatro puestos (diagonal,
   * central, diagonal y la otra esquina) se construyen aquí también, pero NACEN
   * OCULTOS y aparecen al convocar el concurso: la pista se queda limpia mientras
   * se juega al baloncesto normal. Los pone y los quita `mostrarPuestos()`, los
   * tres elementos a la vez (carro, anillo y mancha), que es lo que impide que uno
   * de los cuatro se quede descolgado.
   *
   * El mismo constructor para los cinco, y los carros del recorrido mirando hacia
   * fuera de la pista: el jugador llega de espaldas al aro, coge el balón y se gira
   * para tirar, así que el asa del carro es lo que queda del lado de su cuerpo. El
   * carrito usa la MISMA orientación que los demás: es el primer puesto, no un
   * atrezo aparte.
   *
   * (El carrito SÍ entra en el fundido de mallas estáticas y SÍ proyecta sombra:
   * nunca se esconde, así que no tiene ninguno de los dos problemas de abajo.)
   *
   * NI FUNDIDOS NI PROYECTANDO SOMBRA, y las dos cosas son a propósito:
   *  · el fundido de mallas estáticas REMUEVE la malla de su grupo (`batch.ts`),
   *    así que un carro fundido ya no se podría esconder por partes ni aparecer
   *    después — sólo quedaría su copia dentro del lote del mundo—;
   *  · su sombra se hornearía en el mapa estático y, al esconderse el carro, se
   *    quedaría la sombra sola en el parqué. Llevan su mancha radial (`blob`),
   *    que es la misma técnica que usan el jugador y el balón y cuesta una
   *    llamada de dibujo por carro sólo mientras está a la vista.
   */
  const carrito = buildBallCart();
  carrito.group.position.set(CARRITO.x, 0, CARRITO.z);
  carrito.group.rotation.y = Math.atan2(CARRITO.x - rimX(CONCURSO_SIDE), CARRITO.z);
  const carros = TRIPLES.slice(1).map((p) => {
    const c = buildBallCart();
    c.group.position.set(p.x, 0, p.z);
    c.group.rotation.y = Math.atan2(p.x - rimX(CONCURSO_SIDE), p.z);
    c.group.visible = false;
    // Y los balones, uno a uno: esconder el grupo ya los tapa, pero así el estado
    // del mundo dice la verdad desde el primer fotograma (ningún balón de puesto
    // está «a la vista» antes de que haya concurso). Los enciende
    // `mostrarPuestos()`, que es también quien apaga el grupo.
    for (const b of c.balls) b.visible = false;
    noCastShadow(c.group);
    return c;
  });
  /*
   * LOS CINCO PUESTOS EN ORDEN DE RECORRIDO, con sus mallas: el carrito primero
   * (`TRIPLES[0]`) y detrás los cuatro que aparecen. El estado del concurso habla
   * de puestos por ÍNDICE (`concurso.carro` es un índice de `TRIPLES`), así que
   * esta lista tiene que estar en ese mismo orden o los balones desaparecerían del
   * carro de al lado. La usan `balonesVisibles()` y `sincronizarBalones()`.
   */
  const puestos = [carrito, ...carros];
  scene.add(hoopL, hoopR, benchProp, tunnelProp, scorerTable, scoreboard, carrito.group, ...carros.map((c) => c.group));
  const set = buildInterviewSet();
  scene.add(set.group);

  /*
   * VOLÚMENES DE COLISIÓN.
   *
   * Se construyen una vez al arrancar (fase D). El jugador se resuelve contra
   * ellos al moverse y el balón dentro de su integración, a 120 Hz por si va
   * rápido. Son ~25 volúmenes: el coste es despreciable comparado con una llamada
   * de dibujo, y sin ellos el personaje atravesaba el banquillo, la mesa y los
   * postes.
   */
  const solids = buildColliders();

  const rings: THREE.Mesh[] = [];
  /*
   * Un anillo por zona y uno por puesto del concurso: el carrito de la esquina
   * (que es el primer carro) y los cuatro puestos que aparecen al convocar. Son los mismos anillos que marcan las secciones y
   * cuestan lo mismo (una malla plana sin sombra), pero es lo que se ve de lejos
   * que ahí hay algo con el que se puede interactuar.
   */
  for (const z of [...ZONES, { x: CARRITO.x, z: CARRITO.z, radius: CONCURSO.alcance }]) {
    // Antes se saltaban las zonas de tiro y la canasta de Projects se quedaba
    // sin su anillo naranja, mientras que la de Récord sí lo tenía. Las dos
    // canastas son zonas jugables y las dos lo llevan.
    const ring = buildZoneRing(z.x, z.z, z.radius);
    rings.push(ring);
    scene.add(ring);
  }
  /*
   * Los cuatro anillos del recorrido, que van con los carros que aparecen: ocultos
   * hasta que hay concurso. El del carrito ya está arriba con las zonas, porque su
   * anillo es también el que marca dónde se pulsa E y está siempre. Se guardan
   * aparte (`ringsPuestos`) porque de `rings` se espera lo contrario —que estén
   * siempre— y el pulso de `update()` los recorre todos.
   */
  const ringsPuestos: THREE.Mesh[] = [];
  for (const p of TRIPLES.slice(1)) {
    const ring = buildZoneRing(p.x, p.z, CONCURSO.alcance);
    ring.visible = false;
    ringsPuestos.push(ring);
    rings.push(ring);
    scene.add(ring);
  }
  onProgress(0.55);
  await nextFrame();

  // ───────── Jugador y balón
  const player = buildHuman({
    skin: 0xf0b27a, skinAlt: 0xd69457, hair: 0x54371f, hairAlt: 0x3b2515,
    jersey: 0xff8c3a, jerseyAlt: 0xd96a24, shorts: 0x35406b, shoes: 0xfdfdf6,
    accent: 0xffd54a, number: content.person.jerseyNumber,
    anisotropy: renderer.capabilities.getMaxAnisotropy(),
  });
  // El jugador es el mayor objeto que se mueve (41.586 triángulos) y su sombra
  // cae bajo sus pies, donde no se ve: si proyectara, el mapa estático dejaría
  // una copia suya congelada en el punto de saque en cuanto caminara.
  noCastShadow(player.root);
  scene.add(player.root);
  const pos = player.root.position;
  let rotY = 0;

  const sfx = new Sfx();
  const ballMesh = createBallMesh(ballGLB?.scene ?? null);
  // Diagnóstico del balón. Si alguna vez se ve como un cubo, esta línea dice
  // exactamente qué se ha construido y con qué se ha construido.
  {
    let mallas = 0;
    let tris = 0;
    ballMesh.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      mallas++;
      const g = m.geometry;
      tris += g.index ? g.index.count / 3 : g.getAttribute('position').count / 3;
    });
    console.info(`[ball] ${mallas} mallas, ${tris | 0} triángulos, glTF=${ballGLB ? 'sí' : 'NO'}`);
  }
  noCastShadow(ballMesh);
  scene.add(ballMesh);
  const ball = new Ball(
    ballMesh,
    {
      score: (side) => {
        shakeNet();
        onScore(side);
      },
      // El aro y el tablero también mueven la red (punto F): hasta ahora sólo se
      // agitaba al ENCAR, y lo demás era golpear el hierro y no pasar nada. Con
      // amplitudes mucho menores y una caída más rápida, porque un roce no es
      // una canasta: 4,5 y 3 en lugar de 1, y decaen en un tercio de segundo.
      rim: () => {
        bumpNet(0.45);
        sfx.rim();
      },
      board: () => {
        bumpNet(0.3);
        sfx.board();
      },
      bounce: (v) => sfx.bounce(v),
    },
    // Los volúmenes de la pista: el balón rebota en las vallas, el banquillo, la
    // mesa y los postes en vez de atravesarlos.
    solids,
  );

  /*
   * ESTELA DE FUEGO DEL TAKEOVER (lote A, T3).
   *
   * Una sola llamada de dibujo para toda la llama (`THREE.Points` con mezcla
   * aditiva, 28 puntos) y FUERA del mapa de sombras: nada que se mueva proyecta
   * — el mapa se hornea una vez y una llama proyectando dejaría una copia
   * congelada en cada canasta. El objeto nace invisible y sólo se enciende con el
   * modo; apagado no cuesta ni una llamada.
   */
  const fireTrail = new FireTrail();
  scene.add(fireTrail.object);
  /**
   * Posición del balón en el fotograma anterior, para medir su velocidad real.
   *
   * No se usa `ball.vel` a propósito: con el balón en las manos (regate) `vel`
   * no se actualiza —lo coloca `placeHeldBall`— así que la estela se apagaría
   * justo mientras el jugador bota, que es cuando más se ve el fuego. La
   * diferencia de posición funciona en los dos casos (vuelo y regate).
   */
  const firePrev = new THREE.Vector3();
  let fireVel = 0;

  /*
   * SOMBRAS DE CONTACTO del jugador y del balón.
   *
   * El mapa de sombras es estático (ver arriba), así que nada que se mueva puede
   * proyectar en él: si el jugador proyectara, su silueta se quedaría clavada en
   * el punto de saque en cuanto caminara. La alternativa era volver a hornear el
   * mapa cada vez que da un paso, que es justo el coste que se quitó.
   *
   * En su lugar, cada objeto móvil lleva una mancha radial bajo los pies: 2 draw
   * calls, se encoge y se aclara al despegar, y es lo que hace que el cuerpo se
   * lea apoyado en el parqué y no pegado a él. Es la misma técnica que usa
   * cualquier juego con sombras horneadas.
   */
  const blobTex = canvasTexture(64, 64, (g) => {
    const grd = g.createRadialGradient(32, 32, 1, 32, 32, 31);
    grd.addColorStop(0, 'rgba(0,0,0,0.75)');
    grd.addColorStop(0.55, 'rgba(0,0,0,0.3)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
  });
  const blob = (size: number): THREE.Mesh => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.022;
    m.renderOrder = 1;
    return m;
  };
  const playerBlob = blob(1.2);
  const ballBlob = blob(0.34);
  /*
   * Manchas de los cuatro puestos que aparecen: misma técnica, mismas piezas y
   * fuera de la escena mientras no hay concurso. NO van colgadas del carro
   * porque la aparición del puesto escala el carro en Y (crece del parqué desde
   * su base) y una mancha plana colgada de ahí se aplastaría con él.
   */
  const marcasPuestos = TRIPLES.slice(1).map((p) => {
    const m = blob(1.3);
    m.position.set(p.x, 0.022, p.z);
    m.visible = false;
    return m;
  });
  scene.add(playerBlob, ballBlob, ...marcasPuestos);

  /*
   * Redes del aro: la sacudida al entrar el balón.
   *
   * Amplitud 1 al anotar y decae en medio segundo; el tiempo lo pone el reloj de
   * la escena. Con `prefers-reduced-motion` el reloj vale 0, así que la red se
   * queda quieta sin necesidad de una rama aparte.
   *
   * `bumpNet` es la versión suave para el aro y el tablero: sube la amplitud SÓLO
   * si es mayor que la que ya había (un gol y un roce en el mismo fotograma se
   * quedan con el gol) y fija una caída más rápida, que es lo que distingue
   * «se movió» de «se sacudió».
   */
  let netAmp = 0;
  let netDecay = 2.2; // unidades de amplitud por segundo
  const shakeNet = (): void => {
    netAmp = 1;
    netDecay = 2.2;
    NET.amp.value = 1;
  };
  const bumpNet = (amp: number): void => {
    if (amp <= netAmp) return;
    netAmp = amp;
    netDecay = 5.5;
    NET.amp.value = amp;
  };

  // ───────── UI y estado
  const uiRoot = document.getElementById('ui')!;
  let mode: Mode = 'play';
  const visited = loadSet('court.visited');
  const unlocked = loadSet('court.unlocked');
  const stats = loadStats();
  statsSource.get = () => ({ ...stats, visited: visited.size, total: SECTION_IDS.length, contestBest: mejorConcurso });
  const input = new Input();
  // ORDEN IMPORTANTE: el HUD primero. Su constructor hace `uiRoot.innerHTML = ...`,
  // es decir, borra todo lo que hubiera en #ui. Si PanelManager se construyera antes,
  // su <div class="panel"> desaparecía y todos los paneles salían vacíos (el juego se
  // quedaba congelado en modo 'panel' sin mostrar nada).
  const hud = new Hud(
    uiRoot,
    {
      onMenuSelect: (id) => openSection(id, false),
      onToggleMute: () => sfx.toggleMute(),
    },
    sfx.muted,
  );
  // Ahora sí: el panel se añade después de que el HUD haya construido su DOM.
  const dbg = { freeze: false };
  const panels = new PanelManager(uiRoot, () => {
    openToken++;
    sectionCam = null;
    setMode('play');
  });
  /*
   * EL CUADRO DE CONVERSACIÓN, y por último a propósito: monta su DOM en `#ui`,
   * así que tiene que ir después del HUD (que hace `innerHTML = ...` y se comería
   * el cuadro) y después del panel, para que en el orden de apilado el cuadro
   * quede por debajo de la tarjeta del panel.
   */
  const dialogue = new DialogueBox(uiRoot, () => {
    /*
     * Se acabó la entrevista (o la ha cortado el jugador con Escape): se abre el
     * panel de contacto, que es exactamente lo que se abre desde el menú. El modo
     * pasa a `panel` —no a `interview`— porque el cuadro ya está cerrado y lo que
     * queda delante del jugador es un panel modal normal, no un directo.
     */
    setMode('panel');
    panels.open('contact');
  });
  if (coarse) hud.mountTouch(input);
  canvas.setAttribute('aria-label', t('aria_game'));
  window.addEventListener('langchange', () => canvas.setAttribute('aria-label', t('aria_game')));
  hud.setProgress(visited.size);
  hud.setRecord(stats.made, stats.attempted);
  // El marcador del techo arranca con el récord guardado, no en 0/0.
  scoreboard.setScore(stats.made, stats.attempted);
  refreshMenu();

  // Los carteles flotantes usan los textos de objeto (sign_*), no los del menú.
  for (const z of ZONES) hud.addLabel(z.id, signKey(z.id));

  /**
   * Sección cuyo plano de cámara está activo, o null si se juega.
   *
   * Va aparte de `mode` a propósito: `interview` significa "el plató está en
   * directo" y mueve el reportero, el operador y el rótulo ON AIR. El encuadre
   * es otra cosa, y ahora lo usan las seis secciones.
   */
  let sectionCam: SectionId | null = null;

  function setMode(m: Mode): void {
    mode = m;
    document.body.dataset.mode = m;
    input.setEnabled(m === 'play');
    if (m === 'play') canvas.focus({ preventScroll: true });
    /*
     * La entrevista sólo existe en modo `interview`: en cuanto se sale de él —se
     * abre otra sección desde el menú, se cierra un panel— el cuadro se esconde.
     * Va aquí y no en cada sitio que abre algo para que no haya ni un camino de
     * salida que se deje el cuadro puesto detrás del panel.
     */
    if (m !== 'interview') dialogue.close();
  }

  // ───────── Lógica de juego

  /**
   * Segundos que tarda la carga en llenarse.
   *
   * Es el MISMO umbral con el que la pose de tiro llega al tope, y por eso vive
   * en una constante: antes estaba en dos sitios (la barra y la pose) y si uno
   * se tocaba, la barra no llegaría nunca al final. La barra llena y la postura
   * se completan a la vez.
   */
  const CHARGE_FULL = 0.45;

  let charging = false;
  let chargeT = 0;

  /*
   * Salto del tiro.
   *
   * `pos` es `player.root.position`, así que `pos.y` mueve el cuerpo entero.
   * Antes no se tocaba nunca y el jugador se quedaba clavado en el suelo con
   * los brazos arriba: el gesto de tiro se leía como una estatua. Con esto al
   * soltar el tiro pega un salto y acompaña la pelota en el aire.
   */
  const jump = newJump();

  /**
   * Mano del regate: +1 es la derecha (X local del jugador), -1 la izquierda.
   *
   * El cambio de mano lo provoca un GIRO, no el paso del tiempo: uno cambia de
   * mano en el momento en que decide hacia dónde ir. Si se alternara por tiempo,
   * el balón se pasaría de un lado a otro sin motivo aparente mientras el
   * jugador corría recto en línea recta, que es justo lo que no pasa en un
   * partido y lo que delata que es un efecto.
   */
  let handSide: -1 | 1 = 1;
  let lastDirAngle = 0;
  /*
   * GESTO DEL ÚLTIMO TIRO Y LADO DEL CORTE (lote A, T4).
   *
   * `gestoTiro` lo fija `shoot()` por la distancia al aro y lo consume la capa
   * de pose del seguimiento: mate de cerca, tiro largo de lejos y el tiro normal
   * en medio. `corteDir` es hacia dónde giró la ruta en el último corte (+1 =
   * izquierda del jugador), que es lo que hace que el cuerpo se incline hacia
   * dentro del giro y no al revés.
   */
  let gestoTiro: 'tiro' | 'dunk' | 'lejano' = 'tiro';
  let corteDir: -1 | 1 = 1;
  let celebrate = 0; // segundos que dura la celebración tras anotar
  let flick = 0;
  let missStreak = 0;
  /*
   * RACHA DE ACIERTOS DEL TAKEOVER (T3).
   *
   * Es una variable PROPIA y no se toca `missStreak` para reutilizarla: aquélla
   * cuenta FALLOS y alimenta la asistencia del tiro (`assist = missStreak >= 3`),
   * así que mezclarla con los aciertos cambiaría la dificultad del juego. Ésta
   * cuenta lo contrario (aciertos seguidos) y sólo enciende el fuego.
   * `takeover` es el modo encendido; se apaga al fallar, no por tiempo.
   */
  let hitStreak = 0;
  let takeover = false;
  let mvpShown = false;

  /*
   * MATE EN CARRERA (lote B).
   *
   * La animación vive en `dunk.ts` (lógica pura, con sus tests); aquí sólo está
   * el estado que la conecta con el mundo: la propia animación, el peso de su
   * capa de pose y el ritmo al que venía el jugador cuando soltó.
   */
  const dunk = newDunk();
  let dunkW = 0;

  /*
   * CONCURSO DE TRIPLES (lote B).
   *
   * Las reglas viven en `contest.ts` (con sus tests); aquí está el estado que las
   * conecta con el mundo: el minijuego, la mejor marca guardada y el aviso que el
   * HUD enseña cuando toca correr al carro siguiente.
   */
  const concurso = nuevoConcurso();
  let mejorConcurso = loadMejorConcurso();
  /*
   * LA VOZ DEL CONCURSO.
   *
   * El comentarista es de la CABINA, no del juego: aquí sólo se le cuenta lo que
   * pasa (`decir`) y él decide si merece una frase y cuánto se queda. Las reglas
   * y las frases están en `commentary.ts`, que se comprueba sin navegador; lo que
   * vive aquí es el único dato que necesita el mundo real: el reloj.
   *
   * Se le pasa `performance.now()` y no el tiempo de las animaciones (`time`), que
   * con `prefers-reduced-motion` llega congelado a 0: con ése, los plazos del
   * comentarista no vencerían nunca y la primera frase se quedaría pegada.
   */
  const comentarista = nuevoComentarista();
  /** Suelta lo que acaba de pasar a la cabina, y pinta la frase si se la gana. */
  function decir(s: Suceso): void {
    const f = comentar(comentarista, s, performance.now());
    if (f) hud.subtitle(f.texto, f.ms);
  }
  /*
   * APARICIÓN DEL RECORRIDO (lote B, ajuste posterior).
   *
   * Segundos que tarda un puesto en crecer del parqué y progreso 0..1 de esa
   * animación; los carros existen siempre, pero nacen ocultos y con escala 1. Lo
   * mueve `update()` y lo reinicia `mostrarPuestos()`. Ver `mostrarPuestos()`
   * para por qué se anima en vez de aparecer de golpe.
   */
  const PUESTOS_APARICION = 0.28;
  let puestosT = 1;
  /**
   * Ritmo BRUTO del último fotograma con movimiento (0..1 de la velocidad tope).
   *
   * Es lo que decide si un tiro cerca del aro es un MATE EN CARRERA o el tiro de
   * cerca de siempre: el propietario lo pidió así («sólo si está corriendo»). Se
   * guarda en una variable propia y no se reutiliza `speed01` porque `speed01`
   * está SUAVIZADO (tarda ~0,3 s en reflejar el arranque) y además se apaga solo
   * mientras se carga el tiro: al soltar ya no diría a qué velocidad venía el
   * jugador, que es justo el dato que hace falta.
   */
  let ritmoBruto = 0;

  /**
   * Un tiro que NO entró, contado una sola vez.
   *
   * Vive en una función y no suelto en la rama del balón quieto porque hay DOS
   * formas de que un tiro termine sin canasta: que el balón se pare en la pista
   * (`ball.settled`) o que el jugador lo recoja con la mano antes de que se
   * pare. La segunda es la habitual en este juego —el rebote casi siempre vuelve
   * hacia el jugador— y no contaba: la racha del Takeover (y la asistencia de
   * `missStreak`, que ya existía) sólo se enteraban de los fallos que se
   * quedaban quietos en el suelo, así que se podía fallar toda la partida sin
   * que el fuego se apagara nunca.
   *
   * El juicio es `ball.scored`, que es lo que sabe si el balón pasó por el aro,
   * y no «ha pasado tiempo»: un balón que la recoge la mano después de ENTRAR no
   * es un fallo.
   */
  function fallarTiro(): void {
    // Si hay concurso, el fallo también es del concurso: apunta el tiro y deja
    // al carro preparado para el siguiente balón.
    if (concurso.activo) {
      resolverTiro(concurso, false);
      decir({ tipo: 'fallo' });
      hud.setContest(infoConcurso());
    }
    // Reacción de frustración: hombros caídos y mirada al suelo un segundo.
    frustracion = 1;
    missStreak++;
    if (takeover) {
      takeover = false;
      hud.toast(t('takeover_miss'), 2000);
    }
    hitStreak = 0;
    hud.setTakeover(0, false);
  }

  function nearestSide(): Side {
    return Math.abs(pos.x - rimX(-1)) <= Math.abs(pos.x - rimX(1)) ? -1 : 1;
  }
  /** Zona que se desbloquea encestando en esa canasta. La derecha ya no la tiene. */
  const zoneFor = (side: Side): Zone | undefined => ZONES.find((z) => z.side === side);

  function markVisited(id: SectionId): void {
    visited.add(id);
    saveSet('court.visited', visited);
    hud.setProgress(visited.size);
    refreshMenu();
  }

  /**
   * Estado de cada sección para el menú (✓ visitada, ○ pendiente, ✕ bloqueada).
   *
   * Una zona de tiro está bloqueada hasta que se encesta en su canasta. Se
   * recalcula en los tres momentos en que puede cambiar: al arrancar, al visitar
   * una sección y al desbloquear una zona.
   */
  function refreshMenu(): void {
    hud.setMenuState(
      visited,
      ZONES.filter((z) => z.kind === 'shoot' && !unlocked.has(z.id)).map((z) => z.id),
    );
  }

  /**
   * Segundos que tarda la cámara en llegar a su destino.
   *
   * El lerp es exponencial (`k = 1 - e^(-lerp·dt)`), así que tras `t` segundos
   * queda a `1 - e^(-lerp·t)` del camino. El 97 % son `-ln(0,03) / CAMERA.lerp`.
   *
   * Sin esta espera el panel saltaba en el mismo fotograma en que la cámara
   * arrancaba el viaje: el plano de sección aparecía tapado por la tarjeta y
   * el movimiento no se veía. Ahora se ve llegar, y luego sale la información.
   */
  function cameraSettle(): number {
    if (reduced) return 0; // con movimiento reducido la cámara es instantánea
    return -Math.log(0.03) / CAMERA.lerp;
  }

  /** Token de la apertura pendiente, para que una sección no pise a la otra. */
  let openToken = 0;

  function openSection(id: SectionId, fromZone: boolean): void {
    markVisited(id);
    sfx.click();
    const token = ++openToken;
    // El encuadre se activa al ENTRAR en la sección desde su zona, que es
    // cuando el jugador está de pie en ella. Desde el menú no se aplica: allí
    // la cámara está siguiendo al jugador por la pista y saltar al plano bajo
    // de una sección lejana sería un tirón, no una transición.
    sectionCam = fromZone ? id : null;
    setMode(id === 'contact' && fromZone ? 'interview' : 'panel');
    if (mode === 'interview') {
      pos.set(INTERVIEW.playerSpot[0], 0, INTERVIEW.playerSpot[1]);
      rotY = 0; // mira hacia +Z (el reportero)
      player.root.rotation.y = rotY;
      /*
       * RUTA B (E junto al reportero): aquí NO se abre el panel. Sale el cuadro de
       * conversación, que vive fuera del panel, y el panel de contacto se abrirá
       * cuando el guion se acabe (lo llama `dialogue`). Por eso la rama de abajo
       * no pinta nada en este caso: si también abriera el panel, la entrevista
       * volvería a quedar metida en la tarjeta.
       */
      dialogue.start();
    } else if (fromZone) {
      // El resto de secciones ya tienen al jugador encima (entró por la zona),
      // así que no hay que teletransportarlo: sólo orientarlo hacia el atrezo,
      // que es lo que hace que el plano sea el de alguien leyendo su rótulo.
      rotY = SECTION_CAMERA[id].face;
      player.root.rotation.y = rotY;
      // Primero la cámara, después la información.
      window.setTimeout(() => {
        // Si el jugador ha cerrado o abierto otra cosa mientras tanto, esta
        // apertura ya no vale y se descarta.
        if (token !== openToken || mode === 'play') return;
        panels.open(id);
      }, cameraSettle() * 1000);
    } else {
      panels.open(id);
    }
    if (!mvpShown && visited.size === SECTION_IDS.length) {
      mvpShown = true;
      window.setTimeout(() => hud.toast(t('mvp'), 4500), 600);
    }
  }

  function onScore(side: Side): void {
    sfx.swish();
    // El «golpe» de la canasta: media décima de segundo de sacudida.
    sacudir(SHAKE_TIME, SHAKE_AMP);
    /*
     * CONCURSO: la canasta suma, y suma lo que valía el balón que se tiró. Se
     * resuelve AQUÍ y no en el bucle porque el tanto lo canta la física del aro
     * (`Ball.integrate` → `onScore`), que es el único sitio donde se sabe que el
     * balón ha entrado de verdad.
     */
    /*
     * ¿ES SOBRE LA BOCINA? El balón salió antes de que el reloj llegara a 0
     * —después ya no se puede lanzar— y entra con el tiempo agotado: vale igual y
     * se canta. Se pregunta ANTES de resolver (el aviso es del tiro que acaba de
     * entrar) y el canto va al final de la función, con el resto de avisos.
     */
    const sobreLaBocina = enBocina(concurso);
    if (concurso.activo) {
      const suma = resolverTiro(concurso, true);
      /*
       * La canasta se canta con lo que VALÍA el balón que se tiró: `dinero`
       * pertenece al balón en juego y `resolverTiro` no lo toca (sólo lo reescribe
       * la próxima recogida), así que aquí sigue siendo el del tiro que acaba de
       * entrar. Y la racha la acaba de subir `resolverTiro`.
       */
      decir({ tipo: 'canasta', suma, puntos: concurso.puntos, dinero: concurso.dinero, racha: concurso.racha });
      hud.setContest(infoConcurso());
    }
    const crowdFx2 = courtGroup.userData.crowdFx as { wave: { value: number }; jump: { value: number } } | undefined;
    if (crowdFx2) {
      crowdFx2.jump.value = 1;
      crowdFx2.wave.value = 0;
    }
    missStreak = 0;
    /*
     * RACHA DE ACIERTOS: +1 por canasta y, al llegar a `TAKEOVER_HITS`, el balón
     * se enciende. Va ANTES de los early-returns de abajo (zona desbloqueada,
     * canasta sin zona…) porque la racha no depende de qué canasta sea: cuenta
     * aciertos, no recompensas.
     */
    let anunciarTakeover = false;
    hitStreak += 1;
    if (!takeover && hitStreak >= TAKEOVER_HITS) {
      takeover = true;
      sfx.cheer();
      anunciarTakeover = true;
      scoreboard.flash(t('takeover_tag'), 1600);
    }
    hud.setTakeover(hitStreak, takeover);
    stats.made++;
    saveStats(stats);
    hud.setRecord(stats.made, stats.attempted);
    scoreboard.setScore(stats.made, stats.attempted);

    const zone = zoneFor(side);
    // La canasta derecha ya no desbloquea nada: solo suma al récord.
    if (!zone || zone.kind !== 'shoot' || unlocked.has(zone.id)) {
      hud.toast(t('shot_basket'));
    } else {
      unlocked.add(zone.id);
      saveSet('court.unlocked', unlocked);
      refreshMenu();
      sfx.cheer();
      hud.toast(`${t('unlocked')}: ${t(sectionKey(zone.id))}`, 3000);
      window.setTimeout(() => mode === 'play' && openSection(zone.id, false), 1300);
    }
    /*
     * EL AVISO DEL TAKEOVER VA EL ÚLTIMO, y no es un detalle de estilo: en la
     * primera versión se enseñaba nada más entrar en la racha y el «¡Canasta!»
     * de la línea de arriba lo pisaba en el MISMO fotograma —el mismo elemento
     * del DOM—, así que el jugador que encendía el fuego nunca llegaba a leer
     * que lo había encendido. Medido en vivo: el aviso sólo se veía cuando la
     * canasta no era de zona (que no lleva toast) o cuando no desbloqueaba nada.
     */
    if (anunciarTakeover) hud.toast(t('takeover_on'), 3000);
    /*
     * Y el de la BOCINA, detrás del de la canasta, por lo mismo que el del
     * Takeover y por la misma lección aprendida: el «¡Canasta!» de arriba escribe
     * en el MISMO elemento del DOM, así que anunciarlo antes es no anunciarlo.
     *
     * Va el ÚLTIMO de los tres porque es el momento más raro de todos: la canasta
     * que sale antes de la bocina y entra después. Y el Takeover no se pierde
     * aunque lo tape: sus muescas se quedan encendidas en el HUD.
     */
    if (sobreLaBocina) hud.toast(t('contest_buzzer_beater'), 3200);
  }

  /**
   * Cuenta un INTENTO. Lo comparten el tiro y el mate en carrera: los dos son
   * tiros, y con el contador duplicado el día que se tocara uno el porcentaje de
   * acierto (`made/attempted`) mentiría.
   */
  function contarIntento(): void {
    stats.attempted++;
    saveStats(stats);
    hud.setRecord(stats.made, stats.attempted);
    scoreboard.setScore(stats.made, stats.attempted);
  }

  function shoot(meter: number): void {
    contarIntento();
    // Concurso: el reloj arranca con el PRIMER TIRO, no al convocar.
    arrancarReloj(concurso);
    const side = nearestSide();
    const rim = new THREE.Vector3(rimX(side), RIM.y, 0);
    const from = new THREE.Vector3(pos.x + Math.sin(rotY) * 0.2, 2.15, pos.z + Math.cos(rotY) * 0.2);
    const sol = solveShot(from, rim) ?? { vx: 0, vy: 6, vz: 0, t: 1, angleDeg: 90 };
    // La distancia al aro decide la dificultad: cuanto más lejos, más estrecha
    // es la zona verde y más amplifica el medidor cualquier error de timing.
    const dist = Math.hypot(pos.x - rim.x, pos.z - rim.z);
    const diff = difficultyAt(dist);
    // Mismo centro que se estaba dibujando: si el juicio usara el centro fijo
    // de antes, la barra se movería y el tiro no, y el jugador vería una cosa y
    // se puntuaría contra otra.
    const { e, perfect, sweet } = evaluateMeter(meter, diff, sweetCenterAt(chargeT));
    const assist = missStreak >= 3 ? 0.4 : 0.85; // tras 3 fallos el juego se vuelve más permisivo
    const v = applyShotError(sol, e, assist, Math.random, diff);
    console.info(
      `[shot] distancia=${dist.toFixed(2)} m  dificultad=${diff.toFixed(2)}  ` +
      `zonaVerde=${(sweet * 100).toFixed(0)} %  e=${e.toFixed(2)}  ` +
      `asistencia=${assist}  ${perfect ? 'PERFECTO' : 'fuera de zona'}`,
    );
    ball.launch(from, new THREE.Vector3(v.x, v.y, v.z));
    sfx.release();
    flick = FLICK_TIME;
    // Salta DESPUÉS de solvear la trayectoria: como el tiro se solvea desde un
    // `y` fijo, el orden no altera el resultado, pero deja claro que el salto
    // es la reacción al gesto y no parte del cálculo de la bandeja.
    launchJump(jump);
    if (perfect) {
      hud.toast(t('shot_perfect'), 1200);
      // El "PERFECTO" también en el marcador del techo (P7). Dos cifras de
      // 2,1 m a 5,7 m son las que todo el mundo ve, y no salen del HUD porque el
      // HUD no se mira: el texto tapa el récord un segundo y vuelve solo.
      scoreboard.flash(t('shot_perfect'), 1200);
    }
  }

  /**
   * EL GOLPE DEL MATE (lote B).
   *
   * El balón no se «suelta»: se METE. Y no se teletransporta al fondo de la red:
   * aparece justo encima del aro y cae, así que el tanto lo canta la MISMA física
   * que cualquier tiro —`Ball.integrate` cruza el plano del aro hacia abajo y
   * llama a `onScore`— con todo lo que eso trae: racha del Takeover, récord,
   * desbloqueo de zona. Nada de `made++` a mano: si el balón no entrara por el
   * aro, no habría canasta, que es la única forma de que un mate valga.
   *
   * La cámara vibra AQUÍ, en el instante del golpe, que es cuando lo pidió el
   * propietario, y la red se sacude con el golpe entero (`bumpNet(1)`), no con el
   * roce de un aro.
   */
  function machacar(): void {
    ball.launch(new THREE.Vector3(rimX(dunk.side), RIM.y + 0.16, 0), new THREE.Vector3(0, -3.6, 0));
    sacudir(SHAKE_DUNK_TIME, SHAKE_DUNK_AMP);
    bumpNet(1);
    sfx.release();
  }

  const tmp = new THREE.Vector3();
  /**
   * A dónde va el balón mientras está en las manos, y de dónde sale.
   *
   * `meta` es el destino de este fotograma (regate o pecho) y `recogeDesde` es
   * la posición REAL desde la que se recogió el balón, con la altura que
   * tenía: en el suelo, a media altura o donde fuera. Entre las dos se interpola
   * con el peso de la ventana de recogida, de modo que el balón SUBE hasta la
   * posición de manos en 0,3 s en vez de teletransportarse en un fotograma.
   */
  const meta = new THREE.Vector3();
  const recogeDesde = new THREE.Vector3();
  function placeHeldBall(time: number, speed01: number): void {
    const f = tmp.set(Math.sin(rotY), 0, Math.cos(rotY));
    const side = { x: Math.cos(rotY), z: -Math.sin(rotY) }; // +X local del jugador
    let x = pos.x;
    let y: number;
    let z = pos.z;
    if (charging) {
      // El balón va DELANTE DEL PECHO, sobre el eje del jugador. Antes se
      // colocaba a 1,9 m fijo, que con la cabeza nueva son 9 cm POR ENCIMA del
      // pelo: flotaba suelto sobre el jugador. Se probó a leer la posición de
      // las dos manos desde el rig, pero ambas devolvían la misma posición y el
      // balón salía pegado a un solo brazo; anclarlo al eje es determinista y
      // siempre queda centrado, con las manos cerrándose alrededor.
      x += f.x * 0.5;
      y = 0.86;
      z += f.z * 0.5;
    } else if (speed01 > 0.02) {
      /*
       * REGATE.
       *
       * La altura del bote escala con la velocidad: andando el balón da un
       * bote corto y corriendo llega a media altura. Antes el salto de
       * `speed01 > 0.1` a la variante de pecho era un peldaño, y con la
       * velocidad suavizada ese peldaño se notaba como un tirón al arrancar.
       *
       * El offset lateral es el de la mano: al cambiar de mano el balón se
       * desplaza al otro lado de la silueta en el mismo instante, que es lo que
       * hace legible el cambio. Y el bote va con él, desfasado media fase, para
       * que la mano que conduce se lea.
       *
       * La fase sale de `regateAltura` (en `human.ts`), que es la MISMA función
       * que consume `animateHuman` para el brazo: la fase es COMPARTIDA, no dos copias
       * del `sin(time * 11)` que acabarían desfasadas el día que se toque uno.
       */
      const rebote = 0.16 + speed01 * 0.6;
      y = 0.14 + regateAltura(time, handSide) * rebote;
      x += f.x * 0.45 + side.x * 0.3 * handSide;
      z += f.z * 0.45 + side.z * 0.3 * handSide;
    } else {
      // Altura de PECHO BAJA. Con la cabeza al 53 % de la altura, el torso
      // queda entre 0,55 y 0,85 m y la cabeza empieza justo ahí: a 0,95 m el
      // balón caía en la franja del rostro y tapaba la boca. A 0,78 m queda
      // delante del pecho, por debajo de la barbilla, y la cara se ve entera.
      y = 0.78;
      x += f.x * 0.52;
      z += f.z * 0.52;
    }
    meta.set(x, y, z);
    /*
     * SUBIDA DEL BALÓN. Fuera de la ventana de recogida el balón va directa a
     * la posición de manos (que es donde estaba ya); dentro, interpola desde
     * el punto real de recogida. El peso es el mismo `holdPeso` que mezcla los
     * brazos contra el pecho, así que balón y brazos llegan a la vez.
     */
    const w = holdPeso(recogeT);
    if (w < 1) ball.pos.lerpVectors(recogeDesde, meta, w);
    else ball.pos.copy(meta);
    ball.object.position.copy(ball.pos);
  }

  /* ───────── Concurso de triples (lote B) ───────── */

  /** Resumen que pinta el HUD mientras hay concurso, o `null` si no lo hay. */
  function infoConcurso(): {
    t: number; puntos: number; carro: number; total: number; balones: number; aviso: string | null;
  } | null {
    if (!concurso.activo) return null;
    /*
     * Con la bocina sonada el aviso manda sobre cualquier otro: el reloj está a
     * 0, el concurso sigue abierto y el jugador tiene que saber por qué (el balón
     * que va por el aire todavía vale). El aviso de la bola del dinero en ese
     * momento sería engañoso: ya no se puede lanzar.
     */
    const aviso = enBocina(concurso)
      ? t('contest_hint_buzzer')
      : concurso.esperando
        ? concurso.dinero
          ? t('contest_hint_money')
          : null
        : concurso.balones > 0
          ? null
          : quedanCarros(concurso)
            ? t('contest_hint_next')
            : null;
    return {
      t: concurso.t,
      puntos: concurso.puntos,
      carro: concurso.carro,
      total: TRIPLES.length,
      balones: concurso.balones,
      aviso,
    };
  }

  /**
   * El balón, a las manos, con la transición de siempre (nunca de un salto).
   *
   * `desde` es de dónde SALE el balón cuando no sale de donde está: la recogida
   * del concurso viene de la bandeja del puesto, así que hay que colocarlo allí
   * antes de abrir la ventana de recogida —si no, sube a las manos desde el último
   * sitio donde estuvo, que es lo que hacía que el balón que el jugador traía
   * pareciera el mismo en vez de uno del carro—. Sin `desde` se recoge desde su
   * posición actual, que es lo normal: rodando por la pista o cayendo por la red.
   */
  function darBalonAlJugador(desde?: THREE.Vector3): void {
    if (ball.state === 'held' && !desde) return;
    ball.state = 'held';
    if (desde) ball.pos.copy(desde);
    recogeDesde.copy(ball.pos);
    recogeT = 0;
  }

  /**
   * Posición del balón que hay en la BANDEJA de un puesto, en coordenadas de mundo.
   *
   * Es el de más a la derecha que siga a la vista, que es justo el que va a
   * desaparecer de la bandeja en cuanto `tomarBalon` baje la cuenta: así el balón
   * que el jugador se lleva es EL que se ve irse. Si el puesto no tiene ninguno a
   * la vista (no debería: `puedeCoger` exige balones) se recoge desde el centro de
   * la bandeja, que es un punto plausible y no un rincón del mundo.
   */
  const tmpBandeja = new THREE.Vector3();
  function balonDeLaBandeja(i: number): THREE.Vector3 {
    const p = puestos[i];
    if (!p) return tmpBandeja.set(pos.x, 0.86, pos.z);
    for (let k = p.balls.length - 1; k >= 0; k--) {
      const b = p.balls[k]!;
      if (b.visible) return b.getWorldPosition(tmpBandeja);
    }
    return p.group.getWorldPosition(tmpBandeja).setY(0.78);
  }

  /**
   * EL REBOTEADOR: pone en las manos del jugador un balón del puesto que toca.
   *
   * Es el ÚNICO sitio que reparte balones del concurso, y por eso cubre los dos
   * casos de una vez:
   *  · el balón está por ahí (rodando, cayendo por la red o en el aire) y sube a
   *    las manos;
   *  · el jugador YA traía uno (un rebote que recogió cruzando por encima), y ése
   *    se deja: el balón del turno es el de la bandeja.
   *
   * El segundo caso no es cosmético: es el arreglo de «el primer tiro tras cambiar
   * de carro no sale». Con un balón en la mano sin haber pasado por `tomarBalon`,
   * la bandera `esperando` se quedaba en false (la apaga la resolución del tiro
   * anterior) y `puedeCoger` sólo mira esa bandera, así que al lanzar el reboteador
   * entendía que no había balón en juego y le daba OTRO en el mismo fotograma: el
   * balón salía y volvía a la mano, y había que volver a tirar para que contara.
   * Llamando aquí a `tomarBalon` el balón queda marcado como en juego ANTES de que
   * se pueda lanzar, y el que llega es el de la bandeja.
   */
  function cogerBalonDelPuesto(): void {
    const traia = ball.state === 'held';
    /*
     * `tomarBalon` devuelve si el que llega es la «bola del dinero» (la última del
     * carro), que es lo que canta la cabina: el aviso del HUD lo dice desde que se
     * coge —el jugador tiene que saber que vale doble ANTES de tirar— y el
     * comentarista lo suelta en el mismo momento, que es cuando la grada se
     * levanta.
     */
    if (tomarBalon(concurso)) decir({ tipo: 'dinero' });
    darBalonAlJugador(traia ? balonDeLaBandeja(concurso.carro) : undefined);
  }

  /**
   * ENSEÑA U OCULTA EL RECORRIDO DEL CONCURSO (lote B, ajuste del propietario).
   *
   * En la pista sólo está el carrito de la esquina (que es el primer puesto): los
   * otros cuatro se colocan al convocar y se van al terminar, así que la cancha se
   * queda limpia para el baloncesto de siempre. Los tres elementos de cada puesto
   * van juntos (carro, anillo y mancha) porque por separado uno se queda
   * descolgado: un anillo naranja de puesto sin carro, o al revés.
   *
   * Los carros VUELVEN LLENOS: `empezar()` deja `balones` en tres y los que se
   * gastaron en la partida anterior no se recuerdan. Y la escala se devuelve a 1
   * siempre, incluso al esconderlos: si se quedara a media aparición, el concurso
   * siguiente empezaría a crecer desde donde se quedó el anterior.
   *
   * `puestosT` no es un booleano de encendido: es el progreso de la aparición, y
   * dejarlo en 0 al enseñarlos es lo que dispara la animación en `update()`.
   */
  function mostrarPuestos(on: boolean): void {
    puestosT = on ? 0 : 1;
    for (const c of carros) {
      c.group.visible = on;
      c.group.scale.y = 1;
    }
    for (const r of ringsPuestos) r.visible = on;
    for (const m of marcasPuestos) m.visible = on;
    /*
     * Los balones los pone el ESTADO y no un `visible = on` en bucle: el carrito
     * está siempre en la pista y sus balones no se apagan al terminar el concurso,
     * se recargan (`balonesVisibles(0)` devuelve tres sin concurso), mientras que
     * los de los cuatro carros que se van sí tienen que quedar a cero.
     */
    sincronizarBalones();
  }

  /**
   * CUÁNTOS BALONES SE VEN EN CADA PUESTO.
   *
   * Es la cuenta del HUD («●●○») trasladada al mundo, y sale del estado del
   * concurso, no de cuántos balones se han tocado: una sola fuente. Sin concurso
   * sólo existe el carrito, y está lleno —es de donde se coge el balón para jugar
   * al baloncesto normal, así que tiene que tener balones aunque no haya minijuego—.
   */
  function balonesVisibles(i: number): number {
    if (!concurso.activo) return i === 0 ? CONCURSO.balones : 0;
    if (i < concurso.carro) return 0; // los de atrás se quedaron vacíos
    if (i > concurso.carro) return CONCURSO.balones; // los de delante, sin tocar
    // El puesto que toca: menos el que el jugador tiene en las manos (o en el aire).
    return Math.max(0, concurso.balones - (concurso.esperando ? 1 : 0));
  }

  /**
   * LOS BALONES DEL CARRO, EN EL MUNDO, y tanto si se encesta como si se falla.
   *
   * La cuenta del HUD («●●○») se ve en la bandeja: los balones que ya están
   * tirados desaparecen del carro, así que se sabe cuántos quedan sin mirar
   * arriba. La bajada la decide el ESTADO (`concurso.balones`), y ese descuento lo
   * hace `resolverTiro()` en los dos desenlaces —`onScore` para la canasta y
   * `fallarTiro` para el fallo—, así que el balón se va igual si entra que si no y
   * nunca vuelve a la bandeja.
   *
   * Mientras el balón va por el aire (`esperando`) se descuenta el que se está
   * tirando, que es el que el jugador tiene en las manos: si se descontara al
   * resolver el tiro, el balón se vería a la vez en la mano y en la bandeja.
   *
   * Se escribe SÓLO cuando cambia el valor: 15 escrituras de propiedad por
   * fotograma durante un minuto no se notan, pero no hay ninguna razón para
   * hacerlas.
   */
  function sincronizarBalones(): void {
    puestos.forEach((p, i) => {
      const quedan = balonesVisibles(i);
      for (let k = 0; k < p.balls.length; k++) {
        const on = k < quedan;
        if (p.balls[k]!.visible !== on) p.balls[k]!.visible = on;
      }
    });
  }

  /** Convoca el concurso desde el carrito de la esquina (E). */
  function convocarConcurso(): void {
    empezar(concurso);
    mostrarPuestos(true);
    /*
     * EL PRIMER BALÓN ES DEL CARRITO.
     *
     * El que el jugador traía de la pista se queda fuera: al empezar el concurso
     * se coge uno de la bandeja del primer carro (el carrito en el que está de
     * pie) y se ve llegar del carro a las manos. Lo hace el mismo reboteador que
     * el resto de la partida (`cogerBalonDelPuesto`), así que no hay dos reglas
     * para lo mismo.
     *
     * Va DESPUÉS de `mostrarPuestos()` y con la comprobación de alcance: el alcance
     * de recogida (1,2 m) es más corto que el de la E (1,8 m), así que quien convoca
     * desde el borde de la zona recibe el balón al acercarse, un paso después.
     */
    if (puedeCoger(concurso, pos.x, pos.z)) cogerBalonDelPuesto();
    sfx.click();
    hud.toast(t('contest_on'), 3000);
    decir({ tipo: 'arranque' });
    hud.setContest(infoConcurso());
  }

  /**
   * Cierra el concurso y deja el mundo como estaba.
   *
   * La marca se guarda SÓLO si mejora: el concurso es una partida de 60 s y
   * perder una no puede borrar la mejor que se haya hecho nunca.
   */
  function terminarConcurso(motivo: 'tiempo' | 'carros'): void {
    const { puntos, aciertos, tiros } = concurso;
    if (motivo === 'carros') terminar(concurso);
    else salir(concurso);
    mostrarPuestos(false);
    const record = puntos > mejorConcurso;
    if (record) {
      mejorConcurso = puntos;
      saveMejorConcurso(puntos);
    }
    sfx.cheer();
    hud.setContest(null);
    hud.toast(
      `${motivo === 'tiempo' ? t('contest_end_time') : t('contest_end')} · ${puntos} · ${aciertos}/${tiros}` +
        (record ? ` · ${t('contest_best')}` : ''),
      4200,
    );
    /*
     * El marcador final lo dice el AVISO de arriba con sus números, y la cabina
     * lo canta abajo: es el único momento del concurso en el que se habla dos
     * veces, y a propósito —uno es el rótulo del resultado y el otro la voz que lo
     * despide—. El «récord» no se repite: el aviso ya lo dice y la frase lo mete
     * en la misma línea del marcador.
     */
    decir({ tipo: 'final', puntos, aciertos, tiros, record });
    darBalonAlJugador();
  }

  /** Deja el concurso a medias (se pulsa E en el carrito). */
  function abandonarConcurso(): void {
    salir(concurso);
    hud.setContest(null);
    hud.hideSubtitle();
    mostrarPuestos(false);
    darBalonAlJugador();
  }

  const tmpHand = new THREE.Vector3();
  /**
   * El balón, colgado de la MANO que machaca mientras dura la animación.
   *
   * Con `placeHeldBall` el balón iría al regate o contra el pecho —o sea, a la
   * altura de la cadera— mientras el cuerpo vuela hacia el aro con los brazos
   * arriba: el gesto se leería al revés. `handWorld` da el centro de la mano
   * derecha YA POSADA (la pose se aplica antes, en `animateHuman`), así que el
   * balón sube con el brazo y llega al aro en la mano, que es de donde sale el
   * mate.
   */
  function colgarBalonDeLaMano(): void {
    ball.pos.copy(handWorld(player, 1, tmpHand));
    ball.object.position.copy(ball.pos);
  }

  /*
   * SPIN DEL BALÓN (punto P3).
   *
   * El balón ya se desplazaba girando con dos sumas de Euler dentro de
   * `ball.step`, que depended del frame rate y no rodaba de verdad. Aquí se
   * sustituye por la rotación que sí es física: el eje es el del RODAMIENTO,
   * `up × velocidad` (horizontal, perpendicular a la marcha), y el ángulo es
   * `v / R` por segundo, que es la velocidad angular de una esfera que rueda sin
   * deslizar. Con el radio visual de 0,204 m, un balón que sale del tiro a 12 m/s
   * da 59 rad/s: las bandas de la corteza giran como giran.
   *
   * En el aire se gira algo menos (factor 0,55): un balón lanzado lleva efecto,
   * no rodadura, y con la misma velocidad el giro a ojo sería dos veces más
   * rápido de lo creíble.
   *
   * Coste: un cuaternión por fotograma y NADA más — ni una matriz, ni una draw
   * call, ni un cambio de estado. Se aplica SOBRE la orientación, no acumulando:
   * se parte de identidad en cada fotograma, que es lo que hace determinista el
   * giro (si no, se sumaría sobre lo que escribiera `ball.step`).
   */
  const spinAxis = new THREE.Vector3();
  const spinQ = new THREE.Quaternion();
  function spinBall(dt: number): void {
    const vx = ball.vel.x;
    const vz = ball.vel.z;
    const plano = Math.hypot(vx, vz);
    if (plano < 0.05) return; // quieto o falling de cabeza: no hay eje
    // `up × v` con `up` = (0, 1, 0): da (vz, 0, -vx), que es el eje de rodamiento.
    spinAxis.set(vz, 0, -vx).normalize();
    const rodando = ball.pos.y <= BALL.radius + 0.02;
    const rad = plano / (BALL.radius * BALL.visualScale) * (rodando ? 1 : 0.55);
    spinQ.setFromAxisAngle(spinAxis, rad * dt);
    /*
     * Se multiplica SOBRE la orientación que ya hay, y no desde la identidad.
     *
     * Con `identity()` delante el cuaternión resultante era el giro de UN solo
     * fotograma, y como el siguiente volvía a partir de cero el balón no giraba:
     * alternaba unos 56° de inclinación en cada fotograma, que a ojo es ruido.
     * El giro de una esfera es acumulativo por definición: se compone.
     * `ball.step` ya no escribe rotación (ver el comentario de `Ball.step`).
     */
    ballMesh.quaternion.premultiply(spinQ);
  }

  // ───────── Cámara
  const camGoal = new THREE.Vector3();
  const lookGoal = new THREE.Vector3();
  const lookNow = new THREE.Vector3();
  let dist = 1;

  /*
   * Estado de la cámara y del aterrizaje (fases B y C).
   *
   *  · `advX/advZ`: dirección de marcha suavizada, para el adelanto del encuadre.
   *  · `zoomNow`: acercamiento al cargar el tiro (1 = sin acercar).
   *  · `shake`: tiempo que le queda a la sacudida de la canasta.
   *  · `land`: 1 justo al tocar suelo y baja a 0 en un cuarto de segundo.
   */
  const SHAKE_TIME = 0.15;
  /** Amplitud de la sacudida de la canasta, en metros (±2,2 cm). */
  const SHAKE_AMP = 0.022;
  /*
   * SACUDIDA DEL MATE.
   *
   * Más larga y más ancha que la del aro (0,3 s y 5,5 cm contra 0,15 s y 2,2 cm),
   * porque un mate se siente en todo el pabellón y una canasta no. «Ligeramente»
   * es literal: 5,5 cm sobre una cámara que está a 16 m se lee como un golpe y no
   * como un terremoto, y sigue por debajo del umbral al que la escena se marea.
   */
  const SHAKE_DUNK_TIME = 0.3;
  const SHAKE_DUNK_AMP = 0.055;
  let advX = 0;
  let advZ = 0;
  let advTargetX = 0;
  let advTargetZ = 0;
  let zoomNow = 1;
  let shake = 0;
  let shakeDur = SHAKE_TIME;
  let shakeAmp = SHAKE_AMP;
  /**
   * Pide una sacudida de cámara: `dur` segundos con amplitud `amp` en metros.
   *
   * La amplitud vive con la duración, en vez de ser una constante fija del bucle,
   * porque ahora hay DOS golpes distintos —la canasta y el mate— y el temblor
   * tiene que poder cambiar de uno a otro sin tocar la fórmula.
   */
  function sacudir(dur: number, amp: number): void {
    shake = dur;
    shakeDur = dur;
    shakeAmp = amp;
  }
  let camTime = 0;
  let land = 0;
  let wasGrounded = true;
  /*
   * Estados de un solo disparo que la animación consume y va apagando. Son tres
   * flotantes, cero trabajo por fotograma cuando valen 0, y son la forma de
   * meter reacciones (mirar al cambiar de mano, encogerse al fallar, agacharse a
   * recoger) sin tocar la firma de `animateHuman` ni sus valores por defecto.
   */
  let giro = 0; // -1..1, cabeza al cambiar de mano
  let frustracion = 0; // 0..1, hombros caídos tras fallar

  /*
   * VENTANA DE RECOGIDA (0..RECOGE_TIME) y PESOS DE CAPA DE POSE.
   *
   * Antes `recoge` era un flotante que se ponía a 1 en el fotograma en que se
   * recogía el balón y se apagaba solo: eso metía de golpe 0,55 rad en los
   * brazos, y el mismo `if/else` de `animateHuman` sacaba al personaje de la
   * rama de braceo a la de pecho en un solo fotograma (0,9 rad). Con la ventana,
   * `recogeT` es el TIEMPO dentro de la recogida y los pesos salen de las
   * curvas de `human.ts`, que empiezan y acaban en 0: el gesto entra y sale
   * sin escalón.
   *
   * `holdW`, `tiroW` y `celeW` son los pesos con los que se MEZCLAN las poses
   * sobre la base. Se mueven con `mezclaPeso` (exponencial, independiente del
   * `dt`), nunca de golpe: por eso empezar o soltar la carga del tiro y entrar
   * o salir de la celebración tampoco son saltos.
   *
   * Fuera de la ventana de recogida, `holdW` sigue al estado del balón con
   * `HOLD_TASA`: 8 1/s son 0,11 rad de brazo por fotograma como mucho, la mitad
   * del braceo normal.
   */
  let recogeT = RECOGE_TIME; // arranca ya "recogido": el balón empieza en las manos
  let holdW = 1;
  let tiroW = 0;
  let celeW = 0;
  /** Duración del seguimiento de brazos del tiro, en segundos. */
  const FLICK_TIME = 0.35;
  /** Duración de la celebración tras anotar, en segundos. */
  const CELEBRATION_TIME = 1.6;
  /** Tasa de entrada/salida de la pose de "balón en las manos", en 1/s. */
  const HOLD_TASA = 8;

  /** Cuánto de regate hay: 0 con el balón contra el pecho, 1 a tope. */
  const REGATE_ON = 0.02; // mismo umbral que usa `placeHeldBall`
  const REGATE_FULL = 0.2;
  const regate01 = (sp: number): number => clamp((sp - REGATE_ON) / (REGATE_FULL - REGATE_ON), 0, 1);

  function updateCamera(dt: number, snap = false): void {
    if (import.meta.env.DEV && dbg.freeze) return;
    /*
     * ÓRBITA CINEMÁTICA DE LA PUERTA DE IDIOMA.
     *
     * La escena que hay detrás del selector ya está construida y horneada, así
     * que enseñarla no cuesta nada: sólo mueve la matriz de la cámara, igual que
     * la micro-órbita del panel de más abajo.
     *
     * Gira alrededor del CENTRO de la pista, que es donde aparece el jugador, y
     * no alrededor del jugador: aquí no hay nadie dirigiendo nada, así que
     * perseguir su posición daría un plano que cabecea sin motivo.
     *
     * El radio y la altura NO salen de la cámara del juego (la de juego va a
     * 12,4 m con fov 32, encuadrando un tercio de pista). Esta tiene que ver
     * la cancha entera y dos protagonists, así que sube y se retira.
     *
     * Con `prefers-reduced-motion` no gira: se queda en el ángulo de partida.
     */
    if (mode === 'attract') {
      const th = reduced ? -0.6 : camTime * 0.115 + -0.6;
      const r = 21;
      camGoal.set(Math.sin(th) * r, 9.5, Math.cos(th) * r);
      lookGoal.set(0, 1.6, 0);
      zoomNow += (1 - zoomNow) * (1 - Math.exp(-6 * Math.max(dt, 0)));
      const k = snap ? 1 : 1 - Math.exp(-CAMERA.lerp * dt);
      camera.position.lerp(camGoal, k);
      lookNow.lerp(lookGoal, k);
      camera.lookAt(lookNow);
      return;
    }
    /*
     * PLANO DE LA CÁMARA DE TELEVISIÓN (lote B).
     *
     * `mode === 'interview'` significa «el plató está en directo», que es cuando
     * el jugador está de pie en el punto de la entrevista: ahí la cámara ya no es
     * la del juego, es la de la tele. Se entra con el mismo lerp que todo lo
     * demás, así que el cambio de plano es el viaje de la cámara y no un corte.
     */
    let fovObjetivo: number = CAMERA.fov;
    const sec = mode === 'interview' ? null : sectionCam ? SECTION_CAMERA[sectionCam] : null;
    if (mode === 'interview') {
      camGoal.set(...INTERVIEW.pov.pos);
      lookGoal.set(...INTERVIEW.pov.look);
      fovObjetivo = CAMERA.tvFov;
      zoomNow += (1 - zoomNow) * (1 - Math.exp(-6 * Math.max(dt, 0)));
    } else if (sec) {
      // Plano de sección: bajo, cercano y fijo. No se escala por `dist` (la
      // compensación de aspecto del plano de juego), porque aquí la distancia
      // a la sección es la que da el encuadre y no el formato de la pantalla.
      camGoal.set(...sec.pos);
      lookGoal.set(...sec.look);
      zoomNow += (1 - zoomNow) * (1 - Math.exp(-6 * Math.max(dt, 0)));
    } else {
      const tx = clamp(pos.x, -CAMERA.clampX, CAMERA.clampX);
      const tz = clamp(pos.z, CAMERA.minZ, CAMERA.maxZ);
      /*
       * ADELANTO. El objetivo de mirada va por delante del jugador y la cámara
       * también: el cuerpo queda abajo del encuadre y se ve el terreno al que va,
       * que es lo que hace legible moverse por una pista grande desde arriba.
       */
      const ax = advX * CAMERA.advance;
      const az = advZ * CAMERA.advance;
      lookGoal.set(tx + ax * 0.8, 0.8, tz + az * 0.8);
      const d = dist * zoomNow;
      camGoal.set(tx + CAMERA.offset[0] * d + ax, CAMERA.offset[1] * d, tz + CAMERA.offset[2] * d + az);
      /*
       * ÓRBITA LENTA CON EL PANEL ABIERTO.
       *
       * Al abrir una sección el juego se queda quieto y la escena de al lado se
       * congelaba de golpe. Con esto la cámara gira ±9° en torno al jugador muy
       * despacio (0 coste: sólo la matriz de la cámara), y la pista sigue viva
       * detrás del panel. Con `prefers-reduced-motion` no gira.
       */
      if (mode === 'panel' && !reduced) {
        const th = Math.sin(camTime * 0.18) * 0.16;
        const ox = camGoal.x - tx;
        const oz = camGoal.z - tz;
        camGoal.x = tx + ox * Math.cos(th) - oz * Math.sin(th);
        camGoal.z = tz + ox * Math.sin(th) + oz * Math.cos(th);
      }
      zoomNow += ((charging ? CAMERA.chargeZoom : 1) - zoomNow) * (1 - Math.exp(-6 * Math.max(dt, 0)));
    }
    const k = snap || reduced ? 1 : 1 - Math.exp(-CAMERA.lerp * dt);
    camera.position.lerp(camGoal, k);
    lookNow.lerp(lookGoal, k);
    /*
     * El FOV sólo se recalcula cuando CAMBIA: `updateProjectionMatrix()` son
     * nueve números y una matriz nueva, y aquí se pasaría por él sesenta veces
     * por segundo para nada.
     */
    if (camera.fov !== fovObjetivo) {
      camera.fov = fovObjetivo;
      camera.updateProjectionMatrix();
    }
    /*
     * SACUDIDA de la canasta (fase C): 0,15 s de ±2,2 cm. Tres senos de
     * frecuencias distintas y desfasadas para que el temblor no se lea como un
     * vaivén en una sola dirección, y con la amplitud cayendo a cero, que es lo
     * que lo hace parecer un golpe y no un terremoto.
     */
    if (shake > 0 && !reduced) {
      shake = Math.max(0, shake - dt);
      const a = shakeAmp * (shake / shakeDur);
      camera.position.x += Math.sin(camTime * 61) * a;
      camera.position.y += Math.sin(camTime * 47 + 1.7) * a;
      camera.position.z += Math.sin(camTime * 53 + 3.1) * a;
    }
    camera.lookAt(lookNow);
  }

  function resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En vertical se ve más cancha, pero a media fuerza: ver `CAMERA.portraitGrow`.
    dist = clamp(1 + (1.5 / camera.aspect - 1) * CAMERA.portraitGrow, 1, 2.4);
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
  onProgress(0.85);

  // ───────── Bucle
  const proj = new THREE.Vector3();
  const camDir = new THREE.Vector3();
  const camFlat = new THREE.Vector3();
  const camTo = new THREE.Vector3();
  const toZone = new THREE.Vector3();
  const clock = new THREE.Clock();
  const gl = renderer.getContext();
  let raf = 0;

  /*
   * ¿Hay un bucle de render en marcha?
   *
   * `frame()` se re-encola a sí misma en su primera línea, así que el bucle se
   * sostiene solo. Al pedir uno nuevo hay que saber si ya hay otro en marcha: la
   * cinemática de la puerta arranca uno (`beginAttract`) y, si el visitante elige
   * idioma, `start()` pide otro. Sin este guarda habría DOS cadenas y cada
   * fotograma se dibujaría dos veces, con el coste duplicado y sin que nada lo
   * delate.
   *
   * IMPORTANTE: la comprobación va AQUÍ, en quien PIDE el bucle, y NO dentro de
   * `frame()`. Dentro cortaba la cadena: la primera llamada programaba un
   * sucesor, ese sucesor se salía por el guarda sin volverse a encolar, y el
   * juego se quedaba congelado en el fotograma de la precarga —con la puerta
   * cerrada y sin poder moverse, que es justo lo que se ve si esto falla.
   */
  let bucleActivo = false;

  /** Pide un fotograma, salvo que el bucle ya esté en marcha. */
  function pedirBucle(): void {
    if (bucleActivo) return;
    bucleActivo = true;
    raf = requestAnimationFrame(frame);
  }

  /*
   * CALIDAD ADAPTATIVA CON OBJETIVO DE 60 FPS.
   *
   * La versión anterior contaba fotogramas por encima de 1/24 s (41,7 ms) y bajaba
   * la resolución de 0,25 en 0,25 con un suelo de 1. En la práctica no se disparaba
   * nunca en el caso que importa: un renderizador por software (el panel) que hace
   * el fotograma en 33-43 ms y por tanto alterna 16,7 / 33,3 / 50 ms. Eso es
   * exactamente lo que se percibe como stutter al moverse, y el ajuste no lo tocaba.
   *
   * Ahora se mide la MEDIANA de los últimos 30 intervalos (60 fps = 16,7 ms) y se
   * distingue de quién es la culpa: si el intervalo no cabe pero el COSTE real de
   * render tampoco (medido con un `readPixels` de 1 píxel, que fuerza el flush y por
   * eso mide rasterizado y no envío de comandos), se baja la resolución; si el
   * intervalo no cabe pero el coste es pequeño, el que no da 60 fps es el sistema
   * (p. ej. una pestaña sin foco, que Chromium limita) y bajar resolución sólo
   * emborronaría la escena a cambio de nada.
   *
   * El suelo es 0,7 (no 1) porque es precisamente en un rasterizador por software
   * donde hace falta: en la GPU del propietario esto no se activa nunca.
   *
   * ─────────────────────────────────────────────────────────────────────────────
   * NADA DE ESO ERA SUFICIENTE: LOS 204 ms QUE MEDÍA EL USUARIO
   * ─────────────────────────────────────────────────────────────────────────────
   *
   * La consola decía, textual:
   *
   *   [calidad] fotograma 37.0 ms con coste 204.3 ms -> escala 0.9
   *   [calidad] fotograma 33.8 ms con coste 204.3 ms -> escala 0.8
   *   [calidad] fotograma 26.8 ms con coste 204.3 ms -> escala 0.7
   *
   * Dos fallos encadenados, y ninguno era "la GPU va lenta":
   *
   *  1. **La medida incluía la COLA, no el fotograma.** El reloj arrancaba
   *     ANTES de `renderer.render()` y se paraba en el `readPixels` de 1 px, que
   *     fuerza el vaciado de TODO lo pendiente. En el arranque, lo pendiente
   *     eran las siete vistas de la precompilación, la subida de texturas y el
   *     horneado de sombras: la factura de la CARGA, no la del dibujo de ese
   *     fotograma. Y como el `readPixels` de drenaje pone el reloj a cero, ese
   *     204,3 se reutilizaba tal cual durante los siguientes 120 fotogramas —
   *     por eso sale el mismo número en las tres líneas.
   *  2. **Un solo muestreo fijaba el techo de la sesión.** `techoFallido` se
   *     bajaba en la primera decisión y la recuperación quedaba topada por
   *     `techoFallido - 0.05` PARA SIEMPRE: con `max: 1` y `min: 0.7`, después
   *     de esa medición el juego no podía pasar de 0,75 aunque la GPU llevara
   *     diez segundos libre.
   *
   * Lo de aquí abajo arregla los dos: el drenaje va ANTES del reloj (y la
   * medida se repite en cuanto cambia la escala, para que el número sea de la
   * escala nueva), y mover el techo exige N decisiones CONSECUTIVAS por encima
   * del umbral. El techo tampoco es ya una sentencia: tras un rato estable a
   * 60 fps se permite reintentar un peldaño más alto, con tope de reintentos.
   */
  /*
   * El techo es el escalado con el que se ha ARRANCADO, que ya puede venir
   * bajado si la GPU es de las flojas (ver `ESCALA_HARDWARE_FLOJO` arriba): con
   * hardware flojo la escalada adaptativa no tiene adónde subir por encima de
   * 0,7, y no por una regra interna sino porque ese es el punto de partida que
   * se le ha dado. El suelo (`ESCALA_MIN`) se declara arriba, junto a la decisión
   * que lo usa, porque de esa decisión depende.
   */
  const ESCALA_MAX = pixelRatio;
  /**
   * Decisiones CONSECUTIVAS por encima del umbral antes de mover el techo.
   *
   * Tres es el mínimo útil: con uno, el arranque ruidoso fijaba la escala para
   * el resto de la partida. Con tres, un pico aislado (una compilación que se
   * coló, una pestaña que se puso en segundo plano) no baja nada, y una bajada
   * de verdad —que dura segundos— sigue entrando en tres decisiones.
   */
  const FALLOS_NECESARIOS = 3;
  /** Segundos seguidos a 60 fps antes de permitir reintentar un peldaño más alto. */
  const REINTENTO_ESTABLE_S = 20;
  /** Cuántas veces se reintenta el mismo peldaño antes de aceptarlo como techo. */
  const REINTENTOS_POR_PELDAÑO = 2;
  /** Decisiones a 60 fps antes de subir un peldaño (histéresis de la subida). */
  const SUBIDA_DECISIONES = 15;

  /** Mayor escala en la que se ha visto fallar. Sube con los reintentos. */
  let techoFallido = ESCALA_MAX;
  /** Reintentos gastados en el peldaño del techo actual. */
  let reintentos = 0;
  /** Decisiones seguidas pidiendo bajar la escala. */
  let fallosConsec = 0;
  /** Segundos acumulados a 60 fps sin bajar (ventana de reintento del techo). */
  let estableSeg = 0;
  /** Ya se ha avisado de que el suelo no da 60 fps: se dice UNA vez. */
  let avisadoSuelo = false;
  /** Hay que medir el coste en el próximo fotograma (tras cambiar de escala). */
  let forzarMedida = false;
  /** Escala con la que se tomó el último coste medido, para el log. */
  let escalaMedida = ESCALA_MAX;
  let hist: number[] = [];
  let medianaMs = 0; // última mediana calculada (0 = aún sin ventana llena)
  let costeRender = -1; // ms del último fotograma medido con flush
  let desdeCoste = 0;
  let subiendo = 0;
  const pixel = new Uint8Array(4);

  /*
   * HEARTBEAT DE RENDIMIENTO: cada cuántos segundos sale una línea `[perf]`.
   *
   * Dos segundos es la ventana más corta en la que la mediana y el p95 dicen
   * algo: por debajo, el número se mueve con el ruido del planificador del
   * sistema; por encima, si el problema es de 500 ms, nadie lo ve llegar.
   *
   * En DESARROLLO sale siempre. En producción sólo con `?perf=1`: una línea cada
   * dos segundos durante toda la partida es exactamente el tipo de consola que
   * hace que nadie abra la consola nunca.
   *
   * EL LATIDO NO MINTE, y antes sí mintía. La ventana `hist` tarda en llenarse
   * (los 45 primeros fotogramas no cuentan, y la mediana no se calcula hasta
   * tener 30 intervalos), así que en los primeros latidos salía
   *
   *     [perf] mediana 0.0 ms · p95 0.0 ms · escala 1 · ...
   *
   * Un 0,0 en la columna de milisegundos se lee como "va perfecto", y era
   * exactamente lo contrario: era que no había nada medido. Por eso ahora la
   * línea sólo sale con números cuando hay ventana llena, y mientras no la hay
   * sale una línea que lo dice sin ambigüedad y sin cifras de tiempos.
   *
   * La condición NO es sólo `hist.length`: `medianaMs` sobrevive a un cambio de
   * escala (no se pone a 0, y `calidad` vacía `hist` entera), así que con la
   * mediana sola la línea imprimiría un número viejo junto a un p95 recién
   * medido en cero. Se exigen las dos cosas.
   */
  const LATIDO_MS = 2000;
  /**
   * Muestras que tiene que tener la ventana para que sus percentiles digan
   * algo. Es el tamaño al que `calidad()` recorta la ventana después de decidir
   * (`slice(-20)`), o sea el mínimo que se alcanza una vez calentado.
   */
  const PERF_MIN_MUESTRAS = 20;
  let ultimoLatido = 0;

  function mediana(a: number[]): number {
    const s = [...a].sort((x, y) => x - y);
    return s[s.length >> 1]!;
  }

  /** Percentil de una ventana ya ordenada o sin ordenar (0..1). */
  function percentilOrdenado(a: number[], p: number): number {
    if (a.length === 0) return 0;
    const s = [...a].sort((x, y) => x - y);
    return s[Math.min(s.length - 1, Math.max(0, Math.round((s.length - 1) * p)))]!;
  }

  /*
   * ARRANQUE: los primeros fotogramas NO cuentan.
   *
   * Compilar los shaders y hornear el mapa de sombras se lleva un fotograma de
   * decenas de milisegundos, y con la ventana de 30 ese pico entraba en la
   * mediana y bajaba la escala a 0,7 nada más cargar, sin que el juego fuera
   * lento (medido: 102 ms en el primer fotograma, 20 ms después). Se ignoran los
   * 45 primeros, que es lo que tarda la escena en quedarse en régimen.
   *
   * Y a partir de aquí la medida de COSTE ya no arrastra ese arranque: el
   * drenaje previo (`frame`) hace que el `readPixels` final mida sólo el
   * fotograma recién dibujado.
   */
  let frames = 0;

  /** Ajusta la escala de render según lo medido. Devuelve si ha cambiado. */
  function calidad(inter: number, coste: number): boolean {
    if (++frames < 45) return false;
    hist.push(inter);
    if (hist.length < 30) return false;
    const m = mediana(hist);
    medianaMs = m;
    const ventana = hist.slice(-20); // media ventana: reacciona sin oscilar
    hist = ventana;
    if (m > 19) {
      subiendo = 0;
      estableSeg = 0;
      fallosConsec++;
      // El umbral es el PRESUPUESTO del fotograma (16,7 ms) y no un valor bajo:
      // un coste de 14 ms cabe en 60 fps, y bajar resolución ahí sólo emborrona.
      if (coste > 15 && pixelRatio > ESCALA_MIN + 0.001) {
        if (fallosConsec === 1) {
          // Se dice sólo al empezar la racha: durante un problema sostenido
          // esto se repetiría tres veces cada 20 fotogramas.
          console.info(
            `[calidad] fotograma ${m.toFixed(1)} ms con coste ${coste.toFixed(1)} ms a escala ${pixelRatio}: ` +
              `decisión 1/${FALLOS_NECESARIOS} por encima del umbral`,
          );
        }
        if (fallosConsec < FALLOS_NECESARIOS) return false;
        const n = fallosConsec;
        fallosConsec = 0;
        const antes = pixelRatio;
        techoFallido = antes;
        reintentos = 0;
        pixelRatio = Math.max(ESCALA_MIN, +(antes - 0.1).toFixed(2));
        hist = [];
        forzarMedida = true;
        console.info(
          `[calidad] BAJA · ${n}/${FALLOS_NECESARIOS} decisiones seguidas · ` +
            `fotograma ${m.toFixed(1)} ms con coste ${coste.toFixed(1)} ms a escala ${antes} -> escala ${pixelRatio}`,
        );
        return true;
      }
      if (coste > 15 && pixelRatio <= ESCALA_MIN + 0.001 && !avisadoSuelo) {
        avisadoSuelo = true;
        console.warn(
          `[calidad] escalado mínimo: la GPU no da 60 fps ni a ${ESCALA_MIN} ` +
            `(fotograma ${m.toFixed(1)} ms, coste ${coste.toFixed(1)} ms). El juego sigue ahí; ` +
            `bajar más sólo emborronaría la escena a cambio de nada.`,
        );
      }
      return false;
    }
    fallosConsec = 0;
    if (m > 17.5) {
      subiendo = 0;
      estableSeg = 0;
      return false;
    }
    // 60 fps de verdad (16,7 ms con margen). El tiempo se cuenta con los
    // intervalos REALES de la ventana que acaba de pasar, no con un contador de
    // fotogramas: si el juego va a 30 fps, 20 fotogramas son medio segundo.
    estableSeg += ventana.reduce((a, b) => a + b, 0) / 1000;
    const techo = Math.min(ESCALA_MAX, techoFallido);
    if (pixelRatio < techo - 0.001) {
      if (++subiendo < SUBIDA_DECISIONES) return false;
      subiendo = 0;
      const antes = pixelRatio;
      pixelRatio = Math.min(techo, ESCALA_MAX, +(pixelRatio + 0.1).toFixed(2));
      hist = [];
      forzarMedida = true;
      console.info(
        `[calidad] SUBIDA · fotograma ${m.toFixed(1)} ms con coste ${coste.toFixed(1)} ms a escala ${antes} -> escala ${pixelRatio}`,
      );
      return true;
    }
    subiendo = 0;
    /*
     * Ya está en el techo y aguanta: se le da margen para reintentar UN peldaño
     * más. El tope de reintentos es lo que impide que esto sea un ciclo: como
     * mucho se sube dos veces por escala, y hace falta un tranche entero de
     * `REINTENTO_ESTABLE_S` segundos a 60 fps entre un peldaño y el siguiente.
     * Si el equipo aguanta, la escalada sigue sola hasta ESCALA_MAX; si no,
     * vuelve a caer y para (y el aviso del suelo lo dice).
     */
    if (techoFallido < ESCALA_MAX - 0.001 && estableSeg >= REINTENTO_ESTABLE_S && reintentos < REINTENTOS_POR_PELDAÑO) {
      reintentos++;
      estableSeg = 0;
      techoFallido = Math.min(ESCALA_MAX, +(techoFallido + 0.1).toFixed(2));
      console.info(
        `[calidad] techo reintentado: ${REINTENTO_ESTABLE_S} s estables a escala ${pixelRatio} -> ` +
          `se permite hasta ${Math.min(ESCALA_MAX, techoFallido)} (reintento ${reintentos}/${REINTENTOS_POR_PELDAÑO})`,
      );
    }
    return false;
  }

  /*
   * Velocidad suavizada del jugador. DEBE vivir fuera de `update`: antes era un
   * `let` local inicializado a 0 en cada fotograma, así que el suavizado nunca
   * pasaba de un 18 % de la entrada y la zancada salía casi imperceptible.
   */
  let speed01 = 0;

  /**
   * @param time     reloj decorativo (se congela con `prefers-reduced-motion`).
   * @param animTime reloj del PERSONAJE: nunca se congela. La zancada es
   *                 respuesta directa a la entrada del jugador (feedback de juego),
   *                 no decoración; con el reloj a 0, `sin(time)` era siempre 0 y el
   *                 personaje se deslizaba sin mover las piernas.
   */
  function update(dt: number, time: number, animTime = time): void {
    camTime = time;
    const playing = mode === 'play';
    let speedTarget = 0; // valor bruto de entrada
    advTargetX = 0;
    advTargetZ = 0;

    /*
     * MATE EN CARRERA (lote B): MIENTRAS DURA LA ANIMACIÓN, EL INPUT ESTÁ
     * BLOQUEADO.
     *
     * El bloque va ANTES de la rama del juego y deja `playing && !dunk.activo`
     * en la condición de abajo, de modo que durante la animación no corre ni el
     * movimiento, ni la carga del tiro, ni el regate: el jugador ve la carrera
     * al aro y el golpe, y no puede hacer nada hasta que el cuerpo toca el suelo.
     * La posición la manda la animación (nada de física: es un gesto coreografiado
     * de 0,68 s, no una simulación) y las piernas siguen moviéndose durante el
     * vuelo, que es lo que hace que se lea como una carrera hacia el aro y no
     * como un deslizamiento.
     */
    if (dunk.activo) {
      const paso = stepDunk(dunk, dt);
      pos.x = dunkX(dunk);
      pos.z = dunkZ(dunk);
      rotY = lerpAngle(rotY, Math.atan2(rimX(dunk.side) - pos.x, -pos.z), 1 - Math.exp(-18 * dt));
      speedTarget = paso.golpe ? 0.25 : 1;
      if (paso.golpe) machacar();
    }
    if (playing && !dunk.activo) {
      /*
       * CON QUÉ BALÓN SE PUEDE TIRAR (concurso).
       *
       * Durante el concurso sólo se tira con un balón EN JUEGO, que es el que da
       * el reboteador: con un balón en las manos que el concurso no reconoce (el
       * último de un carro ya vacío, o el rebote que el jugador traía de antes) el
       * tiro no sale. Con eso, el tiro y la cuenta del carro no se pueden
       * desincronizar: cuando se lanza, siempre hay un balón del carro detrás.
       */
      const wants = input.shootHeld && ball.state === 'held' && puedeTirar(concurso);
      if (wants && !charging) {
        charging = true;
        chargeT = 0;
      }
      if (charging) {
        chargeT += dt;
        const side = nearestSide();
        rotY = lerpAngle(rotY, Math.atan2(rimX(side) - pos.x, -pos.z), 1 - Math.exp(-14 * dt));
        // La zona verde del medidor se recalcula en cada fotograma según la
        // distancia al aro: el jugador VE que se estrecha al alejarse.
        const distAro = Math.hypot(pos.x - rimX(side), pos.z);
        // La barra se llena en CHARGE_FULL segundos, el mismo umbral con el que
        // la pose de tiro llega al tope: cuando la barra llega al final, la
        // postura está cargada y toca soltar.
        // La zona verde también recorre el medidor: se pinta donde está ahora y el
        // juicio del tiro se hace contra ese mismo punto.
        const sweetC = sweetCenterAt(chargeT);
        hud.showMeter(meterAt(chargeT), sweetSpotAt(difficultyAt(distAro)), Math.min(chargeT / CHARGE_FULL, 1), sweetC);
        if (!input.shootHeld) {
          /*
           * GESTO SEGÚN LA DISTANCIA (T4).
           *
           * `distAro` ya está calculado arriba para la dificultad del medidor, y
           * aquí es un fotograma antes de soltar: es el único sitio en el que la
           * distancia al aro y el momento del tiro coinciden. El gesto NO toca la
           * física (la parábola sigue saliendo de `solveShot`).
           */
          gestoTiro = distAro <= DUNK_RANGE ? 'dunk' : distAro >= LONG_RANGE ? 'lejano' : 'tiro';
          /*
           * MATE EN CARRERA (lote B).
           *
           * Dos condiciones y ningún `else` de más: cerca del aro Y llegando
           * corriendo (`DUNK_RUN_MIN`). Quieto, o incluso caminando, esto NO se
           * activa y el tiro de cerca se resuelve como siempre —que es lo que el
           * propietario dijo que estaba bien—.
           *
           * Aquí no se llama a `shoot()`: no hay trayectoria que solvear, porque
           * el balón no se lanza. Sale de la mano en el aro, en `machacar()`.
           */
          if (gestoTiro === 'dunk' && puedeMate(distAro, ritmoBruto, DUNK_RANGE, DUNK_RUN_MIN)) {
            contarIntento();
            startDunk(dunk, pos.x, pos.z, nearestSide());
            sfx.release();
          } else {
            shoot(meterAt(chargeT));
          }
          charging = false;
          hud.showMeter(null);
        }
      } else {
        const mv = input.move();
        const len = Math.hypot(mv.x, mv.z);
        /*
         * El ritmo se actualiza AQUÍ, donde está la entrada, y se queda quieto
         * mientras el tiro se carga (este bloque no corre con la carga en
         * marcha). Así, al soltar, el valor que lee el mate es la velocidad a la
         * que el jugador venía al pulsar espacio, no la que tendría al soltar.
         */
        ritmoBruto = len > 0.05 ? Math.min(1, len) : 0;
        if (len > 0.05) {
          const k = Math.min(1, len);
          const dx = mv.x / len;
          const dz = mv.z / len;
          pos.x = clamp(pos.x + dx * PLAYER.speed * k * dt, PLAYER.bounds.minX, PLAYER.bounds.maxX);
          pos.z = clamp(pos.z + dz * PLAYER.speed * k * dt, PLAYER.bounds.minZ, PLAYER.bounds.maxZ);
          /*
           * COLISIONES (fase D).
           *
           * Se resuelve DESPUÉS de mover y de acotar: el jugador avanza, el
           * rectángulo de juego lo sujeta y los volúmenes lo empujan fuera con
           * deslizamiento. Va aquí y no antes porque mover primero y luego
           * corregir es lo que hace que se pueda caminar pegado a la valla en
           * diagonal sin trabarse.
           */
          resolveCircle(pos, PLAYER_RADIUS, solids);
          rotY = lerpAngle(rotY, Math.atan2(dx, dz), 1 - Math.exp(-14 * dt));
          speedTarget = k;
          advTargetX = dx * k;
          advTargetZ = dz * k;

          // ¿Ha girado? Almacenando el ángulo en el momento del cambio, y no en
          // cada fotograma, se evita el parpadeo: hace falta acumular otros 40°
          // para volver a cambiar, así que correr en arco no encadena cambios.
          const dirAngle = Math.atan2(dx, dz);
          const giroReal = wrapPi(dirAngle - lastDirAngle);
          const giroRuta = Math.abs(giroReal);
          if (giroRuta > HAND_SWITCH_ANGLE) {
            handSide = handSide === 1 ? -1 : 1;
            lastDirAngle = dirAngle;
            // El lado del corte sale del SIGNO del giro de la ruta, que es la
            // única de las dos medidas que dice hacia dónde se ha girado: la
            // mano es un interruptor que alterna y no tiene lado.
            if (giroReal !== 0) corteDir = giroReal > 0 ? 1 : -1;
            // La cabeza mira a la mano nueva antes de que llegue el balón (que
            // cambia de lado en el mismo instante): un giro de 0,32 rad que se
            // apaga solo en un tercio de segundo. Sin esto el cambio de mano era
            // un teletransporte del balón de un lado al otro.
            giro = handSide;
          }
        }
      }
    } else if (charging) {
      charging = false;
      hud.showMeter(null);
    }
    player.root.rotation.y = rotY;

    // Animación del jugador.
    //
    // `speed01` se suaviza hacia la entrada cruda en vez de tomarla tal cual.
    // Antes el valor saltaba de 0 a 1 en un fotograma, lo que, al coincidir con que
    // las amplitudes de braceo y zancada están multiplicadas por él se notaba
    // como un tirón; y con la inclinación del torso añadida el salto se
    // notaría todavía más.
    speed01 += (speedTarget - speed01) * (1 - Math.exp(-12 * dt));

    /*
     * Adelanto de cámara: se suaviza la dirección de marcha con su propia
     * constante (más lenta que la del movimiento) para que un cambio de sentido
     * no dé un latigazo al encuadre.
     */
    const kAdv = 1 - Math.exp(-5 * dt);
    advX += (advTargetX - advX) * kAdv;
    advZ += (advTargetZ - advZ) * kAdv;

    // Salto. `grounded` sale de aquí porque la animación recoge las piernas al
    // estar en el aire, y antes nunca se pasaba: siempre `true`, así que la
    // pose de vuelo era código muerto.
    //
    // ATERRIZAJE (fase B): flexión de rodillas brevisima al tocar suelo. El
    // salto del tiro bajaba y se plantaba de golpe, como un ascensor; con el
    // aviso de aterrizaje el cuerpo se hunde 12 cm mientras flexiona y vuelve
    // en un cuarto de segundo.
    //
    // Y la fuerza de la caída es la VELOCIDAD DE BAJADA, no un 1 fijo: `stepJump`
    // deja `vel` a 0 al tocar, así que hay que leerla ANTES de integrar. Con la
    // integración exacta, caer desde el pico del tiro da 3,4 m/s (el impulso
    // entero) y `land` vale 1; un roce de 1 m/s flexionaría una cuarta parte, y
    // por eso el `clamp` no se queda en 0 ni en 1.
    const velAntes = jump.vel;
    /*
     * Durante el mate la altura la manda la ANIMACIÓN, no la gravedad: si se
     * dejara a `stepJump`, el salto del tiro pelearía con la parábola del mate y
     * el cuerpo llegaría al aro a media altura. Se escribe en el MISMO sitio
     * (`jump.y`) para que todo lo de abajo —el aterrizaje, la pose de vuelo,
     * `grounded`— siga leyendo de una sola fuente.
     */
    let grounded: boolean;
    if (dunk.activo) {
      jump.y = dunkY(dunk);
      jump.vel = 0;
      grounded = jump.y <= 0.001;
    } else {
      grounded = stepJump(jump, dt);
    }
    pos.y = jump.y;
    if (grounded && !wasGrounded) land = clamp(-velAntes / SHOOT_JUMP, 0.25, 1.3);
    wasGrounded = grounded;
    // El decaimiento va DESPUÉS de `animateHuman`, más abajo: si no, el primer
    // fotograma de la recepción ya entraba con el pico mermado (0,925 en vez de
    // 1) y el valor de referencia que anuncian los comentarios no era real.
    // Los estados de un disparo se apagan solos: ninguno necesita reloj.
    if (giro !== 0) giro -= giro * Math.min(1, dt * 3.4);
    if (frustracion > 0) frustracion = Math.max(0, frustracion - dt * 1.1);
    if (flick > 0) flick = Math.max(0, flick - dt);
    if (celebrate > 0) celebrate = Math.max(0, celebrate - dt);
    // La ventana de recogida avanza siempre; fuera de ella vale `RECOGE_TIME`.
    if (recogeT < RECOGE_TIME) recogeT = Math.min(RECOGE_TIME, recogeT + dt);

    /*
     * PESOS DE CAPA (ver el bloque donde se declaran).
     *
     * El peso del tiro sube mientras se carga (la barra marca el mismo avance)
     * y con el seguimiento del brazo, y baja cuando los dos se acaban. Al soltar
     * la carga el objetivo pasa a 1 (los brazos arriba del seguimiento) y al
     * terminar el seguimiento a 0: en los dos casos es `mezclaPeso` quien lleva
     * el peso, así que ninguno de los dos saltos de rama de antes existe.
     */
    const objetivoTiro = charging ? Math.min(chargeT / CHARGE_FULL, 1) : flick / FLICK_TIME;
    tiroW = mezclaPeso(tiroW, objetivoTiro, dt);
    // Peso del mate en carrera. Se MEZCLA como las demás capas: nunca asigna.
    dunkW = mezclaPeso(dunkW, dunk.activo ? dunkPose(dunk) : 0, dt);
    celeW = mezclaPeso(celeW, celebrate > 0 ? celebrate / CELEBRATION_TIME : 0, dt);
    /*
     * Peso de "balón en las manos": dentro de la ventana de recogida manda su
     * curva (la misma que sube el balón) y fuera, el estado del balón.
     */
    holdW =
      recogeT < RECOGE_TIME
        ? holdPeso(recogeT)
        : mezclaPeso(holdW, ball.state === 'held' ? 1 : 0, dt, HOLD_TASA);

    animateHuman(
      player,
      animTime,
      speed01,
      ball.state === 'held',
      grounded,
      land,
      {
        handSide, regate: regate01(speed01), giro, frustracion, hold: holdW, recoge: recogePeso(recogeT),
        // El corte usa la MISMA señal que el giro de cabeza (el cambio de mano):
        // un evento, dos lecturas — la cabeza mira y el cuerpo se inclina.
        corte: Math.abs(giro), corteDir,
      },
    );
    // Las capas de pose se MEZCLAN encima: nunca pisan los huesos.
    if (tiroW > 0.002) {
      if (gestoTiro === 'dunk') poseDunk(player, tiroW);
      else if (gestoTiro === 'lejano') poseLejano(player, tiroW);
      else poseShoot(player, tiroW);
    }
    /*
     * La capa del mate en carrera va DESPUÉS del gesto del tiro: mientras dura,
     * los brazos van arriba por el mate y no por el tiro, y como las dos son
     * capas que mezclan, la última en hablar es la que manda.
     */
    if (dunkW > 0.002) poseDunk(player, dunkW);
    if (celeW > 0.002) poseCelebrate(player, animTime, celeW);
    // El decaimiento del aterrizaje, aquí y no antes: la flexión de este
    // fotograma usa el pico entero, y sólo a partir del siguiente baja.
    if (land > 0) land = Math.max(0, land - dt * 4.5);

    // Balón (el bote va sincronizado con la zancada: mismo reloj).
    if (ball.state === 'held') {
      if (dunk.activo) colgarBalonDeLaMano();
      else placeHeldBall(animTime, speed01);
    } else if (concurso.activo) {
      ball.step(dt);
      spinBall(dt);
      /*
       * EL REBOTEADOR DEL CONCURSO.
       *
       * En el concurso el balón NO se va a buscar: vuelve. Un tiro resuelto (que
       * ha entrado y ya ha caído, o que se ha quedado quieto) se le pone en las
       * manos al tirador con la misma transición de 0,3 s que usa una recogida
       * normal, así que se ve venir el balón en vez de aparecer.
       *
       * Y el juicio del tiro es el de siempre: si no entró, es un fallo también
       * para la racha del Takeover y para la asistencia del tiro, no sólo para el
       * marcador del concurso. Con la lógica de recogida normal esto no pasaría,
       * porque durante el concurso el balón nunca toca el suelo de la pista a
       * manos del jugador.
       */
      /*
       * CUÁNDO ESTÁ RESUELTO EL TIRO, que en un concurso cronometrado importa
       * tanto como acertar: en cuanto se sabe qué ha pasado, vuelve el balón.
       *
       *  · Si entró: cuando ya ha caído por debajo del aro (`y < 1,2 m`).
       *    Esperar a que se pare en el suelo costaría dos segundos de reloj por
       *    canasta, y con 15 balones eso es medio concurso.
       *  · Si no entró: al TOCAR EL SUELO por primera vez (el balón está a la
       *    altura de su radio y ya no sube). Eso resuelve un fallo en menos de un
       *    segundo; con la regla de `settled` (edad > 8 s) un tiro largo que se va
       *    fuera de la pista se comía CINCO segundos de reloj, medido en vivo.
       *  · `settled` sigue ahí como red de seguridad para el balón que se queda
       *    rodando sin llegar a pararse del todo.
       */
      const enElSuelo = ball.pos.y <= BALL.radius + 0.04 && ball.vel.y <= 0.01;
      if (ball.scored ? ball.pos.y < 1.2 : enElSuelo || ball.settled) {
        if (ball.scored) celebrate = CELEBRATION_TIME;
        else fallarTiro();
        darBalonAlJugador();
        /*
         * EL BALÓN QUE VUELVE ES UN BALÓN DEL CARRO, Y SE MARCA COMO TAL.
         *
         * El reboteador devuelve el balón a las manos, pero `resolverTiro` acaba
         * de dejar `esperando` en false. Sin volver a marcarlo, el jugador se
         * quedaba con un balón del carro que el juego no reconocía como en juego,
         * y el siguiente lanzamiento disparaba OTRA recogida en el mismo
         * fotograma —`puedeCoger` sólo mira `esperando`—: el balón salía y volvía
         * a la mano, así que parecía que el tiro no había salido y había que
         * tirar dos veces para que contara. Se veía sobre todo al estrenar carro,
         * porque el balón que llega ahí viene del último tiro del anterior.
         *
         * Sólo se marca SI AL CARRO LE QUEDAN BALONES: con el carro vacío el que
         * vuelve ya no es de nadie, y su tiro no cuenta como intento (lo impide
         * la condición de disparo, que durante el concurso exige `esperando`).
         */
        if (concurso.activo && concurso.balones > 0) tomarBalon(concurso);
        hud.setPrompt(null);
      }
    } else {
      ball.step(dt);
      spinBall(dt);
      // RECOGIDA: si el jugador pasa por encima del balón, vuelve a las manos.
      // Antes sólo se recuperaba cuando el balón se detenía por completo, así
      // que un balón rodando por la pista se quedaba muerto hasta que paraba.
      const cerca = Math.hypot(pos.x - ball.pos.x, pos.z - ball.pos.z);
      if (cerca < 0.62 && ball.pos.y < 1.5) {
        ball.state = 'held';
        /*
         * RECOGIDA COMO TRANSICIÓN, no como teletransporte.
         *
         * `recogeDesde` guarda la posición REAL del balón —con la altura que
         * tenía, esté rodando por el suelo o viniendo del rebote— y `recogeT`
         * abre la ventana de 0,3 s: de ahí en adelante el balón sube
         * interpolando hasta la posición de manos y el gesto de agacharse va
         * con él, los dos con el mismo peso. Antes el balón saltaba a la
         * posición final en este mismo fotograma, y encima los brazos se
         * quedaban clavados 0,35 s en la pose de tiro del `flick`.
         */
        // Si el balón se recoge sin haber entrado, es un fallo como el de
        // `settled`: el tiro ya está resuelto (el aro lo habría marcado).
        if (!ball.scored) fallarTiro();
        ball.state = 'held';
        recogeDesde.copy(ball.pos);
        recogeT = 0;
        hud.setPrompt(null);
      } else if (ball.settled) {
        if (ball.scored) celebrate = CELEBRATION_TIME;
        else fallarTiro();
        ball.state = 'held';
        // Misma transición que al pasar por encima: el balón estaba parado en el
        // suelo y sube hasta las manos sin dar un salto.
        recogeDesde.copy(ball.pos);
        recogeT = 0;
      }
    }

    /*
     * ESTELA DEL TAKEOVER (T3).
     *
     * La llama sigue al balón y se apaga sola: `setIntensity` sólo dice si el
     * modo está encendido, y `FireTrail.update` envejece los puntos ya escritos,
     * así que al fallar la cola se consume en medio segundo en vez de
     * desaparecer de golpe.
     *
     * Con `prefers-reduced-motion` no se enciende: es movimiento que no aporta
     * información de juego, y la regla de la casa es congelar lo decorativo sin
     * dejar de jugar. La racha se sigue contando y el HUD lo enseña igual.
     */
    fireVel = firePrev.distanceTo(ball.pos) / Math.max(dt, 1e-4);
    firePrev.copy(ball.pos);
    fireTrail.setIntensity(takeover && !reduced ? 1 : 0);
    fireTrail.update(dt, ball.pos, fireVel);

    /*
     * CONCURSO DE TRIPLES (lote B): el reboteador, el recorrido y el reloj.
     *
     * El orden de las tres cosas importa: primero el balón (si toca dártelo),
     * después el carro (si el actual se ha vaciado, hay que andar al siguiente) y
     * por último el reloj, que es el único que puede terminar la partida. Con el
     * reloj delante, el fotograma que agota el tiempo podría dar un balón que ya
     * no sirve para nada.
     *
     * El reloj también se PARA cuando se abre una sección: el concurso es
     * cronometrado y quedarse leyendo un panel mientras corre el tiempo no es
     * tensión, es una pérdida.
     */
    if (concurso.activo) {
      /*
       * LA BOCINA (ajuste del propietario): «deja que un tiro lanzado antes de que
       * se agote el reloj se resuelva y cuente, como en el concurso real».
       *
       * `avanzarReloj` deja el reloj a 0 y `fin: 'tiempo'`, pero el concurso NO se
       * cierra ahí: sigue `activo` mientras el balón esté VOLANDO, que es lo único
       * que puede pasar ya —`puedeTirar` exige `fin !== 'tiempo'`, y con la bocina
       * ni se coge balón ni se cambia de carro—, y es lo que hace que la canasta
       * siga contando en el marcador del concurso, porque `onScore` y `fallarTiro`
       * resuelven SÓLO si el concurso está activo.
       *
       * El cierre lo hace esta comprobación en el fotograma en que el balón deja de
       * volar (el bloque de arriba acaba de devolvértelo a las manos, y el tiro ya
       * está resuelto y sumado). Se mira `ball.state` y NO `esperando` a propósito:
       * un balón en las MANOS con el tiempo agotado —el que el jugador no llegó a
       * soltar— no vale nada y no puede dejar el concurso abierto para siempre.
       *
       * Y va ANTES del bloque de juego, no después: si el último carro se quedó
       * vacío, `terminarConcurso('carros')` de abajo cerraría la partida como si se
       * hubieran acabado los balones cuando lo que ha sonado es la bocina.
       */
      const bocina = enBocina(concurso);
      if (bocina && ball.state !== 'flying') terminarConcurso('tiempo');
      if (playing && concurso.activo) {
        if (puedeCoger(concurso, pos.x, pos.z)) cogerBalonDelPuesto();
        if (carroVacio(concurso) && !concurso.esperando) {
          /*
           * `avanzarCarro` devuelve `true` SÓLO en el fotograma en que el jugador
           * está en el carro siguiente, así que ése es el momento exacto de
           * cantarlo: el mismo `true` que antes se tiraba a la basura es el que
           * evita que el comentarista repita la frase en cada fotograma mientras
           * se corre hacia el carro.
           */
          if (quedanCarros(concurso)) {
            if (avanzarCarro(concurso, pos.x, pos.z)) decir({ tipo: 'carro', carro: concurso.carro + 1, total: TRIPLES.length });
          } else terminarConcurso('carros');
        }
        // El reloj llega a 0 y aquí no se cierra nada: si hay un balón en el aire,
        // lo cierra la comprobación de la bocina cuando deja de volar. El `true`
        // es el fotograma exacto en que se agota, y es lo que se canta una vez.
        if (concurso.activo && avanzarReloj(concurso, dt)) decir({ tipo: 'bocina' });
      }
      hud.setContest(infoConcurso());
      /*
       * Los balones del carro, en el mundo (ver `sincronizarBalones`).
       *
       * LA GUARDA DE `activo` NO ES DECORATIVA y se descubrió jugando: en el
       * fotograma en que se agota el reloj, `terminarConcurso()` acaba de vaciar
       * las bandejas y este bloque, que va detrás, volvía a llenarlas con el
       * estado del concurso ya terminado. El grupo estaba oculto, así que no se
       * veía nada raro en pantalla, pero el mundo se quedaba diciendo que había 12
       * balones a la vista que no existían. Medido en vivo: los balones de los
       * puestos daban `[1,3,3,3,3]` con el concurso cerrado y los carros ocultos.
       */
      if (concurso.activo) sincronizarBalones();
    }

    /*
     * APARICIÓN DEL RECORRIDO (lote B, ajuste posterior).
     *
     * Los cinco puestos crecen del parqué en `PUESTOS_APARICION` en vez de
     * aparecer de golpe: un carro que sale de la nada se lee como un fallo de
     * carga, y uno que crece se lee como que lo acaban de poner. Se escala SÓLO
     * en Y (`x` y `z` a 1) porque la base del carro está en el suelo: crece hacia
     * arriba, no se hincha.
     *
     * El ease-out (al cuadrado invertido) entra rápido y frena al final, que es lo
     * que hace que el golpe de aparición se lea en el primer tercio. Con
     * `prefers-reduced-motion` se salta de golpe al final: la animación no hace
     * falta para jugar.
     */
    if (concurso.activo && puestosT < 1) {
      puestosT = Math.min(1, puestosT + (reduced ? 1 : dt / PUESTOS_APARICION));
      const k = 1 - (1 - puestosT) * (1 - puestosT);
      for (const c of carros) c.group.scale.y = Math.max(0.02, k);
    }

    // Sombras de contacto: siguen al jugador y al balón, y se aclaran con la
    // altura (el salto del tiro y el balón en el aire).
    const pK = Math.min(1, Math.max(0, pos.y) / 0.6);
    playerBlob.position.set(pos.x, 0.022, pos.z);
    playerBlob.scale.setScalar(1 - pK * 0.28);
    (playerBlob.material as THREE.MeshBasicMaterial).opacity = 0.9 - pK * 0.4;
    const bK = Math.min(1, Math.max(0, ball.pos.y - 0.12) / 3.4);
    ballBlob.position.set(ball.pos.x, 0.022, ball.pos.z);
    ballBlob.scale.setScalar(1 + bK * 1.5);
    (ballBlob.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - bK * 0.8);

    // Público: el balanceo del graderío. Sin matrices en CPU, sólo el reloj.
    if (crowdTime) crowdTime.value = time;

    // Zonas, avisos e interacción
    /*
     * Durante el mate no se abre nada: ni el aviso de interacción ni la sección.
     * `playing` sigue siendo cierto (el bucle corre y la cámara trabaja), pero el
     * input no manda. La tecla se sigue drenando para que no se quede encolada y
     * dispare sola en cuanto termine la animación.
     */
    const jugando = playing && !dunk.activo;
    /*
     * EL CARRITO DE LA ESQUINA: con E se convoca (o se deja) el concurso.
     *
     * La INTERACCIÓN va ANTES del bloque de zonas, y no es un detalle de orden:
     * ese bloque termina siempre con un `consumeInteract()` que vacía la tecla, así
     * que un E pulsado en el carrito se lo comía él y no llegaba nunca aquí. El
     * AVISO, en cambio, se pinta después (más abajo), porque el de la zona se
     * escribe antes y pisaría al del carrito.
     */
    const enElCarrito = jugando && Math.hypot(pos.x - CARRITO.x, pos.z - CARRITO.z) <= 1.8;
    if (enElCarrito && input.consumeInteract()) {
      if (concurso.activo) abandonarConcurso();
      else convocarConcurso();
    }
    let active: Zone | null = null;
    let best = Infinity;
    for (const z of ZONES) {
      const d = Math.hypot(pos.x - z.x, pos.z - z.z);
      const usable = z.kind !== 'shoot' || unlocked.has(z.id);
      if (jugando && usable && d <= z.radius && d < best) {
        best = d;
        active = z;
      }
    }
    if (jugando && active) {
      hud.setPrompt(`${coarse ? t('hint_interact_touch') : t('hint_interact')} · ${t(sectionKey(active.id))}`);
      if (input.consumeInteract()) openSection(active.id, true);
    } else {
      input.consumeInteract();
      const side = nearestSide();
      const shootZone = zoneFor(side);
      const near = Math.abs(pos.x - rimX(side)) <= SHOOT_RANGE && !!shootZone && !unlocked.has(shootZone.id);
      hud.setPrompt(jugando && near && ball.state === 'held' && !charging ? (coarse ? t('hint_shoot_touch') : t('hint_shoot')) : null);
    }

    // El aviso del carrito manda sobre el de la zona, que se acaba de pintar.
    if (enElCarrito) hud.setPrompt(concurso.activo ? t('contest_quit') : t('contest_start'));

    // Redes del aro: la onda baja mientras haya algo que contar.
    NET.time.value = time;
    if (netAmp > 0) {
      netAmp = Math.max(0, netAmp - dt * netDecay);
      NET.amp.value = netAmp;
    }
    // Público: la ola de celebración sale del centro y recorre la grada.
    const crowdFx = courtGroup.userData.crowdFx as { wave: { value: number }; jump: { value: number } } | undefined;
    if (crowdFx) {
      if (crowdFx.jump.value > 0) {
        crowdFx.jump.value = Math.max(0, crowdFx.jump.value - dt * 0.75);
        crowdFx.wave.value += dt * 22;
      }
    }

    // Decorado vivo
    for (const r of rings) r.scale.setScalar(1 + Math.sin(time * 3) * 0.04);
    /*
     * Plató (punto C). `animateTvReporter` / `animateTvOperator` llaman a
     * `animateHuman` y le añaden por encima peso, hombros, respiración y
     * gestos; con `time` (el reloj decorativo) se congelan solas con
     * `prefers-reduced-motion`.
     *
     * `habla` sólo vale 1 en directo: fuera del directo el reportero está de
     * pie esperando y no adormece.
     */
    animateTvReporter(set.reporter, time, mode === 'interview' ? 1 : 0);
    animateTvOperator(set.operator, time);
    // El brazo del micro se pone AL FINAL y a pelo: cuelga de `armR` y es lo
    // único que no se anima. El reportero gesticula con la otra mano por eso.
    set.reporter.armR.rotation.x = mode === 'interview' ? -1.45 : -1.15;
    set.tally.visible = mode === 'interview' || Math.floor(time * 1.5) % 2 === 0;
    // Retransmisión: REC, canal y contador mientras el plató está en directo.
    hud.setBroadcast(mode === 'interview', animTime);
    /*
     * CUADRO DE CONVERSACIÓN: la máquina de escribir.
     *
     * Es lo único que este bucle hace para la interfaz, y va con `animTime` —el
     * reloj REAL— y no con `time`, el decorativo. No es un descuido: del cuadro no
     * cuelgan sólo las letras, sino también las PAUSAS entre intervenciones, y con
     * el reloj congelado a 0 (movimiento reducido) la conversación se quedaba
     * clavada en la primera frase porque su pausa no pasaba nunca. El reloj entra
     * en MILISEGUNDOS, que son las unidades de `CPS` y de las dos pausas del
     * cuadro; quien decide si la frase se escribe letra a letra o de golpe es
     * `reduced`, que va como segundo argumento.
     *
     * El `if` no es una optimización: es la garantía de que no se toca el DOM en
     * ningún fotograma fuera de la entrevista. Cuando el cuadro está cerrado,
     * `tick` no hace nada; cuando está abierto, una escritura de `textContent` y
     * nada más. Ni geometría, ni materiales, ni sombras, ni medidas.
     */
    if (mode === 'interview') dialogue.tick(animTime * 1000, reduced);
    (set.onAir.material as THREE.MeshStandardMaterial).emissiveIntensity = mode === 'interview' ? 1.6 : 0.2;

    updateCamera(dt);

    /*
     * ETIQUETAS DE RUMBO.
     *
     * Antes sólo se veían los rótulos que caían dentro del encuadre: en
     * cuanto una sección quedaba detrás de la cámara o fuera de pantalla, su
     * rótulo desaparecía (el `proj.z < 1` de antes) y el jugador se quedaba
     * sin ninguna pista de hacia dónde había que andar. Con cuatro secciones
     * repartidas por la pista, casi siempre había tres desaparecidas.
     *
     * Ahora cada sección lleva su rótulo SIEMPRE en pantalla:
     *  · si está a la vista, el rótulo flota sobre su cartel, como antes;
     *  · si no, se ancla al borde más cercano con una flecha que apunta en la
     *    dirección en la que hay que girar, y la distancia en metros.
     */
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.getWorldDirection(camDir);
    // Proyección de la vista sobre el suelo: sirve para medir el ángulo de
    // rumbo. Si la cámara mirase exactamente al cielo o al suelo no habría
    // dirección definida, así que se cae al eje de juego.
    camFlat.set(camDir.x, 0, camDir.z);
    if (camFlat.lengthSq() < 1e-8) camFlat.set(0, 0, -1);
    camFlat.normalize();

    for (const z of ZONES) {
      const labelY = z.kind === 'shoot' ? 4.6 : 2.5;

      // Ángulo de rumbo en el plano del suelo respecto a la vista:
      // 0 = recto, +π/2 = a la derecha, ±π = a la espalda.
      toZone.set(z.x - pos.x, 0, z.z - pos.z);
      const dist = toZone.length();
      const flatLen = Math.hypot(toZone.x, toZone.z) || 1;
      const fx = toZone.x / flatLen;
      const fz = toZone.z / flatLen;
      const angle = Math.atan2(camFlat.x * fz - camFlat.z * fx, camFlat.x * fx + camFlat.z * fz);

      proj.set(z.x, labelY, z.z).project(camera);
      let nx = proj.x;
      let ny = proj.y;

      // `project()` NO distingue "detrás de la cámara" de "dentro del encuadre":
      // un punto a la espalda también devuelve coordenadas, sólo que espejadas
      // respecto a la dirección real. Negarlas devuelve la dirección hacia la
      // que hay que girar, que es justo lo que hace falta para la flecha.
      camTo.set(z.x - camera.position.x, labelY - camera.position.y, z.z - camera.position.z);
      const front = camTo.dot(camDir) > 0;
      if (!front) {
        nx = -nx;
        ny = -ny;
      }

      const onScreen = front && Math.abs(nx) <= 1 && Math.abs(ny) <= 1;

      /*
       * La posición se PIDE en píxeles y sin recortar. Fuera de pantalla el
       * punto es el que toca el borde, pero recortarlo aquí con un margen fijo
       * en NDC cortaba los rótulos largos: el margen no sabía cuánto medía cada
       * uno. El recorte por caja real y la separación entre rótulos los hace el
       * HUD, que es quien puede medirlos.
       */
      hud.placeLabel(z.id, (nx * 0.5 + 0.5) * w, (-ny * 0.5 + 0.5) * h, onScreen, angle, dist);
      hud.setLabelLocked(z.id, z.kind === 'shoot' && !unlocked.has(z.id));
      if (mode === 'interview') hud.hideLabel(z.id, true);
    }
    hud.layoutLabels(w, h);
  }

  /** Re-hornea el mapa de sombras (estático). Cuesta un fotograma con el pase completo. */
  function bakeShadows(): void {
    renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera);
  }

  function frame(): void {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 1 / 20);
    /*
     * `time` es SÓLO el reloj de las animaciones (braceo, bote del balón,
     * pulso de los anillos, parpadeo del ON AIR, balanceo del público): el
     * movimiento del juego va por `dt`. Por eso, con `prefers-reduced-motion`
     * basta con congelar este argumento para que todo lo decorativo se pare de
     * golpe, sin tocar ni una animación de una en una — y sin dejar el juego
     * injugable, que es lo que pasaría si se parara el propio bucle.
     */
    update(dt, reduced ? 0 : clock.elapsedTime, clock.elapsedTime);

    /*
     * MEDIR EL COSTE DE VERDAD: DRENAR LA COLA ANTES DE ARRANCAR EL RELOJ.
     *
     * El `readPixels` de 1 píxel es lo que hace válida la medida (fuerza el
     * vaciado de la cola, así que mide rasterizado y no envío de comandos), pero
     * vacía TODO lo pendiente, no sólo este fotograma. Con el reloj puesto antes
     * de `render()`, eso metía en el intervalo los fotogramas del arranque —las
     * siete vistas de la precompilación, la subida de texturas y el horneado de
     * sombras—: el 204,3 ms que veía el usuario, repetido 120 fotogramas
     * seguidos porque la medida además ponía el reloj a cero.
     *
     * Ahora el drenaje va ANTES de arrancar el reloj y NO se cronometra: el
     * `readPixels` final mide sólo el fotograma que se acaba de dibujar. Si sale
     * alto, es de verdad la GPU (o el sistema), no la carga.
     *
     * No se ha comprado nada con esto: es el mismo vaciado, sólo que en el
     * fotograma anterior. Lo que cambia es de dónde se mide.
     *
     * Se mide SÓLO cuando el intervalo ya no cabe (o cuando toca repetir por un
     * cambio de escala): el drenaje acorta ese fotograma, así que no se paga
     * cuando todo va bien ni se paga en cada comprobación.
     */
    desdeCoste++;
    // `medianaMs` y no `hist.length`: la ventana se recorta a 20 dentro de
    // `calidad`, así que comprobar el tamaño aquí dejaría la medida de coste sin
    // disparar nunca (era el fallo de la primera versión).
    const medir = forzarMedida || (medianaMs > 19 && (desdeCoste >= 120 || costeRender < 0));
    if (medir) gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    const t0 = medir ? performance.now() : 0;
    renderer.render(scene, camera);
    if (medir) {
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      const ms = performance.now() - t0;
      const escala = pixelRatio;
      costeRender = ms;
      escalaMedida = escala;
      desdeCoste = 0;
      forzarMedida = false;
      // Se dice SIEMPRE, alto o bajo: "cabe" también es un dato, y sin él no se
      // puede distinguir una GPU lenta de un arranque ruidoso al leer el log.
      console.info(
        `[coste] ${ms.toFixed(1)} ms con la cola drenada antes del reloj, a escala ${escala} · ` +
          (ms > 15
            ? 'supera el presupuesto de fotograma: la culpa es de la GPU'
            : 'cabe en el presupuesto de fotograma; si el fotograma no llega, el que falla es el sistema'),
      );
    }
    // `calidad` puede pedir una escala nueva; `forzarMedida` obliga entonces a
    // que el siguiente fotograma se mida con la escala NUEVA y no con la que
    // acababa de dejar atrás.
    if (calidad(dt * 1000, costeRender)) resize();

    /*
     * HEARTBEAT. Una línea compacta cada `LATIDO_MS` para poder ver la sesión
     * entera de un vistazo sin abrir nada.
     *
     * `draws` y `triángulos` salen de `renderer.info`, que se reinicia en cada
     * `render()`: son los del ÚLTIMO fotograma dibujado, con su pase de color.
     * El pase de sombras no sale por aquí (con `autoUpdate = false` sólo cuenta
     * cuando se hornea, y entonces es el único que se ha dibujado). Para el
     * recuento con el pase de sombras incluido está `__court.draws()`, que
     * cuenta a nivel de WebGL.
     *
     * `n` es el número de intervalos de la ventana: sin él, un p95 de 16,67 no
     * se distingue de "sale justo en vsync" y un 33,34 de "va a 30 fps".
     */
    if (verPerf) {
      const ahora = performance.now();
      if (ahora - ultimoLatido >= LATIDO_MS) {
        ultimoLatido = ahora;
        const info = renderer.info.render;
        const programas = renderer.info.programs?.length ?? 0;
        // Ventana llena de verdad: hace falta mediana YA calculada y suficiente
        // número de intervalos detrás. Si no, no sale ninguna cifra de tiempo.
        if (medianaMs > 0 && hist.length >= PERF_MIN_MUESTRAS) {
          console.info(
            `[perf] mediana ${medianaMs.toFixed(2)} ms · p95 ${percentilOrdenado(hist, 0.95).toFixed(2)} ms · ` +
              `n=${hist.length} fotogramas · escala ${pixelRatio} · programas ${programas} · ` +
              `draws ${info.calls} (sin pase de sombras) · triángulos ${info.triangles}`,
          );
        } else {
          /*
           * LÍNEA DE "AÚN NO HAY NÚMEROS", y sin cifras de tiempos a propósito.
           *
           * Dice cuántas muestras lleva, que es lo que hay que saber para leer
           * bien el resto: mientras no llegue al mínimo, el p95 y la mediana que
           * se podrían imprimir aquí NO serían la sesión, serían el hueco.
           */
          console.info(
            `[perf] midiendo… aún sin mediana ni p95: ${hist.length}/${PERF_MIN_MUESTRAS} intervalos ` +
              `(mediana en ${medianaMs.toFixed(1)} ms: sin calcular) · escala ${pixelRatio} · ` +
              `programas ${programas} · draws ${info.calls} (sin pase de sombras) · triángulos ${info.triangles}`,
          );
        }
      }
    }
  }

  const onVisibility = (): void => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      // Se suelta el guarda para que al volver a la pestaña se pueda volver a
      // pedir el bucle: si no, `pedirBucle()` lo tomaría por un bucle vivo.
      bucleActivo = false;
    } else {
      clock.getDelta();
      pedirBucle();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  /*
   * Horneado del mapa de sombras: UNA vez, con la escena ya completa.
   *
   * Tiene que ir aquí y no antes: el balón, el jugador, el plató y los anillos
   * se añaden más arriba, y el mapa se hornea con lo que haya en la escena en
   * ese momento. El único otro momento que pide rehornear es un cambio de luz.
   */
  /*
   * Fundido de mallas estáticas, justo antes de hornear las sombras.
   *
   * El material único dejó 83 mallas del mundo compartiendo shader y estado;
   * cada una seguía siendo un draw call. Aquí se cuece su `matrixWorld` en la
   * geometría y se funden por estado de sombras y celda. Se deja FUERA
   * todo lo que se mueve (jugador, balón y los dos actores del plató) porque su
   * sombra se hornearía congelada y porque su pose cambia cada fotograma.
   *
   * Va en una función con nombre, y no suelto aquí, para poder repetirla desde el
   * gancho de desarrollo: así se puede comparar el fotograma fundido con el de
   * antes SIN recargar y sin depender de dos cargas distintas (que es la única
   * forma de que la comparación de píxeles sea concluyente).
   */
  /*
   * TAMAÑO DE LA CELDA DEL FUNDIDO: 24 m → 12 m.
   *
   * El intercambio es siempre el mismo y no es otro: celda más pequeña = lotes
   * más pequeños = esfera envolvente más pequeña = el frustum puede descartar
   * bastante más; a cambio, más lotes = más draw calls. Con 24 m el pabellón
   * cabe en 7 lotes y cada uno abarca un cuarto entero, con su esfera
   * encompassiendo medio pabellón, así que el culling por frustum NO puede
   * descartar NINGUNO: el techo, las gradas lejanas y las paredes se dibujan
   * enteros aunque no estén en cuadro.
   *
   * LA MEDIDA DE ESTE CAMBIO ESTÁ PENDIENTE, y hay que decirlo en el sitio
   * donde se lee: esta sesión no tenía shell, así que no se ha podido pasar
   * `__court.draws()` con 24, 16, 12 y 8 m. Lo que justifies el 12 m es la
   * GEOMETRÍA, no una cifra: a 12 m la retícula es de 6 × 6 sobre un pabellón
   * de ±30 × ±26 m, o sea lotes de un cuarto de cuarto, y la franja de la vista
   * de juego (la pista y el borde de grada que la cámara encuadra) deja de
   * arrastrar en su lote las esquinas que nunca se ven.
   *
   * Poner el valor por defecto sin la cifra es un riesgo asumido a conciencia,
   * así que la forma de comprobarlo o de volver atrás está a un clic:
   *
   *   · `?cell=24` (o `?cell=16`, `?cell=8`) en DESARROLLO fuerza el barrido, y
   *     la línea `[batch]` que sale al cargar dice cuántos lotes y cuántos
   *     triángulos ha hecho cada vez;
   *   · `__court.draws()` da el par (draw calls, triángulos) de cada vista;
   *   · si el 12 m sale peor —más llamadas sin menos triángulos—, se vuelve a 24
   *     cambiando una constante, que es todo el cambio.
   */
  const cellParam = Number(parametrosDev.get('cell'));
  const BATCH_CELL =
    import.meta.env.DEV && Number.isFinite(cellParam) && cellParam > 0 ? cellParam : 12;
  /** El `cell` es un parámetro —y no la constante— para poder barrerlo desde el gancho de
   * desarrollo: 24 m da 6 lotes y +18 % de triángulos en la vista de juego; menos celda son
   * más llamadas y menos triángulos. Ver BITACORA §3l. */
  function mergeStaticLots(cell = BATCH_CELL): void {
    const b = batchStaticMeshes(
      scene,
      [courtGroup, hoopL, hoopR, benchProp, tunnelProp, scorerTable, set.group, scoreboard, carrito.group],
      {
        material: VOXEL_MATERIAL,
        cell,
        // Las redes del aro NO están en esta lista porque no hace falta: usan su
        // propio material (el de la ondulación), y el fundido sólo toca las mallas
        // que comparten `VOXEL_MATERIAL`. Es decir, quedan sueltas y animables, que
        // es justo lo que se quiere: son las únicas piezas de la canasta con
        // movimiento propio. Los cuatro que sí hay que excluir son los rigs, que
        // comparten material con el mundo y cambian de pose cada fotograma.
        // Y los carros del recorrido, que sí cambian: los cuatro puestos que
        // aparecen nacen ocultos y se enseñan al convocar (`mostrarPuestos`), y sus
        // balones se van gastando. El fundido no se puede esconder por partes y
        // ADEMÁS remueve la malla de su grupo, así que un carro fundido ya no se
        // podría apagar nunca: quedaría su copia congelada dentro del lote del
        // mundo. (El carrito de la esquina no está aquí: ése no se esconde.)
        exclude: [player.root, ballMesh, set.reporter.root, set.operator.root, ...carrito.balls, ...carros.map((c) => c.group)],
      },
    );
    if (b.merged === 0) return; // ya estaba fundido
    console.info(
      `[batch] fundidas ${b.merged} mallas -> ${b.batches} lotes ` +
        `(${cell} m) · ${b.triangles | 0} triángulos (antes ${b.before | 0}, ` +
        `descartadas ${b.skipped}) · ${(b.bytes / 1048576).toFixed(1)} MB`,
    );
  }
  /*
   * Y va ANTES del horneado: el mapa de sombras se cuece con lo que haya en la
   * escena, así que si se fundiera después, las sombras del primer fotograma se
   * habrían calculado con las 81 mallas sueltas. Fundir primero deja el mapa
   * idéntico —los triángulos son los mismos, en el mismo sitio— pero garantiza
   * que no haya dos caminos distintos según el orden.
   */
  /*
   * Interruptor de MEDICIÓN, sólo en desarrollo: `?nobatch=1` carga la escena sin
   * fundir. Sin él no hay forma de comparar las llamadas de dibujo contra el estado
   * anterior —la fusión es destructiva, la escena de antes ya no existe— y la
   * comparación entre dos cargas distintas sólo es válida si lo único que cambia
   * es esta línea.
   */
  if (!(import.meta.env.DEV && parametrosDev.has('nobatch'))) mergeStaticLots();

  /*
   * A/B DEL MATERIAL DEL VOXEL: `?nolambert=1` (sólo desarrollo).
   *
   * `VOXEL_MATERIAL` es un `MeshLambertMaterial` (ver el bloque de `util.ts`: con
   * `roughness: 0.92` y `metalness: 0` el `MeshStandardMaterial` era un Lambert
   * con pasos de más, y se pagaba en todos los fragmentos del mundo). El
   * interruptor devuelve el `MeshStandardMaterial` original a TODA la escena, de
   * modo que la comparación Lambert/Standard sea dos números en la misma sesión
   * y no dos builds con dos cachés distintas.
   *
   * Va AQUÍ, y no dentro de los constructores, por dos razones:
   *  · los materiales se comparten por IDENTIDAD y `batch.ts` funde comparando
   *    por identidad, así que cambiar uno en caliente dejaría la escena a medias;
   *  · tiene que estar resuelto ANTES de `bakeShadows()` y de
   *    `precargaShaders()`: si se cambiara después, los programas del material
   *    viejo se compilarían dentro del juego y la medida saldría contaminada
   *    justo por el trabajo que se quiere medir.
   *
   * Se cambia SÓLO el material del voxel, por identidad: ni la red de los aros,
   * ni los materiales con textura, ni `mat()`, ni la grada. Un recorrido de la
   * escena comparando por identidad no puede tocar nada más.
   */
  let materialVoxel: THREE.Material = VOXEL_MATERIAL;
  if (sinLambert) {
    const standard = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      metalness: 0,
      flatShading: false,
      side: THREE.FrontSide,
    });
    let cambiadas = 0;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material === VOXEL_MATERIAL) {
        m.material = standard;
        cambiadas++;
      }
    });
    materialVoxel = standard;
    console.info(`[ab] ?nolambert=1: ${cambiadas} mallas con MeshStandardMaterial (el Lambert queda sin usar)`);
  }

  /*
   * QUIÉN ES ESTA MÁQUINA.
   *
   * Toda la discusión sobre si el juego va lento por la GPU, por el rasterizador
   * por software o por el sistema se estaba resolviendo a ojo. Con esta línea
   * se acaba: sale en DESARROLLO y también en PRODUCCIÓN, una vez al arrancar,
   * antes incluso de que empiece el juego. Dice el renderer y el vendor reales,
   * el `devicePixelRatio`, el tamaño de verdad del lienzo (el búfer de dibujo,
   * que es el ancho por el alto por la escala, no el tamaño CSS), la anisotropía
   * máxima que pueden pedir las texturas y qué material está usando el voxel.
   *
   * Sin `WEBGL_debug_renderer_info` —Firefox lo tiene retirado y hay navegadores
   * que lo ocultan por privacidad— se recurre a `gl.RENDERER` / `gl.VENDOR`,
   * que son justo los valores que el navegador tiene derecho a falsear.
   *
   * ─────────────────────────────────────────────────────────────────────────────
   * UN NÚMERO NO ES UN NOMBRE (fallo de este log)
   * ─────────────────────────────────────────────────────────────────────────────
   *
   * Salía esto:
   *
   *     [gpu] 37446 · vendor=37445 · dpr=1 · ...
   *
   * 37445 y 37446 son 0x9245 y 0x9246: enums de `WEBGL_debug_renderer_info`, no
   * el nombre de nada. Cuando el navegador tiene `WEBGL_debug_renderer_info`
   * declarado pero lo tiene ENMASCARADO, `getParameter` no da error ni da cadena
   * vacía: da un entero, y ese entero salía en la consola con la misma
   * tipografía que un nombre de GPU. Peor que no saberlo: parece una medición.
   *
   * Lo que hace ahora:
   *
   *  · **Distingue nombre de enum.** Un texto es un nombre si NO es un entero en
   *    decimal ni en hexadecimal, ni `null`/`undefined`. Los valores que no lo
   *    son se cuentan como ENMASCARADO y se dicen con esas palabras.
   *  · **Prueba las dos vías antes de rendirse:** primero la extensión, y si el
   *    valor no es un nombre, `gl.getParameter(gl.RENDERER)` / `gl.VENDOR`.
   *    Las dos, y el descarte de enums, están en `leerGpu()`: esa función es la
   *    fuente, y este bloque y la escala de partida leen las dos desde ella.
   *  · **Y si tampoco, `navigator.gpu`:** el adaptador de WebGPU es otra ruta al
   *    mismo hardware y suele estar disponible aunque WebGL esté enmascarado. Se
   *    consulta en segundo plano (es una promesa) y su resultado sale en una
   *    segunda línea `[gpu]` si la hay.
   *  · **Y siempre dice cuál es el siguiente paso:** `chrome://gpu`, que es donde
   *    el navegador enseña el renderer real y, sobre todo, POR QUÉ lo ha
   *    enmascarado (una política de privacidad o un bloqueo por lista negra).
   *
   * Si tras todo eso no se puede identificar, se DICE que no se ha podido. Un
   * log que no sabe es más útil que uno que enseña 37446 como si fuera el nombre
   * de la tarjeta gráfica.
   */
  {
    /*
     * La lectura la hace `leerGpu()` (arriba, junto a la decisión de la escala),
     * y no una copia local: es la MISMA lectura que dijo con qué resolución se
     * entra. Si aquí se leyera otra vez, las dos podrían acabar enseñando cosas
     * distintas y el log diría un nombre que no es el con el que arrancó el
     * juego.
     */
    const gpuLeida = leerGpu();
    const rendererTxt = gpuLeida.renderer;
    const vendorTxt = gpuLeida.vendor;
    const voxel = materialVoxel.type === 'MeshLambertMaterial' ? 'Lambert' : 'Standard';

    /**
     * Cómo se describe un valor que no se ha podido identificar: se dice que lo
     * está, y se enseña lo que devuelve para que el que mira sepa qué tiene.
     */
    const enmascarado = (que: string, crudos: string[]): string => {
      const vistos = crudos.filter(Boolean);
      return `${que} ENMASCARADO por el navegador (devuelve ${vistos.length ? vistos.join(' / ') : 'nada'})`;
    };

    console.info(
      `[gpu] ${rendererTxt || enmascarado('renderer', gpuLeida.rendererCrudos)} · ` +
        `${vendorTxt ? `vendor=${vendorTxt}` : enmascarado('vendor', gpuLeida.vendorCrudos)} · ` +
        `dpr=${window.devicePixelRatio} (escala ${pixelRatio}, arranque: ${motivoEscala}) · ` +
        `lienzo ${canvas.width}x${canvas.height} · anisotropía ${renderer.capabilities.getMaxAnisotropy()} · ` +
        `voxel=${voxel} · siguiente paso: chrome://gpu`,
    );
    if (!rendererTxt || !vendorTxt) {
      console.warn(
        '[gpu] el navegador no ha revelado el nombre de la GPU. ' +
          'Los valores de arriba son enums o literales, no una tarjeta: no los leas como nombre. ' +
          'Siguiente paso: chrome://gpu (pestaña "Graphics Feature Status" y "Driver Information"), ' +
          'donde sale el renderer real y por qué está enmascarado.',
      );
      /*
       * SEGUNDA OPORTUNIDAD: `navigator.gpu`.
       *
       * WebGPU pregunta por el adaptador por otra ruta y suele contestar aunque
       * WebGL esté enmascarado, así que es el último intento antes de decir que
       * no se puede. Es asíncrono por naturaleza, así que sale en su propia
       * línea `[gpu]` cuando conteste. Se tipa aquí a mano en vez de usar
       * `Navigator.gpu` porque la superficie de WebGPU en `lib.dom.d.ts`
       * cambia entre versiones de TypeScript y esto no puede romper la
       * compilación el día que suba.
       */
      type InfoGpu = { vendor?: string; architecture?: string; description?: string };
      type AdaptadorGpu = { info?: InfoGpu; requestAdapterInfo?: () => Promise<InfoGpu> };
      const gpuApi = (navigator as unknown as { gpu?: { requestAdapter(): Promise<AdaptadorGpu | null> } }).gpu;
      if (!gpuApi) {
        console.warn('[gpu] este navegador no tiene navigator.gpu (sin WebGPU): la vía alternativa no existe');
      } else {
        // Se copia a una `const` de la rama: dentro del cierre async el
        // estrechamiento de tipos de `gpuApi` no se puede dar por hecho, y así
        // no depende de la versión de TypeScript.
        const api = gpuApi;
        void (async (): Promise<void> => {
          try {
            const adaptador = await api.requestAdapter();
            if (!adaptador) {
              console.warn('[gpu] navigator.gpu no ha devuelto adaptador (puede estar bloqueado)');
              return;
            }
            // `adapter.info` es la API nueva (Chrome 128+); `requestAdapterInfo()`,
            // la vieja. Se prueban las dos porque el nombre de una sigue
            // funcionando donde la otra ya no.
            const info = adaptador.info ?? (adaptador.requestAdapterInfo ? await adaptador.requestAdapterInfo() : null);
            const partes = info ? [info.vendor, info.architecture, info.description].filter(Boolean) : [];
            console.info(`[gpu] navigator.gpu → ${partes.join(' ') || 'adaptador sin datos'}`);
          } catch (e) {
            console.warn('[gpu] navigator.gpu no ha podido consultarse', e);
          }
        })();
      }
    }
  }

  /*
   * PRECARGA DE SHADERS: POR QUÉ EL JUEGO VA MÁS FLUIDO DESPUÉS DE ABRIR UNA SECCIÓN.
   *
   * SÍNTOMA (literal): "ocurre una mejora considerable en el rendimiento
   * posterior a abrir alguna de las secciones y luego cerrarla respecto a la
   * primera carga el juego sin abrir ninguna sección".
   *
   * MECÁNICA (leída en `node_modules/three/src/renderers/WebGLRenderer.js`):
   * un programa de shader se enlaza la PRIMERA vez que se dibuja una malla con
   * ese material, no al construirlo. `WebGLRenderer.compile()` es precisamente
   * la API que adelanta ese enlace, y el juego NO la llamaba en ninguna parte
   * (grep de `src`: `renderer.compile` sólo aparece en este bloque). O sea:
   * la factura se pagaba dentro del juego.
   *
   * DÓNDE SE PAGABA, en esta escena concreta:
   *  · `bakeShadows()` (el horneado que ya existía) recorre el pase de sombras
   *    COMPLETO, así que el horneado sí dejaba calientes los programas de
   *    profundidad. Lo que no dejaba calientes era el pase de color: sólo dibuja
   *    lo que cae en el frustum, y la cámara de juego va a 12,4 m mirando hacia
   *    el jugador. El atrezo de las secciones que queda fuera de ese cono
   *    (banquillo, túnel, mesa de anotadores, redes, plató, pantallas del
   *    marcador) compilaba su programa la primera vez que se entraba en su zona
   *    o se abría su panel.
   *  · Abrir una sección mueve la cámara a 1,75-2,5 m y muy cerca del atrezo:
   *    entra en cuadro material que la vista de juego no había visto. Eso
   *    compila programas nuevos AHORA. Al cerrar, la cámara vuelve a la de
   *    juego, pero los programas ya están en `renderer.info.programs`, que sólo
   *    crece: no se vuelven a pagar nunca. De ahí el "va mejor después": no es
   *    que abrir una sección mejore el juego, es que abrirla lo CALIENTA.
   *  · Y desde el menú (sin entrar en la zona) también: `mode = 'panel'` arranca
   *    la órbita lenta de ±9°, y esa deriva saca del frustum cosas nuevas poco a
   *    poco, que también pagan su primera vez.
   *
   * Y hay un remate que se ve sólo leyendo el orden de las llamadas: al hornear,
   * la cámara SIGUE EN SU POSE POR DEFECTO. `updateCamera(0, true)` no se llama
   * hasta `start()`, así que `bakeShadows()` no sólo hornea sombras: además
   * dibuja un pase de color entero desde (0, 0, 0) mirando a -Z, en mitad del
   * parqué. Ese pase de color calienta lo que se ve desde el ORIGEN, y el juego
   * arranca con la cámara a 12,4 m mirando al jugador: otro frustum, otra
   * factura, en el primer fotograma de todos. Por eso el salto de los primeros
   * segundos no es un efecto raro: es la vista de origen que se queda obsoleta.
   *
   * No se arregla colocando la cámara antes de hornear: es redundante en cuanto
   * existe `precargaShaders()` (que no recorta por frustum) y ensuciaría el
   * `?nopre=1`, que tiene que seguir reproduciendo el síntoma viejo exacto.
   *
   * EL ARREGLO: pagar lo mismo, pero una vez y en la pantalla de carga, con la
   * barra de progreso por delante. Nada de esto cambia lo que se ve ni un píxel:
   * los mismos materiales, los mismos objetos, los mismos parámetros de luz.
   *
   * TRES MATICES QUE SÍ IMPORTAN, leídos del mismo archivo:
   *
   *  1. `compile()` recorre `scene.traverse()` —NI de lejos `traverseVisible()`, y
   *     sin recortar por frustum—, así que una sola pasada ya recoge TODOS los
   *     materiales de la escena. Recorrer las seis vistas de sección no compra
   *     programas nuevos: se queda por tres razones. (a) `compile()` usa la
   *     cámara para decidir qué luces entran
   *     (`object.layers.test(camera.layers)`) y para el estado de render, así que
   *     iterar vistas no deja la precompilación colgando de una suposición
   *     sobre las capas; (b) las pasadas siguientes son un no-op sobre la caché
   *     (el coste entero está en la primera) y dan progreso real a la barra;
   *     (c) es donde se DIBUJA cada vista una vez para calentar búferes de
   *     geometría y texturas — eso `compile()` no lo hace, y ahora es el
   *     comportamiento por defecto (ver el bloque de los interruptores).
   *  2. `compileAsync` es la variante con `KHR_parallel_shader_compile`: el
   *     navegador enlaza en segundo plano y la promesa resuelve cuando el
   *     programa está listo. Existe en 0.170 y está en los tipos (`@types/three`
   *     0.170 la declara). Si la extensión no está, `compileAsync` compila en
   *     síncrono y la promesa se resuelve igual: nunca es peor que `compile()`.
   *  3. NO es un dibujado. `compile()` no toca búferes de geometría, ni texturas,
   *     ni `shadowMap`. Por eso va DESPUÉS de `bakeShadows()`: los programas del
   *     pase de sombras los pone el horneado, y `compile()` pone los del pase de
   *     color. Al revés, faltaría una de las dos mitades. Y por eso, sola, se
   *     queda a medias: la otra mitad es `precargaTexturas()` (ver más abajo).
   *
   * AVISO DE HONESTIDAD: las dos sesiones en las que se ha escrito este bloque
   * NO tenían shell (permiso denegado), así que está razonado leyendo el código,
   * NO medido aquí. Los números salen solos en la consola al cargar —programas
   * antes y después, milisegundos de la precompilación y de la subida de
   * texturas—, y la comparación A/B se hace con `?nopre=1` +
   * `__court.diagnosticar()`. Ver la sonda más abajo.
   */

  /** Desde qué punto de la barra se reparte la precompilación (el resto es espera). */
  const PRECARGA_0 = 0.86;
  /** Punto en el que acaba la precompilación y empieza la subida de texturas. */
  const PRECARGA_TEX = 0.95;

  /*
   * TECHO DE TIEMPO DE LA PRECARGA.
   *
   * Es tiempo MUERTO, pero tiempo muerto que el jugador ve como una barra
   * parada, así que no puede ser infinito. `compileAsync` con
   * `KHR_parallel_shader_compile` va sondeando el estado de enlace con
   * `setTimeout(..., 10)` hasta que todos los materiales están listos: es la vía
   * normal, y si un driver se queda sin responder, la promesa NO resuelve nunca
   * y la carga se queda en 0,95 % para siempre sin que se pueda cerrar el juego.
   *
   * Con el techo, en ese caso se abandona la vista (el enlace sigue adelante por
   * debajo, en el navegador, y para cuando el jugador llegue ya estará listo) y
   * se cuenta como vista OMITIDA. El juego entra igual: una vista sin precalentar
   * cuesta un tirón en esa zona, no una pantalla en negro.
   */
  const VISTA_TECHO_MS = 1200;
  /** Techo del paseo entero de subida de texturas (es una llamada síncrona por textura). */
  const TEXTURAS_TECHO_MS = 900;

  /** Las vistas que se dejan calientes: la de juego y las seis de sección. */
  const vistasPrecarga: {
    nombre: string;
    pos: readonly [number, number, number] | null;
    look: readonly [number, number, number] | null;
  }[] = [
    { nombre: 'juego', pos: null, look: null },
    ...SECTION_IDS.map((id) => ({
      nombre: id as string,
      pos: SECTION_CAMERA[id].pos,
      look: SECTION_CAMERA[id].look,
    })),
  ];

  /*
   * Interruptores de MEDICIÓN.
   *  · `?nopre=1`      — no precompila: reproduce el síntoma viejo para comparar.
   *  · `?noprewarm=1`  — precompila pero NO dibuja cada vista: el estado anterior.
   *
   * PREWARM ES AHORA EL COMPORTAMIENTO POR DEFECTO. Decisión del propietario:
   * "aunque tarde más la barra en cargar, la experiencia mejoraría al no tener
   * lag". Es literalmente su argumento, y es correcto: lo que se compra son los
   * primeros segundos de juego.
   *
   * Antes era opt-in (`?prewarm=1`) porque el intercambio —siete fotogramas
   * completos de barra de carga, uno por vista, con flush— nunca se había
   * cronometrado en ninguna máquina. La cifra que lo justificaba ya está: en la
   * máquina de referencia (Intel HD 4600) el fotograma estable ronda los 20 ms,
   * así que siete dibujados son ~140-250 ms de barra. Por una barra que ahora
   * dura un segundo más, se compra que nada se compile, nada se suba y nada se
   * que nada se compile ni se suba dentro de los primeros segundos de partida.
   *
   * Lo que `compileAsync` NO hace, y es justo lo que este paso añade:
   *
   *  · **Subir los búferes de geometría.** Un programa compilado no tiene
   *    vértices: los ~460.000 triángulos del mundo se suben a la GPU la PRIMERA
   *    vez que se dibujan. Y como el culling por frustum decide qué se dibuja,
   *    la geometría de la mitad del anillo que queda detrás de la cámara NO se
   *    sube en el primer fotograma: se sube el primer día que el jugador mira
   *    hacia otro lado, y ese día da un tirón.
   *  · **Crear el estado de GL de cada malla** (VAO, buffers de índice, uniforms
   *    de textura), que también es la primera vez.
   *
   * Por eso se dibujan las SIETE vistas y no sólo la de juego: cada una mete en
   * la GPU lo que las otras seis no ven, y la unión de las siete es toda la
   * escena. Con la única vista de juego quedaría medio recinto sin subir.
   *
   * No se ve nada raro: `#loader` es opaco y va por encima del lienzo
   * (`z-index: 40`), así que los siete dibujados ocurren detrás de la barra.
   */
  const sinPrecompile = import.meta.env.DEV && parametrosDev.has('nopre');
  const prewarm = !parametrosDev.has('noprewarm');

  /*
   * ¿EXISTE `compileAsync` EN EL THREE INSTALADO?
   *
   * Comprobado leyendo el paquete, no de memoria: `WebGLRenderer.js` la declara
   * en la línea 1034 (`this.compileAsync = function ( scene, camera, targetScene
   * = null )`), así que en 0.170 está. Aun así NO se llama a pelo: si algún día
   * se baja una versión sin ella —o si algún polyfill del navegador la quita—
   * el juego tiene que cargar igual, y por eso la comprobación es de
   * disponibilidad, no de versión.
   */
  const hayCompileAsync = typeof renderer.compileAsync === 'function';

  /**
   * Compila los programas de la vista que tiene la cámara ahora mismo, y no
   * puede colgarse ni rechazar.
   *
   * `compileAsync` devuelve una promesa que NUNCA rechaza, pero con el techo de
   * `Promise.race` se abandona a mitad, y una promesa abandonada que un día
   * rechazara daría un error no capturado. El `then` de rechazo está por eso:
   * registra y devuelve el mismo resultado que el éxito.
   */
  async function compilarVista(): Promise<'ok' | 'techo'> {
    if (!hayCompileAsync) {
      // Vía síncrona de siempre: peor que la asíncrona cuando existe la
      // extensión, y sólo un bloqueo más largo cuando no.
      renderer.compile(scene, camera);
      return 'ok';
    }
    let reloj = 0;
    const techo = new Promise<'techo'>((r) => {
      reloj = window.setTimeout(() => r('techo'), VISTA_TECHO_MS);
    });
    try {
      // Llamada por método (`renderer.compileAsync(…)`, no su valor suelto):
      // dentro usa `this` (`this.compile`, `currentRenderState`), y en un módulo
      // ESM perder el receptor es `this === undefined` y una excepción. La
      // guarda de arriba ya ha comprobado que la función existe.
      const p = renderer.compileAsync(scene, camera);
      const r = await Promise.race([
        p.then(
          () => 'ok' as const,
          (e: unknown) => {
            console.warn('[preload] compileAsync falló en esta vista; se sigue', e);
            return 'ok' as const;
          },
        ),
        techo,
      ]);
      return r;
    } finally {
      window.clearTimeout(reloj);
    }
  }

  async function precargaShaders(): Promise<void> {
    const t0 = performance.now();
    const programasAntes = renderer.info.programs?.length ?? 0;
    const guardaPos = camera.position.clone();
    const guardaQuat = camera.quaternion.clone();
    const tmpLook = new THREE.Vector3();
    let omitidas = 0;
    try {
      for (let i = 0; i < vistasPrecarga.length; i++) {
        const v = vistasPrecarga[i]!;
        if (v.pos) {
          camera.position.set(v.pos[0], v.pos[1], v.pos[2]);
          camera.lookAt(tmpLook.set(v.look![0], v.look![1], v.look![2]));
          camera.updateMatrixWorld(true);
        } else {
          /*
           * Vista de juego. La cámara aún no se ha colocado NUNCA a estas alturas:
           * `start()` es quien llama a `updateCamera`. Sin esto, la primera pasada
           * miraría desde el origen (0, 0, 0), que no es el encuadre real — para
           * `compile()` da igual porque no recorta por frustum, pero para el
           * dibujado de calentamiento sí importa.
           */
          updateCamera(0, true);
        }
        onProgress(PRECARGA_0 + (PRECARGA_TEX - PRECARGA_0) * (i / vistasPrecarga.length));
        // Se cede ANTES de compilar: es el fotograma en el que la barra se pinta
        // con el progreso de esta vista. Compilar bloquea (el enlace es síncrono
        // si no hay `KHR_parallel_shader_compile`), así que sin esta cesión media
        // carga se iría a 0 % durante un rato largo.
        await nextFrame();
        // Una vista que revienta (material corrupto, error de driver) no puede
        // llevarse por delante las otras seis: se cuenta y se sigue.
        try {
          if ((await compilarVista()) === 'techo') {
            omitidas++;
            console.warn(`[preload] vista "${v.nombre}": más de ${VISTA_TECHO_MS} ms de enlace, se abandona`);
          }
        } catch (e) {
          omitidas++;
          console.warn(`[preload] vista "${v.nombre}": fallo al compilar, se sigue`, e);
        }
        if (prewarm) {
          // Un dibujado de verdad con flush: es lo que calienta los búferes de
          // geometría y la subida de texturas, que `compile()` no toca. La vista de
          // juego entra también, porque la de `bakeShadows()` se dibujó desde el
          // origen y no calentó los suyos.
          const t1 = performance.now();
          renderer.render(scene, camera);
          gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
          console.info(`[preload] dibujado de calentamiento ${v.nombre}: ${(performance.now() - t1).toFixed(1)} ms`);
        }
      }
    } finally {
      /*
       * La cámara vuelve a donde estaba SIEMPRE, incluso si el recorrido ha
       * reventado a la mitad. Dejarla en el plano de una sección sería el peor
       * de los estados intermedios: el juego entraría mirando al banquillo, en
       * modo 'play', con el input dado — o sea, jugando, pero en otro sitio.
       * (`start()` vuelve a colocarla igual, pero que el estado de partida no
       * dependa de un `finally` del bucle anterior es mejor.)
       */
      camera.position.copy(guardaPos);
      camera.quaternion.copy(guardaQuat);
      camera.updateMatrixWorld(true);
    }
    const programasDespues = renderer.info.programs?.length ?? 0;
    console.info(
      `[preload] ${vistasPrecarga.length} vistas · ${hayCompileAsync ? 'compileAsync' : 'compile (sin compileAsync)'} · ` +
        `programas ${programasAntes} -> ${programasDespues}` +
        (omitidas ? ` · ${omitidas} OMITIDAS por techo` : '') +
        ` · ${(performance.now() - t0).toFixed(0)} ms`,
    );
  }

  /*
   * SUBIDA DE TEXTURAS A LA GPU.
   *
   * `compileAsync` calienta PROGRAMAS y nada más. Los bytes van aparte: los sube
   * el primer dibujado en el que aparece cada textura, o sea DENTRO del juego,
   * y es la otra mitad del tirón de arranque. Un programa que se enlaza tarda
   * unos pocos milisegundos y se nota poco; un `texImage2D` de un lienzo de
   * ~900x600 con mipmaps y anisotropía, más la CPU de generateMipmap, se nota
   * mucho más — y aquí se paga con la barra delante, no con el jugador moviéndose.
   *
   * `renderer.initTexture(tex)` es exactamente la llamada que hará ese dibujado
   * (va a `textures.setTexture2D`), sólo que anticipada. NO resubida lo que ya
   * está subido: `setTexture2D` compara la versión de la textura con la que tiene
   * el contexto, así que el horneado de sombras ya subió las suyas y esta pasada
   * sólo paga las que faltaban.
   *
   * No se suben los BÚFERES de geometría aquí: eso es lo que hace el dibujado de
   * calentamiento de la pasada anterior, una vez por vista, y ya forma parte del
   * arranque por defecto.
   *
   * EXCEPCIÓN A CONOCER: las dos texturas que se repintan EN JUEGO —el marcador
   * del techo y su `flash()` de "PERFECTO"— marcan `needsUpdate` cada vez que
   * cambian, y entonces sí se vuelven a subir. Es intencionado y se queda así:
   * repintar un panel de 336x112 en el instante en que se anota es correcto, y
   * hacerlo antes significaría mostrar un número viejo o pagar la subida de una
   * textura que aún no tiene el texto que le toca. Todo lo demás se sube una vez.
   */
  const esTextura = (v: unknown): v is THREE.Texture =>
    typeof v === 'object' && v !== null && (v as THREE.Texture).isTexture === true;

  /** Píxeles de la imagen de una textura, o 0 si no los tiene legibles (comprimida). */
  function pixeles(t: THREE.Texture): number {
    const img = t.image as { width?: number; height?: number } | undefined;
    return typeof img?.width === 'number' && typeof img?.height === 'number' ? img.width * img.height : 0;
  }

  /**
   * Todas las texturas que la escena puede llegar a dibujar, sin repetir.
   *
   * Se recogen por Material y no "a ojo" en el código porque una textura que se
   * meta mañana en el dorsal, en una red o en un cartel tiene que entrar sola en
   * el paseo, sin que nadie se acuerde de añadirla a una lista.
   *
   * Se miran DOS sitios de cada material, porque hay dos formas de llevar una
   * textura: como propiedad con nombre propio (`map`, `emissiveMap`, …, que es
   * el 99 % de este proyecto: todo son `canvasTexture`) y dentro de `uniforms`,
   * que es como viajan en un `ShaderMaterial` o en un `onBeforeCompile`. En este
   * repo lo segundo no se usa, pero el recorrido cuesta tres líneas y evita el
   * fallo silencioso si algún día aparece.
   */
  function texturasDe(raiz: THREE.Object3D): THREE.Texture[] {
    const vistas = new Set<THREE.Texture>();
    raiz.traverse((o) => {
      // Sólo lo que de verdad llega a un `draw`: una malla, unas puntos, una
      // línea o un sprite. Un `Object3D` a secas no tiene material.
      if (!(o as THREE.Mesh).isMesh && !(o as THREE.Points).isPoints && !(o as THREE.Line).isLine && !(o as THREE.Sprite).isSprite) return;
      const bruto = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (!bruto) return;
      for (const mat of Array.isArray(bruto) ? bruto : [bruto]) {
        if (!mat) continue;
        for (const valor of Object.values(mat as unknown as Record<string, unknown>)) {
          if (esTextura(valor)) vistas.add(valor);
        }
        const u = (mat as THREE.ShaderMaterial).uniforms as Record<string, { value: unknown }> | undefined;
        if (u) {
          for (const clave of Object.keys(u)) {
            const v = u[clave]?.value;
            if (esTextura(v)) vistas.add(v);
          }
        }
      }
    });
    return [...vistas];
  }

  async function precargaTexturas(): Promise<void> {
    const texs = texturasDe(scene);
    const t0 = performance.now();
    let subidas = 0;
    let pix = 0;
    const saltadas: string[] = [];
    for (let i = 0; i < texs.length; i++) {
      const t = texs[i]!;
      // El techo se comprueba ANTES de empezar la siguiente: una subida es
      // síncrona y no se puede interrumpir a mitad, así que el peor caso es
      // pasarse por una textura, nunca por el presupuesto entero.
      if (performance.now() - t0 > TEXTURAS_TECHO_MS) {
        saltadas.push(...texs.slice(i).map((x) => `${x.name || x.type} ${x.image?.width}x${x.image?.height}`));
        break;
      }
      try {
        renderer.initTexture(t);
        subidas++;
        pix += pixeles(t);
      } catch (e) {
        saltadas.push(`${t.name || t.type} (${(e as Error)?.message ?? 'error'})`);
        console.warn(`[preload] no se pudo subir la textura ${t.name || t.type}; el juego sigue`, e);
      }
      // Se cede de dos en dos: subir son varios `texImage2D` seguidos y, sin
      // ceder, la barra se congela durante todo el paseo. Dos texturas por
      // fotograma mantiene el pintado sin alargar la carga de forma sensible.
      if (i % 2 === 1) {
        onProgress(PRECARGA_TEX + (1 - PRECARGA_TEX) * ((i + 1) / texs.length));
        await nextFrame();
      }
    }
    console.info(
      `[preload] texturas: ${subidas}/${texs.length} subidas · ${(pix / 1e6).toFixed(2)} Mpx · ` +
        `${(performance.now() - t0).toFixed(0)} ms` +
        (saltadas.length ? ` · OMITIDAS: ${saltadas.join(', ')}` : ''),
    );
  }

  /*
   * LA ESCALA DE PARTIDA, MEDIDA.
   *
   * El problema que esto arregla: con el techo en `devicePixelRatio`, la calidad
   * adaptativa DESCUBRE sola lo que la máquina puede, y en el equipo del
   * propietario eso son 7 s de cascada 1,0 → 0,9 → 0,8 → 0,7 con la imagen
   * borrosa, que es lo que se ha reportado más de una vez.
   *
   * Ya no se adivina con el nombre de la GPU: se MIDE. Y la medida sale gratis,
   * porque la precarga acaba de dibujar las siete vistas y, con eso, la escena
   * está calentada de verdad: los programas están enlazados, las texturas
   * subidas y los búferes de geometría en la GPU. Un fotograma medido AHORA, en
   * el encuadre real de juego, es el coste de régimen de esa máquina.
   *
   * DEL COSTE A LA ESCALA. El fotograma se comporta como
   *
   *     t = A + B·s²
   *
   * con `A` fijo (CPU, vértices, envío de dibujo) y `B·s²` la parte que depende
   * de la resolución. De las dos constantes se ha medido la mezcla, no cada una:
   * en la máquina de referencia el reparto es de un 30 % fijo y un 70 %
   * proporcional, y se usa ese 30/70 como estimación. La escala que deja el
   * fotograma en el presupuesto de 60 fps sale de despejar:
   *
   *     0,3·t + 0,7·t·(s'/s)² <= 16,7  ->  s' = s · raiz((16,7 - 0,3·t) / 0,7·t)
   *
   * QUE NO ES UN MODELO EXACTO, y por eso la decisión no es definitiva: la
   * calidad adaptativa sigue teniendo todo el mando y corrige en los primeros
   * segundos. Lo que se compra es que ya no hay que recorrer tres peldaños para
   * llegar al que la máquina puede sostener.
   *
   * SE MIDEN DOS FOTOGRAMAS Y SE QUEDA CON EL MENOR. El primero todavía puede
   * pagar algún resto de subida (el propio `readPixels` de sincronización cuesta
   * uno o dos milisegundos, y eso va dentro de la medida), así que el segundo
   * es mucho más representativo que el peor.
   *
   * Con `?escala=N` no se toca nada: es el interruptor para hacer el A/B de la
   * nitidez inicial a ojo.
   */
  async function elegirEscalaInicial(): Promise<void> {
    if (escalaForzada) {
      console.info(`[gpu] escala ${pixelRatio} fijada a mano con ?escala; no se mide`);
      return;
    }
    const antes = pixelRatio;
    try {
      updateCamera(0, true); // encuadre REAL de juego, no el de la última sección
      resize();
      await nextFrame();
      let mejor = Infinity;
      for (let i = 0; i < 2; i++) {
        if (i > 0) await nextFrame();
        // Drenaje ANTES del reloj y sin cronometrar: vacía la cola para que lo
        // que se mida sea este fotograma y no el trabajo pendiente (es el mismo
        // fallo que se corrigió en `frame()`, y por aquí tampoco hay que repetirlo).
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        const t0 = performance.now();
        renderer.render(scene, camera);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        mejor = Math.min(mejor, performance.now() - t0);
      }
      const PRESUPUESTO = 1000 / 60; // 16,7 ms
      const PARTE_FIJA = 0.3;
      const margen = PRESUPUESTO - PARTE_FIJA * mejor;
      // Con margen negativo no hay escala que valga: se va al suelo y se avisa.
      const s = margen > 0 ? antes * Math.sqrt(margen / ((1 - PARTE_FIJA) * mejor)) : 0;
      const elegido = clamp(+Math.floor(s * 20) / 20, ESCALA_MIN, ESCALA_MAX);
      if (elegido < antes - 0.001) {
        pixelRatio = elegido;
        techoFallido = elegido; // el techo baja con el punto de partida: la escalada
        // adaptativa seguirá pudiendo SUBIR sola, con su histéresis y sus
        // reintentos, si la máquina puede más de lo que dice esta medición.
        resize();
        console.info(
          `[gpu] fotograma medido ${mejor.toFixed(1)} ms a escala ${antes} · ` +
            `escala de partida ${elegido} (medido, no adivinado: 30 % fijo + 70 % por resolución)`,
        );
      } else {
        console.info(`[gpu] fotograma medido ${mejor.toFixed(1)} ms a escala ${antes} · entra en ${antes}: cabe en el presupuesto`);
      }
    } catch (e) {
      console.warn(`[gpu] no se pudo medir la escala de partida; se entra en ${antes}`, e);
    }
  }

  bakeShadows();
  /*
   * LA PRECARGA NUNCA IMPIDE JUGAR.
   *
   * Todo lo de arriba es una optimización: paga trabajo que si no se pagaría
   * dentro del juego. Si algo de ello falla, se registra y el juego entra IGUAL,
   * sólo que con un tirón en la primera vez que se vea cada cosa. Envolverlo
   * aquí es lo que garantiza que la pantalla de carga nunca se queda en negro
   * por culpa de la precarga (y además es la capa que protege a
   * `precargaShaders` de volver a dejar la cámara en el plano de una sección).
   */
  try {
    if (sinPrecompile) {
      console.warn('[preload] OMITIDA (?nopre=1): así se reproduce el síntoma de antes del arreglo');
    } else {
      await precargaShaders();
      await precargaTexturas();
      await elegirEscalaInicial();
    }
  } catch (err) {
    console.error('[preload] la precarga ha fallado; el juego entra SIN precalentar', err);
  }
  onProgress(1);

  /*
   * SONDA DE RENDIMIENTO.
   *
   * Existe porque el síntoma es diferencial POR NATURALEZA —una diferencia
   * entre "la primera vez" y "después"— y las medias del bucle no lo veían: el
   * coste de compilar se paga en un solo fotograma, y la mediana de la calidad
   * adaptativa lo esconde por diseño (los 45 primeros fotogramas ni cuentan).
   *
   * Una medida de DOS NÚMEROS, y sólo dos, decide la pregunta:
   *   · `medianaMs` — el intervalo de fotograma de verdad (reloj de pared entre
   *     `requestAnimationFrame`), no el `dt` recortado a 1/20 que usa el juego;
   *   · `programasDespues - programasAntes` — cuántos programas se han enlazado
   *     durante la ventana. `renderer.info.programs` SÓLE crece (los programas se
   *     quitan en `releaseProgram`, no al reiniciar `info`), así que la diferencia
   *     es exactamente el número de facturas pagadas en esos segundos.
   *
   * Uso (un clic, con el juego ya cargado):
   *   · CON la precompilación puesta (por defecto): `await __court.diagnosticar()`
   *     → tres filas con la misma mediana y `nuevos = 0`. Eso es el arreglo
   *     funcionando.
   *   · SIN ella (`?nopre=1` al cargar): la fila del medio debe traer
   *     programas nuevos y, si la hipótesis es la correcta, una mediana
   *     peor. Ése es el antes/después.
   */
  type Sonda = {
    momento: string;
    ms: number;
    fotogramas: number;
    medianaMs: number;
    p95Ms: number;
    peorMs: number;
    programasAntes: number;
    programasDespues: number;
    nuevos: number;
  };

  /** Programas de shader enlazados hasta ahora. */
  const programas = (): number => renderer.info.programs?.length ?? 0;

  const percentil = (s: number[], p: number): number =>
    s.length === 0 ? 0 : s[Math.min(s.length - 1, Math.max(0, Math.round((s.length - 1) * p)))]!;

  /** Mediana de intervalos durante `ms`, con los programas contados a los dos lados. */
  function sondear(momento: string, ms = 3000): Promise<Sonda> {
    return new Promise((resolve) => {
      const programasAntes = programas();
      const t0 = performance.now();
      let prev = t0;
      const inter: number[] = [];
      const paso = (): void => {
        const ahora = performance.now();
        inter.push(ahora - prev);
        prev = ahora;
        if (document.hidden) {
          // Pestaña sin foco: no hay fotogramas y esto no terminaría nunca.
          console.warn(`[sonda] "${momento}": pestaña oculta, sin medida`);
          resolve({
            momento, ms: 0, fotogramas: 0, medianaMs: 0, p95Ms: 0, peorMs: 0,
            programasAntes, programasDespues: programas(), nuevos: 0,
          });
          return;
        }
        if (ahora - t0 < ms) {
          requestAnimationFrame(paso);
          return;
        }
        const s = [...inter].sort((a, b) => a - b);
        const programasDespues = programas();
        const r: Sonda = {
          momento,
          ms: Math.round(ahora - t0),
          fotogramas: inter.length,
          medianaMs: +percentil(s, 0.5).toFixed(2),
          p95Ms: +percentil(s, 0.95).toFixed(2),
          peorMs: +percentil(s, 1).toFixed(2),
          programasAntes,
          programasDespues,
          nuevos: programasDespues - programasAntes,
        };
        console.info(`[sonda] ${r.momento}: mediana ${r.medianaMs} ms · p95 ${r.p95Ms} ms · programas +${r.nuevos}`);
        resolve(r);
      };
      requestAnimationFrame(paso);
    });
  }

  /**
   * Encuadra una sección sin abrir su panel y sin mover al jugador.
   *
   * Sirve para revisar los seis planos de una sentada: abrir la sección de
   * verdad obliga a caminar hasta ella, y con el renderizado por software
   * cada paso cuesta segundos.
   */
  function encuadrar(id: SectionId): void {
    sectionCam = id;
    rotY = SECTION_CAMERA[id].face;
    updateCamera(0, true);
  }

  /**
   * Reproduce el síntoma en tres medidas seguidas y las deja en una tabla.
   *
   * No toca la interfaz: el segundo tramo mueve la cámara al encuadre de la
   * sección y lo deja ahí, que es lo mismo que hace `openSection` cuando se
   * entra por la zona. Sirve para aislar la parte 3D del efecto; para el
   * síntoma completo tal y como lo ve el jugador (panel entrando y saliendo,
   * con su DOM y sus animaciones) hay que hacerlo a mano: abrir una sección,
   * cerrar y medir con `__court.sondear('...')`.
   */
  async function diagnosticar(porVista = 3000): Promise<Sonda[]> {
    const id = SECTION_IDS[0]!;
    const salida: Sonda[] = [];
    const rotYAntes = rotY;
    salida.push(await sondear('1 · juego (con lo que haya caliente)', porVista));
    encuadrar(id);
    salida.push(await sondear(`2 · cámara en ${id}`, porVista));
    sectionCam = null;
    rotY = rotYAntes;
    updateCamera(0, true);
    salida.push(await sondear('3 · juego otra vez (tras cerrar)', porVista));
    console.table(salida);
    console.info(
      '[diagnosticar] Si la fila 2 queda con `nuevos > 0` y peor mediana que la 1 y la 3, ' +
        'la culpa es la compilación perezosa de programas y la precompilación de la carga la paga antes.',
    );
    return salida;
  }

  // Ganchos de depuración SOLO en desarrollo: Vite los elimina del build.
  // Sirven para medir la escena desde la consola sin abrir el código.
  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>).__court = {
      scene,
      camera,
      renderer,
      rings,
      ZONES,
      /** Repite el fundido de mallas estáticas (ya no encuentra nada después). */
      batch: mergeStaticLots,
      /**
       * Estado del MATE EN CARRERA (lote B).
       *
       * `ritmo` es la velocidad de entrada con la que se decide (ver
       * `DUNK_RUN_MIN`), `t`/`altura` son la animación y `x/z/y` la posición real
       * del jugador: con las cinco cifras se puede comprobar en vivo que el mate
       * sólo sale corriendo, que el cuerpo llega al aro y que vuelve al suelo.
       */
      mate: () => ({
        activo: dunk.activo,
        t: +dunk.t.toFixed(3),
        altura: +dunkY(dunk).toFixed(3),
        ritmo: +ritmoBruto.toFixed(2),
        lado: dunk.side,
        x: +pos.x.toFixed(2),
        z: +pos.z.toFixed(2),
        y: +pos.y.toFixed(2),
        sacudida: +shake.toFixed(3),
      }),
      /**
       * Coloca al jugador donde se pida, o devuelve dónde está (sólo DEV).
       *
       * Con `freeze` no basta: un bloqueo de input se comprueba EMPEZANDO en un
       * sitio concreto (a 5 m del aro, corriendo hacia él), y llegar hasta ahí a
       * mano depende del encuadre, de las colisiones y de la suerte. Siendo un
       * gancho de desarrollo no entra en el bundle.
       */
      jugador: (x?: number, z?: number) => {
        if (typeof x === 'number' && typeof z === 'number') {
          pos.set(x, 0, z);
        }
        return { x: +pos.x.toFixed(2), y: +pos.y.toFixed(2), z: +pos.z.toFixed(2) };
      },
      /**
       * Estado del CONCURSO DE TRIPLES (lote B), para comprobarlo en vivo.
       */
      concurso: () => ({
        activo: concurso.activo,
        t: +concurso.t.toFixed(1),
        puntos: concurso.puntos,
        carro: concurso.carro,
        balones: concurso.balones,
        tiros: concurso.tiros,
        aciertos: concurso.aciertos,
        esperando: concurso.esperando,
        reloj: concurso.reloj,
        dinero: concurso.dinero,
        mejor: mejorConcurso,
        fin: concurso.fin,
      }),
      /**
       * Estado del RECORRIDO del concurso (lote B): si está a la vista, cómo va la
       * aparición y cuántos balones le quedan a cada carro, contados en el mundo
       * (mallas visibles) y no en el estado. Es lo que permite comprobar en vivo
       * que la pista arranca limpia, que los cuatro puestos aparecen al convocar y
       * que se van al terminar (y que el carrito se recarga).
       */
      puestos: () => ({
        carrito: carrito.group.visible,
        carros: carros[0]!.group.visible,
        aparicion: +puestosT.toFixed(2),
        escala: +carros[0]!.group.scale.y.toFixed(2),
        balones: puestos.map((p) => p.balls.filter((b) => b.visible).length),
        anillos: ringsPuestos.filter((r) => r.visible).length,
        manchas: marcasPuestos.filter((m) => m.visible).length,
      }),
      /** Convoca el concurso desde la consola (sólo DEV). */
      convocar: () => {
        convocarConcurso();
        return true;
      },
      /** Balón: posición y estado, para no tener que adivinar dónde está. */
      balon: () => ({
        x: +ball.pos.x.toFixed(2),
        y: +ball.pos.y.toFixed(2),
        z: +ball.pos.z.toFixed(2),
        estado: ball.state,
        encestado: ball.scored,
      }),
      /** Estado de la calidad adaptativa (escala, ventana de intervalos, coste). */
      calidad: () => ({
        escala: pixelRatio,
        max: ESCALA_MAX,
        min: ESCALA_MIN,
        techoFallido,
        techoPermitido: Math.min(ESCALA_MAX, techoFallido),
        reintentos,
        fallosConsec,
        fallosNecesarios: FALLOS_NECESARIOS,
        ventana: hist.length,
        medianaMs: +medianaMs.toFixed(1),
        p95Ms: +percentilOrdenado(hist, 0.95).toFixed(1),
        costeMs: +costeRender.toFixed(1),
        costeEscala: escalaMedida,
        desdeCoste,
        estableSeg: +estableSeg.toFixed(1),
      }),
      /**
       * Mide el coste real de un fotograma (render + flush) sin tocar la escena.
       *
       * Drena ANTES de arrancar el reloj, igual que el bucle: si no, el
       * `readPixels` final se tragaría también la cola pendiente y el número
       * sería el de la carga, no el del fotograma.
       */
      costeRender(): number {
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        const t0 = performance.now();
        renderer.render(scene, camera);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        return +(performance.now() - t0).toFixed(2);
      },
      /*
       * Programas de shader enlazados hasta ahora. SÓLE crece mientras juegas:
       * si sube entre dos medidas, es que algo está pagando su primera vez ahí.
       */
      programas,
      /**
       * Mediana y p95 de los intervalos de fotograma durante `ms` (3 s por
       * defecto), con los programas contados antes y después. Un clic.
       */
      sondear: (momento = 'libre', ms?: number) => sondear(momento, ms),
      /** Las TRES medidas del síntoma en una tabla: juego → sección → juego. */
      diagnosticar,
      /**
       * Vuelve a pagar la precompilación de la carga desde la consola.
       *
       * Devuelve los milisegundos de las SIETE vistas con la caché ya llena:
       * el trabajo de Three son siete recorridos de escena y siete `getProgram`
       * que aciertan en la caché. Ese es el techo del coste por vista, y es la
       * referencia para decidir si el arreglo cabe en la carga —tiene que
       * caber: es una fracción de fotograma, no un fotograma entero—. Con
       * `?noprewarm=1` se ve además el coste de cada vista por separado.
       */
      precalentar: async (): Promise<number> => {
        const t0 = performance.now();
        await precargaShaders();
        return +(performance.now() - t0).toFixed(1);
      },
      /**
       * Inventario de texturas que la escena puede dibujar, con su tamaño.
       *
       * Es el punto de partida de la pregunta "¿se sube todo?": si mañana se
       * añade una textura a un constructor, sale aquí sin haber que tocar esta
       * lista (la lista no existe: se recoge de los materiales).
       */
      texturas: (): { nombre: string; tipo: THREE.TextureDataType; px: number; w: number; h: number }[] =>
        texturasDe(scene).map((t) => {
          const img = t.image as { width?: number; height?: number } | undefined;
          return {
            nombre: t.name || '(sin nombre)',
            tipo: t.type,
            px: pixeles(t),
            w: img?.width ?? 0,
            h: img?.height ?? 0,
          };
        }),
      /**
       * Vuelve a subir TODAS las texturas y mide cuánto cuesta.
       *
       * Necesita `t.needsUpdate = true`: con la textura ya subida, `initTexture`
       * no hace nada y la medida saldría en 0. Con eso sí se mide el trabajo real
       * de `texImage2D` + `generateMipmap`, que es el que la precarga de la
       * carga paga por adelantado. Es la cifra que hace falta para responder a si
       * el paseo de texturas se paga con creces (y para compararla contra lo que
       * cuesta el horneado de sombras, que es su hermano).
       */
      precalentarTexturas: async (): Promise<number> => {
        for (const t of texturasDe(scene)) t.needsUpdate = true;
        const t0 = performance.now();
        await precargaTexturas();
        return +(performance.now() - t0).toFixed(1);
      },
      /**
       * Coste de UNA llamada a `hud.layoutLabels`: seis lecturas de `offsetWidth`
       * que llegan tras las escrituras de estilo del mismo fotograma, o sea el
       * reflow forzado que el HUD paga en cada uno.
       *
       * Se mide en bucle contra el estado de régimen (rótulos ya colocados); la
       * primera pasada se tira, porque ahí además hay que resolver estilo por
       * primera vez.
       *
       * NO MEDIDO en esta sesión (sin shell): el número sale al llamarlo. Lo que
       * sí queda verificado leyendo `ui/hud.ts` es que dentro de la llamada la
       * lectura y la escritura van en dos pasadas separadas, así que el coste es
       * UN reflow forzado por fotograma y no dos: `placeLabel` escribe estilo y
       * `layoutLabels` lee, en ese orden y en el mismo fotograma. Cualquier
       * segundo reflow tendría que venir de otra escritura entre medias
       * (`hud.showMeter`, `hud.setPrompt`, `hideLabel`) y eso no se puede
       * confirmar sin medir.
       */
      reflowLabels(n = 30): number {
        const w = window.innerWidth;
        const h = window.innerHeight;
        hud.layoutLabels(w, h); // calentar: fuera de la medida
        const t0 = performance.now();
        for (let i = 0; i < n; i++) hud.layoutLabels(w, h);
        const ms = (performance.now() - t0) / n;
        console.info(`[reflow] layoutLabels: ${ms.toFixed(3)} ms por llamada · ${n} llamadas · ${ZONES.length} rótulos`);
        return +ms.toFixed(3);
      },
      /**
       * Cuenta llamadas de dibujo y triángulos de un fotograma con un contador a
       * nivel de WebGL, y de paso de qué vistas se pide.
       *
       * Se cuenta en el contexto y NO con `renderer.info` porque en Three.js
       * `info.reset()` va después de `shadowMap.render()`: el pase de sombras no
       * aparece nunca en `info`. Aquí el pase de sombras es la diferencia entre un
       * render que lo pide (`needsUpdate`) y uno normal, que con
       * `autoUpdate = false` sólo dibuja el visible.
       */
      draws(views: SectionId[] = []): Record<string, [number, number]> {
        type Ctx = WebGL2RenderingContext & { __m?: { n: number; t: number } };
        const g = renderer.getContext() as Ctx;
        if (!g.__m) {
          g.__m = { n: 0, t: 0 };
          const spec: Record<string, (a: unknown[]) => number> = {
            drawElements: (a) => a[1] as number,
            drawArrays: (a) => a[2] as number,
            drawElementsInstanced: (a) => (a[1] as number) * (a[4] as number),
            drawArraysInstanced: (a) => (a[2] as number) * (a[4] as number),
          };
          for (const f of Object.keys(spec)) {
            const orig = (g as unknown as Record<string, (...a: unknown[]) => unknown>)[f]!.bind(g);
            (g as unknown as Record<string, unknown>)[f] = (...a: unknown[]) => {
              const m = g.__m!;
              m.n++;
              if (a[0] === g.TRIANGLES) m.t += spec[f]!(a);
              return orig(...a);
            };
          }
        }
        const one = (shadow: boolean): [number, number] => {
          g.__m!.n = 0;
          g.__m!.t = 0;
          if (shadow) renderer.shadowMap.needsUpdate = true;
          renderer.render(scene, camera);
          return [g.__m!.n, Math.round(g.__m!.t / 3)];
        };
        const visible = one(false);
        const bake = one(true);
        const out: Record<string, [number, number]> = {
          visible,
          sombras: [bake[0] - visible[0], bake[1] - visible[1]],
        };
        for (const v of views) {
          sectionCam = v;
          rotY = SECTION_CAMERA[v].face;
          updateCamera(0, true);
          out[v] = one(false);
        }
        return out;
      },
      /** Re-hornea el mapa de sombras tras tocar luces o proyectantes. */
      bakeShadows,
      /** Congela el objetivo de cámara para poder encuadrar a mano desde la consola. */
      get freeze() { return dbg.freeze; },
      set freeze(v: boolean) { dbg.freeze = v; },
      /**
       * Distancia al primer obstáculo en la recta entre dos puntos, o
       * `Infinity` si no hay nada en medio.
       *
       * Colocar un encuadre a ojo falla: un plano puede quedar clavado detrás
       * de una pared sin que se note hasta que se mira la captura. Con esto se
       * comprueba antes, y el encuadre se elige entre los que tienen la línea
       * de visión limpia en lugar de adivinarlo.
       */
      clearShot(from: number[], to: number[]): number {
        const dir = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
        const len = dir.length();
        if (len < 0.01) return Infinity;
        dir.divideScalar(len);
        const ray = new THREE.Raycaster(
          new THREE.Vector3(from[0], from[1], from[2]),
          dir,
          0.05,
          len - 0.35, // no contar el propio suelo del punto de mira
        );
        const hits = ray.intersectObjects(scene.children, true);
        return hits.length > 0 ? hits[0].distance : Infinity;
      },
      /** Abre una sección como si el jugador hubiera entrado en su zona. */
      openSection(id: SectionId, fromZone = true) {
        openSection(id, fromZone);
      },
      /** Encuadra una sección sin abrir su panel y sin mover al jugador (ver `encuadrar`). */
      previewSection: encuadrar,
    };
  }
  return {
    /*
     * CINEMÁTICA DE LA PUERTA DE IDIOMA.
     *
     * Hermano de `start()` con la misma carga útil y un objetivo distinto: deja la
     * escena girando detrás del selector en vez de esperar a que elijes idioma.
     *
     * Lo que NO hace, y es lo importante:
     *   · no desbloquea el audio (`sfx.unlock()`) — todavía nadie ha pedido sonido;
     *   · no pone `mode` en `play`, así que `update()` se queda fuera del juego y
     *     el input sigue apagado (`setMode` sólo lo habilita en `play`);
     *   · no avisa de bienvenida, porque aún no se sabe en qué idioma.
     *
     * El reloj arranca aquí y NO se reinicia en `start()`: si arrancara dos
     * veces, las animaciones que dependen de `clock.elapsedTime` darían un salto
     * al entrar, y el salto se vería justo en el momento en que el jugador cree
     * que el juego acaba de empezar.
     */
    beginAttract() {
      setMode('attract');
      updateCamera(0, true);
      clock.start();
      pedirBucle();
    },
    start() {
      /*
       * Si la escena ya estaba girando en la cinemática, `start()` NO vuelve a
       * arrancar el reloj: `clock.start()` pone el tiempo a cero y las animaciones
       * darían un salto justo en la transición, que es el peor sitio posible.
       * `updateCamera(0, true)` sí se repite: encuadra de golpe el plano de
       * juego en vez de tener que esperar a que el lerp llegue.
       */
      /*
       * El reloj NO se reinicia si ya venía corriendo: `clock.start()` pone el
       * tiempo a cero y las animaciones darían un salto justo en la transición de
       * la cinemática al juego, que es el peor sitio posible. Preguntamos al
       * reloj en vez de suponer, para que entrar por `start()` sin haber pasado
       * por `beginAttract()` siga arrancando el tiempo como antes.
       */
      sfx.unlock();
      setMode('play');
      updateCamera(0, true);
      hud.toast(coarse ? t('welcome_touch') : t('welcome'), 6000);
      if (!clock.running) clock.start();
      pedirBucle();
    },
    dispose() {
      cancelAnimationFrame(raf);
      bucleActivo = false;
      fireTrail.dispose();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      input.dispose();
      /*
       * LIBERAR LA GPU, no sólo el contexto.
       *
       * `renderer.dispose()` suelta el contexto WebGL, pero las geometrías, los
       * materiales y las texturas siguen residentes en la memoria del driver hasta
       * que se llaman sus `dispose()`. Hoy eso no se ve: este `dispose()` no lo
       * llama nadie —`boot.ts` lo usa como contrato y el respaldo sin WebGL2 se
       * va con `location.replace`—, así que NO es una medida. Es dejar el
       * contrato completo para el día que haya un remontaje (cambio de idioma en
       * caliente, una segunda partida, un HMR de Vite).
       *
       * Geometrías, materiales y texturas se comparten entre mallas (los lotes del
       * fundido, `VOXEL_MATERIAL`, la mancha de contacto), así que algunos
       * `dispose()` se llaman más de una vez: es inocuo en Three —cada uno sólo
       * emite su evento— y recorrer el grafo entero cuesta menos que llevar la
       * cuenta. Lo que NO se alcanza son las texturas que vivan dentro de
       * `material.uniforms`: en este proyecto los uniformes propios son sólo
       * escalares (el balanceo del público, la onda de la red), así que no queda
       * nada fuera; si algún día un material trae textura en un uniforme, esto
       * hay que ampliarlo a mano.
       */
      scene.traverse((o) => {
        const malla = o as THREE.Mesh;
        if (!malla.isMesh) return;
        malla.geometry.dispose();
        const mats = Array.isArray(malla.material) ? malla.material : [malla.material];
        for (const mat of mats) {
          if (!mat) continue;
          for (const valor of Object.values(mat as unknown as Record<string, unknown>)) {
            if (valor && (valor as THREE.Texture).isTexture) (valor as THREE.Texture).dispose();
          }
          mat.dispose();
        }
      });
      renderer.dispose();
    },
  };
}

