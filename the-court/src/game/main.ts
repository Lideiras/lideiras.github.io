import * as THREE from 'three';
import { content, type SectionId } from '../data/content';
import { t } from '../i18n';
import { Hud } from '../ui/hud';
import { PanelManager, sectionKey, signKey, statsSource } from '../ui/panels';
import { Sfx } from './audio';
import { Ball } from './ball';
import { buildCourt, buildCourtLines } from './builders/court';
import { animateHuman, buildHuman, poseCelebrate, poseShoot } from './builders/human';
import { buildBench, buildHoop, buildScorerTable, buildTunnel, buildZoneRing, createBallMesh } from './builders/props';
import { loadModel, normalize } from './assets';
import { PALETTE, VoxelWorld } from './builders/util';
import { voxelizeMesh } from './builders/voxelize';
import { buildInterviewSet } from './builders/tv';
import {
  BALL, CAMERA,
  SECTION_CAMERA, COURT, HAND_SWITCH_ANGLE, INTERVIEW, PLAYER, RIM, SECTION_IDS, SHOOT_RANGE,
  ZONES, rimX, type Side, type Zone,
} from './config';
import { Input } from './input';
import { launchJump, newJump, stepJump } from './jump';
import { applyShotError, difficultyAt, evaluateMeter, meterAt, solveShot, sweetCenterAt, sweetSpotAt } from './shot';

type Mode = 'play' | 'panel' | 'interview';
export interface GameHandle { start(): void; dispose(): void }

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
const nextFrame = (): Promise<void> => new Promise((r) => requestAnimationFrame(() => r()));

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

