import * as THREE from 'three';
import { COURT } from '../config';
import { CROWD_COLORS, VOXEL, canvasTexture, drawPixelText, mulberry32, noCastShadow, pixelTextWidth, voxelGroup } from './util';

const PPM = 80; // píxeles de textura por metro

/**
 * Parqué + zonas pintadas + marca central.
 * Las LÍNEAS no se dibujan en la textura: se construyen con voxels
 * (ver buildCourtLines) para que se vean como bloques de verdad.
 */
/**
 * Parqué + zonas pintadas + LÍNEAS + marca central, todo en la textura.
 *
 * Las líneas se dibujan píxel a píxel con rectángulos enteros (nada de
 * `stroke`, que suavizaría). Van planas en el suelo a propósito: como voxels de
 * 6.25 cm se leen como una valla desde la cámara rasante.
 */
function drawFloor(g: CanvasRenderingContext2D, W: number, H: number, brand: string, linesOnly = false): void {
  // `brand` se conserva en la firma por compatibilidad, pero ya no se pinta.
  /*
   * SE PICA DOS VECES, Y SOLO UNA SE VE.
   *
   * `drawFloor` se usa para dos texturas: el parquet de la malla `floor` (y=0)
   * y la capa de líneas `courtLines` (y=0,004). Por encima de ambas hay una
   * cancha VOXEL opaca de 28 x 15 m en y=0,002, que es la que realmente se ve.
   *
   * Es decir: la textura del suelo está ENTERRADA. Pintar la zona ahí no hace
   * nada — se comprobó muestreando el píxel de la textura (salía el rojo
   * correcto) y mirando a la vez la pantalla, donde seguía el parqué tal cual.
   * Por eso la pintura va en la capa de líneas, que es la única visible.
   */
  if (!linesOnly) {
    // Parqué. Las juntas se dibujan tenues y espaciadas: con una línea fuerte
    // cada 25 cm el parquet entero parecía una reja de metal.
    g.fillStyle = '#d9a05b';
    g.fillRect(0, 0, W, H);
    const plank = PPM * 0.5;
    for (let i = 0, n = 0; i < W; i += plank, n++) {
      g.fillStyle = n % 2 ? 'rgba(150,90,35,0.16)' : 'rgba(255,232,170,0.20)';
      g.fillRect(i, 0, plank, H);
      g.fillStyle = 'rgba(120,70,25,0.16)';
      g.fillRect(i, 0, 1, H);
    }

    /*
     * La ZONA (el «paint» o «la zona de la canasta»): rectángulo de 4,9 m de
     * ancho por 5,8 m de largo pegado a cada línea de fondo.
     *
     * El ancho coincide con el de la línea de tiros libres que se dibuja
     * después (`-2.45 .. 2.45`), así que el color y el trazo encajan exacto.
     * Lleva un marco propio más oscuro para que se lea como una superficie
     * pintada y no como una mancha: en una cancha real la zona está delimitada.
     */
  }

  paintKeys(g, W, H);
  drawLines(g);

  // La marca central con las iniciales se retiró: el propietario la veía como
  // un elemento ajeno sobre la pista y competía con las líneas reglamentarias.
  void brand;
}

/**
 * LA ZONA: el rectángulo de 4,9 x 5,8 m pegado a cada línea de fondo.
 *
 * El ancho coincide exactamente con el de la línea de tiros libres que dibuja
 * `drawLines` después (`-2.45 .. 2.45`), así que el color y el trazo encajan y
 * no se ve ni un píxel de parqué dentro. Lleva su propio marco más oscuro
 * porque en una cancha real la zona está delimitada, y sin borde un rectángulo
 * rojo sobre el parqué se lee como una mancha.
 */
function paintKeys(g: CanvasRenderingContext2D, W: number, H: number): void {
  const keyL = 5.8 * PPM;
  const keyW = 4.9 * PPM;
  for (const kx of [0, W - keyL]) {
    g.fillStyle = '#e0341f';
    g.fillRect(kx, H / 2 - keyW / 2, keyL, keyW);
    g.strokeStyle = '#8f1a0c';
    g.lineWidth = Math.max(2, 0.06 * PPM);
    g.strokeRect(kx, H / 2 - keyW / 2, keyL, keyW);
  }
}

