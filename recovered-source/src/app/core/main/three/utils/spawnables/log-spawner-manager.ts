import { SpawnableObj } from "./spawnables/spawnable-obj";
import { SpawnableBird } from "./spawnables/spawnable-bird";
import { AbstractSpawnable, SpawnablePosition } from "./spawnables/abstract-spawnable";
import { AbstractThreeManager } from "../abstract-three-manager";
import * as THREE from "three";
// import { SpawnableTree } from "./spawnables/spawnable-tree.tsa";
import { SpawnableCloud } from "./spawnables/spawnable-cloud";
import { SpawnableGround } from "./spawnables/spawnable-ground";
// import { SpawnableBuilding } from "./spawnables/spawnable-building.tsa";
// import { SpawnableLight } from "./spawnables/spawnable-light.tsa";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { SpawnableTree3d } from "./spawnables/spawnable-3d_tree";
// import { SpawnableLake } from "./spawnables/spawnable-lake.tsa";
// import { SpawnableGrass } from "./spawnables/spawnable-grass.tsa";
import { SpawnableRock } from "./spawnables/spawnable-rock";
import { SpawnableScene } from "./spawnables/spawnable-scene";
import { SpawnableTower } from "./spawnables/spawnable-tower";
import { SpawnableVillage } from "./spawnables/spawnable-village";

export class LogSpawnerManager extends AbstractThreeManager {
  requestedAreas: any[][] = [];
  bigArea: THREE.Vector3 = new THREE.Vector3();
  spawnables: { [id: string]: AbstractSpawnable };

  ground: SpawnableGround;

