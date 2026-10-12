import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/** Gestor de progreso de carga compartido (solo se usa si añades modelos .glb). */
export function createLoadingManager(onProgress: (p: number) => void): THREE.LoadingManager {
  const m = new THREE.LoadingManager();
  m.onProgress = (_url, loaded, total) => onProgress(total ? loaded / total : 1);
  return m;
}

export interface LoadedModel { scene: THREE.Group; animations: THREE.AnimationClip[] }

/**
 * Carga un .glb. Si falla (404, red…) devuelve null para que el llamador
 * conserve la versión procedural. Nunca rompe el arranque del juego.
 */
export async function loadModel(url: string, manager?: THREE.LoadingManager): Promise<LoadedModel | null> {
  try {
    const gltf = await new GLTFLoader(manager).loadAsync(url);
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return { scene: gltf.scene, animations: gltf.animations };
  } catch (err) {
    console.warn(`[assets] no se pudo cargar ${url}; se usa el modelo procedural`, err);
    return null;
  }
}

/**
 * Normaliza un modelo glTF para usarlo dentro de nuestro mundo Y-up.
 *
 * Los assets de Sketchfab vienen en Z-up y con escalas arbitrarias, así que
 * aquí se centran en el origen, se giran al eje Y y se escalan a un tamaño
 * conocido. Sin esto el modelo aparece tumbado y con una escala que no
 * corresponde a nada.
 */
export function normalize(
  scene: THREE.Object3D,
  opts: { targetSize?: number; zUp?: boolean; liftTo?: number } = {},
): void {
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  scene.position.sub(center);
  if (opts.zUp) {
    scene.rotation.x = -Math.PI / 2;
    scene.updateMatrixWorld(true);
  }
  if (opts.targetSize && size.lengthSq() > 0) {
    scene.scale.setScalar(opts.targetSize / Math.max(size.x, size.y, size.z));
    scene.updateMatrixWorld(true);
  }
  if (opts.liftTo !== undefined) {
    const b = new THREE.Box3().setFromObject(scene);
    scene.position.y += opts.liftTo - b.max.y;
  }
}

/** Primera malla de un modelo cargado, o null si no hay ninguna. */
export function firstMesh(scene: THREE.Object3D): THREE.Mesh | null {
  let found: THREE.Mesh | null = null;
  scene.traverse((o) => {
    if (!found && (o as THREE.Mesh).isMesh) found = o as THREE.Mesh;
  });
  return found;
}
