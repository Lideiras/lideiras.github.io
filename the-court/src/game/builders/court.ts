import * as THREE from 'three';
import { COURT } from '../config';
import { CROWD_COLORS, VOXEL, canvasTexture, drawPixelText, mulberry32, noCastShadow, pixelTextWidth, voxelGroup } from './util';

const PPM = 80; // píxeles de textura por metro

/*
 * LA BATERÍA DE FOCOS DEL TECHO.
 *
 * Estas cuatro constantes son la ÚNICA fuente de verdad del rig, y las consumen
 * tres sitios distintos: las carcasas que cuelgan de las cerchas (`buildCeiling`),
 * los charcos de luz que se pintan en el parqué (`drawFloor`) y las `SpotLight`
 * que los iluminan de verdad (`main.ts`, que importa `ARENA_LAMPS`). Antes cada
 * uno tenía sus números escritos a mano y no había forma de saber que un charco
 * y su foco podían acabar en sitios distintos.
 */

/** Columnas x de la batería colgante, de izquierda a derecha. */
export const LAMP_COLS = [-9.6, -3.2, 3.2, 9.6] as const;
/** Files z de la batería colgante. */
export const LAMP_ROWS = [-8.5, -2.5, 2.5] as const;
/**
 * Altura de la CARA EMISIVA de un foco colgante.
 *
 * La carcasa de voxel ocupa una celda de 25 cm entre 12,00 y 12,25 m, así que
 * su cara inferior está en 12,00. El panel emisivo se cuelga 4 cm POR DEBAJO
 * (11,88-11,96) en vez de coplanarlo en 12,00: dos caras a la misma profundidad
 * son z-fighting, y aquí el techo es la superficie que más se ve de cerca.
 */
export const LAMP_FACE_Y = 11.92;
/** Semiancho de la cara emisiva, en metros. */
const LAMP_FACE_W = 1.0;
const LAMP_FACE_D = 0.68;

export interface ArenaLamp {
  /** Posición del panel emisivo, que es de donde sale la luz. */
  x: number;
  y: number;
  z: number;
}

/**
 * LOS CUATRO FOCOS QUE APORTAN LUZ DE VERDAD.
 *
 * De los 12 focos de la batería sólo cuatro tienen `SpotLight`: cada luz se paga
 * en el bucle de iluminación de CADA fragmento de CADA malla, y con 12 focos el
 * shader se dispara sin que la imagen mejore (medido en otros rígidos: a partir
 * del cuarto o quinto cono el suelo queda uniforme y los focos siguientes no se
 * distinguen). Se eligen las dos columnas interiores y las dos filas extremas:
 *
 *  · **Columnas interiores (±3,2)**: los focos de fuera (±9,6) están a 12,4 m de
 *    altura, así que un cono de 45° les llega al perímetro a menos de 10 m de
 *    distancia horizontal y las gradas se iluminan casi tanto como la pista.
 *    Con las interiores, el primer peldaño (x = ±16,2) queda fuera del cono.
 *  · **Filas extremas (-8,5 y 2,5)**: cubren de un tirón las dos líneas de fondo
 *    y el círculo central, que es donde se juega.
 *
 * La retícula completa (12 focos) sigue dibujada y con el panel encendido: se
 * ven los doce encendidos, y cuatro de ellos además proyectan un cono real. Es
 * lo que hace un pabellón de verdad, donde la luz se solapa y el suelo se lee
 * como una superficie continua y no como doce manchas.
 */
export const ARENA_LAMPS: readonly ArenaLamp[] = [
  { x: -3.2, y: LAMP_FACE_Y, z: -8.5 },
  { x: 3.2, y: LAMP_FACE_Y, z: -8.5 },
  { x: -3.2, y: LAMP_FACE_Y, z: 2.5 },
  { x: 3.2, y: LAMP_FACE_Y, z: 2.5 },
];

/**
 * Material de las caras encendidas.
 *
 * `MeshBasicMaterial` sin tono mapping: la cara de un foco encendido vale más
 * que el blanco de la pista, y si pasara por el ACES acabaría en el mismo valor
 * que el parqué y dejaría de leerse como encendida. Al no ser `VOXEL_MATERIAL`,
 * esta malla NO entra en el fundido del arranque y se queda suelta: **+1 draw
 * call fijo** en el fotograma de juego, que es el precio de que los focos brillen
 * (y nada más: `batch.ts` sólo funde por identidad de material).
 */
