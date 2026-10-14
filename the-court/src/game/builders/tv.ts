import * as THREE from 'three';
import { animateHuman, buildHuman, type HumanRig } from './human';
import { PALETTE, VOXEL, VoxelWorld, canvasTexture, noCastShadow, voxelGroup } from './util';

export interface InterviewSet {
  group: THREE.Group;
  reporter: HumanRig;
  operator: HumanRig;
  tally: THREE.Mesh;
  onAir: THREE.Mesh;
}

/**
 * Cámara de TV de estudio sobre trípode, en voxels. Apunta hacia +Z local.
 * Devuelve la luz de "tally" como Mesh suelta porque main.ts la enciende y apaga.
 */
export function buildTvCamera(): { group: THREE.Group; tally: THREE.Mesh } {
  const g = voxelGroup('tvCamera', (v) => {
    // Cuerpo, visor lateral y cabeza del trípode.
    v.span(-0.23, 1.31, -0.4, 0.23, 1.69, 0.4, 0x1f2937);
    v.span(0.23, 1.49, -0.2, 0.33, 1.69, 0.1, 0x111827); // visor
    v.span(-0.09, 1.19, -0.09, 0.09, 1.31, 0.09, 0x374151); // cabeza del trípode

    // Objetivo: 3 anillos de bloques que growan hacia +Z (el "barril").
    for (let i = 0; i < 3; i++) {
      const z0 = 0.4 + i * 0.12;
      const r = 0.17 - i * 0.02;
      v.span(-r, 1.5 - r, z0, r, 1.5 + r, z0 + 0.12, i === 0 ? 0x0b0f19 : 0x111827);
    }
    // Parpeta del objetivo: bloque oscuro que sobresale.
    v.span(-0.21, 1.29, 0.72, 0.21, 1.71, 0.84, 0x111827);

    // Patas del trípode: peldaños de bloques, no cilindros.
    for (const [dx, dz] of [[0.65, 0], [-0.325, 0.56], [-0.325, -0.56]] as const) {
      const steps = 13;
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const y = 1.19 - t * 1.19;
        const x = dx * t;
        const z = dz * t;
        v.span(x - 0.055, y - 0.09, z - 0.055, x + 0.055, y, z + 0.055, 0x374151);
      }
    }
  });

  // Luz tally: 1 bloque suelto (para poder cambiarle el color en caliente).
  const tally = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.1),
    new THREE.MeshBasicMaterial({ color: PALETTE.tallyOn }),
  );
  tally.position.set(0, 1.78, 0.3);
  g.add(tally);
  return { group: g, tally };
}

/** Rótulo "ON AIR": mismo texto en ambos idiomas, así que no necesita traducción. */
function onAirTexture(on: boolean): THREE.CanvasTexture {
  return canvasTexture(128, 48, (g) => {
    g.fillStyle = on ? '#7f1d1d' : '#2a1010';
    g.fillRect(0, 0, 128, 48);
    g.fillStyle = on ? '#ffffff' : '#7f5151';
    g.font = 'bold 28px "Silkscreen", "Bebas Neue", monospace';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('ON AIR', 64, 26);
  });
}

