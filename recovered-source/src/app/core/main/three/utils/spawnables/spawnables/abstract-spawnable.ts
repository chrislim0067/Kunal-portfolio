import { LogNoise } from "../../../../../../shared/utils/noise";
import * as THREE from "three";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ThreeService } from "../../../three.service";
import { SpawnerInstance } from "./SpawnerInstance";
import { AreaManager } from "../../log-area-manager";
import { InstancedMesh, Vector3 } from "three";
import { SpawnableVillage } from "./spawnable-village";

export class SpawnablePosition {
  constructor(public id: string, public pos: THREE.Vector3, public data: any = {}) {}
}

export interface SpawnableOptions {
  seed: number;
  hookToRender?: boolean;
  density?: THREE.Vector3;
  detail?: number;
  scale?: number;
  cutoff?: number;
  feather?: number;
  childRandomPos?: THREE.Vector3;
  noiseGeneratorNum?: number;
  takesUpSpace?: boolean;
  color?: THREE.Color;
  isPositional?: boolean;
  isInstanced?: boolean;
  positions?: any[];
  addToPoi?: boolean;
  poiYShift?: number;
  data?: any;
  creationDelay?: number;
}

export class AbstractSpawnable {
  private ngUnsubscribe: Subject<null> = new Subject();
  // instances: { obj: THREE.Object3D, origPos: THREE.Vector3 }[] = [];
  instances: SpawnerInstance[][][] = [];
  positionalInstances: SpawnerInstance[][] = [];
  positionalInstancesOnStage: SpawnerInstance[] = [];
  options: SpawnableOptions = {
    seed: 1545,
    hookToRender: false,

    density: new THREE.Vector3(10, 1, 10),
    detail: 1,
    scale: 1,
    cutoff: 0,
    feather: 0,
    childRandomPos: new THREE.Vector3(0, 0, 0),
    noiseGeneratorNum: 0,
    takesUpSpace: false,
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    positions: [],
    isPositional: false,
    addToPoi: false,
    poiYShift: 0,
    creationDelay: 100,
  };
  tempPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  instanceWorldPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  controlPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  childGeom;
  childMat;
  childMesh;

  childPosNoiseX;
  childPosNoiseZ;
  childPosNoiseY;

  cutoffNoise;
  featherNoise;

  noiseGenerators: LogNoise[] = [];
  maxDist = new THREE.Vector3((this.am.size.x * this.am.dimension.x) / 2, (this.am.size.y * this.am.dimension.y) / 2, (this.am.size.z * this.am.dimension.z) / 2);