export async function createGame(opts: { canvas: HTMLCanvasElement; onProgress: (p: number) => void }): Promise<GameHandle> {
  const { canvas, onProgress } = opts;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

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
  await document.fonts.load('48px "Bebas Neue"').catch(() => undefined);

  // ───────── Renderer, escena, cámara, luces
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  let pixelRatio = Math.min(window.devicePixelRatio, coarse ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
   *  · **Las sombras caen RECTAS hacia abajo**, porque el foco que las proyecta
   *    está en la vertical. Al aire libre el sol las proyecta de lado, y ese
   *    sesgo es lo que delataba el exterior.
   *  · **Luz muy uniforme**: los cuatro focos de esquina cruzan la pista en
   *    diagonal y rellenan lo que el central deja a oscuras.
   *  · **Tono cálido** de halogenuro metálico (ámbar pálido), no el azul del
   *    cielo.
   */

  // Foco central de techo. Es el ÚNICO que proyecta sombras: un solo mapa de
  // sombras bien ajustado cuesta mucho menos que cuatro, y como la luz es
  // vertical las sombras no se cruzan entre sí.
  // Intensidad calibrada contra una medición, no a ojo.
  //
  // A 2,9 el suelo se quemaba: el tono comprime las altas luces y el parqué
  // (#d9a05b) y las líneas (#fdf6e8) acababan en el mismo valor, con lo que la
  // pista se leía como una mancha beis sin dibujo. Bajado a 1,9 el suelo deja
  // de saturar y las líneas vuelven a separarse.
  const ceiling = new THREE.DirectionalLight(0xfff2dc, 1.9);
  ceiling.position.set(1.5, 42, 3);
  ceiling.castShadow = true;
  ceiling.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  Object.assign(ceiling.shadow.camera, { left: -24, right: 24, top: 20, bottom: -20, near: 5, far: 90 });
  ceiling.shadow.bias = -0.0004;
  // `normalBias` quita el patrón de tejas en superficies voxel: desplaza la
  // muestra a lo largo de la normal del bloque en vez de a lo largo del rayo.
  ceiling.shadow.normalBias = 0.06;
  scene.add(ceiling);

  // Cuatro baterías desde las torres de las esquinas, cruzando la pista en
  // diagonal. Sin sombras: ya las pone el foco central y cuatro mapas más
  // costarían carísimo. Aquí sólo aportan el relleno direccional del pabellón.
  const towers: THREE.DirectionalLight[] = [];
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const tower = new THREE.DirectionalLight(0xfff6e4, 0.7);
      tower.position.set(sx * 26, 15, sz * 18);
      tower.target.position.set(-sx * 5, 0, -sz * 2.5);
      scene.add(tower, tower.target);
      towers.push(tower);
    }
  }

  // Rebote cálido del parqué: el pabellón devuelve mucha luz del suelo, y sin
  // esto las caras inferiores de los modelos quedan muertas.
  const bounce = new THREE.DirectionalLight(0xffd9a8, 0.45);
  bounce.position.set(-6, -12, -4);
  scene.add(bounce);

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
   */
  const fill = new THREE.DirectionalLight(0xbfd4ff, 0.62);
  fill.position.set(10, 5, 18);
  scene.add(fill);

  // Hemisférica: el rebote difuso de gradas y parqué. Subida de 0,15 a 0,55.
  //
  // Sigue siendo baja para que el pabellón se lea como cubierto, pero a 0,15
  // las caras que no ven el techo quedaban planas y sin color.
  const hemi = new THREE.HemisphereLight(0xfff4d6, 0x3a4668, 0.55);
  scene.add(hemi);

  console.info(
    `[lights] PABELLON -> techo=${ceiling.intensity} (sombras ${ceiling.castShadow}) ` +
    `torres=${towers.length}x${towers[0]?.intensity} rebote=${bounce.intensity} ` +
    `relleno=${fill.intensity} hemisferica=${hemi.intensity} sol=ELIMINADO`,
  );
  onProgress(0.2);
  await nextFrame();

  // ───────── Assets .glb (con fallback procedural si no cargan)
  onProgress(0.3);
  const [ballGLB, courtGLB] = await Promise.all([
    loadModel('models/ball.glb'),
    loadModel('models/voxel-court.glb'),
  ]);
  console.info(`[court] glTF cargados: balon=${!!ballGLB} cancha=${!!courtGLB}`);
  if (ballGLB) normalize(ballGLB.scene, { targetSize: BALL.radius * BALL.visualScale * 2 });
  let courtFloorReady = false;
  if (courtGLB) {
    // La cancha descargada ES la pista del juego, y pasa por el voxelizador
    // igual que el resto del mundo.
    //
    // El modelo es voxel art de 0,1 m exactos (256 pasos de 0,1 medidos en sus
    // vertices), asi que rasterizar a 0,1 m reproduce su dibujo sin perdida.
    // Viene en Z-up: el giro va en un envoltorio para no pisar la transformada
    // propia del modelo, que los GLB de Sketchfab ya traen.
    const oriented = new THREE.Group();
    oriented.rotation.x = -Math.PI / 2;
    oriented.add(courtGLB.scene);
    oriented.updateMatrixWorld(true);

    // El suelo es la malla plana; su caja fija la escala y el centrado. Hay que
    // usar ESA malla y no la caja del modelo entero: el modelo incluye las
    // gradas (25,6 x 25,6 m) y centrar con ellas dejaria la pista descolgada.
    let floorMesh: THREE.Mesh | null = null;
    let thinnest = Infinity;
    oriented.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const b = new THREE.Box3().setFromObject(m);
      const th = b.max.y - b.min.y;
      if (th < thinnest) {
        thinnest = th;
        floorMesh = m;
      }
    });

    if (floorMesh) {
      // `attach` conserva la transformada de mundo al cambiar de padre, así que
      // el giro de Z-up y la escala propia del modelo ya vienen incluidos.
      //
      // La escala se aplica a un contenedor AISLADO con sólo esta malla, no al
      // grupo que envuelve el modelo entero: escalar el grupo padre dejaba las
      // coordenadas del mundo fuera de rango y el voxelizador descartaba las
      // 47.663 caras del suelo por coste.
      const holder = new THREE.Group();
      holder.attach(floorMesh);

      const fb = new THREE.Box3().setFromObject(holder);
      const fsize = fb.getSize(new THREE.Vector3());
      // Escalado en X/Z hasta que el suelo coincida con COURT (28 x 15 m): así
      // los aros en ±12.425 m caen donde espera la física del tiro. Es no
      // uniforme (el modelo mide 25,6 x 15,9), pero al ser una superficie plana
      // no deforma ningún volumen.
      holder.scale.set(COURT.length / fsize.x, 1, COURT.width / fsize.z);
      holder.updateMatrixWorld(true);

      const nb = new THREE.Box3().setFromObject(holder);
      const nc = nb.getCenter(new THREE.Vector3());
      holder.position.x -= nc.x;
      holder.position.z -= nc.z;
      holder.position.y -= nb.min.y;
      holder.updateMatrixWorld(true);

      const vw = new VoxelWorld(0.1);
      const celdas = voxelizeMesh(vw, floorMesh, { grid: 0.1, fallback: PALETTE.hardwood });

      // El suelo del modelo cubre el 94 % de su caja envolvente (medido sobre
      // sus triángulos): quedan franjas sin marcar, sobre todo en el borde, por
      // las que se ve el césped. Se rellenan con el color base para que la
      // pista sea una superficie continua en vez de una rejilla agujereada.
      const hx = Math.round(COURT.halfL / 0.1);
      const hz = Math.round(COURT.halfW / 0.1);
      for (let ix = -hx; ix < hx; ix++) {
        for (let iz = -hz; iz < hz; iz++) {
          if (!vw.occupied(ix, 0, iz)) vw.putCell(ix, 0, iz, PALETTE.hardwood);
        }
      }
      // UNA SOLA CAPA, garantizada. El voxelizador marca dos (el plano de la
      // cancha cae justo en el borde entre ellas) y las dos emitían su cara
      // superior: 80.397 quads donde sólo caben 42.000. Borrar sólo la capa -1
      // no bastaba; se vacía TODO lo que no sea la capa 0.
      vw.eraseCells(-hx - 4, -60, -hz - 4, hx + 3, -1, hz + 3);
      vw.eraseCells(-hx - 4, 1, -hz - 4, hx + 3, 60, hz + 3);

      if (celdas > 0) {
        // Solo la cara superior: es una superficie plana, el canto no se ve.
        const g = vw.build({ name: 'court-floor', flatTop: true, flatY: 0.002 });
        g.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh) m.castShadow = false;
        });
        scene.add(g);
        courtFloorReady = true;
        console.info(
          `[court] suelo del glTF voxelizado: ${celdas} celdas a 0,1 m, ` +
          `${vw.colorCount} colores de paleta`,
        );
      } else {
        console.warn('[court] el glTF no produjo voxels; se conserva el suelo procedural');
      }
    }
  }
  onProgress(0.45);
  await nextFrame();

  // ───────── Mundo
  const courtGroup = buildCourt(content.person.initials, renderer.capabilities.getMaxAnisotropy());
  scene.add(courtGroup);
  if (courtFloorReady) {
    // El suelo voxelizado del glTF hace de pista: se retira solo el suelo
    // procedural con sus lineas, que si no quedaria coplanar encima y
    // parpadearia (z-fighting). El terreno de alrededor SE MANTIENE: sin el la
    // pista se lee como una isla flotando en el cielo.
    const proceduralFloor = courtGroup.getObjectByName('floor');
    if (proceduralFloor) proceduralFloor.visible = false;
    // El suelo del modelo viene en dos tonos planos y sin marcaje (su paleta
    // solo usa dos colores en esa malla), asi que las lineas se dibujan ENCIMA
    // para que la pista se lea como una cancha de baloncesto.
    scene.add(buildCourtLines(content.person.initials, renderer.capabilities.getMaxAnisotropy()));
  }
  scene.add(buildHoop(-1), buildHoop(1), buildBench(), buildTunnel(), buildScorerTable());
  const set = buildInterviewSet();
  scene.add(set.group);

  const rings: THREE.Mesh[] = [];
  for (const z of ZONES) {
    // Antes se saltaban las zonas de tiro y la canasta de Projects se quedaba
    // sin su anillo naranja, mientras que la de Récord sí lo tenía. Las dos
    // canastas son zonas jugables y las dos lo llevan.
    const ring = buildZoneRing(z.x, z.z, z.radius);
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
  });
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
  scene.add(ballMesh);
  const ball = new Ball(ballMesh, {
    score: onScore,
    rim: () => sfx.rim(),
    board: () => sfx.board(),
    bounce: (v) => sfx.bounce(v),
  });

  // ───────── UI y estado
  const uiRoot = document.getElementById('ui')!;
  let mode: Mode = 'play';
  const visited = loadSet('court.visited');
  const unlocked = loadSet('court.unlocked');
  const stats = loadStats();
  statsSource.get = () => ({ ...stats, visited: visited.size, total: SECTION_IDS.length });
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
  if (coarse) hud.mountTouch(input);
  canvas.setAttribute('aria-label', t('aria_game'));
  window.addEventListener('langchange', () => canvas.setAttribute('aria-label', t('aria_game')));
  hud.setProgress(visited.size);
  hud.setRecord(stats.made, stats.attempted);

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
  let celebrate = 0; // segundos que dura la celebración tras anotar
  let flick = 0;
  let missStreak = 0;
  let mvpShown = false;

  function nearestSide(): Side {
    return Math.abs(pos.x - rimX(-1)) <= Math.abs(pos.x - rimX(1)) ? -1 : 1;
  }
  /** Zona que se desbloquea encestando en esa canasta. La derecha ya no la tiene. */
  const zoneFor = (side: Side): Zone | undefined => ZONES.find((z) => z.side === side);

  function markVisited(id: SectionId): void {
    visited.add(id);
    saveSet('court.visited', visited);
    hud.setProgress(visited.size);
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
    } else if (fromZone) {
      // El resto de secciones ya tienen al jugador encima (entró por la zona),
      // así que no hay que teletransportarlo: sólo orientarlo hacia el atrezo,
      // que es lo que hace que el plano sea el de alguien leyendo su rótulo.
      rotY = SECTION_CAMERA[id].face;
      player.root.rotation.y = rotY;
    }
    if (fromZone) {
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
    missStreak = 0;
    stats.made++;
    saveStats(stats);
    hud.setRecord(stats.made, stats.attempted);

    const zone = zoneFor(side);
    // La canasta derecha ya no desbloquea nada: solo suma al récord.
    if (!zone || zone.kind !== 'shoot') {
      hud.toast(t('shot_basket'));
      return;
    }
    if (unlocked.has(zone.id)) {
      hud.toast(t('shot_basket'));
      return;
    }
    unlocked.add(zone.id);
    saveSet('court.unlocked', unlocked);
    sfx.cheer();
    hud.toast(`${t('unlocked')}: ${t(sectionKey(zone.id))}`, 3000);
    window.setTimeout(() => mode === 'play' && openSection(zone.id, false), 1300);
  }

  function shoot(meter: number): void {
    stats.attempted++;
    saveStats(stats);
    hud.setRecord(stats.made, stats.attempted);
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
    flick = 0.35;
    // Salta DESPUÉS de solvear la trayectoria: como el tiro se solvea desde un
    // `y` fijo, el orden no altera el resultado, pero deja claro que el salto
    // es la reacción al gesto y no parte del cálculo de la bandeja.
    launchJump(jump);
    if (perfect) hud.toast(t('shot_perfect'), 1200);
  }

  const tmp = new THREE.Vector3();
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
       */
      const rebote = 0.16 + speed01 * 0.6;
      y = 0.14 + Math.abs(Math.sin(time * 11 + (handSide < 0 ? Math.PI : 0))) * rebote;
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
    ball.pos.set(x, y, z);
    ball.object.position.copy(ball.pos);
  }

  // ───────── Cámara
  const camGoal = new THREE.Vector3();
  const lookGoal = new THREE.Vector3();
  const lookNow = new THREE.Vector3();
  let dist = 1;
  function updateCamera(dt: number, snap = false): void {
    if (import.meta.env.DEV && dbg.freeze) return;
    const sec = sectionCam ? SECTION_CAMERA[sectionCam] : null;
    if (sec) {
      // Plano de sección: bajo, cercano y fijo. No se escala por `dist` (la
      // compensación de aspecto del plano de juego), porque aquí la distancia
      // a la sección es la que da el encuadre y no el formato de la pantalla.
      camGoal.set(...sec.pos);
      lookGoal.set(...sec.look);
    } else {
      const tx = clamp(pos.x, -CAMERA.clampX, CAMERA.clampX);
      const tz = clamp(pos.z, CAMERA.minZ, CAMERA.maxZ);
      lookGoal.set(tx, 0.8, tz);
      camGoal.set(tx + CAMERA.offset[0] * dist, CAMERA.offset[1] * dist, tz + CAMERA.offset[2] * dist);
    }
    const k = snap || reduced ? 1 : 1 - Math.exp(-CAMERA.lerp * dt);
    camera.position.lerp(camGoal, k);
    lookNow.lerp(lookGoal, k);
    camera.lookAt(lookNow);
  }

  function resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    dist = clamp(1.5 / camera.aspect, 1, 2.4); // en vertical se aleja para ver más cancha
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
  let raf = 0;
  let slowFrames = 0;

  function update(dt: number, time: number): void {
    const playing = mode === 'play';
    let speed01 = 0;   // valor suavizado, el que consume la animación
    let speedTarget = 0; // valor bruto de entrada

    if (playing) {
      const wants = input.shootHeld && ball.state === 'held';
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
          shoot(meterAt(chargeT));
          charging = false;
          hud.showMeter(null);
        }
      } else {
        const mv = input.move();
        const len = Math.hypot(mv.x, mv.z);
        if (len > 0.05) {
          const k = Math.min(1, len);
          const dx = mv.x / len;
          const dz = mv.z / len;
          pos.x = clamp(pos.x + dx * PLAYER.speed * k * dt, PLAYER.bounds.minX, PLAYER.bounds.maxX);
          pos.z = clamp(pos.z + dz * PLAYER.speed * k * dt, PLAYER.bounds.minZ, PLAYER.bounds.maxZ);
          rotY = lerpAngle(rotY, Math.atan2(dx, dz), 1 - Math.exp(-14 * dt));
          speedTarget = k;

          // ¿Ha girado? Almacenando el ángulo en el momento del cambio, y no en
          // cada fotograma, se evita el parpadeo: hace falta acumular otros 40°
          // para volver a cambiar, así que correr en arco no encadena cambios.
          const dirAngle = Math.atan2(dx, dz);
          const giro = Math.abs(wrapPi(dirAngle - lastDirAngle));
          if (giro > HAND_SWITCH_ANGLE) {
            handSide = handSide === 1 ? -1 : 1;
            lastDirAngle = dirAngle;
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

    // Salto. `grounded` sale de aquí porque la animación recoge las piernas al
    // estar en el aire, y antes nunca se pasaba: siempre `true`, así que la
    // pose de vuelo era código muerto.
    const grounded = stepJump(jump, dt);
    pos.y = jump.y;

    animateHuman(player, time, speed01, ball.state === 'held' && !charging, grounded);
    if (charging) poseShoot(player, Math.min(chargeT / CHARGE_FULL, 1));
    if (flick > 0) {
      flick -= dt;
      poseShoot(player, 1);
    }
    if (celebrate > 0) {
      celebrate -= dt;
      poseCelebrate(player, time, Math.min(celebrate / 1.6, 1));
    }

    // Balón
    if (ball.state === 'held') placeHeldBall(time, speed01);
    else {
      ball.step(dt);
      // RECOGIDA: si el jugador pasa por encima del balón, vuelve a las manos.
      // Antes sólo se recuperaba cuando el balón se detenía por completo, así
      // que un balón rodando por la pista se quedaba muerto hasta que paraba.
      const cerca = Math.hypot(pos.x - ball.pos.x, pos.z - ball.pos.z);
      if (cerca < 0.62 && ball.pos.y < 1.5) {
        ball.state = 'held';
        hud.setPrompt(null);
      } else if (ball.settled) {
        if (ball.scored) celebrate = 1.6;
        else missStreak++;
        ball.state = 'held';
      }
    }

    // Zonas, avisos e interacción
    let active: Zone | null = null;
    let best = Infinity;
    for (const z of ZONES) {
      const d = Math.hypot(pos.x - z.x, pos.z - z.z);
      const usable = z.kind !== 'shoot' || unlocked.has(z.id);
      if (playing && usable && d <= z.radius && d < best) {
        best = d;
        active = z;
      }
    }
    if (playing && active) {
      hud.setPrompt(`${coarse ? t('hint_interact_touch') : t('hint_interact')} · ${t(sectionKey(active.id))}`);
      if (input.consumeInteract()) openSection(active.id, true);
    } else {
      input.consumeInteract();
      const side = nearestSide();
      const shootZone = zoneFor(side);
      const near = Math.abs(pos.x - rimX(side)) <= SHOOT_RANGE && !!shootZone && !unlocked.has(shootZone.id);
      hud.setPrompt(playing && near && ball.state === 'held' && !charging ? (coarse ? t('hint_shoot_touch') : t('hint_shoot')) : null);
    }

    // Decorado vivo
    for (const r of rings) r.scale.setScalar(1 + Math.sin(time * 3) * 0.04);
    animateHuman(set.reporter, time, 0, false);
    animateHuman(set.operator, time, 0, false);
    set.reporter.armR.rotation.x = mode === 'interview' ? -1.45 : -1.15;
    set.tally.visible = mode === 'interview' || Math.floor(time * 1.5) % 2 === 0;
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
      if (!onScreen) {
        // Escala el punto hasta que toca el borde del rectángulo visible. El
        // 0,84 deja margen para que el rótulo y la flecha no se recorten.
        const k = Math.max(Math.abs(nx) / 0.84, Math.abs(ny) / 0.84) || 1;
        nx /= k;
        ny /= k;
      }

      hud.placeLabel(z.id, (nx * 0.5 + 0.5) * w, (-ny * 0.5 + 0.5) * h, onScreen, angle, dist);
      hud.setLabelLocked(z.id, z.kind === 'shoot' && !unlocked.has(z.id));
      if (mode === 'interview') hud.hideLabel(z.id, true);
    }
  }

  function frame(): void {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 1 / 20);
    update(dt, clock.elapsedTime);
    renderer.render(scene, camera);

    // Calidad adaptativa: si va lento, baja la resolución de render
    slowFrames = dt > 1 / 24 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (slowFrames > 90 && pixelRatio > 1) {
      pixelRatio = Math.max(1, pixelRatio - 0.25);
      slowFrames = 0;
      resize();
    }
  }

  const onVisibility = (): void => {
    if (document.hidden) cancelAnimationFrame(raf);
    else {
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  onProgress(1);
  // Ganchos de depuración SOLO en desarrollo: Vite los elimina del build.
  // Sirven para medir la escena desde la consola sin abrir el código.
  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>).__court = {
      scene,
      camera,
      renderer,
      rings,
      ZONES,
      /** Congela el objetivo de cámara para poder encuadrar a mano desde la consola. */
      get freeze() { return dbg.freeze; },
      set freeze(v: boolean) { dbg.freeze = v; },
      /**
       * Encuadra una sección sin abrir su panel y sin mover al jugador.
       *
       * Sirve para revisar los seis planos de una sentada: abrir la sección de
       * verdad obliga a caminar hasta ella, y con el renderizado por software
       * cada paso cuesta segundos.
       */
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
      previewSection(id: SectionId) {
        sectionCam = id;
        rotY = SECTION_CAMERA[id].face;
        updateCamera(0, true);
      },
    };
  }
  return {
    start() {
      sfx.unlock();
      setMode('play');
      updateCamera(0, true);
      hud.toast(coarse ? t('welcome_touch') : t('welcome'), 6000);
      clock.start();
      raf = requestAnimationFrame(frame);
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      input.dispose();
      renderer.dispose();
    },
  };
}

