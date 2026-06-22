import { LogBasicShader } from "../../../shaders/logbasicmaterial/LogBasicShader";
import { AbstractSpawnable } from "./abstract-spawnable";
import { SpawnerInstance } from "./SpawnerInstance";

import * as THREE from "three";
import { LogStandardShader } from "../../../shaders/logstandardmaterial/LogStandardShader";
import { LogAsset } from "../../log-asset-manager";
import { LogNoise } from "src/app/shared/utils/noise";

export class SpawnableCloud extends AbstractSpawnable {
  childGeom;
  childMat;
  lookPos = new THREE.Vector3();
  camWorldDir = new THREE.Vector3();

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
    this.childGeom = new THREE.PlaneGeometry(this.am.size.x, this.am.size.z);
  }

  createChild(instance, x, y, z): THREE.Object3D {
    const wrapper: any = new THREE.Object3D();
    // const opmat = new THREE.MeshBasicMaterial({
    //     // color: 0xff0000,
    //     color: (Math.random() * 0xFFFFFF << 0),

    //     transparent: true,
    //     opacity: 0.5
    // });
    // const tile = new THREE.Mesh(plane2geom, opmat);
    // wrapper.add(tile);
    // tile.rotation.x = - Math.PI / 2;

    // const spriteMaterial = new THREE.MeshBasicMaterial({
    //     // color: (Math.random() * 0xFFFFFF << 0),
    //     // color: 0xdcdcdc,
    //     map: this.ts.assets.getAsset('cloud').data,
    //     envMap: this.ts.cubeCamera.renderTarget.texture,
    //     transparent: true,
    //     depthWrite: false,
    //     depthTest: false,
    //     // blending: THREE.AdditiveBlending,
    //     combine: THREE.MixOperation,
    //     reflectivity: 0.68,
    //     // side: THREE.DoubleSide
    // });

    // this.ts.cubeCamera.renderTarget.texture.mapping = THREE.CubeRefractionMapping;
    const mat = new THREE.MeshBasicMaterial({
      // color: (Math.random() * 0xFFFFFF << 0),
      // color: 0xdcdcdc,
      map: this.ts.assets.getAsset("cloud").data,
      envMap: this.ts.cubeCamera.renderTarget.texture,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      combine: THREE.MixOperation,
      // alphaTest: 0.5,
      // combine: THREE.AddOperation,
      reflectivity: 0.5,
      refractionRatio: 1,
      // envMapIntensity: 1,
      // side: THREE.DoubleSide
    });

    this.ts.prepareFogMaterial(mat).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });

    const plane = new THREE.Mesh(this.childGeom, mat);
    wrapper.add(plane);
    plane.renderOrder = 99999;

    plane.scale.setScalar(80 / this.am.size.x);
    wrapper.scale.x = wrapper.scale.y = wrapper.scale.z = 4 + Math.random() * 3;

    // plane.scale.setScalar(0.2);
    // wrapper.scale.x = wrapper.scale.y = wrapper.scale.z = 4 + Math.random() * 3;
    wrapper.origScale = wrapper.scale.x;
    wrapper.origPos = new THREE.Vector3(wrapper.position.x, wrapper.position.y, wrapper.position.z);
    wrapper.gridOrigPos = new THREE.Vector3();
    wrapper.gridOrigPos.x = x;
    wrapper.gridOrigPos.z = z;
    // wrapper.rotation.x = - Math.PI / 2;

    plane.rotation.z = Math.PI * 2 * Math.random();

    wrapper.origRotZ = plane.rotation.z;
    wrapper.position.y = 1;

    return wrapper;
  }

  manipulateChild(child: THREE.Object3D, instance: SpawnerInstance) {
    // plane.rotation.z += 0.001;
    // // = child.origRotZ
    // child.position.y = this.ts.spawner.ground.getGroundLevelRay(this.tempPos.add(child.children[0].position)) + 50;
    child.position.y = this.ts.spawner.ground.getGroundLevel(this.tempPos.add(child.children[0].position));
  }
  getOpacity(t) {
    const lowLimit = 0.5;
    // 1 - (t - lowLimit) / (1 - lowLimit)
    // 1 - (t - 0.7) / (1 - 0.7)
    let ret = t < lowLimit ? t / lowLimit : 1 - (t - lowLimit) / (1 - lowLimit);
    // if (t < lowLimit) {
    //     ret = ret * ((0.3 * ((t - lowLimit) / (1 - lowLimit))) / 0.3);
    // }
    return ret;
  }

  manipulateChildRender(clock, instance, childInstance) {
    const wind = this.ts.effectController.wind * 100;

    const child = childInstance.children[0];
    const plane = child.children[0];
    child.getWorldPosition(this.tempPos);
    const cpos = this.tempPos;
    const detail = 30;
    const time = clock.elapsedTime;
    this.controlPos.copy(this.ts.camera.position);

    // const numX = Math.abs(this.tempPos.x - this.controlPos.x) / this.maxDist.x;
    // const numZ = Math.abs(this.tempPos.z - this.controlPos.z) / this.maxDist.z;
    // // const numY = Math.abs(this.tempPos.y - this.controlPos.y) / this.maxDist.y;
    // plane.material.opacity = this.getOpacity(1 - Math.max(numZ, numX)) / 3;

    this.tempPos.y = this.ts.camera.position.y;
    const dist = Math.min(Math.max(this.tempPos.distanceTo(this.ts.camera.position) / 780, 0), 1);
    plane.material.opacity = ((1 - dist) / 2) * this.ts.effectController.cloudOpacity;

    const scale = child.origScale + this.noiseGenerators[0].simplex3(cpos.x / detail, cpos.z / detail, (time / 10) * wind) * 2;
    child.scale.x = child.scale.y = child.scale.z = scale;
    plane.rotation.z += 0.001;

    // this.lookPos.copy(this.controlPos);
    this.ts.camera.getWorldDirection(this.camWorldDir);
    this.lookPos.copy(this.controlPos.add(this.camWorldDir.multiplyScalar(100).negate()));

    // const vector = new THREE.Vector3(); // create once and reuse it!
    // this.ts.camera.getWorldDirection(vector);
    // vector.multiplyScalar(5);
    // this.lookPos.add(vector);
    // this.lookPos.y = child.position.y;
    child.lookAt(this.lookPos);
  }
  destroy() {
    super.destroy();
  }
}
