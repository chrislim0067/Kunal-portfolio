import { AbstractSpawnable } from "./spawnables/abstract-spawnable";
import { AbstractThreeManager } from "../abstract-three-manager";
import * as THREE from "three";
import { SpawnerInstance } from "./spawnables/SpawnerInstance";

class Location {
  debugObj: THREE.Object3D;
  constructor(public spawnable: AbstractSpawnable, public instance: SpawnerInstance, public child: THREE.Object3D, public startX: number, public endX: number, public startZ: number, public endZ: number) {}
}

export class LogPopulationManager extends AbstractThreeManager {
  population: Location[][] = [];
  granularity = new THREE.Vector3(10, 1, 10);
  tempPos = new THREE.Vector3(0, 0, 0);
  tempPos2 = new THREE.Vector3(0, 0, 0);
  tempPos3 = new THREE.Vector3(0, 0, 0);
  create() {}

  onAreaChange(area: THREE.Vector3) {}

  populate(spawnable: AbstractSpawnable, instance: SpawnerInstance, child: THREE.Object3D, position: THREE.Vector3, x, z): boolean {
    let takesUpSpaceX = Math.floor(spawnable.am.size.x / spawnable.options.density.x / this.granularity.x);
    let takesUpSpaceZ = Math.floor(spawnable.am.size.z / spawnable.options.density.z / this.granularity.z);
    takesUpSpaceX = takesUpSpaceX < 1 ? 1 : takesUpSpaceX;
    takesUpSpaceZ = takesUpSpaceZ < 1 ? 1 : takesUpSpaceZ;
    // instance.obj.updateMatrixWorld();
    let pos;
    if (child) {
      pos = this.tempPos.copy(child.position);
    } else {
      pos = this.tempPos3.copy(position);
    }
    instance.obj.localToWorld(pos);

    // pos = pos.divide(this.granularity);

    const startX = Math.ceil(pos.x / this.granularity.x - takesUpSpaceX / 2);
    const endX = Math.ceil(pos.x / this.granularity.x + takesUpSpaceX / 2);

    const startZ = Math.ceil(pos.z / this.granularity.z - takesUpSpaceZ / 2);
    const endZ = Math.ceil(pos.z / this.granularity.z + takesUpSpaceZ / 2);
    // console.log(startX, endX, startZ, endZ);

    // let loopnum = 0;
    let isFree = true;
    loopX: for (let _x = startX; _x < endX; _x++) {
      for (let _z = startZ; _z < endZ; _z++) {
        const locX = this.population[_x];
        const location = locX ? this.population[_x][_z] : null;
        if (location) {
          if (location.spawnable !== spawnable) {
            if (!location.spawnable.options.isPositional && !location.spawnable.options.isInstanced) {
              location.spawnable.removeInstanceChild(location.instance, location.child);
              this.ts.mainScene.remove(location.debugObj);
              this.removeOccupant(location.startX, location.endX, location.startZ, location.endZ);
            } else {
              if (spawnable.options.isPositional || !location.spawnable.options.takesUpSpace) {
                isFree = true;
              } else {
                isFree = false;
              }
            }
          }
          break loopX;
        }
        // loopnum++;
      }
    }
    if (isFree) {
      spawnable.spawnInstanceChild(instance, child);
      this.markOccupied(spawnable, instance, child, startX, endX, startZ, endZ, pos, takesUpSpaceX, takesUpSpaceZ);
      if (spawnable.options.addToPoi) {
        const pos2 = this.tempPos2.copy(child.children[0].position);
        child.localToWorld(pos2);
        this.ts.poi.addPoi(pos2, true, spawnable.options.poiYShift);
      }
      return true;
    } else {
      spawnable.removeInstanceChild(instance, child);
      return false;
    }
  }

  removeOccupant(startX, endX, startZ, endZ) {
    for (let _x = startX; _x < endX; _x++) {
      for (let _z = startZ; _z < endZ; _z++) {
        const locX = this.population[_x];
        if (!locX) {
          this.population[_x] = [];
        }
        this.population[_x][_z] = null;
      }
    }
  }

  markOccupied(spawnable, instance, child, startX, endX, startZ, endZ, pos, takesUpSpaceX, takesUpSpaceZ) {
    const location: Location = new Location(spawnable, instance, child, startX, endX, startZ, endZ);
    if (this.ts.isDebug) {
      location.debugObj = this.createPlane(spawnable, pos, startX, startZ, takesUpSpaceX, takesUpSpaceZ);
    }

    for (let _x = startX; _x < endX; _x++) {
      for (let _z = startZ; _z < endZ; _z++) {
        const locX = this.population[_x];
        if (!locX) {
          this.population[_x] = [];
        }
        this.population[_x][_z] = location;
      }
    }
  }

  createPlane(spawnable, pos, startX, startZ, takesUpSpaceX, takesUpSpaceZ) {
    const testmat = new THREE.MeshBasicMaterial({
      color: spawnable.options.color,
      wireframe: true,
    });
    const testobj = new THREE.Mesh(new THREE.PlaneGeometry(takesUpSpaceX * this.granularity.x, takesUpSpaceZ * this.granularity.z, 1), testmat);
    testobj.rotation.x = (-90 * Math.PI) / 180;
    testobj.position.set(pos.x, this.ts.spawner.ground.getGroundLevel(pos), pos.z);
    this.ts.mainScene.add(testobj);
    return testobj;
  }
  onAssetLoaded(asset) {}
  onRender(clock: { elapsedTime: number; delta: number }) {}
  onResize(size: { width: number; height: number }) {}
  onSkyUpdate(params) {}
  onEffectsUpdate(params) {}
}