  constructor(public ts: ThreeService, public am: AreaManager, options: SpawnableOptions = null) {
    if (options) {
      Object.keys(options).forEach((key) => {
        this.options[key] = options[key];
      });
    }

    for (let n = 0; n < options.noiseGeneratorNum; n++) {
      this.noiseGenerators[n] = new LogNoise(this.options.seed + n * 78595);
    }

    this.childPosNoiseX = new LogNoise(this.options.seed + 100);
    this.childPosNoiseZ = new LogNoise(this.options.seed + 1000);
    this.childPosNoiseY = new LogNoise(this.options.seed + 10000);

    this.cutoffNoise = new LogNoise(this.options.seed + 200);
    this.featherNoise = new LogNoise(this.options.seed + 2000);

    this.ts.onResize.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onResize(params);
    });
    this.ts.onSkyUpdate.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onSkyUpdate(params);
    });
    this.ts.onEffectsUpdate.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onEffectsUpdate(params);
    });
    this.ts.onAssetLoaded.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onAssetLoaded(params);
    });

    this.create();
    if (this.options.isPositional) {
      this.createPositionalInstances();
      this.am.checkPositionalSpawnables();
      if (options.hookToRender) {
        this.ts.onRender.pipe(takeUntil(this.ngUnsubscribe)).subscribe((clock) => {
          this.onPositionalRender(clock);
        });
      }
    } else {
      this.createInstances();
      this.am.onAreaChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
        this.onAreaChange(params);
      });
      if (options.hookToRender) {
        this.ts.onRender.pipe(takeUntil(this.ngUnsubscribe)).subscribe((clock) => {
          this.onRender(clock);
        });
      }
      this.onAreaChange(this.am.currentArea);
    }
  }
  create() {}
  createPositionalInstances() {
    for (let x = 0; x < this.options.positions.length; x++) {
      const pos = this.options.positions[x];
      this.createPositionalInstance(pos);
    }
  }

  createPositionalInstance(pos: SpawnablePosition) {
    const areaX = Math.round(pos.pos.x / this.am.size.x);
    const areaZ = Math.round(pos.pos.z / this.am.size.z);
    if (this.positionalInstances[areaX]) {
      if (!this.positionalInstances[areaX][areaZ]) {
        this.positionalInstances[areaX][areaZ] = new SpawnerInstance();
        this.positionalInstances[areaX][areaZ].scene = this.ts.mainScene;
        this.positionalInstances[areaX][areaZ].areaX = areaX;
        this.positionalInstances[areaX][areaZ].areaZ = areaZ;
        this.positionalInstances[areaX][areaZ].spawnable = this;
      }
    } else {
      this.positionalInstances[areaX] = [];
      this.positionalInstances[areaX][areaZ] = new SpawnerInstance();
      this.positionalInstances[areaX][areaZ].scene = this.ts.mainScene;
      this.positionalInstances[areaX][areaZ].areaX = areaX;
      this.positionalInstances[areaX][areaZ].areaZ = areaZ;
      this.positionalInstances[areaX][areaZ].spawnable = this;
    }
    const instance = this.positionalInstances[areaX][areaZ];

    this.am.addPositionalSpawnable(instance, instance.areaX, instance.areaZ);
    instance.obj.position.x = areaX * this.am.size.x;
    instance.obj.position.z = areaZ * this.am.size.z;

    const childObj = new THREE.Object3D();
    const childMesh = this.createChild(instance, pos.pos.x, 0, pos.pos.z, pos, childObj);
    childObj.add(childMesh);

    childObj.position.x = pos.pos.x - areaX * this.am.size.x;
    childObj.position.z = pos.pos.z - areaZ * this.am.size.z;
    instance.spawnChild(childObj);
    instance.positionalChildren.push(childObj);
    instance.obj.updateMatrixWorld();
    const isSpawned = this.ts.population.populate(this, instance, childObj, null, 0, 0);
    this.manipulateChild(childObj, instance);
    // if (this.options.addToPoi) {
    //     this.ts.poi.addPoi(pos, true, this.options.poiYShift);
    // }
  }

  async createInstances() {
    for (let x = 0; x < this.am.dimension.x; x++) {
      this.instances[x] = [];
      for (let y = 0; y < this.am.dimension.y; y++) {
        this.instances[x][y] = [];
        for (let z = 0; z < this.am.dimension.z; z++) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(null);
            }, this.options.creationDelay);
          });
          const instance = this.createInstance();
          instance.origId.set(x, y, z);
          this.instances[x][y][z] = instance;
          this.createChildren(instance);
          this.updateInstance(instance, x, y, z);
        }
      }
    }
  }
  createChildren(instance: SpawnerInstance) {
    const numInArea = 0;
    let posArr = this.options.isInstanced ? instance.instancedPositions : instance.instanceChildren;

    for (let x = 0; x < this.options.density.x; x++) {
      posArr[x] = [];
      posArr[x] = [];
      for (let y = 0; y < this.options.density.y; y++) {
        posArr[x][y] = [];
        for (let z = 0; z < this.options.density.z; z++) {
          const childMeshPosition = new THREE.Vector3();
          const childWrapperPosition = new THREE.Vector3();
          if (this.options.childRandomPos.x > 0) {
            const xRandom = ((1 + this.childPosNoiseX.simplex2((this.options.seed + x + instance.origId.x) * 10000, (this.options.seed + z + instance.origId.z) * 1000)) / 2) * this.options.childRandomPos.x;
            childMeshPosition.x = xRandom * (this.am.size.x / this.options.density.x) - this.am.size.x / this.options.density.x / 2;
          }
          if (this.options.childRandomPos.y > 0) {
            const yRandom = ((1 + this.childPosNoiseY.simplex2((this.options.seed + x + instance.origId.x) * 30000, (this.options.seed + z + instance.origId.z) * 3000)) / 2) * this.options.childRandomPos.y;
            childMeshPosition.y = yRandom * (this.am.size.y / this.options.density.y) - this.am.size.y / this.options.density.y / 2;
          }
          if (this.options.childRandomPos.z > 0) {
            const zRandom = ((1 + this.childPosNoiseZ.simplex2((this.options.seed + x + instance.origId.x) * 20000, (this.options.seed + z + instance.origId.z) * 2000)) / 2) * this.options.childRandomPos.z;
            childMeshPosition.z = zRandom * (this.am.size.z / this.options.density.z) - this.am.size.z / this.options.density.z / 2;
          }
          childWrapperPosition.x = (x * this.am.size.x) / this.options.density.x - this.am.size.x / 2 + this.am.size.x / this.options.density.x / 2;
          childWrapperPosition.y = (y * this.am.size.y) / this.options.density.y - this.am.size.y / 2 + this.am.size.y / this.options.density.y / 2;
          childWrapperPosition.z = (z * this.am.size.z) / this.options.density.z - this.am.size.z / 2 + this.am.size.z / this.options.density.z / 2;
          if (this.options.isInstanced) {
            const pos = new Vector3().copy(childMeshPosition).add(childWrapperPosition);
            // const instanceMatrix = this.createChildMatrix(instance, pos, x, y, z);
            posArr[x][y][z] = pos;
          } else {
            const childObj = new THREE.Object3D();
            const childMesh = this.createChild(instance, x, y, z, null, childObj);
            childMesh.position.copy(childMeshPosition);
            childObj.position.copy(childWrapperPosition);
            childObj.add(childMesh);

            // const spriteMaterial = new THREE.MeshBasicMaterial({
            //     color: (Math.random() * 0xFFFFFF << 0),
            // });
            // const plane = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), spriteMaterial);
            // childObj.add(plane);

            posArr[x][y][z] = childObj;
          }
        }
      }
    }
    // this.updateAreaChildren(instance);
  }

  createInstance(): SpawnerInstance {
    const instance = new SpawnerInstance();
    instance.spawnable = this;
    instance.type = this.constructor.name;

    // const mat = new THREE.MeshBasicMaterial({
    //     color: new THREE.Color(0, 1, 1),
    //     wireframe: true,
    //     depthWrite: false,
    //     depthTest: false
    // });
    // const plane = new THREE.Mesh(new THREE.BoxGeometry(this.am.size, 0.001, this.am.size), mat);
    // instance.obj.add(plane);
    this.ts.mainScene.add(instance.obj);
    return instance;
  }

  createChild(instance, x, y, z, spawnablePos: SpawnablePosition = null, childObj: THREE.Object3D = null): THREE.Object3D {
    return null;
  }

  onAssetLoaded(asset) {}
  onRender(clock: { elapsedTime: number; delta: number }) {
    this.controlPos.copy(this.ts.camera.position);

    for (let x = 0; x < this.am.dimension.x; x++) {
      for (let y = 0; y < this.am.dimension.y; y++) {
        for (let z = 0; z < this.am.dimension.z; z++) {
          const instance: SpawnerInstance = this.instances[x]?.[y]?.[z];
          if (!instance) continue;
          for (let s = 0; s < instance.spawnedChildren.length; s++) {
            this.manipulateChildRender(clock, instance, instance.spawnedChildren[s]);
          }
          // for (let cx = 0; cx < this.options.density.x; cx++) {
          //     for (let cy = 0; cy < this.options.density.y; cy++) {
          //         for (let cz = 0; cz < this.options.density.z; cz++) {
          //             const childInstance = instance.instanceChildren[cx][cy][cz];
          //             this.manipulateChildRender(clock, instance, childInstance);
          //         }
          //     }
          // }
        }
      }
    }
  }
  onPositionalRender(clock: { elapsedTime: number; delta: number }) {
    for (let z = 0; z < this.positionalInstancesOnStage.length; z++) {
      const instance: SpawnerInstance = this.positionalInstancesOnStage[z];
      for (let s = 0; s < instance.spawnedChildren.length; s++) {
        this.manipulateChildRender(clock, instance, instance.spawnedChildren[s]);
      }
    }

    // this.controlPos.copy(this.ts.camera.position);

    // for (let x = 0; x < this.am.dimension.x; x++) {
    //     for (let y = 0; y < this.am.dimension.y; y++) {
    //         for (let z = 0; z < this.am.dimension.z; z++) {
    //             const instance: SpawnerInstance = this.instances[x][y][z];
    //             for (let s = 0; s < instance.spawnedChildren.length; s++) {
    //                 this.manipulateChildRender(clock, instance, instance.spawnedChildren[s]);
    //             }
    //             // for (let cx = 0; cx < this.options.density.x; cx++) {
    //             //     for (let cy = 0; cy < this.options.density.y; cy++) {
    //             //         for (let cz = 0; cz < this.options.density.z; cz++) {
    //             //             const childInstance = instance.instanceChildren[cx][cy][cz];
    //             //             this.manipulateChildRender(clock, instance, childInstance);
    //             //         }
    //             //     }
    //             // }
    //         }
    //     }
    // }
  }
  manipulateChildRender(clock, instance, child) {}
  onResize(size: { width: number; height: number }) {}
  onSkyUpdate(params) {}
  onEffectsUpdate(params) {}
  onAreaChange(area: THREE.Vector3) {
    // setTimeout(() => {
    // console.log("on area Change", this.constructor.name);
    for (let x = 0; x < this.am.dimension.x; x++) {
      for (let y = 0; y < this.am.dimension.y; y++) {
        for (let z = 0; z < this.am.dimension.z; z++) {
          const instance: SpawnerInstance = this.instances[x]?.[y]?.[z];
          if (!instance) continue;
          this.updateInstance(instance, x, y, z);
        }
      }
    }
    // console.timeEnd(this.constructor.name);
    // });
  }

  updateInstance(instance, x, y, z) {
    const normX = x - Math.floor(this.am.dimension.x / 2);
    const normZ = z - Math.floor(this.am.dimension.z / 2);

    this.updateArea(instance.obj, normX, "x");
    this.updateArea(instance.obj, normZ, "z");

    if (this.am.dimension.y > 1) {
      const normY = y - Math.floor(this.am.dimension.y / 2);
      this.updateArea(instance.obj, normY, "y");
    }
    if (instance.prevPosY !== instance.obj.position.y || instance.prevPosZ !== instance.obj.position.z || instance.prevPosX !== instance.obj.position.x) {
      instance.obj.updateMatrixWorld();
      this.updateAreaChildren(instance);
      instance.prevPosZ = instance.obj.position.z;
      instance.prevPosY = instance.obj.position.y;
      instance.prevPosX = instance.obj.position.x;
    }
  }
  updateAreaChildren(instance: SpawnerInstance) {
    // console.log("updateAreaChildren", this.constructor.name, instance.origId);
    if (!this.options.isInstanced) {
      for (let cx = 0; cx < this.options.density.x; cx++) {
        for (let cy = 0; cy < this.options.density.y; cy++) {
          for (let cz = 0; cz < this.options.density.z; cz++) {
            if (!this.options.isInstanced) {
              const child = instance.instanceChildren[cx][cy][cz] as THREE.Object3D;
              instance.obj.getWorldPosition(this.instanceWorldPos);
              this.tempPos.copy(child.position).add(this.instanceWorldPos);
              const noise = (1 + this.cutoffNoise.simplex2((this.tempPos.x / this.am.size.x) * this.options.detail, (this.tempPos.z / this.am.size.z) * this.options.detail)) / 2;
              // if (this.constructor.name === "SpawnableVillage") console.log(instance.obj.position, this.instanceWorldPos);
              if (noise > this.options.cutoff) {
                const invcutoff = 1 - (1 - noise) / (1 - this.options.cutoff);
                let noise2 = (1 + this.featherNoise.simplex2(this.tempPos.x * 1000, this.tempPos.z * 1000)) / 2;
                if (1 - this.options.feather + invcutoff > noise2) {
                  if (this.options.takesUpSpace) {
                    const isSpawned = this.ts.population.populate(this, instance, child, null, cx, cz);
                    if (isSpawned) {
                      this.manipulateChild(child, instance, noise, noise2);
                    }
                  } else {
                    this.spawnInstanceChild(instance, child);
                    this.manipulateChild(child, instance, noise, noise2);
                  }
                } else {
                  this.removeInstanceChild(instance, child);
                }
              } else {
                this.removeInstanceChild(instance, child);
              }
            }
          }
        }
      }
    } else {
      // console.log(this.getChildGeom());
      // instance.instancedMesh = new InstancedMesh()
      const matrixes: THREE.Matrix4[] = [];
      for (let cx = 0; cx < this.options.density.x; cx++) {
        for (let cy = 0; cy < this.options.density.y; cy++) {
          for (let cz = 0; cz < this.options.density.z; cz++) {
            const pos = instance.instancedPositions[cx][cy][cz] as THREE.Vector3;
            instance.obj.getWorldPosition(this.instanceWorldPos);
            this.tempPos.copy(pos).add(this.instanceWorldPos);
            const noise = (1 + this.cutoffNoise.simplex2((this.tempPos.x / this.am.size.x) * this.options.detail, (this.tempPos.z / this.am.size.z) * this.options.detail)) / 2;
            if (noise > this.options.cutoff) {
              const invcutoff = 1 - (1 - noise) / (1 - this.options.cutoff);
              let noise2 = (1 + this.featherNoise.simplex2(this.tempPos.x * 1000, this.tempPos.z * 1000)) / 2;
              if (1 - this.options.feather + invcutoff > noise2) {
                if (this.options.takesUpSpace) {
                  const isSpawned = this.ts.population.populate(this, instance, null, pos, cx, cz);
                  if (isSpawned) {
                    matrixes.push(this.createChildMatrix(instance, pos));
                    // this.manipulateChild(child, instance, noise, noise2);
                  }
                } else {
                  matrixes.push(this.createChildMatrix(instance, pos));
                  // this.spawnInstanceChild(instance, child);
                  // this.manipulateChild(child, instance, noise, noise2);
                }
              } else {
                // this.removeInstanceChild(instance, child);
              }
            } else {
              // this.removeInstanceChild(instance, child);
            }
          }
        }
      }

      if (instance.instancedMeshes.length > 0) {
        instance.instancedMeshes.forEach((instancedMesh) => {
          instance.obj.remove(instancedMesh);
        });
        instance.instancedMeshes = [];
      }
      const meshes = this.createInstancedMeshes(matrixes);
      meshes.forEach((instancedMesh) => {
        instance.instancedMeshes.push(instancedMesh);
        instance.obj.add(instancedMesh);
      });
    }
  }

  manipulateChild(child: THREE.Object3D, instance: SpawnerInstance, cutoffNoise: number = null, featherNoise: number = null) {}

  createChildMatrix(instance: SpawnerInstance, pos: THREE.Vector3): THREE.Matrix4 {
    return null;
  }
  createInstancedMeshes(matrixes: THREE.Matrix4[]): THREE.InstancedMesh[] {
    return null;
  }
  updateArea(instanceObj: THREE.Object3D, origPos, axis) {
    if (this.am.normalizedArea[axis] < 0 && this.am.normalizedArea[axis] - origPos < -this.am.dimension[axis] / 2) {
      instanceObj.position[axis] = this.am.size[axis] * origPos + this.am.areaSize[axis] * this.am.largeArea[axis] - this.am.areaSize[axis];
    } else if (this.am.normalizedArea[axis] > 0 && -this.am.normalizedArea[axis] + origPos < -this.am.dimension[axis] / 2) {
      instanceObj.position[axis] = this.am.size[axis] * origPos + this.am.areaSize[axis] * this.am.largeArea[axis] + this.am.areaSize[axis];
    } else {
      instanceObj.position[axis] = this.am.size[axis] * origPos + this.am.areaSize[axis] * this.am.largeArea[axis];
    }
  }

  spawnInstanceChild(instance: SpawnerInstance, child: THREE.Object3D) {
    instance.spawnChild(child);
  }
  removeInstanceChild(instance: SpawnerInstance, child: THREE.Object3D) {
    instance.removeChild(child);
  }

  destroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
