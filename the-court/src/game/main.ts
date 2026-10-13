import * as THREE from 'three';
import { content, type SectionId } from '../data/content';
import { t } from '../i18n';
import { Hud } from '../ui/hud';
import { PanelManager, sectionKey, signKey, statsSource } from '../ui/panels';
import { Sfx } from './audio';
import { Ball } from './ball';
import { buildCourt, buildCourtLines, buildScoreboard } from './builders/court';
import { animateHuman, buildHuman, poseCelebrate, poseShoot } from './builders/human';
import { batchStaticMeshes } from './builders/batch';
import { NET, buildBench, buildHoop, buildScorerTable, buildTunnel, buildZoneRing, createBallMesh } from './builders/props';
import { PLAYER_RADIUS, buildColliders, resolveCircle } from './collide';
import { loadModel, normalize } from './assets';
import { VOXEL_MATERIAL, canvasTexture, noCastShadow } from './builders/util';
import { buildInterviewSet } from './builders/tv';
import {
  BALL, CAMERA,
  SECTION_CAMERA, HAND_SWITCH_ANGLE, INTERVIEW, PLAYER, RIM, SECTION_IDS, SHOOT_RANGE,
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
   *  · **Luz muy uniforme**: los cuatro focos de esquina cruzan la pista en
   *    diagonal y rellenan lo que el central deja a oscuras.
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
   * Intensidad 2,0, medida y no a ojo: a 2,9 el suelo se quemaba (el tonemapping
   * comprime las altas luces y el parqué #d9a05b acababa al mismo valor que las
   * líneas #fdf6e8, así que la pista se leía como una mancha beis sin dibujo).
   * Con 24° de sesgo el suelo recibe el 91 % de la luz de antes, así que se sube
   * de 1,9 a 2,0 para dejarlo igual de brillante.
   */
  const ceiling = new THREE.DirectionalLight(0xfff2dc, 2.0);
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
  // Bajada de 0,55 a 0,38: con el foco clave ya sesgado, la hemisférica alta
  // planchaba las sombras que se acaban de recuperar.
  const hemi = new THREE.HemisphereLight(0xfff4d6, 0x3a4668, 0.38);
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
  const scoreboard = buildScoreboard();
  scene.add(hoopL, hoopR, benchProp, tunnelProp, scorerTable, scoreboard);
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
      rim: () => sfx.rim(),
      board: () => sfx.board(),
      bounce: (v) => sfx.bounce(v),
    },
    // Los volúmenes de la pista: el balón rebota en las vallas, el banquillo, la
    // mesa y los postes en vez de atravesarlos.
    solids,
  );

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
  scene.add(playerBlob, ballBlob);

  /*
   * Redes del aro: la sacudida al entrar el balón.
   *
   * Amplitud 1 al anotar y decae en medio segundo; el tiempo lo pone el reloj de
   * la escena. Con `prefers-reduced-motion` el reloj vale 0, así que la red se
   * queda quieta sin necesidad de una rama aparte.
   */
  let netAmp = 0;
  const shakeNet = (): void => {
    netAmp = 1;
    NET.amp.value = 1;
  };

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
    // El «golpe» de la canasta: media décima de segundo de sacudida.
    shake = SHAKE_TIME;
    const crowdFx2 = courtGroup.userData.crowdFx as { wave: { value: number }; jump: { value: number } } | undefined;
    if (crowdFx2) {
      crowdFx2.jump.value = 1;
      crowdFx2.wave.value = 0;
    }
    missStreak = 0;
    stats.made++;
    saveStats(stats);
    hud.setRecord(stats.made, stats.attempted);
    scoreboard.setScore(stats.made, stats.attempted);

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
    refreshMenu();
    sfx.cheer();
    hud.toast(`${t('unlocked')}: ${t(sectionKey(zone.id))}`, 3000);
    window.setTimeout(() => mode === 'play' && openSection(zone.id, false), 1300);
  }

  function shoot(meter: number): void {
    stats.attempted++;
    saveStats(stats);
    hud.setRecord(stats.made, stats.attempted);
    scoreboard.setScore(stats.made, stats.attempted);
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

  /*
   * Estado de la cámara y del aterrizaje (fases B y C).
   *
   *  · `advX/advZ`: dirección de marcha suavizada, para el adelanto del encuadre.
   *  · `zoomNow`: acercamiento al cargar el tiro (1 = sin acercar).
   *  · `shake`: tiempo que le queda a la sacudida de la canasta.
   *  · `land`: 1 justo al tocar suelo y baja a 0 en un cuarto de segundo.
   */
  const SHAKE_TIME = 0.15;
  let advX = 0;
  let advZ = 0;
  let advTargetX = 0;
  let advTargetZ = 0;
  let zoomNow = 1;
  let shake = 0;
  let camTime = 0;
  let land = 0;
  let wasGrounded = true;

  function updateCamera(dt: number, snap = false): void {
    if (import.meta.env.DEV && dbg.freeze) return;
    const sec = sectionCam ? SECTION_CAMERA[sectionCam] : null;
    if (sec) {
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
     * SACUDIDA de la canasta (fase C): 0,15 s de ±2,2 cm. Tres senos de
     * frecuencias distintas y desfasadas para que el temblor no se lea como un
     * vaivén en una sola dirección, y con la amplitud cayendo a cero, que es lo
     * que lo hace parecer un golpe y no un terremoto.
     */
    if (shake > 0 && !reduced) {
      shake = Math.max(0, shake - dt);
      const a = 0.022 * (shake / SHAKE_TIME);
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
   */
  const ESCALA_MAX = pixelRatio;
  const ESCALA_MIN = 0.7;
  let techoFallido = ESCALA_MAX; // la mayor escala que NO dio 60 fps: no se reintenta
  let hist: number[] = [];
  let medianaMs = 0; // última mediana calculada (0 = aún sin ventana llena)
  let costeRender = -1; // ms del último fotograma medido con flush
  let desdeCoste = 0;
  let subiendo = 0;
  const pixel = new Uint8Array(4);

  function mediana(a: number[]): number {
    const s = [...a].sort((x, y) => x - y);
    return s[s.length >> 1]!;
  }

  /** Ajusta la escala de render según lo medido. Devuelve si ha cambiado. */
  /*
   * ARRANQUE: los primeros fotogramas NO cuentan.
   *
   * Compilar los shaders y hornear el mapa de sombras se lleva un fotograma de
   * decenas de milisegundos, y con la ventana de 30 ese pico entraba en la
   * mediana y bajaba la escala a 0,7 nada más cargar, sin que el juego fuera
   * lento (medido: 102 ms en el primer fotograma, 20 ms después). Se ignoran los
   * 45 primeros, que es lo que tarda la escena en quedarse en régimen.
   */
  let frames = 0;

  /** Ajusta la escala de render según lo medido. Devuelve si ha cambiado. */
  function calidad(inter: number, coste: number): boolean {
    if (++frames < 45) return false;
    hist.push(inter);
    if (hist.length < 30) return false;
    const m = mediana(hist);
    medianaMs = m;
    hist = hist.slice(-20); // media ventana, así reacciona al cambio sin oscilar
    if (m > 19) {
      subiendo = 0;
      // El umbral es el PRESUPUESTO del fotograma (16,7 ms) y no un valor bajo:
      // un coste de 14 ms cabe en 60 fps, y bajar resolución ahí sólo emborrona.
      if (coste > 15 && pixelRatio > ESCALA_MIN + 0.001) {
        techoFallido = Math.min(techoFallido, pixelRatio);
        pixelRatio = Math.max(ESCALA_MIN, +(pixelRatio - 0.1).toFixed(2));
        hist = [];
        console.info(`[calidad] fotograma ${m.toFixed(1)} ms con coste ${coste.toFixed(1)} ms -> escala ${pixelRatio}`);
        return true;
      }
      return false;
    }
    // Con 60 fps de verdad (16,7 ms) y margen, se recupera resolución: despacio y
    // sin volver a pisar la escala que ya falló.
    if (m <= 17.5 && pixelRatio < Math.min(techoFallido - 0.05, ESCALA_MAX)) {
      if (++subiendo >= 90) {
        subiendo = 0;
        pixelRatio = Math.min(techoFallido - 0.05, ESCALA_MAX, +(pixelRatio + 0.1).toFixed(2));
        hist = [];
        console.info(`[calidad] 60 fps con coste ${coste.toFixed(1)} ms -> escala ${pixelRatio}`);
        return true;
      }
    } else subiendo = 0;
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
    const grounded = stepJump(jump, dt);
    pos.y = jump.y;

    /*
     * ATERRIZAJE (fase B): flexión de rodillas brevisima al tocar suelo.
     *
     * El salto del tiro bajaba y se plantaba de golpe, como un ascensor. Con el
     * aviso de aterrizaje el cuerpo se hunde 12 cm mientras flexiona y vuelve en
     * un cuarto de segundo, que es lo que hace un jugador de verdad al caer.
     */
    if (grounded && !wasGrounded) land = 1;
    wasGrounded = grounded;
    if (land > 0) land = Math.max(0, land - dt * 4.5);

    animateHuman(player, animTime, speed01, ball.state === 'held' && !charging, grounded, land);
    if (charging) poseShoot(player, Math.min(chargeT / CHARGE_FULL, 1));
    if (flick > 0) {
      flick -= dt;
      poseShoot(player, 1);
    }
    if (celebrate > 0) {
      celebrate -= dt;
      poseCelebrate(player, animTime, Math.min(celebrate / 1.6, 1));
    }

    // Balón (el bote va sincronizado con la zancada: mismo reloj).
    if (ball.state === 'held') placeHeldBall(animTime, speed01);
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

    // Redes del aro: la onda baja mientras haya algo que contar.
    NET.time.value = time;
    if (netAmp > 0) {
      netAmp = Math.max(0, netAmp - dt * 2.2);
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
     * El coste se mide SÓLO cuando el intervalo ya no cabe y como mucho cada 120
     * fotogramas: el `readPixels` fuerza el flush y eso alarga ese fotograma, así
     * que no se paga cuando todo va bien ni se paga en cada comprobación.
     */
    desdeCoste++;
    // `medianaMs` y no `hist.length`: la ventana se recorta a 20 dentro de
    // `calidad`, así que comprobar el tamaño aquí dejaría la medida de coste sin
    // disparar nunca (era el fallo de la primera versión).
    const medir = medianaMs > 19 && (desdeCoste >= 120 || costeRender < 0);
    const t0 = medir ? performance.now() : 0;
    renderer.render(scene, camera);
    if (medir) {
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      costeRender = performance.now() - t0;
      desdeCoste = 0;
    }
    if (calidad(dt * 1000, costeRender)) resize();
  }

  const onVisibility = (): void => {
    if (document.hidden) cancelAnimationFrame(raf);
    else {
      clock.getDelta();
      raf = requestAnimationFrame(frame);
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
   * geometría y se funden por estado de sombras y celda de 24 m. Se deja FUERA
   * todo lo que se mueve (jugador, balón y los dos actores del plató) porque su
   * sombra se hornearía congelada y porque su pose cambia cada fotograma.
   *
   * Va en una función con nombre, y no suelto aquí, para poder repetirla desde el
   * gancho de desarrollo: así se puede comparar el fotograma fundido con el de
   * antes SIN recargar y sin depender de dos cargas distintas (que es la única
   * forma de que la comparación de píxeles sea concluyente).
   */
  const BATCH_CELL = 24;
  /** El `cell` es un parámetro —y no la constante— para poder barrerlo desde el gancho de
   * desarrollo: 24 m da 6 lotes y +18 % de triángulos en la vista de juego; menos celda son
   * más llamadas y menos triángulos. Ver BITACORA §3l. */
  function mergeStaticLots(cell = BATCH_CELL): void {
    const b = batchStaticMeshes(
      scene,
      [courtGroup, hoopL, hoopR, benchProp, tunnelProp, scorerTable, set.group, scoreboard],
      {
        material: VOXEL_MATERIAL,
        cell,
        // Las redes del aro NO están en esta lista porque no hace falta: usan su
        // propio material (el de la ondulación), y el fundido sólo toca las mallas
        // que comparten `VOXEL_MATERIAL`. Es decir, quedan sueltas y animables, que
        // es justo lo que se quiere: son las únicas piezas de la canasta con
        // movimiento propio. Los cuatro que sí hay que excluir son los rigs, que
        // comparten material con el mundo y cambian de pose cada fotograma.
        exclude: [player.root, ballMesh, set.reporter.root, set.operator.root],
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
  if (!(import.meta.env.DEV && new URLSearchParams(location.search).has('nobatch'))) mergeStaticLots();

  bakeShadows();
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
      /** Repite el fundido de mallas estáticas (ya no encuentra nada después). */
      batch: mergeStaticLots,
      /** Estado de la calidad adaptativa (escala, ventana de intervalos, coste). */
      calidad: () => ({
        escala: pixelRatio,
        max: ESCALA_MAX,
        min: ESCALA_MIN,
        techoFallido,
        ventana: hist.length,
        medianaMs: +medianaMs.toFixed(1),
        costeMs: +costeRender.toFixed(1),
        desdeCoste,
      }),
      /** Mide el coste real de un fotograma (render + flush) sin tocar la escena. */
      costeRender(): number {
        const t0 = performance.now();
        renderer.render(scene, camera);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        return +(performance.now() - t0).toFixed(2);
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

