import * as THREE from "three";

/**
 * Stub for the original custom LogBasicShader material. The source was not in
 * the production source map and all instantiations (`new LogBasicShader()`) are
 * commented out in the deployed code, so this minimal subclass of
 * MeshBasicMaterial is enough to restore compilation.
 */
export class LogBasicShader extends THREE.MeshBasicMaterial {
  constructor(parameters?: THREE.MeshBasicMaterialParameters) {
    super(parameters);
  }
}
