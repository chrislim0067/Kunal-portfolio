import { AbstractSpawnable } from "./abstract-spawnable";

import * as THREE from "three";
import { MeshBasicMaterial } from "three";

export class SpawnableTower extends AbstractSpawnable {
  create() {}

  createTower() {
    const tower = this.ts.assets.getAsset("tower").data;
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0) });
    //  new THREE.MeshPhongMaterial({ color: 0x000000 });
    this.ts.prepareFogMaterial(mat).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });

    tower.traverse((child) => {
      if (child.isMesh) {
        // child.castShadow = true;
        child.material = mat;
      }
    });

    return tower;
  }

  createChild(instance, x, y, z): THREE.Object3D {
    const obj = new THREE.Object3D();
    const tower = this.createTower();
    tower.scale.setScalar(1000);
    tower.position.y = -200;
    obj.add(tower);
    return obj;
  }

  manipulateChild(child: THREE.Object3D) {
    const pos = child.getWorldPosition(this.tempPos);

    child.position.y = this.ts.spawner.ground.getGroundLevelRay(pos) + 0.3;
  }
}
