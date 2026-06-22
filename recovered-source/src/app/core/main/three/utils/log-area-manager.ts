import * as THREE from "three";
import { AbstractSpawnable } from "./spawnables/spawnables/abstract-spawnable";
import { Subject } from "rxjs";
import { SpawnerInstance } from "./spawnables/spawnables/SpawnerInstance";

export class AreaManager {
  loadedAreas: any[][] = [];
  positionalSpawnables: SpawnerInstance[][][] = [];
  spawnedPositionalInstances: SpawnerInstance[] = [];
  normalizedArea = new THREE.Vector3();
  largeArea = new THREE.Vector3();
  areaSize = new THREE.Vector3(this.dimension.x * this.size.x, this.dimension.y * this.size.y, this.dimension.z * this.size.z);

  onAreaChange: Subject<THREE.Vector3> = new Subject();
  onUpdateGround: Subject<THREE.Vector3> = new Subject();

  constructor(public size: THREE.Vector3 = new THREE.Vector3(500, 0, 500), public dimension: THREE.Vector3 = new THREE.Vector3(3, 1, 3), public currentArea: THREE.Vector3 = new THREE.Vector3()) {
    // this.triggerAreaChange();
  }
  triggerAreaChange() {
    this.largeArea.x = Math.floor((this.currentArea.x + this.dimension.x / 2) / this.dimension.x);
    this.largeArea.y = Math.floor((this.currentArea.y + this.dimension.y / 2) / this.dimension.y);
    this.largeArea.z = Math.floor((this.currentArea.z + this.dimension.z / 2) / this.dimension.z);

    this.normalizedArea.x = this.currentArea.x - this.largeArea.x * this.dimension.x;
    this.normalizedArea.y = this.currentArea.y - this.largeArea.y * this.dimension.y;
    this.normalizedArea.z = this.currentArea.z - this.largeArea.z * this.dimension.z;

    this.onUpdateGround.next(this.currentArea);
    this.onAreaChange.next(this.currentArea);
    this.checkPositionalSpawnables();
    this.clearPositionalSpawnables();
  }

  addPositionalSpawnable(instance: SpawnerInstance, areaX: number, areaZ: number) {
    if (this.positionalSpawnables[areaX]) {
      if (!this.positionalSpawnables[areaX][areaZ]) {
        this.positionalSpawnables[areaX][areaZ] = [];
      }
    } else {
      this.positionalSpawnables[areaX] = [];
      this.positionalSpawnables[areaX][areaZ] = [];
    }
    this.positionalSpawnables[areaX][areaZ].push(instance);
  }
  checkPositionalSpawnables() {
    for (let x = 0; x < this.dimension.x; x++) {
      const checkX = this.currentArea.x - x + Math.floor(this.dimension.x / 2);
      if (!this.positionalSpawnables[checkX]) {
        continue;
      }
      for (let z = 0; z < this.dimension.z; z++) {
        const checkZ = this.currentArea.z - z + Math.floor(this.dimension.z / 2);

        const positionalInstancesInArea: SpawnerInstance[] = this.positionalSpawnables[checkX][checkZ];
        if (positionalInstancesInArea) {
          positionalInstancesInArea.forEach((instance: SpawnerInstance) => {
            instance.spawn();
            this.spawnedPositionalInstances.push(instance);
          });
        }
      }
    }
  }
  clearPositionalSpawnables() {
    const checkDist = Math.floor(this.dimension.x / 2);
    for (let i = 0; i < this.spawnedPositionalInstances.length; i++) {
      const instance = this.spawnedPositionalInstances[i];
      if (instance.areaX > this.currentArea.x + checkDist || instance.areaX < this.currentArea.x - checkDist || instance.areaZ > this.currentArea.z + checkDist || instance.areaZ < this.currentArea.z - checkDist) {
        instance.remove();
        this.spawnedPositionalInstances.splice(i, 1);
        i--;
      }
    }
  }
  // getNearbyAreas() {
  //     const checkDist = Math.floor(this.dimension.x / 2);
  //     for (let i = 0; i < this.spawnedPositionalInstances.length; i++) {
  //         const instance = this.spawnedPositionalInstances[i];
  //         if (instance.areaX > this.currentArea.x + checkDist || instance.areaX < this.currentArea.x - checkDist
  //             || instance.areaZ > this.currentArea.z + checkDist || instance.areaZ < this.currentArea.z - checkDist) {
  //             instance.remove();
  //             this.spawnedPositionalInstances.splice(i, 1);
  //             i--;
  //         }
  //     }
  // }
}