  create(): Promise<boolean> {
    this.ground = new SpawnableGround(this.ts, this.ts.areas.mainArea, {
      seed: 356,
      hookToRender: false,
      density: new THREE.Vector3(1, 1, 1),
      cutoff: 0,
      detail: 1,
      feather: 0,
      noiseGeneratorNum: 3,
    });

    this.spawnables = {
      // avillagePositional: new SpawnableVillage(this.ts, this.ts.areas.mainArea, {
      //   seed: 3010101,
      //   density: new THREE.Vector3(1, 1, 1),
      //   cutoff: 1,
      //   detail: 1,
      //   feather: 0,
      //   childRandomPos: new THREE.Vector3(1, 0, 1),
      //   noiseGeneratorNum: 2,
      //   takesUpSpace: true,
      //   isPositional: true,
      //   positions: [new SpawnablePosition("objPositional", new THREE.Vector3(1300, 0, -7701))],
      // }),
      avillage: new SpawnableVillage(this.ts, this.ts.areas.mainArea, {
        seed: 3010101,
        density: new THREE.Vector3(1, 1, 1),
        cutoff: 0.89,
        detail: 1,
        feather: 0,
        // childRandomPos: new THREE.Vector3(1, 0, 1),
        noiseGeneratorNum: 2,
        // takesUpSpace: true,
        creationDelay: 550,
      }),
      bird: new SpawnableBird(this.ts, this.ts.areas.mainArea, {
        seed: 780000,
        density: new THREE.Vector3(1, 1, 1),
        cutoff: 0.3,
        detail: 1,
        feather: 0,
        hookToRender: true,
        // positions: [
        //   new SpawnablePosition("bird", new THREE.Vector3(0, 0, -100), { something: 1546 }),
        //   // new THREE.Vector3(0, 0, -1220),
        //   // new THREE.Vector3(0, 0, -2020),
        //   // new THREE.Vector3(0, 0, -200), new THREE.Vector3(0, 0, -250), new THREE.Vector3(0, 0, -300),
        //   // new THREE.Vector3(0, 0, -400), new THREE.Vector3(0, 0, -600), new THREE.Vector3(0, 0, -900),
        //   // new THREE.Vector3(0, 0, -1400), new THREE.Vector3(0, 0, -1600), new THREE.Vector3(0, 0, -1900),
        //   // new THREE.Vector3(0, 0, -2400), new THREE.Vector3(0, 0, -2600), new THREE.Vector3(0, 0, -2900),
        // ],
        // isPositional: true,
        // childRandomPos: new THREE.Vector3(1, 0, 1),
      }),
      treePositional: new SpawnableTree3d(this.ts, this.ts.areas.mainArea, {
        seed: 154,
        density: new THREE.Vector3(100, 1, 100),
        // childRandomPos: new THREE.Vector3(1, 0, 1),
        noiseGeneratorNum: 3,
        takesUpSpace: true,
        isPositional: true,
        // addToPoi: true,
        // poiYShift: 15
        creationDelay: 30,
      }),
      // treePositional: new SpawnableTree3d(this.ts, this.ts.areas.mainArea, {
      //   seed: 154,
      //   density: new THREE.Vector3(100, 1, 100),
      //   // childRandomPos: new THREE.Vector3(1, 0, 1),
      //   noiseGeneratorNum: 3,
      //   takesUpSpace: true,
      //   isPositional: true,
      //   // addToPoi: true,
      //   // poiYShift: 15,
      // }),
      // tree: new SpawnableTree3d(this.ts, this.ts.areas.mainArea, {
      //   seed: 10,
      //   // density: new THREE.Vector3(1, 1, 1), cutoff: 0.8, detail: 1, feather: 0.3,
      //   density: new THREE.Vector3(10, 1, 10),
      //   // cutoff: 0.5, detail: 1, feather: 0.5,
      //   cutoff: 0.2,
      //   detail: 1,
      //   feather: 1,
      //   childRandomPos: new THREE.Vector3(1, 0, 1),
      //   noiseGeneratorNum: 3,
      //   takesUpSpace: true,
      //   // isInstanced: true,
      // }),
      scenePositional: new SpawnableScene(this.ts, this.ts.areas.mainArea, {
        seed: 504554,
        // density: new THREE.Vector3(1, 1, 1), cutoff: 0.8, detail: 1, feather: 0.3,
        density: new THREE.Vector3(100, 1, 100),
        // cutoff: 0.5, detail: 1, feather: 0.5,
        cutoff: 0.5,
        detail: 1,
        feather: 1,
        childRandomPos: new THREE.Vector3(1, 0, 1),
        noiseGeneratorNum: 3,
        takesUpSpace: true,
        isPositional: true,
        hookToRender: true,
        creationDelay: 250,
      }),
      rockPositional: new SpawnableRock(this.ts, this.ts.areas.mainArea, {
        seed: 50554,
        // density: new THREE.Vector3(1, 1, 1), cutoff: 0.8, detail: 1, feather: 0.3,
        density: new THREE.Vector3(100, 1, 100),
        // cutoff: 0.5, detail: 1, feather: 0.5,
        cutoff: 0.5,
        detail: 1,
        feather: 1,
        childRandomPos: new THREE.Vector3(1, 0, 1),
        noiseGeneratorNum: 3,
        takesUpSpace: true,
        isPositional: true,
      }),
      tree2: new SpawnableTree3d(this.ts, this.ts.areas.mainArea, {
        seed: 10,
        // density: new THREE.Vector3(1, 1, 1), cutoff: 0.8, detail: 1, feather: 0.3,
        density: new THREE.Vector3(this.ts.qc.treeDensity, 1, this.ts.qc.treeDensity),
        // cutoff: 0.5, detail: 1, feather: 0.5,
        cutoff: 0.5,
        detail: 1,
        feather: 1,
        childRandomPos: new THREE.Vector3(1, 0, 1),
        noiseGeneratorNum: 3,
        takesUpSpace: true,
        isInstanced: true,
        creationDelay: 90,
      }),
      rock: new SpawnableRock(this.ts, this.ts.areas.mainArea, {
        seed: 50554,
        // density: new THREE.Vector3(1, 1, 1), cutoff: 0.8, detail: 1, feather: 0.3,
        density: new THREE.Vector3(this.ts.qc.stoneDensity, 1, this.ts.qc.stoneDensity),
        // cutoff: 0.5, detail: 1, feather: 0.5,
        cutoff: 0.5,
        detail: 1,
        feather: 1,
        childRandomPos: new THREE.Vector3(1, 0, 1),
        noiseGeneratorNum: 3,
        takesUpSpace: true,
        isInstanced: true,
        creationDelay: 110,
      }),

      // towers: new SpawnableCity(this.ts, this.ts.areas.mainArea, {
      //   seed: 90101,
      //   density: new THREE.Vector3(1, 1, 1),
      //   cutoff: 0.95,
      //   detail: 1,
      //   feather: 0,
      //   childRandomPos: new THREE.Vector3(1, 0, 1),
      //   noiseGeneratorNum: 2,
      //   takesUpSpace: false,
      // }),
      cityPositional: new SpawnableTower(this.ts, this.ts.areas.mainArea, {
        seed: 2010101,
        density: new THREE.Vector3(1, 1, 1),
        cutoff: 1,
        detail: 1,
        feather: 0,
        childRandomPos: new THREE.Vector3(1, 0, 1),
        noiseGeneratorNum: 2,
        takesUpSpace: false,
        isPositional: true,
      }),
      objPositional: new SpawnableObj(this.ts, this.ts.areas.mainArea, {
        seed: 2010101,
        density: new THREE.Vector3(1, 1, 1),
        cutoff: 1,
        detail: 1,
        feather: 0,
        childRandomPos: new THREE.Vector3(1, 0, 1),
        noiseGeneratorNum: 2,
        takesUpSpace: false,
        isPositional: true,
        positions: [new SpawnablePosition("objPositional", new THREE.Vector3(1790, 0, -6301), { something: 1546 })],
      }),

      // city: new SpawnableCity(this.ts, this.ts.areas.mainArea, {
      //   seed: 2010101,
      //   // density: new THREE.Vector3(1, 1, 1), cutoff: 0.8, detail: 1, feather: 0.3,
      //   density: new THREE.Vector3(3, 1, 3),
      //   // cutoff: 0.5, detail: 1, feather: 0.5,
      //   cutoff: 0.5,
      //   detail: 1,
      //   feather: 0,
      //   childRandomPos: new THREE.Vector3(1, 0, 1),
      //   noiseGeneratorNum: 2,

      //   // isInstanced: true,
      // }),
      // building: new SpawnableBuilding(this.ts, this.ts.areas.mainArea, {
      //   seed: 45587,
      //   positions: [
      //     // new SpawnablePosition("building", new THREE.Vector3(0, 0, -5), { something: 1546 }),
      //     // new SpawnablePosition("building", new THREE.Vector3(0, 0, -10), { something: 1546 }),
      //     // new SpawnablePosition("building", new THREE.Vector3(0, 0, -20), { something: 1546 }),
      //     // new SpawnablePosition("building", new THREE.Vector3(0, 0, -30), { something: 1546 }),
      //     // new SpawnablePosition("building", new THREE.Vector3(0, 0, -5000), { something: 1546 }),
      //     // new SpawnablePosition("building", new THREE.Vector3(0, 0, -6000), { something: 1546 }),
      //     // new SpawnablePosition("building", new THREE.Vector3(0, 0, -7000), { something: 1546 }),
      //     // new SpawnablePosition("building", new THREE.Vector3(0, 0, -8000), { something: 1546 }),
      //     // new SpawnablePosition("treePositional", new THREE.Vector3(-5, 0, -200), { something: 1546 }),
      //     // new SpawnablePosition("building", new THREE.Vector3(-5, 0, -1000), { something: 1546 }),
      //     // new SpawnablePosition("building", new THREE.Vector3(-5, 100, -2500), { something: 1546 }),
      //     // new SpawnablePosition("treePositional", new THREE.Vector3(-5, 0, -1000), { something: 1546 }),
      //   ],
      //   isPositional: true,
      //   density: new THREE.Vector3(100, 1, 100),
      //   takesUpSpace: false,
      //   addToPoi: true,
      //   poiYShift: 80,
      // }),
      cloud: new SpawnableCloud(this.ts, this.ts.areas.aClouds, {
        seed: 4545,
        hookToRender: true,
        density: new THREE.Vector3(1, 1, 1),
        cutoff: 0,
        detail: 1,
        feather: 0,
        noiseGeneratorNum: 1,
        creationDelay: 0,
      }),
      // light: new SpawnableLight(this.ts, this.ts.areas.mainArea, {
      //   seed: 15546,
      //   hookToRender: true,
      //   density: new THREE.Vector3(10, 1, 10),
      //   cutoff: 0,
      //   detail: 1,
      //   feather: 0,
      //   isPositional: true,
      //   poiYShift: 5,
      //   addToPoi: true,
      //   takesUpSpace: true,
      //   positions: [
      //     // new SpawnablePosition(new THREE.Vector3(-2090, 0, -3250), { something: 1546 })
      //   ],
      //   // childRandomPos: new THREE.Vector3(0.3, 0, 0.5),
      //   // density: 9, cutoff: 0, detail: 1, feather: 0
      // }),
      // new SpawnableBuilding(this.ts, this.ts.areas.mainArea, {
      //     seed: 45587,
      //     density: new THREE.Vector3(1, 1, 1),
      //     takesUpSpace: true,
      //     cutoff: 0.5, detail: 1, feather: 0,
      //     addToPoi: true,
      //     childRandomPos: new THREE.Vector3(1, 0, 1),
      // }),
      // new SpawnableBuilding(this.ts, this.ts.areas.mainArea, {
      //     seed: 25826,
      //     density: new THREE.Vector3(10, 1, 10), cutoff: 0.8, detail: 1, feather: 0,
      //     childRandomPos: new THREE.Vector3(0, 0, 0),
      //     takesUpSpace: true
      // }),
      // tree: new SpawnableTree(this.ts, this.ts.areas.mainArea, {
      //     seed: 1554,
      //     // density: new THREE.Vector3(1, 1, 1), cutoff: 0.8, detail: 1, feather: 0.3,
      //     density: new THREE.Vector3(10, 1, 10),
      //     // cutoff: 0.5, detail: 1, feather: 0.5,
      //     cutoff: 0.6, detail: 1, feather: 1,
      //     childRandomPos: new THREE.Vector3(1, 0, 1),
      //     noiseGeneratorNum: 3,
      //     takesUpSpace: true
      // }),
      // lake: new SpawnableLake(this.ts, this.ts.areas.mainArea, {
      //   positions: [new SpawnablePosition("lake", new THREE.Vector3(-5, 0, -1040), { something: 1546 })],
      //   seed: 3554,
      //   density: new THREE.Vector3(100, 1, 100),
      //   cutoff: 0,
      //   detail: 1,
      //   feather: 0,
      //   takesUpSpace: false,
      //   hookToRender: true,
      //   isPositional: true,
      // }),
      // light: new SpawnableLight(this.ts, this.ts.areas.mainArea, {
      //   seed: 15546,
      //   hookToRender: true,
      //   density: new THREE.Vector3(5, 1, 5),
      //   cutoff: 0,
      //   detail: 1,
      //   feather: 0,
      //   childRandomPos: new THREE.Vector3(1, 0, 1),
      //   // density: 9, cutoff: 0, detail: 1, feather: 0
      //   takesUpSpace: true,
      // }),
      // new SpawnableLight(this.ts, this.ts.areas.a100, {
      //     seed: 2556,
      //     hookToRender: true,
      //     density: new THREE.Vector3(1, 1, 1), cutoff: 0, detail: 1, feather: 0,
      //     childRandomPos: new THREE.Vector3(1, 1, 1),
      //     // density: 9, cutoff: 0, detail: 1, feather: 0
      // }),
    };

    // if (!this.ts.isMobile) {
    //   this.spawnables.grass = new SpawnableGrass(this.ts, this.ts.areas.aGrass, {
    //     // positions: [new SpawnablePosition("grass", new THREE.Vector3(-5, 0, -1020), { something: 1546 })],
    //     seed: 122,
    //     // density: new THREE.Vector3(1, 1, 1), cutoff: 0.8, detail: 1, feather: 0.3,
    //     density: new THREE.Vector3(10, 1, 10),
    //     // cutoff: 0.5, detail: 1, feather: 0.5,
    //     cutoff: 0,
    //     detail: 1,
    //     feather: 1,
    //     childRandomPos: new THREE.Vector3(1, 0, 1),
    //     noiseGeneratorNum: 3,
    //     hookToRender: true,
    //     // isPositional: true,
    //   });
    // }

    // this.spawnables = {};

    this.ts.areas.bigArea.onAreaChange.subscribe((area) => {
      this.onAreaChange(area).then();
    });
    return this.onAreaChange(this.ts.areas.bigArea.currentArea);
  }

