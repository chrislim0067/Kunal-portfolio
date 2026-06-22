import { AreaManager } from "./log-area-manager";
import { AbstractThreeManager } from "./abstract-three-manager";
import * as THREE from "three";
import { takeUntil } from "rxjs/operators";
import { SpawnablePosition } from "./spawnables/spawnables/abstract-spawnable";

export class Poi {
  constructor(public pos: THREE.Vector3, public isOnGround = true, public yPosShift = 0) {}
}

export class LogPoiManager extends AbstractThreeManager {
  pois: any[][][] = [];
  currentPois = [];
  // poiCutoff = 40000;
  poiCutoff = 800;
  area: AreaManager;
  currentPoi;

  controlObj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff00ff }));

  create() {
    // this.ts.mainScene.add(this.controlObj);

    this.area = this.ts.areas.mainArea;
    this.area.onAreaChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onAreaChange(params);
    });
    this.onAreaChange(this.area.currentArea);
  }
  onAreaChange(area: THREE.Vector3) {
    this.currentPois = [];

    const checkDistX = this.area.dimension.x * 3;
    const checkDistZ = this.area.dimension.z * 3;

    for (let x = 0; x < checkDistX; x++) {
      const checkX = this.area.currentArea.x - x + Math.floor(checkDistX / 2);
      if (!this.pois[checkX]) {
        continue;
      }
      for (let z = 0; z < checkDistZ; z++) {
        const checkZ = this.area.currentArea.z - z + Math.floor(checkDistZ / 2);
        const pois: Poi[] = this.pois[checkX][checkZ];
        if (pois) {
          this.currentPois = this.currentPois.concat(pois);
        }
      }
    }
  }
  getClosestPoi(actorPos: THREE.Vector3): { poi: Poi; distanceMultiplier: number } {
    let closest;
    let currentDist;
    this.currentPois.forEach((poi) => {
      const xd = actorPos.x - poi.pos.x;
      const zd = actorPos.z - poi.pos.z;
      const dist = Math.sqrt(xd * xd + zd * zd);
      if (dist < currentDist || currentDist === undefined) {
        currentDist = dist;
        closest = poi;
      }
    });
    if (!closest) {
      return null;
    }

    if (this.currentPoi !== closest) {
      this.currentPoi = closest;
      // console.log(this.currentPoi);
    }

    let multiplier = 1;
    if (currentDist < this.poiCutoff) {
      multiplier = this.easeInOutQuad(currentDist / this.poiCutoff);
    }
    return { poi: closest, distanceMultiplier: multiplier };
  }
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  addPoi(pos: THREE.Vector3, isOnGround = true, poiYShift = 0) {
    const areaX = Math.round(pos.x / this.ts.areas.mainArea.size.x);
    const areaZ = Math.round(pos.z / this.ts.areas.mainArea.size.z);
    if (this.pois[areaX]) {
      if (!this.pois[areaX][areaZ]) {
        this.pois[areaX][areaZ] = [];
      }
    } else {
      this.pois[areaX] = [];
      this.pois[areaX][areaZ] = [];
    }
    let found = false;
    this.pois[areaX][areaZ].forEach((poi) => {
      if (poi.pos.equals(pos)) {
        found = true;
      }
    });
    if (!found) {
      this.pois[areaX][areaZ].push(new Poi(pos.clone(), isOnGround, poiYShift));
      console.log(poiYShift);
    }
    this.onAreaChange(this.area.currentArea);
    // console.log(this.currentPois);
  }

  onRender(clock: { elapsedTime: number; delta: number }) {
    // const bc = this.ts.physics.bodies.balloonControl;
    // if (bc) {
    //     this.controlObj.position.x = bc.position.x;
    //     this.controlObj.position.z = bc.position.z;
    //     const yGoal = this.ts.control.getYGoal(this.controlObj.position);
    //     this.controlObj.position.y = yGoal;
    // }
    // this.ts.camera.position.copy(this.controlObj.position);
    // this.ts.camera.position.z += 60;
  }
  getYGoal(position: THREE.Vector3) {
    let heightMod = this.ts.floatingHeightDif;
    const poiInfo: { poi: Poi; distanceMultiplier: number } = this.ts.poi.getClosestPoi(position);
    if (poiInfo) {
      // console.log(poiInfo.poi.yPosShift);
      if (poiInfo.poi.isOnGround) {
        heightMod = this.ts.floatingHeightDif * poiInfo.distanceMultiplier + poiInfo.poi.yPosShift * (1 - poiInfo.distanceMultiplier);
      }
    }
    const groundLevel = this.ts.spawner.ground.getGroundLevel(position, false);
    const yTarget = this.ts.spawner.ground.getGroundLevel(position, false) + heightMod;
    return { groundLevel, absoluteY: yTarget, relativeY: heightMod };
  }
}
