import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { loadModel } from './assets';

export interface GlbCharacter {
  root: THREE.Group;
  /** speed01 ∈ [0, 1]: mezcla entre la animación idle y la de correr. */
  update(dt: number, speed01: number): void;
}

/**
 * Personaje desde un .glb con animaciones (p. ej. Quaternius o Mixamo).
 * Devuelve null si el archivo falla o no contiene los clips pedidos:
 * el llamador conserva entonces el personaje procedural.
 */
export async function buildCharacterFromGLB(
  url: string,
  opts: { idle: string; run: string; scale?: number },
  manager?: THREE.LoadingManager,
): Promise<GlbCharacter | null> {
  const model = await loadModel(url, manager);
  if (!model) return null;
  const idle = THREE.AnimationClip.findByName(model.animations, opts.idle);
  const run = THREE.AnimationClip.findByName(model.animations, opts.run);
  if (!idle || !run) {
    console.warn(`[assets] ${url}: clips disponibles = ${model.animations.map((a) => a.name).join(', ')}`);
    return null;
  }
  const root = new THREE.Group();
  const obj = cloneSkinned(model.scene) as THREE.Group; // clone() normal rompe los esqueletos
  obj.scale.setScalar(opts.scale ?? 1);
  root.add(obj);
  const mixer = new THREE.AnimationMixer(obj);
  const idleAction = mixer.clipAction(idle).play();
  const runAction = mixer.clipAction(run).play();
  return {
    root,
    update(dt, speed01) {
      idleAction.setEffectiveWeight(1 - speed01);
      runAction.setEffectiveWeight(speed01);
      mixer.update(dt);
    },
  };
}