  onAreaChange(area): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const requesting: { x: number; z: number }[] = [];
      loopX: for (let xd = -1; xd < 2; xd++) {
        loopZ: for (let zd = -1; zd < 2; zd++) {
          const areaX = area.x + xd;
          const areaZ = area.z + zd;
          if (this.requestedAreas[areaX]) {
            if (this.requestedAreas[areaX][areaZ]) {
              continue loopZ;
            }
          }
          if (!this.requestedAreas[areaX]) {
            this.requestedAreas[areaX] = [];
          }
          requesting.push({ x: areaX, z: areaZ });
          this.requestedAreas[areaX][areaZ] = true;
        }
      }
      this.ts.api.getBigAreaElements(requesting).then((positions) => {
        positions.forEach((pos) => {
          this.spawnables[pos.id].createPositionalInstance(pos);
        });
        this.ts.areas.mainArea.checkPositionalSpawnables();
        resolve(true);
      });
    });
  }
  spawnPositional(pos) {
    // console.log(pos.id);

    this.spawnables[pos.id].createPositionalInstance(pos);
    this.ts.areas.mainArea.checkPositionalSpawnables();
    // setTimeout((params) => {
    //     this.spawnables[pos.id].onPositionalArea(this.ts.areas.mainArea.currentArea);
    // })
  }
  onAssetLoaded(asset) {}
  onRender(clock: { elapsedTime: number; delta: number }) {}
  onResize(size: { width: number; height: number }) {}
  onSkyUpdate(params) {}
  onEffectsUpdate(params) {}
}