const LAMP_FACE_MATERIAL = new THREE.MeshBasicMaterial({ color: 0xfff3c4, toneMapped: false });

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
     * CHARCO DE LUZ BAJO CADA FOCO.
     *
     * Se pinta AQUÍ, en la textura del parqué, y no con planos aditivos en la
     * escena, porque el coste de esta versión es de CERO: ni un triángulo, ni un
     * draw call, ni una malla que colisione. Los planos aditivos serían 12
     * quads transparentes encima del suelo (o uno solo de 28 × 15 m) —y eso en el
     * mismo suelo que ya recibe el `SpotLight`, que es decir una copia de la luz
     * que ya se está pagando—. Con la textura el charco sale gratis y además se
     * lleva anisotropía y mipmaps gratis con el resto del parqué.
     *
     * Se pintan los DOCE, no sólo los cuatro que tienen `SpotLight` (ver
     * `ARENA_LAMPS`): los doce paneles están encendidos y se ven, así que el
     * suelo tiene que estar iluminado bajo los doce. Si sólo hubiera charco
     * debajo de cuatro, la batería se leería como medio apagada.
     *
     * Van ANTES que la pintura y que las líneas para que la zona siga siendo
     * roja y las líneas sigan siendo blancas: la luz las tiñe un poco en la
     * realidad, pero un blanco recalentado se confunde con el trazo gordo.
     */
    paintLampPools(g);

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
 * Charco de luz bajo cada foco colgante: centro cálido, y SOBRE TODO un anillo
 * oscuro alrededor.
 *
 * Elipse y no círculo porque el cono real de un foco de pabellón es alargado en
 * el eje longitudinal de la pista, y un círculo se lee como una mancha de tóner.
 *
 * POR QUÉ EL ANILLO Y NO SÓLO EL CENTRO CLARO (esta es la versión v2):
 *
 * La primera versión pintaba el charco como ALBEDO más claro y ya más alto:
 *
 *     0     rgba(255,236,196,0.22)   centro, más claro
 *     0,45  rgba(255,214,150,0.13)   medio
 *     1     rgba(255,196,124,0)      borde
 *
 * Con la irradiancia de entonces (2,09 en el parqué) eso era aritméticamente
 * invisible: el parqué normal salía del tonemapping en el HOMBRO de la curva, a
 * ~235/255, y el centro del charco, sólo un 10 % más claro de albedo, a ~237.
 * DOS NIVELES. Un charco "más claro que un suelo ya quemado" no se ve nunca,
 * por muchas capas que se le pinten: es una diferencia que la curva se come.
 *
 * Por eso el arreglo es doble. La mitad de abajo (bajar la irradiancia del suelo
 * a ~1,53; ver el bloque de las luces en `main.ts`) devuelve RECORRIDO a la
 * curva, y esta mitad devuelve CONTRASTE. Un foco real tiene centro caliente y
 * alrededor que se apaga, y ese apagón es un tono frío y oscuro, no el parqué de
 * siempre: por eso el degradado vuelve a TRANSPARENTE a media distancia (se ve
 * el parquet base, que es el derrame real del `SpotLight`) y se vuelve a oscurecer
 * en el anillo exterior. Ese anillo es lo que separa un charco del vecino, y lo
 * que hace que las zonas iluminadas se lean como PUNTOS y no como "parqué con
 * manchas" —que es exactamente lo que se veía sin él.
 *
 * Con los valores de abajo y la irradiancia recalibrada (1,53), el albedo lineal
 * del canal rojo queda en 0,778 en el centro y 0,346 en el anillo, y el resultado
 * en sRGB tras ACES con exposición 1,05 es:
 *
 *     parqué normal   1,53 x 0,694 = 1,06  ->  ~230/255
 *     centro charco   1,53 x 0,778 = 1,19  ->  ~233/255
 *     anillo oscuro   1,53 x 0,346 = 0,53  ->  ~202/255   (31 niveles de diferencia)
 *
 * Nótese que el alfa del CENTRO importa poco: subirlo de 0,28 a 0,38 sólo
 * compra un nivel, porque estamos en el hombro de la curva. El recorrido se gana
 * abajo, en el anillo. Por eso el centro se queda en un alfa moderado y el
 * esfuerzo se pone en el azul-gris apagado del anillo.
 *
 * Se pintan los DOCE, no sólo los dos que tienen `SpotLight` (ver `ARENA_LAMPS`):
 * los doce paneles del techo siguen encendidos y se ven, así que el suelo tiene
 * que estar iluminado bajo los doce.
 */
