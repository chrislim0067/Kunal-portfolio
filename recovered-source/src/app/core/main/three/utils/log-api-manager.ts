import { SpawnablePosition } from "./spawnables/spawnables/abstract-spawnable";
import { ColorManipulator } from "../../../../shared/utils/colormanipulator";
import { AbstractThreeManager } from "./abstract-three-manager";
import * as THREE from "three";
import { TweenMax, Expo } from "gsap/all";

export class LogApiManager extends AbstractThreeManager {
  bigAreaSize = 0;
  positions: SpawnablePosition[] = [
    // new SpawnablePosition("building", new THREE.Vector3(-5, 0, -1200), { something: 1546 }),
    // new SpawnablePosition("building", new THREE.Vector3(-5, 100, -2500), { something: 1546 }),

    new SpawnablePosition("rockPositional", new THREE.Vector3(-1000, 0, -800), { something: 1546 }),

    new SpawnablePosition("rockPositional", new THREE.Vector3(-966.8059485385949, 0, -1025.116006665105), { something: 1546 }),
    // new SpawnablePosition("rockPositional", new THREE.Vector3(-885.8048219757558, 473.41445137947136, -742.7270210983415), { something: 1546 }),
    new SpawnablePosition("scenePositional", new THREE.Vector3(-1055.8090396075659, 531.1200522127425, -697.8694691786698), { scene: "me" }),
    new SpawnablePosition("rockPositional", new THREE.Vector3(-972.0664972293348, 8, -620.1887551726018), { something: 1546 }),
    // new SpawnablePosition("rockPositional", new THREE.Vector3(-975.0664972293348, -17, -658.1887551726018), { something: 1546 }),
    // new SpawnablePosition("rockPositional", new THREE.Vector3(-1020.0664972293348, -60, -750.1887551726018), { something: 1546 }),
    new SpawnablePosition("rockPositional", new THREE.Vector3(-1100.0664972293348, 0, -700.1887551726018), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1150.0664972293348, 0, -730.1887551726018), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1050.0664972293348, 0, -780.1887551726018), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1150.0664972293348, 0, -780.1887551726018), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1200.0664972293348, 0, -750.1887551726018), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-935.3580890553195, 0, -881.04699), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1236.0617211871618, 0, -496.475), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1086, 0, -559), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1193, 0, -298), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1102, 0, -437), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1108, 0, -255), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1019, 0, -75), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-1083, 0, -82), { something: 1546 }),
    // new SpawnablePosition("treePositional", new THREE.Vector3(-869, 0, -727), { something: 1546 }),
    new SpawnablePosition("treePositional", new THREE.Vector3(-947, 0, -766), { something: 1546 }),
    // new SpawnablePosition("cityPositional", new THREE.Vector3(1000, 0, -1566), { something: 1546 }),
    // new SpawnablePosition("cityPositional", new THREE.Vector3(-1875, 0, -2887), { something: 1546 }),
    new SpawnablePosition("cityPositional", new THREE.Vector3(-1245, 0, -1613), { something: 1546 }),

    // new SpawnablePosition("cityPositional", new THREE.Vector3(1000, 0, -2566), { something: 1546 }),
    // new SpawnablePosition("cityPositional", new THREE.Vector3(-4500, 0, 1900), { something: 1546 }),

    // new SpawnablePosition("building", new THREE.Vector3(0, 0, -5), { something: 1546 }),
    // new SpawnablePosition("building", new THREE.Vector3(0, 0, -1000), { something: 1546 }),
    // new SpawnablePosition("building", new THREE.Vector3(0, 0, -2000), { something: 1546 }),
    // new SpawnablePosition("building", new THREE.Vector3(0, 0, -3000), { something: 1546 }),
    // new SpawnablePosition("building", new THREE.Vector3(0, 0, -4000), { something: 1546 }),
    // new SpawnablePosition("building", new THREE.Vector3(0, 0, -5000), { something: 1546 }),
    // new SpawnablePosition("building", new THREE.Vector3(0, 0, -6000), { something: 1546 }),
    // new SpawnablePosition("building", new THREE.Vector3(0, 0, -7000), { something: 1546 }),
    // new SpawnablePosition("building", new THREE.Vector3(0, 0, -8000), { something: 1546 }),
    // new SpawnablePosition("treePositional", new THREE.Vector3(-5, 0, -200), { something: 1546 }),
    // new SpawnablePosition("treePositional", new THREE.Vector3(-5, 0, -1000), { something: 1546 }),
    // new SpawnablePosition("treePositional", new THREE.Vector3(-5, 0, -1000), { something: 1546 }),
  ];

  bigAreas: SpawnablePosition[][][] = [];

  create() {
    this.bigAreaSize = this.ts.areas.bigArea.size.x;
    this.processPositions(this.positions);
  }

  processPositions(arr: SpawnablePosition[]) {
    for (const pos of this.positions) {
      const areaX = Math.floor((pos.pos.x + this.bigAreaSize / 2) / this.bigAreaSize);
      const areaY = Math.floor((pos.pos.z + this.bigAreaSize / 2) / this.bigAreaSize);
      if (!this.bigAreas[areaX]) {
        this.bigAreas[areaX] = [];
        this.bigAreas[areaX][areaY] = [];
        this.bigAreas[areaX][areaY].push(pos);
      } else {
        if (!this.bigAreas[areaX][areaY]) {
          this.bigAreas[areaX][areaY] = [];
        }
        this.bigAreas[areaX][areaY].push(pos);
      }
    }
  }

  getBigAreaElements(requestedAreas: { x: number; z: number }[]): Promise<SpawnablePosition[]> {
    return new Promise((resolve, reject) => {
      // setTimeout(() => {
      // console.log(requestedAreas);
      let returnedPositions: SpawnablePosition[] = [];
      requestedAreas.forEach((area) => {
        if (this.bigAreas[area.x] && this.bigAreas[area.x][area.z]) {
          returnedPositions = returnedPositions.concat(this.bigAreas[area.x][area.z]);
        }
      });
      resolve(returnedPositions);
      // }, 1000);
    });
  }
}