/** Líneas de pista rasterizadas píxel a píxel sobre la textura. */
function drawLines(g: CanvasRenderingContext2D): void {
  const LW = Math.max(3, Math.round(0.05 * PPM));
  const toPx = (mx: number) => (mx + COURT.length / 2) * PPM;
  const toPy = (mz: number) => (mz + COURT.width / 2) * PPM;

  g.fillStyle = '#fdf6e8';
  const put = (mx: number, mz: number) => g.fillRect(Math.round(toPx(mx) - LW / 2), Math.round(toPy(mz) - LW / 2), LW, LW);

  /** Rectángulo hueco, saltando en pasos iguales al ancho del trazo. */
  const rectOutline = (x0: number, x1: number, z0: number, z1: number) => {
    const step = (LW / PPM) * 1.15;
    for (let x = x0; x <= x1; x += step) { put(x, z0); put(x, z1); }
    for (let z = z0; z <= z1; z += step) { put(x0, z); put(x1, z); }
    put(x1, z0); put(x1, z1);
  };

  /** Arco: un punto por cada píxel de textura a lo largo del recorrido. */
  const arc = (cx: number, cz: number, r: number, a0: number, a1: number) => {
    const steps = Math.max(32, Math.ceil((Math.abs(a1 - a0) * r * PPM) / 1.5));
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps;
      put(cx + Math.cos(a) * r, cz + Math.sin(a) * r);
    }
  };

  const halfL = COURT.halfL;
  const halfW = COURT.halfW;
  /*
   * EL TRIPLE.
   *
   * El perímetro del triple son tres piezas: la recta de esquina, el arco y la
   * otra recta. Antes el arco terminaba en un sitio y la recta empezaba en
   * otro, con un hueco de 2,83 m: se veía el triple cortado antes de llegar al
   * fondo, que es exactamente lo que pasaba.
   *
   * La causa era mezclar dos criteris. El arco se recortaba por `asin(cornerZ/r)`
   * —donde el triple cruza la recta que está a 0,90 m de la banda— mientras la
   * recta de esquina se dibujaba desde la línea de fondo hasta `hx + side*dxArc`,
   * con el signo cambiado. Que el signo pareciera el correcto escondía el error:
   * lo que no cuadraba era el otro.
   *
   * Ahora el arco se recorta por el punto donde corta la recta de esquina, y la
   * recta se dibuja hasta ese mismo punto. El hueco pasa a 0,0000 m medidos.
   *
   * La geometría de una cancha real tiene aquí una contradicción: si la recta
   * está a 0,90 m de la banda y el arco tiene radio 6,75 m medido desde el
   * centro del aro, no pueden juntarse exactamente. Se elige la recta a 0,90 m
   * de la línea de fondo (que es lo que marca el reglamento) y el arco se
   * cierra ahí, de modo que acaba a 0,79 m de la banda en vez de 0,90. Son
   * 11 cm de diferencia en el punto de unión, y a favor tiene que el perímetro
   * quede cerrado.
   */
  const arcR = 6.75;
  const CORNER_STRAIGHT = 0.9; // metros desde la línea de fondo (FIBA)
  // cos(ang) sale de dónde tiene que acabar el arco para tocar la recta.
  const ang = Math.acos(-(1.575 - CORNER_STRAIGHT) / arcR);
  const cornerZ = arcR * Math.sin(ang);

  rectOutline(-halfL, halfL, -halfW, halfW);
  for (let z = -halfW; z <= halfW; z += (LW / PPM) * 1.15) put(0, z);
  arc(0, 0, 1.8, 0, Math.PI * 2);

  for (const side of [-1, 1] as const) {
    const baseX = side * halfL;
    const hx = baseX - side * 1.575;
    const keyX = baseX - side * 5.8;

    rectOutline(baseX, keyX, -2.45, 2.45);
    arc(keyX, 0, 1.8, 0, Math.PI * 2);

    // Rectas de esquina: desde la línea de fondo hasta el extremo real del arco.
    const step = (LW / PPM) * 1.15;
    const xEnd = side * (halfL - CORNER_STRAIGHT);
    for (const zz of [-cornerZ, cornerZ]) {
      for (let x = Math.min(baseX, xEnd); x <= Math.max(baseX, xEnd); x += step) put(x, zz);
    }
    /*
     * Marcas de tiro libre (las «lane marks») en los laterales de la zona.
     *
     * Faltaban, y son de las líneas reglamentarias que más se echan de menos
     * en una pista: son las muescas donde se colocan los jugadores en cada
     * tiro. En FIBA la primera está a 1,75 m de la línea de fondo y las
     * siguientes cada 0,85 m; cada una mide 0,40 m y entra hacia dentro de la
     * zona. Sin ellas la zona es un rectángulo rojo vacío.
     */
    for (const off of [1.75, 2.6, 3.45, 4.3, 5.15]) {
      const mx = baseX - side * off;
      for (const edge of [-2.45, 2.45]) {
        // 0,40 m de marca entrando hacia el interior de la zona.
        const from = edge;
        const to = edge - Math.sign(edge) * 0.4;
        for (let z = from; edge > 0 ? z >= to : z <= to; z += edge > 0 ? -step : step) put(mx, z);
      }
    }

    if (side === -1) arc(hx, 0, arcR, -ang, ang);
    else arc(hx, 0, arcR, Math.PI - ang, Math.PI + ang);

    if (side === -1) arc(hx, 0, 1.25, -Math.PI / 2, Math.PI / 2);
    else arc(hx, 0, 1.25, Math.PI / 2, (3 * Math.PI) / 2);
  }
}

/**
 * Grada perimetral: un ANILLO de peldaños alrededor de la pista.
 *
 * Antes eran seis cajas de hasta 3,6 m de alto apiladas en un solo lado: el
 * frente de cada una era un muro, costaba 79.000 triángulos y la grada se leía
 * como un muro, no como un escalón. Ahora cada peldaño es una losa horizontal
 * (huella) más su contrahuella, el anillo cierra los cuatro lados y el conjunto
 * se lee como una cancha de verdad.
 *
 * Bandas de bioma: en Cube World el terreno se lee como franjas de color, cada
 * una con su masa propia, no como dos tonos alternos.
 */
function buildStands(): THREE.Group {
  const BANDS = [0x6f9fd8, 0x7fd18a, 0xf0c14b, 0xe8845c, 0xb47ad6, 0x8fc7f0, 0x9fd0a8] as const;
  const TIERS = 7;
  const RISE = 0.55; // altura de cada peldaño
  const TREAD = 1.15; // fondo de cada peldaño
  const R0X = COURT.halfL + 2.2; // borde interior del anillo
  const R0Z = COURT.halfW + 2.2;

  const g = voxelGroup('stands', (v) => {
    for (let i = 0; i < TIERS; i++) {
      const y = RISE * (i + 1);
      const y0 = y - RISE;
      const ox = R0X + i * TREAD;
      const oz = R0Z + i * TREAD;
      const ex = ox + TREAD; // borde exterior del peldaño
      const band = BANDS[i % BANDS.length]!;
      // Cuatro losas forman el anillo. Las de los lados largos se extienden
      // hasta el borde exterior para cubrir también las esquinas.
      v.span(-ex, y0, -oz - TREAD, ex, y, -oz, band); // fondo
      v.span(-ex, y0, oz, ex, y, oz + TREAD, band); // delantera
      v.span(-ox - TREAD, y0, -oz, -ox, y, oz, band); // izquierda
      v.span(ox, y0, -oz, ox + TREAD, y, oz, band); // derecha
      // Remate claro en el borde interior: marca el canto del peldaño.
      v.span(-ex, y - 0.12, -oz - 0.25, ex, y, -oz, 0xdfe9f7);
      v.span(-ex, y - 0.12, oz, ex, y, oz + 0.25, 0xdfe9f7);

      /*
       * PASILLO DE ESCALERAS (fase A).
       *
       * Cada peldaño lleva un tramo de color distinto en dos puntos de los lados
       * largos: es lo que lee como la escalera de acceso a la grada, y de paso
       * rompe la simetría del anillo. Se pinta la HUELLA (la cara de arriba), así
       * que no añade volumen.
       */
      for (const ax of [-7.4, 7.4]) {
        v.span(ax - 1.1, y - 0.02, -oz - TREAD, ax + 1.1, y, -oz, 0xe8845c);
        v.span(ax - 1.1, y - 0.02, oz, ax + 1.1, y, oz + TREAD, 0xe8845c);
      }
    }
    /*
     * EL GRANO DEL GRADERÍO SE QUEDA EN 25 cm, y es una decisión medida.
     *
     * La barandilla y los banderines (más abajo, en su propio grupo) piden 12 cm
     * para leerse, y el primer intento fue bajar el grano de TODO el graderío a
     * 12,5 cm: al duplicar la resolución, cada losa de peldaño pasa de 2 a 4
     * celdas por lado y el graderío se fue de 189.656 a 505.416 triángulos —el
     * 60 % de todo el mundo, para las cuatro barras de una barandilla—. Con el
     * detalle en su propio `VoxelWorld` su barandilla cuesta 13.000 triángulos y
     * el graderío conserva su grano grueso, que es el que le va bien a una losa
     * de 30 m de largo.
     */
  }, 0.25);

  const rail = buildStandsRail(R0X, R0Z);
  g.add(rail);

  // Asientos: se recorre el anillo peldaño a peldaño. Una sola lista alimenta
  // las cuatro mallas instanciadas del público.
  const SPACING = 0.95; // las figuras miden 1,1 m: 0,7 las solapaba
  const seats: Array<[number, number, number]> = [];
  // Los pasillos de escalera se quedan sin butaca: si la escalera está pintada y
  // encima hay público sentado, la escalera no se ve.
  const enPasillo = (x: number): boolean => Math.abs(Math.abs(x) - 7.4) < 1.25;
  for (let i = 0; i < TIERS; i++) {
    const y = RISE * (i + 1) + 0.12;
    const ox = R0X + i * TREAD + TREAD / 2;
    const oz = R0Z + i * TREAD + TREAD / 2;
    for (let x = -ox; x <= ox; x += SPACING) {
      if (enPasillo(x)) continue;
      seats.push([x, y, -oz], [x, y, oz]);
    }
    for (let z = -oz + SPACING; z <= oz - SPACING; z += SPACING) {
      seats.push([-ox, y, z], [ox, y, z]);
    }
  }

  const crowd = buildCrowd(seats);
  g.userData.crowdTime = crowd.userData.crowdTime;
  g.userData.crowdFx = crowd.userData.crowdFx;
  g.add(crowd);
  return g;
}