function paintLampPools(g: CanvasRenderingContext2D): void {
  const R = 4.6 * PPM; // radio del charco, en metros
  for (const x of LAMP_COLS) {
    for (const z of LAMP_ROWS) {
      // Mismo mapeo que las líneas: columna = (x + mitad de largo) · PPM.
      const px = (x + COURT.length / 2) * PPM;
      const py = (z + COURT.width / 2) * PPM;
      g.save();
      g.translate(px, py);
      g.scale(1, 1.25);
      const grd = g.createRadialGradient(0, 0, 0, 0, 0, R);
      // Centro: cálido y más claro que el parquet, con alfa MODERADO (en el
      // hombro de la curva, más alfa no compra contraste).
      grd.addColorStop(0, 'rgba(255,238,202,0.28)');
      // Media distancia: transparente. Se ve el parquet de debajo, que es el
      // derrame real del cono; de aquí sale el patrón de anillo.
      grd.addColorStop(0.3, 'rgba(255,236,196,0)');
      grd.addColorStop(0.6, 'rgba(58,74,108,0.1)');
      // Anillo: azul-gris apagado, frío. Éste es el que separa los charcos.
      grd.addColorStop(0.72, 'rgba(46,58,86,0.34)');
      grd.addColorStop(0.86, 'rgba(58,74,108,0.11)');
      // Borde final: transparente, para que el anillo no deje un corte de disco.
      grd.addColorStop(1, 'rgba(70,88,124,0)');
      g.fillStyle = grd;
      g.beginPath();
      g.arc(0, 0, R, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }
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
 * En cuántos sectores angulares se trocea el público, y el interruptor para
 * barrerlo.
 *
 * El valor por defecto (8) es el que está justificado en el bloque de abajo. El
 * barrido es `?sectores=N` y SÓLO en desarrollo: `?sectores=1` reconstruye el
 * graderío entero en cinco `InstancedMesh` —el estado anterior a este cambio—,
 * de modo que la comparación de `__court.draws()` sale de dos URLs del mismo
 * build y no de dos builds.
 */
function sectoresPublico(): number {
  const porDefecto = 8;
  if (!import.meta.env.DEV || typeof location === 'undefined') return porDefecto;
  const pedido = Number(new URLSearchParams(location.search).get('sectores'));
  return Number.isInteger(pedido) && pedido >= 1 && pedido <= 32 ? pedido : porDefecto;
}

/**
 * Público: figuras humanoides estilizadas, no cajas de color.
 *
 * Antes cada espectador era un único cubo coloreado. La guía pide silueta
 * reconocible con cabeza, pelo, torso y brazos diferenciados, y variación de
 * peinado, color, escala y pose.
 *
 * Se resuelve con CINCO `InstancedMesh` que comparten la misma lista de
 * asientos: cabeza, pelo, torso, brazos y piernas. Son cinco llamadas de dibujo
 * para todo el graderío, así que la variedad no cuesta rendimiento… salvo que
 * las cinco mallas cubren todo el anillo y entonces el culling no puede
 * descartar nada (ver el bloque de SECTORES, más abajo).
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
  /*
   * BRAZOS: una variante del material con `aAlto`, el atributo que marca si el
   * brazo de esa instancia está YA ARRIBA (uno de cada cinco los tiene).
   *
   * No se puede deducir de la matriz de la instancia: los brazos colgados están
   * 46 cm más bajos que los levantados, pero las filas de la grada también están
   * separadas por más de eso, así que la altura no distingue «brazo arriba» de
   * «una fila más abajo». Un atributo de instancia sí lo dice, cuesta 4 bytes
   * por brazo (n·2·4 B: unos 20 KB para 1000 espectadores) y no rompe el
   * instancing: `InstancedBufferAttribute` es un atributo por instancia, no por
   * vértice, así que la llamada de dibujo sigue siendo una.
   */
  const mat = (brazos = false): THREE.MeshStandardMaterial => {
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, flatShading: true });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uCrowdTime = uCrowdTime;
      shader.uniforms.uCrowdWave = uCrowdWave;
      shader.uniforms.uCrowdJump = uCrowdJump;
      shader.vertexShader = `uniform float uCrowdTime;\nuniform float uCrowdWave;\nuniform float uCrowdJump;\n${
        brazos ? 'attribute float aAlto;\n' : ''
      }${shader.vertexShader}`.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          // Longitud de onda larga (~25 m): la grada se mece en olas que la
          // recorren, no en un temblor por asiento. 4,5 cm de amplitud es lo que
          // hace falta para que se note a 30 m; con 1,8 cm el movimiento se
          // quedaba por debajo del píxel.
          float fase = instanceMatrix[3].x * 0.22 + instanceMatrix[3].z * 0.31;
          transformed.y += sin(uCrowdTime * 0.9 + fase) * 0.045;
          // Deriva lateral (punto D): 2 cm a un ritmo más lento y con la fase
          // deformada, para que no vaya en fase con el vaivén vertical. Con sólo
          // subir y bajar, una grada de bloques parece un dibujo plano; el
          // balanceo de lado es lo que la hace masa y no estampa. Las cinco
          // piezas de una persona comparten traslación casi exacta, así que se
          // mueven juntas y nadie se desmonta.
          transformed.x += sin(uCrowdTime * 0.55 + fase * 1.7) * 0.02;
          // Celebración: un frente de onda que sale del centro de la pista.
          float radio = length(instanceMatrix[3].xz);
          float ola = max(0.0, 1.0 - abs(uCrowdWave - radio * 0.14));
          transformed.y += ola * uCrowdJump * 0.3;
          ${
            brazos
              ? `
          // SOLO los brazos, y los que ya estaban arriba: los que suben con la
          // ola son los que la están celebrando, y suben 38 cm más que el
          // cuerpo. Sin esto la ola levantaba a todo el mundo por igual y no
          // se distinguía el que celebra del que se levanta a mirar.
          transformed.y += ola * uCrowdJump * 0.38 * aAlto;
          // y además se barren de lado, como un saludo: 3,5 cm.
          transformed.x += sin(uCrowdTime * 1.4 + fase) * 0.035 * aAlto * ola;`
              : ''
          }
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

  /*
   * SECTORES: POR QUÉ EL GRADERÍO SE TROCEA EN TROZOS QUE SE PUEDEN DESCARTAR.
   *
   * Antes las cinco piezas del público eran cinco `InstancedMesh` con TODOS los
   * asientos, y la esfera envolvente de cada uno abrazaba el anillo entero
   * (±24 m). `Frustum.intersectsObject` sólo sabe trabajar con esa esfera: si la
   * esfera toca el frustum, se dibuja el objeto ENTERO. Con la cámara de juego
   * dentro del anillo, mirando hacia -Z y hacia abajo, el graderío de detrás y el
   * de los lados no se ve casi ninguno —los bordes de la imagen son unos pocos
   * grados— y aun así sus ~61.000 triángulos pasaban por el vertex shader en
   * todos y cada uno de los fotogramas.
   *
   * Troceando por SECTOR ANGULAR alrededor del centro de la pista, cada trozo se
   * lleva una esfera envolvente pequeña: a 8 sectores el radio sale del orden de
   * los 7 m en vez de 24, y los trozos que quedan detrás o al lado se descartan
   * enteros. El anillo tiene 360° y la cámara de juego ve un cono de unos 54°
   * de apertura total, así que lo normal es dibujarse dos o tres sectores de los
   * ocho, no los ocho.
   *
   * LO QUE NO CAMBIA, y es lo importante:
   *
   *  · **Un asiento no se mueve, no cambia de color, ni de escala, ni de sitio.**
   *    El reparto se hace sobre la lista de asientos ya construida, y el bucle
   *    que los coloca se ejecuta entero y en el MISMO ORDEN que antes, así que la
   *    secuencia del generador de números es idéntica: el mismo asiento sale
   *    vacío, con la misma camiseta y con el mismo pelo. Sólo cambia en qué
   *    buffer de instancias se copia su matriz.
   *  · **Los cinco uniformes compartidos siguen siendo los mismos objetos.**
   *    `uCrowdTime`, `uCrowdWave` y `uCrowdJump` se crean una vez aquí y los
   *    reparte `mat()` a los cuarenta materiales. Si se creara uno por sector, la
   *    ola saldría en un sector y no en el de al lado: el balanceo y la
   *    celebración se descuadrarían justo en las juntas, que es donde se nota.
   *  · **La fase de cada instancia sale de su propia matriz**
   *    (`instanceMatrix[3]`), no de un índice: así que deja de importar que el
   *    índice ya no sea un `k` global, y el balanceo sigue siendo el mismo función
   *    del sitio donde está cada espectador.
   *  · **`aAlto` (qué brazos ya están arriba) se recalcula por sector.** El
   *    atributo va en la geometría, y la geometría de los brazos es ahora una
   *    por sector, con su propio array: si se compartiera, el brazo enésimo de
   *    un sector se leería el valor de otro.
   *
   * NÚMERO DE SECTORES: 8. Con menos, la esfera de cada trozo se ensancha
   * (a 45° ya no cabe dentro del cono de la cámara y no se descarta) y se
   * pierde el recorte; con más, la mitad del ganancia se la come el aumento de
   * draw calls. El barrido para comprobarlo es `?sectores=N` en desarrollo, y
   * `?sectores=1` devuelve exactamente el comportamiento anterior.
   *
   * LO QUE PAGA: de 5 a 5 × sectores llamadas de dibujo en el pase visible, y lo
   * mismo en el único horneado del mapa de sombras (que es un fotograma, al
   * cargar). En la vista de juego sólo se pagan los sectores visibles, que son
   * los que antes se dibujaban enteros: es un intercambio, no un regalo.
   *
   * SIN MEDIR en esta sesión (no había shell), así que las dos cifras del
   * intercambio —llamadas y triángulos por vista— hay que sacarlas con
   * `__court.draws()` antes y después de tocar esta constante.
   */
  const SECTORES = sectoresPublico();
  const sectorDe = (x: number, z: number): number => {
    const giro = (Math.atan2(z, x) + Math.PI) / (2 * Math.PI); // [0, 1)
    return Math.min(SECTORES - 1, Math.floor(giro * SECTORES));
  };
  /** Sector de cada asiento. */
  const sectorDeAsiento = new Int32Array(n);
  /** Índice del asiento dentro de su sector: ése es su índice de instancia. */
  const localEnSector = new Int32Array(n);
  const porSector: number[][] = [];
  for (let s = 0; s < SECTORES; s++) porSector.push([]);
  for (let k = 0; k < n; k++) {
    const s = sectorDe(seats[k]![0], seats[k]![2]);
    sectorDeAsiento[k] = s;
    localEnSector[k] = porSector[s]!.length;
    porSector[s]!.push(k);
  }

  /*
   * LAS CINCO PIEZES, UNA COPIA POR SECTOR.
   *
   * Cabeza, pelo, torso y piernas comparten las MISMAS cuatro cajas entre
   * sectores: su geometría no lleva ningún atributo por instancia, así que no
   * hay nada que separar y una sola geometría basta para todas. Los brazos sí
   * necesitan una geometría propia por sector, porque `aAlto` vive en la
   * geometría y su array es de la longitud del sector.
   */
  const heads: THREE.InstancedMesh[] = [];
  const hairs: THREE.InstancedMesh[] = [];
  const bodies: THREE.InstancedMesh[] = [];
  const arms: THREE.InstancedMesh[] = [];
  const legs: THREE.InstancedMesh[] = [];
  /** `aAlto` de cada sector, en el orden en que se escriben las instancias. */
  const altoPorSector: (Float32Array | null)[] = new Array(SECTORES).fill(null);
  const geoCabeza = new THREE.BoxGeometry(0.42, 0.40, 0.36);
  const geoPelo = new THREE.BoxGeometry(0.46, 0.14, 0.40);
  const geoTorso = new THREE.BoxGeometry(0.40, 0.44, 0.30);
  const geoPierna = new THREE.BoxGeometry(0.14, 0.18, 0.34);

  for (let s = 0; s < SECTORES; s++) {
    const ns = porSector[s]!.length;
    if (ns === 0) continue; // sector sin asientos: no hay nada que dibujar
    heads.push(new THREE.InstancedMesh(geoCabeza, mat(), ns));
    hairs.push(new THREE.InstancedMesh(geoPelo, mat(), ns));
    bodies.push(new THREE.InstancedMesh(geoTorso, mat(), ns));
    legs.push(new THREE.InstancedMesh(geoPierna, mat(), ns * 2));
    const geoBrazo = new THREE.BoxGeometry(0.11, 0.34, 0.11);
    const altoBrazo = new Float32Array(ns * 2);
    // Se ASIGNA por índice de sector, no con `push()`. Los dos son lo mismo
    // mientras ningún sector salga vacío, pero si uno saliera, `push()` dejaría
    // los arrays corridos una posición y `aAlto` se escribiría en el del vecino:
    // un fallo silencioso que sólo aparecería en una grada concreta.
    altoPorSector[s] = altoBrazo;
    geoBrazo.setAttribute('aAlto', new THREE.InstancedBufferAttribute(altoBrazo, 1));
    arms.push(new THREE.InstancedMesh(geoBrazo, mat(true), ns * 2));
  }

  const skin = CROWD_SKIN.map((c) => new THREE.Color(c));
  const hair = CROWD_HAIR.map((c) => new THREE.Color(c));
  const shirt = CROWD_COLORS.map((c) => new THREE.Color(c));

  seats.forEach(([x, y, z], k) => {
    /*
     * Las cinco piezas de este espectador van a su SECTOR, con el índice local
     * dentro de ese sector. Todo lo que hay por debajo es EXACTAMENTE el
     * código de antes, con `k` sustituido por `local`: el mismo bucle, el mismo
     * orden y las mismas llamadas al generador de números, seat por asiento.
     */
    const s = sectorDeAsiento[k]!;
    const local = localEnSector[k]!;

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
      const i = local * 2 + b;
      legs[s]!.setMatrixAt(i, m);
      legs[s]!.setColorAt(i, new THREE.Color(camiseta).multiplyScalar(0.55));
    }

    // Torso.
    p.set(px, y + 0.40 + dy, pz);
    m.compose(p, q, sc);
    bodies[s]!.setMatrixAt(local, m);
    bodies[s]!.setColorAt(local, camiseta);

    // Cabeza grande, con giro propio para que no miren todos igual.
    e.set(0, giro + (rnd() - 0.5) * 0.5, 0);
    q.setFromEuler(e);
    p.set(px, y + 0.86 + dy, pz);
    m.compose(p, q, sc);
    heads[s]!.setMatrixAt(local, m);
    heads[s]!.setColorAt(local, skin[Math.floor(rnd() * skin.length)]!);

    // Pelo: casquete sobre la cabeza, de color y altura variables.
    sc.set(esc, esc * (0.7 + rnd() * 0.8), esc);
    p.set(px, y + 1.09 + dy, pz);
    m.compose(p, q, sc);
    hairs[s]!.setMatrixAt(local, m);
    hairs[s]!.setColorAt(local, hair[Math.floor(rnd() * hair.length)]!);
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
      const i = local * 2 + b;
      arms[s]!.setMatrixAt(i, m);
      arms[s]!.setColorAt(i, camiseta);
      // Marca para el shader: este brazo ya está arriba (ver `mat(true)`). El
      // array es el del sector, y el índice el local: la marca va pegada a la
      // matriz que tiene justo al lado, no a la posición que ocupaba antes.
      altoPorSector[s]![i] = arriba ? 1 : 0;
    }
  });

  for (const im of [...legs, ...bodies, ...arms, ...heads, ...hairs]) {
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    // El público PROYECTA: con el foco clave inclinado 24°, cada espectador
    // echa su sombra sobre la fila de delante, y eso es lo que da profundidad al
    // graderío en las seis secciones. `castShadow` viene en `false` por defecto
    // en cualquier `Mesh`, así que hay que activarlo a mano (en el código
    // original nunca se activó: el público no proyectaba).
    // Coste: los 5 × sectores instanciados entran en el horneado del mapa de
    // sombras, que es ÚNICO, no en cada fotograma.
    im.castShadow = true;
    g.add(im);
  }
  for (const im of arms) {
    (im.geometry.getAttribute('aAlto') as THREE.InstancedBufferAttribute).needsUpdate = true;
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

/** Píxel de texto con el que se pinta un récord corto (el caso normal). */
const SCORE_PX_MAX = 9;
/** Margen que se deja entre el texto y el borde del lienzo, en píxeles. */
const SCORE_PAD_X = 8;
const SCORE_PAD_Y = 8;

/**
 * El texto del marcador SIEMPRE tiene que caber en el lienzo, para CUALQUIER
 * valor que pueda acabar en `localStorage`.
 *
 * El ancho de `drawPixelText` es `(caracteres·6 − 1)·px`, así que con `px` fijo en
 * 9 el texto se salía del lienzo por los dos lados a partir de 7 caracteres
 * ("1234/567" son 9) y los dígitos de los extremos quedaban directamente
 * fuera de la textura: no se veían. El marcador guarda lo que venga de
 * `court.stats` sin acotar, y ese número lo escribe el usuario (o una versión
 * vieja del juego), así que el ancho no se puede suponer.
 *
 * Por eso el tamaño de píxel se DEDUCE del texto: el mayor entero que deja el
 * texto centrado con margen por los cuatro lados, sin pasar de 9 (que es el
 * que se ve bien de cerca). Todo lo que se pasa a `fillRect` son enteros, así
 * que el resultado sigue siendo pixel-art puro: sin antialiasing, sin
 * escalado, sin medio píxel.
 *
 * Con el recorte de `scoreText` (6 cifras por número, 13 caracteres en el peor
 * caso) el mínimo sale en `px = 4`, que sigue siendo legible; el `Math.max(1,
 * …)` de abajo es la red de seguridad para que la garantía sea del código y
 * no del supuesto sobre el contenido del almacenamiento.
 */
function scoreFontPx(txt: string): number {
  // `pixelTextWidth` cuenta `(caracteres·6 − 1)` columnas; aquí sólo hace falta
  // ese ancho en unidades de píxel para dividir el hueco disponible.
  const cols = Math.max(1, [...txt].length * 6 - 1);
  const porAncho = Math.floor((SCORE_W - 2 * SCORE_PAD_X) / cols);
  const porAlto = Math.floor((SCORE_H - 2 * SCORE_PAD_Y) / 7);
  return Math.max(1, Math.min(SCORE_PX_MAX, porAncho, porAlto));
}

/**
 * El récord tal y como se ve en la pantalla: `hechos/intentos`, acotado.
 *
 * Los dos números vienen de `JSON.parse(localStorage)` y `main.ts` sólo
 * comprueba que sean `number` y no negativos: pueden llegar decimales
 * ("3,7"), infinitos, o cifras de 40 dígitos escritos a mano. Sin acotar, un
 * número enorme da una cadena que no cabe en 336 px y el texto se vuelve a
 * salir del lienzo por los dos lados. Se redondea a entero y se limita a 6
 * cifras, que a 80 px/m dan un marcador de miles de tiros: más que eso ya no
 * es un récord, es un dato corrupto del almacenamiento.
 */
function scoreText(made: number, attempted: number): string {
  const n = (v: number): number => Math.max(0, Math.min(999999, Math.round(Number.isFinite(v) ? v : 0)));
  return `${n(made)}/${n(attempted)}`;
}

/** Pinta el fondo, el bisel y `txt` centrado en el lienzo del marcador. */
function paintScore(g: CanvasRenderingContext2D, txt: string): void {
  g.fillStyle = '#080d18';
  g.fillRect(0, 0, SCORE_W, SCORE_H);
  // Marco interior: un bisel de dos tonos, como los marcadores de verdad.
  g.fillStyle = '#1f2937';
  g.fillRect(0, 0, SCORE_W, 6);
  g.fillRect(0, SCORE_H - 6, SCORE_W, 6);
  g.fillRect(0, 0, 6, SCORE_H);
  g.fillRect(SCORE_W - 6, 0, 6, SCORE_H);

  const px = scoreFontPx(txt);
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
  /**
   * Muestra `text` ENCIMA del récord durante `ms` y vuelve al récord solo.
   *
   * Es la pieza de infraestructura de P7 (el cableado lo pone `main.ts`): el
   * marcador no sabe qué ha pasado en la partida, sólo que hay un texto
   * urgente que tapar un momento ("¡FALTA!", "90", "FIN") y luego dejar que la
   * pantalla vuelva sola al marcador real.
   */
  flash(text: string, ms: number): void;
}

/*
 * `maxAnisotropy` es el valor de `renderer.capabilities.getMaxAnisotropy()`.
 *
 * HECHO en `src/game/main.ts`:
 *
 *     const scoreboard = buildScoreboard(renderer.capabilities.getMaxAnisotropy());
 *
 * (mismo llamador que las dos líneas de arriba, que ya lo hacen con
 * `buildCourt` y `buildCourtLines`). El parámetro es opcional con valor por
 * defecto 1 sólo para que el gate siga en verde mientras tanto; sin él, la
 * textura se muestrea sin anisotropía.
 */
export function buildScoreboard(maxAnisotropy = 1): Scoreboard {
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

  const TILT = 0.44; // ~25°
  const TAN_T = Math.tan(TILT);
  const COS_T = Math.cos(TILT);
  /**
   * MEDIA altura del plano de la pantalla en el mundo: `H·cos(TILT)`.
   *
   * El plano mide 2·H de alto, pero está inclinado, así que su huella vertical
   * es 2·H·cos(25°) = 0,995 m, no 1,1 m. Es la altura contra la que hay que
   * comparar las filas de la carcasa.
   */
  const SCREEN_HY = H * COS_T; // 0,4976 m
  /**
   * `z` del CENTRO del plano, medido desde el eje del tablero.
   *
   * Es LA constante del arreglo. Antes valía 0,37 m y la carcasa era una caja de
   * semifondo 0,36 m: el plano, inclinado sobre su propio centro, metía su
   * borde inferior en z = 0,37 − H·sin(25°) = 0,137 m, es decir 22 cm DENTRO de
   * la caja, que lo ocluía. Con la carcasa ahora en cuña (ver más abajo) el
   * plano tiene que vivir por delante de TODA la cuña, y su punto más cercano
   * al eje es el borde inferior (z = 0,4 − 0,234 = 0,166 m), de modo que 0,4 m
   * es lo que deja la pantalla pegada a su carcasa sin hundirse en ella.
   */
  const SCREEN_Z = 0.4;
  /** Grano de la carcasa: 12,5 cm (VoxelWorld no admite planos inclinados). */
  const V = VOXEL * 4;
  /** Semifondo de la espina central que comparten las dos cuñas: una celda. */
  const CORE = V;

  /**
   * Cara frontal de la carcasa en la fila cuya base está a `yLow`.
   *
   * El plano inclinado pasa por (y, SCREEN_Z) con pendiente `TAN_T` en z: la
   * pantalla está en z(y) = SCREEN_Z + (y − y)·tan(25°) = SCREEN_Z +
   * (yLow − y)·tan(25°) + [0, V·tan(25°)) a lo largo de toda la fila, porque
   * dentro de una celda de 12,5 cm el plano sólo sube 5,9 cm.
   *
   * La regla del recorte es "el frente de la carcasa NUNCA pasa del plano", y
   * como dentro de la fila el plano sólo sube, el punto más bajo es el de la
   * base: frente = ⌊z(yLow)/V⌋·V. Eso deja un peldaño cada vez que el plano
   * cruza un múltiplo de 12,5 cm (aquí, en las filas 44, 46 y 48: tres peldaños
   * a lo largo de los 1,25 m del tablero), y un hueco máximo de V + V·tan(25°)
   * = 18 cm entre peldaño y plano. Ese hueco es el precio de voxelizar una
   * inclinación, y no se ve: está DETRÁS de un plano opaco que la cámara
   * siempre tiene delante (el punto de vista queda a 65° del plano, no a más
   * de 90°), así que sólo se transparenta desde el otro lado, que es el interior
   * de la carcasa.
   */
  const rowFront = (yLow: number): number =>
    Math.max(CORE, Math.floor((SCREEN_Z + (yLow - y) * TAN_T) / V) * V);

  // ── Estructura: cuña escalonada que sigue la inclinación, y cables.
  group.add(
    voxelGroup('scoreboardBody', (v) => {
      const CUERPO = 0x2b3550;
      const MARCO = 0x8e9cb4;
      // Dos filas de remate por arriba y por debajo del plano.
      const i0 = Math.floor((y - SCREEN_HY) / V) - 2;
      const i1 = Math.ceil((y + SCREEN_HY) / V) + 1;
      for (let iy = i0; iy <= i1; iy++) {
        const y0 = iy * V;
        const y1 = y0 + V;
        // Remate = fila que NO toca el panel: se pinta enteramente de claro y
        // hace de marco superior e inferior.
        const remate = y1 <= y - SCREEN_HY || y0 >= y + SCREEN_HY;
        const XW = remate ? W + 0.3 : W + 0.14;
        // Espina central, común a las dos caras.
        v.span(-XW, y0, -CORE, XW, y1, CORE, remate ? MARCO : CUERPO);
        if (!remate) {
          // Raíles claros a los lados: el panel va encajado entre ellos.
          v.span(-XW, y0, -CORE, -(W + 0.02), y1, CORE, MARCO);
          v.span(W + 0.02, y0, -CORE, XW, y1, CORE, MARCO);
        }
        /*
         * LAS DOS CUÑAS, y son el arreglo del bug.
         *
         * Antes la carcasa era una caja recta de semifondo 0,36 m que atravesaba
         * el plano inclinado por la mitad (el "números cortados por la mitad" que
         * reportó quien juega). La caja no puede inclinarse —`VoxelWorld` sólo
         * emite celdas de un eje— así que en vez de una caja la carcasa es una
         * CUÑA ESCALONADA: el frente avanza de 12,5 en 12,5 cm a medida que
         * sube, replicando la inclinación del panel, en vez de cortarlo.
         *
         * La celda `n` ocupa z ∈ [n·V, (n+1)·V] y su cara frontal es (n+1)·V en
         * +Z y n·V en −Z; por eso la cuña de +Z se rellena hacia delante desde
         * la primera celda fuera de la espina y la de −Z se escribe con los
         * signos cambiados. Las dos quedan SIMÉTRICAS: la misma profundidad y el
         * mismo frente, y el centro de las dos pantallas baja 0,166 m del eje,
         * donde ya no hay nada que lo tape.
         */
        const kExt = Math.max(0, Math.round(rowFront(y0) / V) - 1);
        for (const s of [-1, 1]) {
          for (let n = 1; n <= kExt; n++) {
            const zA = s > 0 ? n * V : -(n + 1) * V;
            const zB = s > 0 ? (n + 1) * V : -n * V;
            v.span(-XW, y0, zA, XW, y1, zB, remate ? MARCO : CUERPO);
            if (!remate) {
              v.span(-XW, y0, zA, -(W + 0.02), y1, zB, MARCO);
              v.span(W + 0.02, y0, zA, XW, y1, zB, MARCO);
            }
          }
        }
      }
      // Cuatro cables a las cerchas del techo, arrancados de dentro del remate.
      const yTecho = (i1 + 1) * V;
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          v.span(sx * (W - 0.2) - 0.03, yTecho - V, sz * 0.24 - 0.03, sx * (W - 0.2) + 0.03, 14.2, sz * 0.24 + 0.03, 0x1f2937);
        }
      }
      // Grano GRUESO (12,5 cm): es una cuña lisa de 4,2 x 1,6 m vista desde 12 m.
      // A 3 cm costaba 18.000 triángulos de superficie que no se distinguen.
    }, V),
  );

  const canvas = document.createElement('canvas');
  canvas.width = SCORE_W;
  canvas.height = SCORE_H;
  const g = canvas.getContext('2d');
  if (g) paintScore(g, scoreText(0, 0));
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  /*
   * ANISOTROPÍA: es lo que hace falta para leer los dígitos de verdad.
   *
   * El panel está inclinado 25° y la cámara de juego lo mira desde 11 m por
   * encima, o sea con ~65° entre la normal y la línea de visión, y a 12 m de
   * distancia el panel ocupa una franja de pocos píxeles de alto. Sin
   * anisotropía el `LinearMipmapLinear` promedia un nivel de mipmap MUY
   * reducido (el footprint de un píxel es una mancha larguísima sobre la
   * textura), los trazos de 5x7 se mezclan entre sí y los dígitos salen
   * cortados y con los bordes parpadeando. Con anisotropía se muestrea un
   * mipmap por cada dirección del footprint y la cifra se reconstruye entera.
   * Es el mismo motivo por el que `buildCourt` y `buildCourtLines` ya la piden.
   */
  tex.anisotropy = maxAnisotropy;
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
   *
   * El plano gira SOBRE SU CENTRO, así que al inclinarlo su borde inferior se
   * acerca al eje z en H·sin(25°) = 23,4 cm y el superior se aleja otros tantos.
   * `SCREEN_Z` está elegido justo para que ese borde inferior quede por delante
   * de la cuña (`rowFront`), y no "subiendo" el plano: el descentrado no es un
   * parche, es lo que hace que el panel se APOYE en la carcasa y no sobresalga
   * flotando medio metro por delante del tablero.
   */
  for (const sz of [-1, 1]) {
    const face = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, H * 2), mat);
    face.position.set(0, y, sz * SCREEN_Z);
    face.rotation.set(TILT, sz < 0 ? Math.PI : 0, 0, 'YXZ');
    face.name = `scoreboardFace${sz > 0 ? 'F' : 'B'}`;
    group.add(face);
  }

  /*
   * PINTADO DEL PANEL.
   *
   * `record` es el último récord pedido con `setScore` y `efimero` lo que hay
   * encima ahora mismo. Se guardan los DOS para que un `setScore` que llega
   * mientras hay un efímero en pantalla no lo borre, y para que al terminar el
   * efímero se vuelva al récord MÁS RECIENTE y no a uno viejo.
   *
   * El repintado sigue siendo a evento, nunca por fotograma: se toca el lienzo
   * y se sube la textura una sola vez.
   */
  let record = scoreText(0, 0);
  let efimero = '';
  let reloj: number | undefined;

  const pintar = (txt: string): void => {
    if (!g) return;
    paintScore(g, txt);
    tex.needsUpdate = true;
  };

  const setScore = (made: number, attempted: number): void => {
    record = scoreText(made, attempted);
    pintar(efimero || record);
  };

  const flash = (text: string, ms: number): void => {
    efimero = text;
    pintar(text);
    if (reloj !== undefined) window.clearTimeout(reloj);
    reloj = window.setTimeout(() => {
      reloj = undefined;
      efimero = '';
      pintar(record);
    }, Math.max(0, ms));
  };

  // Los métodos van en el propio grupo (no en `userData`) para que `main.ts` los
  // llame tipado: `board.setScore(...)`, `board.flash(...)`.
  const board = group as Scoreboard;
  board.setScore = setScore;
  board.flash = flash;
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
    // Focos colgantes: péndulo y carcasa (visera). El PANEL ENCENDIDO de cada
    // foco ya no se pinta aquí con un color de vértice: eso era un bloque más
    // del techo, iluminado como cualquier otro, que desde la cámara de juego
    // sólo se veía por debajo y no brillaba nada. Ahora lo construye
    // `buildLampFaces`, con material emisivo y como malla propia.
    for (const x of LAMP_COLS) {
      for (const z of LAMP_ROWS) {
        v.span(x - 0.05, Y - 1.6, z - 0.05, x + 0.05, Y, z + 0.05, 0x2b3550);
        v.span(x - 0.62, Y - 2.1, z - 0.44, x + 0.62, Y - 1.6, z + 0.44, 0x5d6f96);
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
 * LOS PANELES ENCENDIDOS DE LOS DOCE FOCOS.
 *
 * Lo que faltaba antes: el color `0xfff3c4` de la «cara emisiva» era un color
 * de VÉRTICE sobre `VOXEL_MATERIAL`, es decir un bloque más del techo que se
 * iluminaba como los demás. No brillaba, no era fuente de luz y desde la cámara
 * de juego —que está a 12,4 m de alto, por encima de los focos— sólo se veía su
 * cara de abajo. Aquí cada foco lleva su panel con material propio, que no depende
 * de ninguna luz para verse encendido.
 *
 *  · **Un `InstancedMesh`, no doce mallas**: doce cajas sueltas serían doce draw
 *    calls en el fotograma de juego. Con instancias es **una llamada fija**.
 *  · **No proyecta sombra**: el mapa de sombras se hornea UNA vez al final de la
 *    carga (`bakeShadows`), así que un proyectante estático de más sólo añadiría
 *    triángulos al horneado sin aportar nada. El techo entero va con
 *    `noCastShadow` por lo mismo.
 *  · **No entra en el fundido de mallas estáticas**: `batchStaticMeshes` compara
 *    el material POR IDENTIDAD y sólo funde `VOXEL_MATERIAL`, así que esta malla
 *    se queda suelta. Sigue valiendo **+1 draw call**, que es el precio de que
 *    los focos brillen; a cambio el resto del techo no se ha movido ni un bloque.
 *  · `frustumCulled = false` a propósito: la esfera envolvente de una malla
 *    instanciada abarca pista y torres y no la va a descartar nunca, y así no
 *    depende de calcularla bien.
 */
function buildLampFaces(): THREE.InstancedMesh {
  const cajas: THREE.Vector3[] = [];
  for (const x of LAMP_COLS) {
    for (const z of LAMP_ROWS) cajas.push(new THREE.Vector3(x, LAMP_FACE_Y, z));
  }
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(LAMP_FACE_W, 0.08, LAMP_FACE_D),
    LAMP_FACE_MATERIAL,
    cajas.length,
  );
  const pos = new THREE.Matrix4();
  for (let i = 0; i < cajas.length; i++) {
    pos.makeTranslation(cajas[i]!.x, cajas[i]!.y, cajas[i]!.z);
    mesh.setMatrixAt(i, pos);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.name = 'lampFaces';
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.frustumCulled = false;
  return mesh;
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
        // Cabezal del mástil y visera superior.
        v.span(x - 1.0, 7.6, z - 1.0, x + 1.0, 8.5, z + 1.0, 0x5d6f96);
        v.span(x - 1.05, 8.5, z - 1.05, x + 1.05, 8.62, z + 1.05, 0x6b7686);
        /*
         * Los seis "focos" del cabezal y su visera SE HAN QUITADO, y no por
         * decoración: eran geometría MUERTA, nunca visible.
         *
         * Con el grano de 25 cm de este grupo, la parrilla de focos caía en las
         * celdas iy 31-33, dentro del bloque del cabezal (iy 30-33) y en su
         * interior en x y z: `VoxelWorld` descarta las caras internas, así que no
         * emitía ni un triángulo. Y la visera (`8,40-8,48 m` → celdas 34 a 33)
         * directamente no tenía celdas: el rango salía al revés.
         *
         * Encima la cámara de juego mira desde 12,4 m con el borde superior del
         * encuadre 33° por debajo de la horizontal, y el cabezal está a 8,5 m
         * y a 23 m de distancia: 10° de pendiente, muy por encima del encuadre.
         * No se ve, y por tanto no hay nada que iluminar ni que emisivizar. Si
         * algún día el cabezal entra en cuadro, la emisiva va en su cara
         * SUPERIOR con material propio, como la de los focos colgantes
         * (`buildLampFaces`), y no con un color de vértice.
         */
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
  // Los paneles encendidos de los focos van FUERA del techo y no entran en el
  // fundido (material propio): una llamada fija más en el fotograma de juego.
  const lampFaces = buildLampFaces();
  console.info(
    `[court] tiempos ms -> stands ${(t1 - t0) | 0}, boards ${(t2 - t1) | 0}, ` +
    `torres ${(t3 - t2) | 0}, vegetacion ${(t4 - t3) | 0}, techo ${(t5 - t4) | 0}`,
  );
  group.add(around, floor, stands, boards, towers, scatter, ceiling, lampFaces);
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