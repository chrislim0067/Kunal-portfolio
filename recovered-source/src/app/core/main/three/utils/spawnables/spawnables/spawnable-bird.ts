import { LogBasicShader } from "../../../shaders/logbasicmaterial/LogBasicShader";
import { AbstractSpawnable } from "./abstract-spawnable";
import { SpawnerInstance } from "./SpawnerInstance";

import * as THREE from "three";
import { LogStandardShader } from "../../../shaders/logstandardmaterial/LogStandardShader";
import { LogAsset } from "../../log-asset-manager";
import { LogNoise } from "src/app/shared/utils/noise";

class Bird {
  obj: THREE.Object3D = new THREE.Object3D();
  wingL: { obj: THREE.Object3D; transformObj: THREE.Object3D; origPos: THREE.Vector3; origRot: THREE.Vector3 };
  wingR: { obj: THREE.Object3D; transformObj: THREE.Object3D; origPos: THREE.Vector3; origRot: THREE.Vector3 };
  wingLTop: { obj: THREE.Object3D; transformObj: THREE.Object3D; origPos: THREE.Vector3; origRot: THREE.Vector3 };
  wingRTop: { obj: THREE.Object3D; transformObj: THREE.Object3D; origPos: THREE.Vector3; origRot: THREE.Vector3 };
  wingPhase = Math.random() * Math.PI * 2;
  circlingSize = 10 + Math.random() * 10;
  disperse = 10;
  disperseVec: THREE.Vector3 = new THREE.Vector3();
  rand = Math.random() * Math.PI * 2;
  dampBase = 100;
  speed = 1;
  speedBase = Math.random() * 0.5 + 0.5;
  tempDiffVector: THREE.Vector3 = new THREE.Vector3();
  tempGoalVector: THREE.Vector3 = new THREE.Vector3();
  tempControlPos: THREE.Vector3 = new THREE.Vector3();
  tempWorldPos: THREE.Vector3 = new THREE.Vector3();
  prevPos: THREE.Vector3 = new THREE.Vector3();

  constructor(private config: any, private controlObj: THREE.Object3D, public wingLgeom: THREE.ShapeBufferGeometry, public wingRgeom: THREE.ShapeBufferGeometry, wLTop, wRTop) {
    this.circlingSize = config.circlingSize;
    this.disperse = config.disperse;
    this.disperseVec.set(this.disperse - Math.random() * this.disperse * 2, this.disperse - Math.random() * this.disperse * 2, this.disperse - Math.random() * this.disperse * 2);

    this.wingL = this.createObj(this.obj, wingLgeom, 0x8080f0, 0, 0, 0, -90, 40, 0, 1);
    this.wingR = this.createObj(this.obj, wingRgeom, 0x8080f0, 0, 0, 0, -90, -40, 0, 1);

    // this.wingLTop = this.createObj(this.wingL.obj, wingLTopgeom, 0x8080f0, 0, 0, 0, 90, -40, -180 + 30, 1);
    this.wingLTop = this.createObj(this.wingL.transformObj, wLTop, 0x8080f0, -4, 0, 0, 0, 0, -65, 1);
    this.wingRTop = this.createObj(this.wingR.transformObj, wRTop, 0x8080f0, 4, 0, 0, 0, 0, 65, 1);
    this.obj.scale.setScalar(config.birdSize);

    this.setTempVector(controlObj, this.rand);
    this.obj.position.copy(this.tempGoalVector);
    // const helper = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 10), new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }));
    // this.obj.add(helper);
  }