/** Plató de entrevista: fondo, reportero con micro, cámara, operador y cartel ON AIR. */
export function buildInterviewSet(): InterviewSet {
  const group = new THREE.Group();

  // El fondo del plató es un muro: con la luz del techo su sombra cae DETRÁS
  // del muro, sobre el zócalo que ya está a oscuras. Medido: 0 píxeles.
  const setVox = noCastShadow(voxelGroup('setDressing', (v) => {
    // Fondo del plató + franja naranja.
    v.span(6.8, 0, 11.2, 12.2, 2.6, 11.32, 0x111827);
    v.span(6.8, 2.0, 11.16, 12.2, 2.16, 11.22, PALETTE.shirt);
    // Zócalo para que el plató no flote sobre el parqué.
    v.span(6.6, 0, 10.9, 12.4, 0.08, 11.5, 0x0b1220);
    // Grano GRUESO: es un muro plano de 5,4 x 2,6 m. A 3 cm costaba 75.000
    // triángulos de superficie lisa que no se distinguen en pantalla.
  }, VOXEL * 4));
  group.add(setVox);

  const onAirTex = onAirTexture(false);
  const onAir = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.41, 0.1),
    new THREE.MeshStandardMaterial({ map: onAirTex, emissive: 0xff2d2d, emissiveMap: onAirTex, emissiveIntensity: 0.15 }),
  );
  onAir.position.set(9.5, 2.95, 11.2);
  group.add(onAir);

  const reporter = buildHuman({
    skin: 0xe8a56f, skinAlt: 0xcf8a52, hair: 0x352a22, hairAlt: 0x241c16,
    jersey: 0x4fa8f0, jerseyAlt: 0x2f76bd, shorts: 0x35406b, shoes: 0xfdfdf6, accent: 0xff8c3a,
  });
  reporter.root.position.set(9.0, 0, 9.7);
  reporter.root.rotation.y = Math.PI; // mira hacia -Z (la cancha)

  // Micrófono en voxels, sujeto a la mano derecha.
  const micV = new VoxelWorld();
  micV.span(-0.03, -0.2, -0.03, 0.03, 0.06, 0.03, 0x111111);
  micV.span(-0.07, 0.06, -0.07, 0.07, 0.18, 0.07, PALETTE.shirt);
  micV.span(-0.05, 0.18, -0.05, 0.05, 0.22, 0.05, 0x111111);
  const mic = micV.build({ name: 'mic' });
  // El micrófono cuelga del BRAZO, y el brazo del reportero está rotado
  // -1,45 rad (-83°) para sostenerlo delante del pecho. Esa rotación dejaba el
  // micro casi HORIZONTAL, apuntando hacia delante. Con +90° en su eje local se
  // compensa y el micro queda vertical, con la cápsula hacia arriba, junto a la
  // boca: que es como se sostiene un micrófono de reportero.
  mic.rotation.x = Math.PI / 2;
  mic.position.set(0, -0.6, 0.06);
  reporter.armR.add(mic);

  const cam = buildTvCamera();
  cam.group.position.set(11.0, 0, 8.7);
  cam.group.rotation.y = -Math.PI / 2; // apunta hacia -X (el punto de entrevista)

  const operator = buildHuman({
    skin: 0xd69457, skinAlt: 0xbd7c42, hair: 0x54371f, hairAlt: 0x3b2515,
    jersey: 0x7e58c8, jerseyAlt: 0x5f3fa3, shorts: 0x35406b, shoes: 0xfdfdf6, accent: 0x4fa8f0,
  });
  operator.root.position.set(11.9, 0, 8.7);
  operator.root.rotation.y = -Math.PI / 2;

  group.add(reporter.root, cam.group, operator.root);
  // Los dos actores del plató se mueven (y el reportero sostiene el micro que ya
  // cuelga de su brazo), así que NO pueden proyectar sobre un mapa de sombras
  // congelado: dejarían su silueta clavada en el suelo del plató.
  noCastShadow(reporter.root);
  noCastShadow(operator.root);
  return { group, reporter, operator, tally: cam.tally, onAir };
}

/* ===========================================================================
 * VIDA EN EL PLATÓ
 * ---------------------------------------------------------------------------
 * Los dos actores comparten `animateHuman`, que está hecho para el JUGADOR: una
 * zancada, un braceo en oposición y nada más. En el plató no hay zancada, así que
 * de sus capas sólo sale la respiración, y el resultado era un reportero y un
 * operador con la misma quietud de estatua que una figura de la grada.
 *
 * Aquí van por encima las CUATRO cosas que hacen que alguien esté de pie
 * esperando (nada de ellas toca una matriz en CPU de más: son rotaciones de los
 * pivotes que ya existen, siete números por actor y fotograma).
 * ========================================================================= */

/**
 * Reportero: peso de un pie al otro, hombros, respiración y gestos del brazo
 * LIBRE.
 *
 * `habla` (0..1) es lo que separa «de pie en el plató» de «diciendo algo».
 *
 * El brazo del micro (`armR`) NO se toca, y es deliberado: el micrófono cuelga
 * de él (`mic.position` dentro de `armR`) y `main.ts` le pone el ángulo de la
 * entrevista. Cualquier retoque en ese brazo se traduciría en un micrófono
 * atravesando la cara, que es el peor sitio donde puede estar. El gesto de la
 * mano libre (`armL`) es el que se mueve: es la mano que señala, la que apoya
 * en la cadera, la que acompaña a la frase.
 *
 * La inclinación de cabeza va por `torso`, que es el pivote de la cabeza (la
 * cabeza es hija suya): un cabeceo de 3° se lee a 9 m, que es a la distancia a
 * que se ve el plató desde el juego.
 */
