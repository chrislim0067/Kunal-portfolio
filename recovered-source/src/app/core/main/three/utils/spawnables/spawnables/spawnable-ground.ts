import { LogBasicShader } from "../../../shaders/logbasicmaterial/LogBasicShader";
import { AbstractSpawnable } from "./abstract-spawnable";

import * as THREE from "three";
import { SpawnerInstance } from "./SpawnerInstance";
import { Vector2 } from "three";

export class SpawnableGround extends AbstractSpawnable {
  groundobj: THREE.Object3D;
  numVerts: number;
  scale: number;

  detail: number;
  strength: number;

  detailStrength: number;
  detailScale: number;

  raycaster;
  raycasterDirection;
  raycasterHelper;

  plane;
  line;
  vTempPos;
  texture2;
  create() {
    this.am.onAreaChange.subscribe((params) => {
      this.visualizeNoise();
    });
    this.visualizeNoise();

    this.groundobj = new THREE.Object3D();
    this.vTempPos = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();
    this.raycasterDirection = new THREE.Vector3(0, -1, 0);
    this.raycasterHelper = new THREE.Vector3(0, 0, 0);

    this.numVerts = this.ts.qc.groundVertices;
    // this.numVerts = this.ts.isDebug ? 20 : 30;
    this.scale = 6;

    this.detail = 0.005 / this.scale;
    this.strength = 400 * this.scale;

    this.detailStrength = 3 * this.scale;
    this.detailScale = 2;

    // const shader = new LogBasicShader();
    // const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    // // uniforms.envMap.value = this.ts.cubeCamera.renderTarget.texture;
    // // const col1 = this.ts.isDebug ? 1 : 0;
    // const col2 = 0.0;
    // const col3 = 0.0;
    // const col1 = Math.random();
    // // const col2 = Math.random();
    // // const col3 = Math.random();
    // uniforms.diffuse.value = new THREE.Vector3(col1, col2, col3);
    // uniforms.color.value = new THREE.Vector3(col1, col2, col3);
    // uniforms.fogColor.value = new THREE.Vector3(0, 1, 1);
    // uniforms.fogNear.value = 0;
    // uniforms.fogFar.value = this.am.size.x * 0.7 + this.ts.debugZ;
    // uniforms.reflectivity.value = 0.0;
    // uniforms.metalness.value = 0.0;
    // uniforms.roughness.value = 1.0;

    // this.childMat = new THREE.ShaderMaterial({
    //   uniforms,
    //   vertexShader: shader.getVertexShader(uniforms),
    //   fragmentShader: shader.getFragmentShader(uniforms),

    //   fog: true,
    //   // depthWrite: false,
    //   // depthTest: false,
    //   wireframe: this.ts.isDebug,
    //   // wireframe: false
    // });
    // const bump = this.ts.assets.getAsset("groundbump").data;
    // const map = this.ts.assets.getAsset("grounddiff").data as THREE.Texture;
    // const roughness = this.ts.assets.getAsset("groundroughness").data as THREE.Texture;
    // const repeat = 10;
    // const repeat2 = 2;
    // map.repeat = new THREE.Vector2(10, 10);
    // bump.repeat = new THREE.Vector2(repeat, repeat);
    // roughness.repeat = new THREE.Vector2(repeat2, repeat2);
    // map.wrapS = map.wrapT = THREE.RepeatWrapping;
    // bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
    // roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;

    // this.texture2 = this.ts.assets.getAsset("waternormals").data;
    // this.texture2.wrapS = this.texture2.wrapT = THREE.RepeatWrapping;
    // this.texture2.repeat = new THREE.Vector2(15, 15);
    // this.childMat.extensions.derivatives = true;

    this.childMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0) });
    // this.childMat = new THREE.MeshPhongMaterial({
    //   envMap: this.ts.cubeCamera.renderTarget.texture,
    //   reflectivity: 0.5,
    //   refractionRatio: 0.5,
    //   color: new THREE.Color(0, 0, 0),
    //   transparent: false,
    // });
    this.ts.prepareFogMaterial(this.childMat).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });

    // this.childMat = new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
    //   shininess: 10,
    //   specular: 0x111111,
    //   transparent: true,
    // });
  }
  createInstance(): SpawnerInstance {
    const instance = new SpawnerInstance();
    instance.spawnable = this;
    this.groundobj.add(instance.obj);
    this.ts.mainScene.add(this.groundobj);
    return instance;
  }

  createChild(instance, x, y, z): THREE.Object3D {
    const obj = new THREE.Object3D();
    const debug = this.ts.isDebug ? 10 : 0;
    const geom = new THREE.PlaneGeometry(this.am.size.x - debug, this.am.size.z - debug, this.numVerts, this.numVerts);
    const plane = new THREE.Mesh(geom, this.childMat);
    plane.receiveShadow = false;
    // obj.frustumCulled = false;
    plane.rotation.x = (-90 * Math.PI) / 180;
    if (this.ts.isDebug) {
    }
    // plane.scale.setScalar(0.999);
    obj.add(plane);
    return obj;
  }

  manipulateChild(child: THREE.Object3D, instance: SpawnerInstance, cutoffNoise: number, featherNoise: number) {
    // child.position.y = 10;
    const mesh: THREE.Mesh = child.children[0].children[0] as THREE.Mesh;
    mesh.frustumCulled = false; // needs optimization
    // three r125+ uses BufferGeometry; displace heights via the position attribute
    // (the original code used the legacy Geometry.vertices API).
    const position = (mesh.geometry as THREE.BufferGeometry).getAttribute("position");
    const vnum = this.numVerts + 1;

    // child.children[0].updateMatrixWorld();
    child.updateMatrixWorld();
    for (let _x = 0; _x < vnum; _x++) {
      for (let _z = 0; _z < vnum; _z++) {
        const vertId = _z * (this.numVerts + 1) + _x;

        this.vTempPos.set(position.getX(vertId), position.getY(vertId), position.getZ(vertId));
        mesh.localToWorld(this.vTempPos);
        position.setZ(vertId, this.getGroundLevel(this.vTempPos));
      }
    }
    position.needsUpdate = true;
    mesh.geometry.computeBoundingBox();
  }

  getGroundLevel(pos: THREE.Vector3, withDetail = true): number {
    const perlinX = pos.x * this.detail;
    const perlinZ = pos.z * this.detail;
    // vertices[vertId].z = this.noise.simplex2(perlinX, perlinZ) * 150;

    const noise2 = (1 + this.noiseGenerators[1].simplex2(perlinX / 10, perlinZ / 10)) / 2;

    let detail = 0;

    if (withDetail) {
      const noise3 = this.noiseGenerators[2].simplex2(perlinX * this.detailScale, perlinZ * this.detailScale);
      detail = noise3 * this.detailStrength;
    }

    const noiseBias = 1;
    const simplex = (1 + this.noiseGenerators[0].simplex2(perlinX, perlinZ)) / 2;
    let noise = ((noise2 / noiseBias + simplex / noiseBias) / 2) * this.strength * (noise2 * noise2 * noise2) + detail;

    // noise = noise > 15 ? noise : 9;

    return noise;
  }

  getGroundLevelRay(pos: THREE.Vector3): number {
    // update the picking ray with the camera and mouse position
    this.raycasterHelper.set(Math.round(pos.x), 1000, Math.round(pos.z));
    this.raycaster.set(this.raycasterHelper, this.raycasterDirection);
    const intersects = this.raycaster.intersectObjects(this.groundobj.children, true);

    if (intersects[0]) {
      const distance = -(intersects[0].distance - 1000);
      // vertices[1].y = distance;
      return distance;
    } else {
      // console.warn("no ground intersection");
      return this.getGroundLevel(pos);
    }
  }

  visualizeNoise() {
    if (!this.ts.helperCanvas) {
      return;
    }
    const canvas = this.ts.helperCanvas;
    canvas.width = 20;
    canvas.height = 20;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const viewdistance = 3;

    for (let x = 0; x < canvas.width; x++) {
      for (let z = 0; z < canvas.height; z++) {
        const pX = this.am.currentArea.x * this.am.size.x + (x / canvas.width) * this.am.dimension.x * this.am.size.x * viewdistance - ((this.am.dimension.x * this.am.size.x) / 2) * viewdistance;
        const pZ = this.am.currentArea.z * this.am.size.z + (z / canvas.height) * this.am.dimension.z * this.am.size.z * viewdistance - ((this.am.dimension.z * this.am.size.z) / 2) * viewdistance;
        const v = (this.getGroundLevel(new THREE.Vector3(pX, 0, pZ)) + 100) / this.strength;
        const highpoints = v > 1.6 ? 255 : 0;
        const color = "rgba(" + highpoints + ",0,0," + Math.abs(v) + ")";
        ctx.fillStyle = color;
        ctx.fillRect(x, z, 1, 1);
      }
    }
  }

  destroy() {
    super.destroy();
  }
}