  createObj(parent: THREE.Object3D, geom, color, x, y, z, rx, ry, rz, s) {
    const obj = new THREE.Object3D();
    const transformObj = new THREE.Object3D();
    // flat shape
    const mesh = new THREE.Mesh(geom, this.config.material);
    obj.position.set(x, y, z);
    obj.rotation.set((rx * Math.PI) / 180, (ry * Math.PI) / 180, (rz * Math.PI) / 180);
    obj.scale.set(s, s, s);
    transformObj.add(mesh);
    obj.add(transformObj);

    // const helper = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide }));
    // obj.add(helper);
    // const helper2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3),
    //     new THREE.MeshStandardMaterial({ color: 0x0000FF, side: THREE.DoubleSide }));
    // transformObj.add(helper2);
    // // extruded shape
    // let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    // let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }));
    // mesh.position.set(x, y, z - 75);
    // mesh.rotation.set(rx, ry, rz);
    // mesh.scale.set(s, s, s);
    // obj.add(mesh);
    parent.add(obj);
    return { obj, transformObj, origPos: new THREE.Vector3(x, y, z), origRot: new THREE.Vector3(rx, ry, rz) };
  }
  update(controlObj: THREE.Object3D, clock: { elapsedTime: number; delta: number }) {
    const time = this.rand + clock.elapsedTime / 3;
    this.wingPhase += this.speed;
    const wingPhase = Math.sin(this.wingPhase / 2);
    const pi = Math.PI / 180;
    this.wingL.transformObj.rotation.y = wingPhase * 30 * pi;
    this.wingR.transformObj.rotation.y = -wingPhase * 30 * pi;
    this.wingLTop.transformObj.rotation.y = (-50 - wingPhase * 50) * pi;
    this.wingRTop.transformObj.rotation.y = -(-50 - wingPhase * 50) * pi;

    this.speed = 0.6 + Math.sin(time) * 0.4 * this.speedBase;
    const dampening = (0.3 + 1 - this.speed) * this.dampBase;

    this.setTempVector(controlObj, time);

    this.tempDiffVector.copy(this.tempGoalVector);
    // this.tempControlPos.copy(this.tempDiffVector).multiplyScalar(10).add(this.obj.position);
    this.tempDiffVector.sub(this.obj.position).divideScalar(dampening);
    this.obj.position.add(this.tempDiffVector);
    this.obj.getWorldPosition(this.tempControlPos);

    this.tempControlPos.sub(this.prevPos).normalize().multiplyScalar(10).add(this.obj.getWorldPosition(this.tempWorldPos));
    // this.controlObj.getWorldPosition(this.tempControlPos);
    this.obj.lookAt(this.tempControlPos);
    // this.obj.rotation.y += Math.PI / 2;
    this.obj.getWorldPosition(this.prevPos);
  }
  setTempVector(controlObj: THREE.Object3D, time) {
    this.tempGoalVector.copy(controlObj.position);
    this.tempGoalVector.add(this.disperseVec);
    this.tempGoalVector.x += Math.sin(time) * this.circlingSize;
    this.tempGoalVector.y += Math.sin(time / 2) * this.circlingSize;
    this.tempGoalVector.z += Math.sin(time / 1.5) * this.circlingSize;
  }
}
class BirdFlock {
  birds: Bird[] = [];
  flockObj: THREE.Object3D = new THREE.Object3D();
  controlObj: THREE.Object3D = new THREE.Object3D();
  flockCenter = new THREE.Vector3();
  flyarea = new THREE.Vector3(30, 30, 30);
  flyspeed = new THREE.Vector3(5, 5, 5);
  constructor(
    public config: {
      size: number;
      x: number;
      y: number;
      z: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      areax: number;
      areay: number;
      areaz: number;
      circlingSize: number;
      disperse: number;
      material: THREE.Material;
      timeShift: number;
      birdSize: number;
    }
  ) {
    this.flockCenter.set(config.x, config.y, config.z);
    this.flyarea.set(config.areax, config.areay, config.areaz);
    this.flyspeed.set(config.speedX, config.speedY, config.speedZ);
    const mat = new THREE.MeshBasicMaterial({ color: 0xefefef });
    const cog = new THREE.BoxGeometry(10, 10, 10);
    this.controlObj = new THREE.Mesh(cog, mat);
    // this.flockObj.add(this.controlObj);
    this.update({ elapsedTime: 0, delta: 0 });
    this.createBird();
  }
  createBird() {
    // var extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const leftWingGeom = this.createShape([
      [-4, 0],
      [0, 0],
      [0, 2],
      [-4, 0],
    ]);
    const rightWingGeom = this.createShape([
      [4, 0],
      [0, 0],
      [0, 2],
      [4, 0],
    ]);
    // const leftWingTopGeom = this.createShape([[-4, 0], [0, 0], [0, 4], [-4, 0]]);
    // const rightWingTopGeom = this.createShape([[4, 0], [0, 0], [0, 4], [4, 0]]);
    const leftWingTopGeom = this.createShape([
      [-2, -1],
      [0, 0],
      [0, 3],
      [-2, -1],
    ]);
    const rightWingTopGeom = this.createShape([
      [2, -1],
      [0, 0],
      [0, 3],
      [2, -1],
    ]);

    for (let a = 0; a < this.config.size; a++) {
      const bird = new Bird(this.config, this.controlObj, leftWingGeom, rightWingGeom, leftWingTopGeom, rightWingTopGeom);
      this.birds.push(bird);
      this.flockObj.add(bird.obj);
    }
  }
  createShape(pts: any[][]) {
    const shape = new THREE.Shape();
    shape.moveTo(pts[0][0], pts[0][1]);
    for (let index = 1; index < pts.length; index++) {
      const pt = pts[index];
      shape.lineTo(pt[0], pt[1]);
    }
    return new THREE.ShapeBufferGeometry(shape);
  }

  update(clock: { elapsedTime: number; delta: number }) {
    const time = this.config.timeShift + clock.elapsedTime;
    this.controlObj.position.x = this.flockCenter.x + Math.sin(time / this.flyspeed.x) * this.flyarea.x;
    this.controlObj.position.y = this.flockCenter.y + Math.sin(time / this.flyspeed.y) * this.flyarea.y;
    this.controlObj.position.z = this.flockCenter.z + Math.cos(time / this.flyspeed.z) * this.flyarea.z;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.birds.length; i++) {
      const bird = this.birds[i];
      bird.update(this.controlObj, clock);
    }
  }
}

