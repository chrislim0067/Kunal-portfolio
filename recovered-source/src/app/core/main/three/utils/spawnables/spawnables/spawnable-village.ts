import { AbstractSpawnable, SpawnablePosition } from "./abstract-spawnable";

import * as THREE from "three";
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Object3D } from "three";

export class SpawnableVillage extends AbstractSpawnable {
  create() {}

  createVillage(parentObj: THREE.Object3D) {
    const v1 = this.ts.assets.getAsset("v1").data;
    const v2 = this.ts.assets.getAsset("v2").data;
    const v3 = this.ts.assets.getAsset("v3").data;
    const audio = this.ts.assets.getPositionalAudio("village");

    const houses = [v1, v2, v3];

    const mat = new THREE.MeshPhongMaterial({ color: 0x000000 });
    this.ts.prepareFogMaterial(mat).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });

    houses.forEach((h) => {
      h.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.material = mat;
        }
      });
      h.scale.setScalar(14);
      h.position.y = -40;
    });

    const sizeW = this.ts.site.isMobile ? 3 : 4;
    const sizeD = this.ts.site.isMobile ? 3 : 4;
    const gap = this.ts.site.isMobile ? 300 : 250;
    const village = new Object3D();
    for (let x = 0; x < sizeW; x++) {
      for (let z = 0; z < sizeD; z++) {
        const noise = this.noiseGenerators[0].simplex2(z, x);
        const h = houses[Math.floor(Math.abs((10 + noise + x * z) % 3))].clone();
        h.position.x = gap * x;
        h.position.z = gap * z;
        h.rotation.y = Math.PI * noise;
        village.add(h);
      }
    }

    village.add(audio);
    audio.position.x = (gap * sizeW) / 2;
    audio.position.z = (gap * sizeD) / 2;
    // const audioMesh = new Mesh(new BoxGeometry(100, 100, 100), new MeshBasicMaterial({ color: new Color(1, 0, 0) }));
    // village.add(audioMesh);
    // audioMesh.position.copy(audio.position);
    parentObj.userData.audio = audio;
    // audio.getWorldPosition(this.tempPos);
    // audio.position.y = this.ts.spawner.ground.getGroundLevel(this.tempPos);

    return village;
  }

  createChild(instance, x, y, z, pos: SpawnablePosition, parentObj: Object3D): THREE.Object3D {
    const village = this.createVillage(parentObj);
    return village;
  }

  manipulateChild(child: THREE.Object3D, instance) {
    // const pos = child.getWorldPosition(this.tempPos);
    // child.position.y = this.ts.spawner.ground.getGroundLevelRay(pos);
    for (let i = 0; i < child.children[0].children.length; i++) {
      const ch = child.children[0].children[i];
      const pos = ch.getWorldPosition(this.tempPos);
      ch.position.y = this.ts.spawner.ground.getGroundLevel(this.tempPos) - 20;
      if (ch.type === "Audio" || ch.type === "Mesh") {
        ch.position.y += 150;
        // ch.updateMatrixWorld(true);
      }
    }
  }

  // destroy() {
  //     super.destroy();
  // }
}
