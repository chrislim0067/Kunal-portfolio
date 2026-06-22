import * as THREE from "three";
import { AbstractThreeManager } from "./abstract-three-manager";
import { ThreeService } from "../three.service";

/**
 * Stub for the original LogBuilderManager. The source for this manager was not
 * present in the production source map. In the deployed build the builder was
 * never instantiated (its creation is commented out in three.service.ts), so a
 * minimal type-compatible implementation is sufficient to restore compilation.
 */
export class LogBuilderManager extends AbstractThreeManager {
  positionalSpawnables: { id: string }[] = [];

  constructor(public ts: ThreeService) {
    super(ts);
  }

  create() {}

  build(_point: THREE.Vector3) {}
}
