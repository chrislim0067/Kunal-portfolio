import { AbstractSpawnable, SpawnablePosition } from "./abstract-spawnable";

import * as THREE from "three";
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Object3D } from "three";

export class SpawnableObj extends AbstractSpawnable {
  create() {}

  createChapel() {
    const chapel = this.ts.assets.getAsset("chapel").data;
    const mat = new THREE.MeshPhongMaterial({ color: 0x000000 });
    this.ts.prepareFogMaterial(mat).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });

    chapel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.material = mat;
      }
    });
    chapel.scale.setScalar(40);
    chapel.position.y = -40;

    return chapel;
  }

  createChild(instance, x, y, z, pos: SpawnablePosition, parentObj: Object3D): THREE.Object3D {
    const obj = new THREE.Object3D();
    const tower = this.createChapel();
    obj.add(tower);
    const audio = this.ts.assets.getPositionalAudio("chapel");
    obj.add(audio);
    // const audioMesh = new Mesh(new BoxGeometry(10, 10, 10), new MeshBasicMaterial({ color: new Color(1, 0, 0) }));
    // obj.add(audioMesh);
    // audioMesh.position.copy(audio.position);
    parentObj.userData.audio = audio;

    return obj;
  }

  manipulateChild(child: THREE.Object3D) {
    const pos = child.getWorldPosition(this.tempPos);
    child.position.y = this.ts.spawner.ground.getGroundLevelRay(pos);
  }

  // destroy() {
  //     super.destroy();
  // }
}