export class SpawnableBird extends AbstractSpawnable {
  flocks: BirdFlock[] = [];
  childGeom;
  childMat;
  lookPos = new THREE.Vector3();
  // plane;
  create() {
    // const gridHelper = new THREE.GridHelper(this.am.size * this.am.num * 3, this.am.num * 3, 0x0000ff, 0x808080);
    // this.ts.mainScene.add(gridHelper);
    // this.plane = new THREE.Mesh(new THREE.PlaneGeometry(this.am.size, this.am.size),
    //     new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0, 0), opacity: 0.2, transparent: true }));
    // this.plane.rotation.x = -90 * Math.PI / 180;
    // this.ts.mainScene.add(this.plane);
    // gridHelper.position.x = -this.ts.areaSize / 2;
    // gridHelper.position.z = -this.ts.areaSize / 2;
    // const shader = new LogBasicShader();
    // const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    // const col1 = 1;
    // const col2 = 1;
    // const col3 = 1;
    // uniforms.diffuse.value = new THREE.Vector3(col1, col2, col3);
    // uniforms.color.value = new THREE.Vector3(col1, col2, col3);
    // // uniforms.envMap.value = this.ts.cubeCamera.renderTarget.texture;
    // uniforms.fogColor.value = new THREE.Vector3(0, 1, 1);
    // uniforms.fogNear.value = this.am.size.x / 2;
    // uniforms.fogFar.value = this.am.size.x;
    // uniforms.reflectivity.value = 0.0;
    // // uniforms.roughness.value = 0.85;
    // uniforms.map.value = this.ts.assets.getAsset('cloud').data;
    // // this.ts.cubeCamera.renderTarget.texture.mapping = THREE.CubeRefractionMapping;
    // this.childMat = new THREE.ShaderMaterial({
    //     uniforms,
    //     vertexShader: shader.getVertexShader(uniforms),
    //     fragmentShader: shader.getFragmentShader(uniforms),
    //     // lights: true,
    //     // depthWrite: true,
    //     // depthTest: true,
    //     // alphaTest: 0.5,
    //     depthWrite: false,
    //     depthTest: false,
    //     transparent: true,
    //     // blending: THREE.MixOperation,
    //     blending: THREE.AdditiveBlending,
    //     combine: THREE.MixOperation,
    //     // combine: THREE.AddOperation,
    //     // combine: THREE.MixOperation,
    //     // fog: true,
    //     side: THREE.DoubleSide
    // });
    // this.childGeom = new THREE.PlaneGeometry(this.am.size.x, this.am.size.z);
    // this.ts.assets.getAsset('soundCrows').onLoad.subscribe((asset: LogAsset) => {
    //     if (asset.isLoaded && this.ts.firstContact) {
    //         this.setupSound(asset.data);
    //     }
    // });
    // const gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);
    // this.ts.mainScene.add(gridHelper);
  }

  createChild(instance, x, y, z): THREE.Object3D {
    const wrapper = new THREE.Object3D();

    const birdflock: any = new BirdFlock({
      size: this.ts.qc.birdFlockSize,
      x: 0,
      y: 0,
      z: 0,
      speedX: 2,
      speedY: 2 + Math.random(),
      speedZ: 2,
      areax: 250,
      areay: 10,
      areaz: 250,
      // areax: 5,
      // areay: 0,
      // areaz: 5,
      circlingSize: 1,
      disperse: 75,
      material: new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }),
      timeShift: -50,
      birdSize: 1,
    });
    this.ts.prepareFogMaterial(birdflock.config.material).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });

    birdflock.flockObj.origClass = birdflock;

    // this.ts.assets.getAsset("soundCrows").onLoad.subscribe((asset: LogAsset) => {
    //   if (asset.isLoaded && this.ts.firstContact) {
    //     this.setupSound(birdflock, asset.data);
    //   }
    // });

    wrapper.add(birdflock.flockObj);
    return wrapper;
  }
  setupSound(flock, buffer) {
    const sound2 = new THREE.PositionalAudio(this.ts.audio.ts.listener);
    sound2.setBuffer(buffer);
    sound2.setRefDistance(5);
    sound2.setVolume(2);
    sound2.play();
    flock.controlObj.add(sound2);
  }
  manipulateChild(child: THREE.Object3D, instance: SpawnerInstance) {
    // plane.rotation.z += 0.001;
    // // = child.origRotZ
    child.position.y = this.ts.spawner.ground.getGroundLevelRay(this.tempPos.add(child.children[0].position)) + 300;

    // child.position.y = this.ts.ground.getGroundLevelRay(this.tempPos.add(child.children[0].position));
  }

  manipulateChildRender(clock, instance, childInstance) {
    // console.log(childInstance);
    childInstance.children[0].children[0].origClass.update(clock);
  }
  destroy() {
    super.destroy();
  }
}
