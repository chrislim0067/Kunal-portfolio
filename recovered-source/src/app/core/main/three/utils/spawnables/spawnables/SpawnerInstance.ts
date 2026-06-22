import * as THREE from "three";
import { SpawnableOptions, AbstractSpawnable } from "./abstract-spawnable";

export class SpawnerInstance {
  obj: THREE.Object3D = new THREE.Object3D();

  instanceChildren: THREE.Object3D[][][] = [];

  instancedPositions: THREE.Vector3[][][] = [];
  instancedMeshes: THREE.InstancedMesh[] = [];

  spawnedChildren: THREE.Object3D[] = [];
  origId: THREE.Vector3 = new THREE.Vector3();

  prevPosX;
  prevPosZ;
  prevPosY;

  positionalChildren: any[] = [];
  isSpawned = false;
  areaX;
  areaZ;
  spawnable: AbstractSpawnable;

  type: string;
  scene: THREE.Object3D;
  spawnChild(child: THREE.Object3D) {
    if (this.spawnable.options.isInstanced) {
      return;
    }
    if (this.spawnedChildren.indexOf(child) <= -1) {
      if (child.userData.audio && !child.userData.audio.isPlaying) child.userData.audio.play();
      this.obj.add(child);
      this.spawnedChildren.push(child);
    }
  }
  removeChild(child: THREE.Object3D) {
    if (!child) return;
    this.obj.remove(child);
    if (child.userData.audio && !child.userData.audio.isPlaying) child.userData.audio.pause();
    this.spawnedChildren.splice(this.spawnedChildren.indexOf(child), 1);
  }

  spawn() {
    if (!this.isSpawned) {
      this.obj.children.forEach((child) => {
        if (child.userData.audio) {
          child.userData.audio.pause();
          child.userData.audio.play();
          // console.log("Positional userdata started", child.userData);
        }
      });

      this.spawnable.positionalInstancesOnStage.push(this);
      this.scene.add(this.obj);
      this.obj.updateMatrixWorld();
      this.updateChildren();
      this.isSpawned = true;
    }
  }
  remove() {
    if (this.isSpawned) {
      const index = this.spawnable.positionalInstancesOnStage.indexOf(this);
      if (index > -1) {
        this.spawnable.positionalInstancesOnStage.splice(index, 1);
      }
      this.scene.remove(this.obj);

      this.obj.children.forEach((child) => {
        if (child.userData.audio && !child.userData.audio.isPlaying) {
          // console.log("Positional userdata pause", child.userData);
          child.userData.audio.pause();
        }
      });
      this.isSpawned = false;
    }
  }
  updateChildren() {
    setTimeout(() => {
      for (let i = 0; i < this.positionalChildren.length; i++) {
        const child = this.positionalChildren[i];
        child.getWorldPosition(this.spawnable.tempPos);
        this.spawnable.manipulateChild(child, this);
      }
    });
  }
}
