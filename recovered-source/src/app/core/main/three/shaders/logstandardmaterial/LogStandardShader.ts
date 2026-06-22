import * as THREE from "three";

/**
 * Stub for the original custom LogStandardShader material. The source was not in
 * the production source map and all instantiations are commented out in the
 * deployed code, so this minimal subclass of MeshStandardMaterial is enough to
 * restore compilation.
 */
export class LogStandardShader extends THREE.MeshStandardMaterial {
  constructor(parameters?: THREE.MeshStandardMaterialParameters) {
    super(parameters);
  }
}