/** Tonos de piel y de pelo del público. Varios de cada, para que la grada no
 * sea un mosaico de dos colores repetidos. */
const CROWD_SKIN = [0xf0b27a, 0xd69457, 0xa96a3c, 0x8a5127, 0xf7c9a0] as const;
const CROWD_HAIR = [0x2f2018, 0x54371f, 0x8a5a2b, 0xd8b04a, 0x1f1a24, 0x7a3b2a] as const;

/**
 * Público: figuras humanoides estilizadas, no cajas de color.
 *
 * Antes cada espectador era un único cubo coloreado. La guía pide silueta
 * reconocible con cabeza, pelo, torso y brazos diferenciados, y variación de
 * peinado, color, escala y pose.
 *
 * Se resuelve con CUATRO `InstancedMesh` que comparten la misma lista de
 * asientos: cabeza, pelo, torso y brazos. Son cuatro llamadas de dibujo para
 * todo el graderío, así que la variedad no cuesta rendimiento.
 *
 * La cabeza va deliberadamente GRANDE respecto al cuerpo: es la misma regla de
 * proporción que se aplica al jugador, sólo que a menor detalle porque se mira
 * desde lejos.
 */
function buildCrowd(seats: Array<[number, number, number]>): THREE.Group {
  const g = new THREE.Group();
  g.name = 'crowd';
  const rnd = mulberry32(7);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const sc = new THREE.Vector3();

  /*
   * Público VIVO, y sin tocar una sola matriz en CPU.
   *
   * Mil asientos estáticos se leen como una foto. Moverlos desde JavaScript
   * serían 4.900 matrices por fotograma (componer, subir el buffer entero):
   * medio milisegundo de CPU para un balanceo de dos centímetros. En vez de eso
   * el desplazamiento se hace en el vértice: cada instancia saca su FASE de su
   * propia traslación (`instanceMatrix[3]`, la columna de posición), que es
   * distinta para cada asiento y constante en el tiempo, y con ella se suma un
   * seno de 4,5 cm a la altura. Las cinco piezas de una misma persona comparten
   * traslación, así que cabeza, pelo, torso, brazos y muslos suben y bajan
   * juntos: no se desmonta nadie.
   *
   * El uniforme es único y lo comparten los cinco materiales; `main.ts` lo
   * avanza con el reloj de la escena (y se queda en 0 con `prefers-reduced-motion`).
   */
  const uCrowdTime = { value: 0 };
  /*
   * OLA DE CELEBRACIÓN (fase B).
   *
   * Al anotar, la grada entera se levanta: un frente de onda que sale del centro
   * de la pista y recorre el anillo (el radio de cada asiento sale de su propia
   * traslación, que ya la tiene). Cuesta dos uniformes compartidos por los cinco
   * materiales —los mismos que el balanceo— y cero matrices de CPU.
   */
  const uCrowdWave = { value: 0 };
  const uCrowdJump = { value: 0 };
  const mat = (): THREE.MeshStandardMaterial => {
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, flatShading: true });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uCrowdTime = uCrowdTime;
      shader.uniforms.uCrowdWave = uCrowdWave;
      shader.uniforms.uCrowdJump = uCrowdJump;
      shader.vertexShader = `uniform float uCrowdTime;\nuniform float uCrowdWave;\nuniform float uCrowdJump;\n${shader.vertexShader}`.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          // Longitud de onda larga (~25 m): la grada se mece en olas que la
          // recorren, no en un temblor por asiento. 4,5 cm de amplitud es lo que
          // hace falta para que se note a 30 m; con 1,8 cm el movimiento se
          // quedaba por debajo del píxel.
          float fase = instanceMatrix[3].x * 0.22 + instanceMatrix[3].z * 0.31;
          transformed.y += sin(uCrowdTime * 0.9 + fase) * 0.045;
          // Celebración: un frente de onda que sale del centro de la pista.
          float radio = length(instanceMatrix[3].xz);
          float ola = max(0.0, 1.0 - abs(uCrowdWave - radio * 0.14));
          transformed.y += ola * uCrowdJump * 0.3;
        }`,
      );
    };
    return m;
  };

  /*
   * Escala. Un espectador SENTADO mide ~1,1 m, que es el 60 % del jugador
   * (1,81 m). La versión anterior medía 0,6 m: un tercio del jugador, y por eso
   * la grada parecía de juguete. La cabeza se lleva 0,40 m de esos 1,1 m, la
   * misma proporción dominante que el personaje jugable.
   */
  const n = seats.length;
  const heads = new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 0.40, 0.36), mat(), n);
  const hairs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.46, 0.14, 0.40), mat(), n);
  const bodies = new THREE.InstancedMesh(new THREE.BoxGeometry(0.40, 0.44, 0.30), mat(), n);
  const arms = new THREE.InstancedMesh(new THREE.BoxGeometry(0.11, 0.34, 0.11), mat(), n * 2);
  const legs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.14, 0.18, 0.34), mat(), n * 2);

  const skin = CROWD_SKIN.map((c) => new THREE.Color(c));
  const hair = CROWD_HAIR.map((c) => new THREE.Color(c));
  const shirt = CROWD_COLORS.map((c) => new THREE.Color(c));

  seats.forEach(([x, y, z], k) => {
    // Un 16 % de asientos vacíos: una grada llena al 100 % parece un patrón.
    const vacio = rnd() < 0.16;
    const esc = vacio ? 0.001 : 0.92 + rnd() * 0.16;
    const giro = (rnd() - 0.5) * 0.6;
    const dy = vacio ? 0 : (rnd() - 0.5) * 0.04;
    const px = x + (rnd() - 0.5) * 0.14;
    const pz = z + (rnd() - 0.5) * 0.12;
    const camiseta = shirt[Math.floor(rnd() * shirt.length)]!;
    sc.set(esc, esc, esc);

    e.set(0, giro, 0);
    q.setFromEuler(e);

    // Muslos: van hacia delante porque el espectador está sentado.
    for (let b = 0; b < 2; b++) {
      const lado = b === 0 ? -1 : 1;
      p.set(
        px + Math.cos(giro) * lado * 0.12 * esc,
        y + 0.09 + dy,
        pz + 0.12 * esc - Math.sin(giro) * lado * 0.12 * esc,
      );
      m.compose(p, q, sc);
      const i = k * 2 + b;
      legs.setMatrixAt(i, m);
      legs.setColorAt(i, new THREE.Color(camiseta).multiplyScalar(0.55));
    }

    // Torso.
    p.set(px, y + 0.40 + dy, pz);
    m.compose(p, q, sc);
    bodies.setMatrixAt(k, m);
    bodies.setColorAt(k, camiseta);

    // Cabeza grande, con giro propio para que no miren todos igual.
    e.set(0, giro + (rnd() - 0.5) * 0.5, 0);
    q.setFromEuler(e);
    p.set(px, y + 0.86 + dy, pz);
    m.compose(p, q, sc);
    heads.setMatrixAt(k, m);
    heads.setColorAt(k, skin[Math.floor(rnd() * skin.length)]!);

    // Pelo: casquete sobre la cabeza, de color y altura variables.
    sc.set(esc, esc * (0.7 + rnd() * 0.8), esc);
    p.set(px, y + 1.09 + dy, pz);
    m.compose(p, q, sc);
    hairs.setMatrixAt(k, m);
    hairs.setColorAt(k, hair[Math.floor(rnd() * hair.length)]!);
    sc.set(esc, esc, esc);

    // Brazos: dos por espectador. Una parte los levanta al aire.
    const arriba = rnd() < 0.2;
    for (let b = 0; b < 2; b++) {
      const lado = b === 0 ? -1 : 1;
      const ax = px + Math.cos(giro) * lado * 0.26 * esc;
      const az = pz - Math.sin(giro) * lado * 0.26 * esc;
      if (arriba) {
        e.set(-0.35, giro, lado * 0.5);
        p.set(ax, y + 0.78 + dy, az);
      } else {
        e.set(0.2, giro, lado * 0.18);
        p.set(ax, y + 0.32 + dy, az);
      }
      q.setFromEuler(e);
      m.compose(p, q, sc);
      const i = k * 2 + b;
      arms.setMatrixAt(i, m);
      arms.setColorAt(i, camiseta);
    }
  });

  for (const im of [legs, bodies, arms, heads, hairs]) {
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    // El público PROYECTA: con el foco clave inclinado 24°, cada espectador
    // echa su sombra sobre la fila de delante, y eso es lo que da profundidad al
    // graderío en las seis secciones. `castShadow` viene en `false` por defecto
    // en cualquier `Mesh`, así que hay que activarlo a mano (en el código
    // original nunca se activó: el público no proyectaba).
    // Coste: los 5 instanciados entran en el horneado del mapa de sombras, que
    // es ÚNICO, no en cada fotograma.
    im.castShadow = true;
    g.add(im);
  }
  // Los uniformes viajan con el grupo: `buildCourt` los sube al suyo y `main.ts`
  // los avanza desde el bucle, sin conocer la jerarquía interna del graderío.
  g.userData.crowdTime = uCrowdTime;
  g.userData.crowdFx = { wave: uCrowdWave, jump: uCrowdJump };
  return g;
}

/* ===========================================================================
 * MARCADOR COLGADO DEL TECHO
 * ---------------------------------------------------------------------------
 * Un pabellón sin marcador no es un pabellón: es una pista con gente. Éste cuelga
 * del techo sobre el centro de la cancha, con las cuatro caras mirando a las
 * gradas, y lleva el RÉCORD EN VIVO (anotados / intentados) en lugar de un texto
 * fijo, que habría que traducir.
 *
 * Coste: la estructura entra en el fundido del arranque (0 llamadas) y sólo las
 * dos pantallas —una cara y la opuesta, que comparten material— son llamadas
 * nuevas, y sólo en la vista de juego: en las seis secciones el marcador queda
 * fuera de cuadro (la cámara mira a 2 m de altura y el marcador está a 8,6).
 *
 * La pantalla se redibuja SÓLO cuando cambia el marcador (al tirar), no por
 * fotograma: `setScore()` pinta el lienzo y sube la textura a la GPU una vez.
 * ========================================================================= */

/** Lienzo del marcador: 4,2 x 1,1 m a 80 px/m. */
const SCORE_W = 336;
const SCORE_H = 88;

function paintScore(g: CanvasRenderingContext2D, made: number, attempted: number): void {
  g.fillStyle = '#080d18';
  g.fillRect(0, 0, SCORE_W, SCORE_H);
  // Marco interior: un bisel de dos tonos, como los marcadores de verdad.
  g.fillStyle = '#1f2937';
  g.fillRect(0, 0, SCORE_W, 6);
  g.fillRect(0, SCORE_H - 6, SCORE_W, 6);
  g.fillRect(0, 0, 6, SCORE_H);
  g.fillRect(SCORE_W - 6, 0, 6, SCORE_H);

  const txt = `${made}/${attempted}`;
  const px = 9;
  const w = pixelTextWidth(txt, px);
  const x = Math.round((SCORE_W - w) / 2);
  const y = Math.round((SCORE_H - 7 * px) / 2) + 1;
  // Sombra desplazada una fila: en un LED se lee como el fondo apagado.
  drawPixelText(g, txt, x, y + 1, px, '#5b1d12');
  drawPixelText(g, txt, x, y, px, '#ff7a1a');
}

export interface Scoreboard extends THREE.Group {
  /** Repinta la pantalla con el récord en vivo. */
  setScore(made: number, attempted: number): void;
}

export function buildScoreboard(): Scoreboard {
  const group = new THREE.Group();
  group.name = 'scoreboard';
  /*
   * ALTURA: 5,7 m, y no los 8,6 del primer intento.
   *
   * La cámara de juego mira hacia abajo unos 50° con un campo vertical de 32°, así
   * que su borde superior está 34° por debajo de la horizontal: lo que esté más
   * alto que eso NO ENTRA EN CUADRO por mucho que esté delante. A 8,6 m el
   * marcador quedaba fuera (medido: no aparecía en ninguna captura de juego); a
   * 5,7 entra por el borde alto del encuadre y se lee sin estorbar, porque queda
   * por encima del aro (3,05 m) y muy por encima del jugador.
   *
   * Los cables suben hasta las cerchas (14,2 m): largos, pero es donde se cuelga
   * un marcador de pabellón.
   */
  const y = 5.7;
  const W = SCORE_W / PPM / 2; // 2,1 m de semiancho
  const H = SCORE_H / PPM / 2;

  // ── Estructura: caja con biseles y cables hasta el techo.
  group.add(
    voxelGroup('scoreboardBody', (v) => {
      v.span(-W - 0.14, y - H - 0.14, -0.36, W + 0.14, y + H + 0.14, 0.36, 0x2b3550);
      v.span(-W - 0.2, y + H + 0.14, -0.42, W + 0.2, y + H + 0.3, 0.42, 0x8e9cb4);
      v.span(-W - 0.2, y - H - 0.3, -0.42, W + 0.2, y - H - 0.14, 0.42, 0x8e9cb4);
      // Cuatro cables a las cerchas del techo.
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          v.span(sx * (W - 0.2) - 0.03, y + H + 0.3, sz * 0.24 - 0.03, sx * (W - 0.2) + 0.03, 14.2, sz * 0.24 + 0.03, 0x1f2937);
        }
      }
      // Grano GRUESO (12,5 cm): es una caja lisa de 4,5 x 2,4 m vista desde 16 m.
      // A 3 cm costaba 18.000 triángulos de superficie que no se distinguen.
    }, VOXEL * 4),
  );

  const canvas = document.createElement('canvas');
  canvas.width = SCORE_W;
  canvas.height = SCORE_H;
  const g = canvas.getContext('2d');
  if (g) paintScore(g, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  // MeshBasicMaterial: un marcador es una fuente de luz, no una superficie
  // pintada. Además se lee igual con la luz que caiga, que es lo que se quiere.
  const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
  /*
   * LAS PANTALLAS VAN INCLINADAS 25° HACIA ABAJO, y no es un capricho estético.
   *
   * La cámara de juego está 11 m por encima del marcador: con la pantalla vertical
   * se ve de canto, en escorzo, y los dígitos se leen como una raya. Inclinadas
   * miran al suelo de la pista, que es donde está el público de la grada y donde
   * está la cámara. Los marcadores de pabellón de verdad son así.
   *
   * El orden de Euler es YXZ a propósito: primero el giro de 180° (para que la
   * cara de atrás mire hacia -Z) y después la inclinación, que así cae en el eje
   * correcto en las dos caras.
   */
  const TILT = 0.44; // ~25°
  for (const sz of [-1, 1]) {
    const face = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, H * 2), mat);
    face.position.set(0, y, sz * 0.37);
    face.rotation.set(TILT, sz < 0 ? Math.PI : 0, 0, 'YXZ');
    face.name = `scoreboardFace${sz > 0 ? 'F' : 'B'}`;
    group.add(face);
  }

  const setScore = (made: number, attempted: number): void => {
    if (!g) return;
    paintScore(g, made, attempted);
    tex.needsUpdate = true;
  };
  // El método va en el propio grupo (no en `userData`) para que `main.ts` lo
  // llame tipado: `board.setScore(...)`.
  const board = group as Scoreboard;
  board.setScore = setScore;
  return board;
}

/**
 * TECHO DEL PABELLÓN: cerchas, focos colgantes y altavoces.
 *
 * Sin nada arriba, el fondo del encuadre es un azul vacío y la pista vuelve a
 * leerse como una isla flotante, que es justo lo que se corrigió con el terreno
 * alrededor. Aquí se cierra el espacio con la estructura MÍNIMA que se ve desde
 * la cámara de juego (que mira hacia abajo desde 12,4 m): tres celosías
 * cruzadas, sus correas, seis focos colgantes y altavoces.
 *
 * DOS PRECAUCIONES, las dos medidas y no supuestas:
 *
 *  · **No proyecta sombra** (`noCastShadow`). El mapa de sombras se hornea UNA
 *    vez con el foco clave en (10, 34, 12) y su frustum cubre todo el recinto: un
 *    techo que proyectara taparía la pista entera y el juego se vería a oscuras
 *    (y el horneado pasaría de 9 llamadas a dibujar toda la cubierta).
 *  · **No hay losa de cubierta.** Se probó con una y el techo, al estar iluminado
 *    desde arriba, se veía como una plancha clara comiéndose el encuadre; las
 *    cerchas dan la lectura de «bajo techo» sin tapar el cielo del panel.
 */
function buildCeiling(): THREE.Group {
  return noCastShadow(voxelGroup('ceiling', (v) => {
    const X = COURT.halfL + 8; // 22 m: cubre pista y gradas
    /*
     * LA CUBIERTA NO PASA POR ENCIMA DE LA CÁMARA, y esto es lo único delicado de
     * toda la pieza.
     *
     * La cámara de juego está en `CAMERA.offset` multiplicado por `dist`: en
     * apaisado a 12,4 m de alto y en vertical hasta 17,2 m (y hasta 29,8 m en un
     * móvil, donde `dist` llega a 2,4). El primer intento cubrió el pabellón
     * entero con las cerchas a 14,2 m y, en cuanto la cámara subió por el formato
     * de la pantalla, se metió DEBAJO de la estructura y las cerchas taparon la
     * pista entera: la captura era un muro azul.
     *
     * Por eso la cubierta cubre sólo la MITAD LEJANA (z ≤ +4). La cámara está
     * siempre en z ≥ 6,2 y mira hacia -Z, así que ve el canto de la cubierta en la
     * parte alta del encuadre —exactamente como un plano de retransmisión desde la
     * grada, con la estructura del techo asomando por arriba— y nunca puede
     * quedar por debajo de ella.
     */
    const Z_NEAR = 4; // borde de la cubierta por el lado de la cámara
    const Z_FAR = -(COURT.halfW + 7);
    const Y = 14.2;
    // Cerchas maestras: celosía de canto y cordón inferior.
    for (const z of [Z_FAR + 0.6, -4, 0, Z_NEAR - 0.2]) {
      v.span(-X, Y, z - 0.18, X, Y + 0.36, z + 0.18, 0x4a5a80);
      v.span(-X, Y + 1.5, z - 0.18, X, Y + 1.86, z + 0.18, 0x4a5a80);
      for (let x = -X; x <= X; x += 1.6) {
        v.span(x - 0.1, Y + 0.36, z - 0.1, x + 0.1, Y + 1.5, z + 0.1, 0x5d6f96);
      }
    }
    // Correas transversales: cierran la retícula vista en escorzo.
    for (let x = -X; x <= X; x += 3.2) {
      v.span(x - 0.12, Y + 1.86, Z_FAR + 0.6, x + 0.12, Y + 2.1, Z_NEAR - 0.2, 0x4a5a80);
    }
    // Focos colgantes: péndulo, visera y cara emisiva. Van alineados con la
    // pista, que es donde se mira.
    for (const x of [-9.6, -3.2, 3.2, 9.6]) {
      for (const z of [-8.5, -2.5, 2.5]) {
        v.span(x - 0.05, Y - 1.6, z - 0.05, x + 0.05, Y, z + 0.05, 0x2b3550);
        v.span(x - 0.62, Y - 2.1, z - 0.44, x + 0.62, Y - 1.6, z + 0.44, 0x5d6f96);
        v.span(x - 0.5, Y - 2.18, z - 0.34, x + 0.5, Y - 2.1, z + 0.34, 0xfff3c4);
      }
    }
    // Altavoces: dos parejas de megafonía colgadas de las cerchas, en los dos
    // extremos que cubre la cubierta.
    for (const sz of [-1, 1]) {
      const z = sz < 0 ? -9.5 : 2.5;
      v.span(-6.5, Y - 2.4, z - 0.5, -5.1, Y - 1.4, z + 0.5, 0x1f2937);
      v.span(-6.4, Y - 2.3, z - 0.4, -5.2, Y - 1.5, z + 0.4, 0x3a465e);
    }
  }, 0.25));
}

/**
 * BARANDILLA PERIMÉTRICA Y BANDERINES DEL GRADERÍO (fase A).
 *
 * La barandilla es la pieza que convierte el anillo de peldaños en una grada de
 * pabellón: va delante de la primera fila, a la altura del pecho de un
 * espectador sentado (1,1 m), con montantes cada 2,5 m y dos barras.
 *
 * De ella cuelgan banderines: triángulos de cuatro bloques en los colores del
 * graderío. Es el detalle más barato que existe para dar «fiesta» a una grada, y
 * Trove es colorido y alegre por definición.
 *
 * Va en su PROPIO `VoxelWorld` a 12,5 cm (ver el comentario del grano en
 * `buildStands`): el graderío se queda a 25 cm y la barandilla tiene el detalle
 * que necesita. Las dos piezas comparten el material voxel, así que el fundido
 * del arranque las mete en los mismos lotes: sigue costando 0 llamadas.
 */
function buildStandsRail(R0X: number, R0Z: number): THREE.Group {
  return voxelGroup('standsRail', (v) => {
    const RAIL_Y = 1.1;
    const FLAG = [0xff8c3a, 0xf6d54a, 0x4fa8f0, 0x7ee08a, 0xfdfdf6] as const;
    let flagN = 0;
    const banderin = (x: number, z: number, dir: number): void => {
      // Mástil corto hacia abajo + triángulo de tres bloques decrecientes.
      v.span(x - 0.05, RAIL_Y - 0.5, z - 0.05, x + 0.05, RAIL_Y, z + 0.05, 0x2b3550);
      const c = FLAG[flagN++ % FLAG.length]!;
      for (let i = 0; i < 3; i++) {
        v.span(x - 0.05, RAIL_Y - 0.18 - i * 0.12, z - 0.05, x + 0.05, RAIL_Y - 0.06 - i * 0.12, z + 0.05 + dir * (0.34 - i * 0.1), c);
      }
    };
    const tramo = (x0: number, z0: number, x1: number, z1: number): void => {
      const dx = x1 - x0;
      const dz = z1 - z0;
      const len = Math.hypot(dx, dz);
      const n = Math.max(2, Math.round(len / 2.5));
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const x = x0 + dx * t;
        const z = z0 + dz * t;
        v.span(x - 0.07, 0.6, z - 0.07, x + 0.07, RAIL_Y, z + 0.07, 0x8e9cb4);
      }
      // Dos barras horizontales: la de arriba gruesa y una intermedia fina.
      const step = 0.35;
      for (let i = 0; i * step <= len; i++) {
        const x = x0 + (dx / len) * i * step;
        const z = z0 + (dz / len) * i * step;
        v.span(x - 0.06, RAIL_Y - 0.12, z - 0.06, x + 0.06, RAIL_Y, z + 0.06, 0xdfe9f7);
        v.span(x - 0.05, RAIL_Y - 0.42, z - 0.05, x + 0.05, RAIL_Y - 0.32, z + 0.05, 0x8e9cb4);
      }
      // Banderines cada 2,4 m, colgando hacia el lado de la pista.
      const cada = 2.4;
      const signo = Math.abs(dz) > 0.1 ? -Math.sign(dz) : 0;
      for (let i = 0; i * cada <= len; i++) {
        const x = x0 + (dx / len) * i * cada;
        const z = z0 + (dz / len) * i * cada;
        banderin(x, z, signo);
      }
    };
    tramo(-R0X, -R0Z, R0X, -R0Z);
    tramo(-R0X, R0Z, R0X, R0Z);
    tramo(-R0X, -R0Z, -R0X, R0Z);
    tramo(R0X, -R0Z, R0X, R0Z);
  }, 0.125);
}

/**
 * Vallas publicitarias de banda.
 *
 * Son el detalle que más "cancha real" aporta por triángulo invertido: en
 * cualquier pista hay una franja de paneles al borde. Se dejan huecos en el
 * túnel y en las canastas para no taparlos.
 */
function buildBoards(): THREE.Group {
  const PANEL = [0xfdfdf6, 0xff8c3a, 0x3f8ae0, 0xffd54a, 0xb8443c] as const;
  const z = COURT.halfW + 1.15;
  const xEnd = COURT.halfL + 0.9;
  return voxelGroup('boards', (v) => {
    // Los lados largos llevan huecos delante de TODO lo que va pegado a la
    // banda. Sin ellos, la valla se coloca por delante del banquillo, del
    // plató de TV y de la mesa, y esos elementos quedan ocultos tras el muro.
    for (const sz of [-1, 1]) {
      for (let x = -xEnd; x < xEnd; x += 0.8) {
        const enTunel = sz < 0 && x > -12.4 && x < -7.6;
        const enMesa = sz < 0 && x > -1.6 && x < 1.6;
        const enBanquillo = sz > 0 && x > -3.0 && x < 3.0;
        const enPlato = sz > 0 && x > 6.2 && x < 12.8;
        if (enTunel || enMesa || enBanquillo || enPlato) continue;
        const c = PANEL[Math.round((x + xEnd) / 0.8) % PANEL.length]!;
        v.span(x, 0, sz * z - 0.09, x + 0.72, 0.85, sz * z + 0.09, c);
        // Remate superior oscuro: lee como estructura, no como cinta pintada.
        v.span(x, 0.85, sz * z - 0.09, x + 0.72, 0.92, sz * z + 0.09, 0x2b3550);
      }
    }
  }, 0.125);
}

/** Torres de luz en las cuatro esquinas: dan silueta y altura al recinto. */
function buildLightTowers(): THREE.Group {
  const X = COURT.halfL + 7;
  const Z = COURT.halfW + 7;
  // Las torres son el propio soporte de los focos y están por encima de todo lo
  // demás: incluso con la luz sesgada, su sombra cae sobre su propia zapata, que
  // la tapa. Además, al ser un grupo voxel con las cuatro torres juntas, su
  // esfera envolvente cubre todo el recinto y ninguna cámara de sombras puede
  // descartarlo por frustum: se dibujaría en todos los horneados desde cualquier
  // vista, para nada.
  return noCastShadow(voxelGroup('lightTowers', (v) => {
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const x = sx * X;
        const z = sz * Z;
        // Zapata de hormigón con refuerzos.
        v.span(x - 0.9, 0, z - 0.9, x + 0.9, 0.25, z + 0.9, 0x9aa3ad);
        v.span(x - 0.6, 0.25, z - 0.6, x + 0.6, 0.42, z + 0.6, 0x8e9cb4);
        // Mástil por TRAMOS con anillos: un prisma liso de 7,5 m no da escala.
        for (let i = 0; i < 5; i++) {
          const y0 = 0.42 + i * 1.42;
          v.span(x - 0.3, y0, z - 0.3, x + 0.3, y0 + 1.3, z + 0.3, 0x8e9cb4);
          v.span(x - 0.36, y0 + 1.3, z - 0.36, x + 0.36, y0 + 1.42, z + 0.36, 0x6b7686);
        }
        // Tirantes en aspa en el primer tramo.
        for (let i = 0; i < 6; i++) {
          const t = i / 5;
          v.span(x - 0.26 + t * 0.5, 0.5 + t * 1.2, z - 0.06, x - 0.2 + t * 0.5, 0.62 + t * 1.2, z + 0.06, 0x6b7686);
        }
        // Cabezal: parrilla de 3x2 focos con visera.
        v.span(x - 1.0, 7.6, z - 1.0, x + 1.0, 8.5, z + 1.0, 0x5d6f96);
        v.span(x - 1.05, 8.5, z - 1.05, x + 1.05, 8.62, z + 1.05, 0x6b7686);
        for (let a = 0; a < 3; a++) {
          for (let b = 0; b < 2; b++) {
            v.span(x - 0.78 + a * 0.62, 7.75, z - 0.78 + b * 1.1, x - 0.3 + a * 0.62, 8.4, z - 0.34 + b * 1.1, 0xfff3c4);
            v.span(x - 0.82 + a * 0.62, 8.4, z - 0.82 + b * 1.1, x - 0.26 + a * 0.62, 8.48, z - 0.3 + b * 1.1, 0x5d6f96);
          }
        }
      }
    }
  }, 0.25));
}

/**
 * Vegetación y rocas fuera del recinto.
 *
 * Cube World llena el terreno de siluetas reconocibles a distancia. Sin nada
 * alrededor, la pradera se lee como una superficie vacía.
 */
function buildScatter(): THREE.Group {
  const rnd = mulberry32(1234);
  const TRUNK = 0x7c4e26;
  const TRUNK_DARK = 0x5e3a1c;
  const LEAF = [0x4f9d69, 0x63b043, 0x3f8a57] as const;
  const ROCK = [0x9aa3ad, 0x8e9cb4, 0xa8b0bb] as const;
  const g = voxelGroup('scatter', (v) => {
    for (let n = 0; n < 32; n++) {
      const a = rnd() * Math.PI * 2;
      const r = 24 + rnd() * 42;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r * 0.75;
      if (Math.abs(x) < 23 && Math.abs(z) < 17) continue; // dentro del recinto no
      const tipo = rnd();

      if (tipo < 0.24) {
        // Roca: dos o tres masas escalonadas, no una bola suelta.
        const r0 = 0.45 + rnd() * 0.5;
        v.sphere(x, r0 * 0.7, z, r0, ROCK[0]);
        v.sphere(x + r0 * 0.8, r0 * 0.45, z - r0 * 0.5, r0 * 0.62, ROCK[1]);
        if (rnd() < 0.5) v.sphere(x - r0 * 0.7, r0 * 0.35, z + r0 * 0.6, r0 * 0.45, ROCK[2]);
      } else if (tipo < 0.36) {
        // Arbusto: dos masas bajas que rompen la línea del césped.
        v.sphere(x, 0.35, z, 0.5 + rnd() * 0.3, LEAF[1]);
        v.sphere(x + 0.5, 0.28, z + 0.3, 0.38, LEAF[0]);
      } else {
        // Árbol: tronco con base ancha, muñones de rama y copa en tres pisos
        // decrecientes. Sin los pisos la copa es una bola y no lee como árbol.
        const h = 1.8 + rnd() * 1.8;
        const w = 0.16 + rnd() * 0.08;
        v.span(x - w * 1.6, 0, z - w * 1.6, x + w * 1.6, 0.35, z + w * 1.6, TRUNK_DARK);
        v.span(x - w, 0.3, z - w, x + w, h, z + w, TRUNK);
        v.span(x - w * 3.4, h * 0.62, z - w * 0.6, x + w * 3.4, h * 0.62 + w * 1.2, z + w * 0.6, TRUNK);
        v.span(x - w * 0.6, h * 0.78, z - w * 3.4, x + w * 0.6, h * 0.78 + w * 1.2, z + w * 3.4, TRUNK);
        const cr = 1.0 + rnd() * 0.4;
        v.sphere(x, h + cr * 0.45, z, cr, LEAF[2]);
        v.sphere(x, h + cr * 1.05, z, cr * 0.78, LEAF[0]);
        v.sphere(x, h + cr * 1.5, z, cr * 0.5, LEAF[1]);
      }
    }
  }, 0.25);
  // Vegetación y rocas del exterior del recinto (a partir de r = 24 m): su
  // sombra cae al lado del árbol, fuera de la pista y fuera del encuadre.
  return noCastShadow(g);
}

/**
 * Terreno que rodea la pista.
 *
 * Antes era un plano liso de 60x40 del mismo azul que el cielo, así que la
 * pista se leía como una isla flotante: no había horizonte ni apoyo para las
 * gradas. Ahora es una pradera pixel-art con parcelas de varios tonos, que es
 * como Trove resuelve el suelo (manchas de color, no un degradado uniforme).
 */
function drawGround(g: CanvasRenderingContext2D, W: number, H: number): void {
  const B = 4; // píxeles por bloque fino
  const P = 16; // píxeles por parcela
  const rnd = mulberry32(20261012);
  const GREEN = ['#6fbf4a', '#65b445', '#7bcb56', '#59a53c'] as const;
  const FLOWER = ['#f6d54a', '#f07aa6', '#fdfdf6'] as const;

  for (let y = 0; y < H; y += P) {
    for (let x = 0; x < W; x += P) {
      const tone = Math.floor(rnd() * GREEN.length);
      g.fillStyle = GREEN[tone]!;
      g.fillRect(x, y, P, P);
      // Bloques finos dentro de la parcela: rompen la uniformidad sin que el
      // campo entero parezca ruido aleatorio.
      for (let by = y; by < y + P; by += B) {
        for (let bx = x; bx < x + P; bx += B) {
          const r = rnd();
          if (r < 0.16) g.fillStyle = GREEN[(tone + 1) % GREEN.length]!;
          else if (r > 0.985) g.fillStyle = FLOWER[Math.floor(rnd() * FLOWER.length)]!;
          else continue;
          g.fillRect(bx, by, B, B);
        }
      }
    }
  }
}

export function buildCourt(brand: string, maxAnisotropy: number): THREE.Group {
  const group = new THREE.Group();
  const W = COURT.length * PPM;
  const H = COURT.width * PPM;
  const tex = canvasTexture(W, H, (g) => drawFloor(g, W, H, brand));
  tex.anisotropy = maxAnisotropy;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(COURT.length, COURT.width),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  // Sin nombre no se podía localizar desde main.ts para retirarlo cuando la
  // cancha del glTF hace de pista, y quedaba debajo provocando z-fighting.
  floor.name = 'floor';

  // 180 m de terreno: suficiente para que el horizonte no se acabe a la vista.
  const GW = 720;
  const groundTex = canvasTexture(GW, GW, (g) => drawGround(g, GW, GW));
  groundTex.anisotropy = maxAnisotropy;
  // El suelo sí necesita mipmaps: es una superficie enorme vista en escorzo y
  // sin ellos parpadearía con aliasing en cuanto la cámara se mueve.
  groundTex.generateMipmaps = true;
  groundTex.minFilter = THREE.LinearMipmapLinearFilter;
  const around = new THREE.Mesh(
    new THREE.PlaneGeometry(180, 180),
    new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.95 }),
  );
  around.rotation.x = -Math.PI / 2;
  around.position.y = -0.01;
  around.receiveShadow = true;

  around.name = 'around';
  // Instrumentación temporal: sin esto no hay forma de saber qué constructor
  // se come el tiempo de carga.
  const t0 = performance.now();
  const stands = buildStands();
  const t1 = performance.now();
  const boards = buildBoards();
  const t2 = performance.now();
  const towers = buildLightTowers();
  const t3 = performance.now();
  const scatter = buildScatter();
  const t4 = performance.now();
  const ceiling = buildCeiling();
  const t5 = performance.now();
  console.info(
    `[court] tiempos ms -> stands ${(t1 - t0) | 0}, boards ${(t2 - t1) | 0}, ` +
    `torres ${(t3 - t2) | 0}, vegetacion ${(t4 - t3) | 0}, techo ${(t5 - t4) | 0}`,
  );
  group.add(around, floor, stands, boards, towers, scatter, ceiling);
  // El uniforme del balanceo del público nace dentro del graderío; se sube al
  // grupo que devuelve `buildCourt` porque quien lo avanza (`main.ts`) recibe
  // ese grupo y no tiene por qué saber cómo está montado por dentro.
  group.userData.crowdTime = stands.userData.crowdTime;
  group.userData.crowdFx = stands.userData.crowdFx;
  return group;
}

/**
 * Capa de marcaje y pintura, 4 mm POR ENCIMA del parqué.
 *
 * El parqué procedural de `drawFloor` pinta el barniz con sus betas, pero su
 * pintura y sus líneas quedan tapadas por la propia capa de suelo (se comprobó
 * muestreando el píxel de la textura). Así que el marcaje va en esta segunda
 * pasada, una calcomanía con `transparent` y `depthWrite: false` que se apoya
 * sobre el suelo y deja leer la pista como una cancha de baloncesto.
 */
export function buildCourtLines(brand: string, maxAnisotropy: number): THREE.Mesh {
  const W = COURT.length * PPM;
  const H = COURT.width * PPM;
  const tex = canvasTexture(W, H, (g) => drawFloor(g, W, H, brand, true));
  tex.anisotropy = maxAnisotropy;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(COURT.length, COURT.width),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.7, depthWrite: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.004;
  mesh.receiveShadow = true;
  mesh.name = 'courtLines';
  return mesh;
}