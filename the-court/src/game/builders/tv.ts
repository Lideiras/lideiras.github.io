import * as THREE from 'three';
import { buildHuman, type HumanRig } from './human';
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

export { onAirTexture };