export function animateTvReporter(rig: HumanRig, time: number, habla = 0): void {
  animateHuman(rig, time, 0, false);

  // Peso de un pie a otro: periodo lento (3,7 s) y 2,5 cm de desplazamiento.
  // Es lo que separa «plantado» de «apoyado».
  const peso = Math.sin(time * 1.7);
  rig.body.position.x = peso * 0.025;
  // La pierna que carga se estira y la otra se acorta: el peso también se ve en
  // las rodillas, no sólo en el balanceo de la cadera.
  rig.legL.rotation.x += peso * 0.05;
  rig.legR.rotation.x -= peso * 0.03;
  // Respiración: el torso sube y baja un 1,4 %, un poco más que el jugador,
  // porque nadie aguanta la respiración con el pecho quieto.
  rig.torso.scale.y = 1 + Math.sin(time * 2) * 0.014;
  // Balanceo de hombros, en oposición: si los dos van a la vez, el torso se ve
  // rígido.
  rig.armL.rotation.x += Math.sin(time * 0.9 + 1.1) * 0.05;
  rig.armR.rotation.x += Math.sin(time * 0.9 + 1.1) * 0.05;

  // Gesto del brazo libre. Es un ASENTIR con el brazo, no un ademán grande: a
  // 9 m un gesto de 0,4 rad son 20 px y ya se ve, uno de 1 rad es un manoteo.
  rig.armL.rotation.x += habla * (-0.38 + Math.sin(time * 2.6) * 0.13);
  rig.armL.rotation.z += habla * (0.2 + Math.sin(time * 1.9) * 0.07);

  // Cabeza: asentimiento al hablar (frecuencia de sílaba) y una inclinación
  // lateral lenta, que es la postura de quien escucha a su propia voz.
  rig.torso.rotation.x += habla * Math.sin(time * 2.3) * 0.07;
  /*
   * Inclinación lateral de cabeza y hombros, con ASIGNACIÓN, no suma.
   *
   * `animateHuman` fija `torso.rotation.x` y `.y` en absoluto cada fotograma
   * pero NO toca `.z`, así que un `+=` aquí iría sumando el valor del fotograma
   * anterior indefinidamente: el torso se iría girando cada vez más (un paseo
   * aleatorio que además crece con el frame rate, porque el paso es el mismo
   * con 60 fps que con 144). Se asigna para que sea una postura, no un acumulador.
   */
  rig.torso.rotation.z = Math.sin(time * 1.3) * 0.04 + habla * Math.sin(time * 1.7) * 0.03;
}

/**
 * Operador de cámara: de pie junto al trípode, con las manos en la posición de
 * quien espera el corte.
 *
 * No lleva micrófono, así que los dos brazos están libres: uno apoya el cuerpo
 * en la cadera y el otro se queda sobre el ocular, con un vaivén lento. Es el
 * mismo esqueleto con otra forma de estar: las mismas cuatro capas de encima
 * (peso, rodillas, respiración, hombros) y sólo los brazos cambiados.
 */
export function animateTvOperator(rig: HumanRig, time: number): void {
  animateHuman(rig, time, 0, false);

  const peso = Math.sin(time * 1.4 + 0.8);
  rig.body.position.x = peso * 0.022;
  rig.legL.rotation.x += peso * 0.04;
  rig.legR.rotation.x -= peso * 0.025;
  rig.torso.scale.y = 1 + Math.sin(time * 1.8 + 0.5) * 0.012;

  // Brazo derecho apoyado en la cadera (el del lado del trípode) y el otro
  // delante, a media altura, como quien sostiene el ocular.
  rig.armR.rotation.x = -0.45 + Math.sin(time * 0.8) * 0.05;
  rig.armR.rotation.z = -0.5;
  rig.armL.rotation.x = -1.1 + Math.sin(time * 1.1 + 2) * 0.07;
  rig.armL.rotation.z = 0.22;
  // Mira a donde apunta la cámara, con una deriva mínima. Igual que en el
  // reportero, `.z` se ASIGNA: `animateHuman` no lo reinicia (ver el comentario
  // de arriba) y un `+=` aquí lo convertiría en un acumulador.
  rig.torso.rotation.y = 0.12 + Math.sin(time * 0.5) * 0.05;
  rig.torso.rotation.z = Math.sin(time * 1.6) * 0.03;
}

export { onAirTexture };