import { ColorManipulator } from "../../../../shared/utils/colormanipulator";
import { AbstractThreeManager } from "./abstract-three-manager";
import * as THREE from "three";
import { LogSky } from "../shaders/sky/logsky";
import { LogStars } from "../shaders/stars/logstars";
import { AdditiveBlending } from "three";

export class LogSkyManager extends AbstractThreeManager {
  sunSphere: THREE.Mesh;
  // sunLight: THREE.DirectionalLight;

  sky: any;
  stars: any;
  skyBox: any;

  // distance = 525000;
  distance = 10000;

  sunRealPos: THREE.Vector3 = new THREE.Vector3();
  // sunFakePos: THREE.Vector3 = new THREE.Vector3();

  sunPos: THREE.Vector3 = new THREE.Vector3();

  skyReflectionTexture;
  skyRefractionTexture;
  renderTarget;
  onContextRestored() {
    this.onSkyUpdate();
  }
  create() {
    // Add Sky
    this.sky = new LogSky();
    this.sky.scale.setScalar(this.distance);
    this.ts.scene.add(this.sky);

    this.stars = new LogStars();
    this.stars.scale.setScalar(this.ts.camera.far * 2);
    this.ts.scene.add(this.stars);

    // console.log(this.stars.material);
    // this.stars.material.uniforms.opacity.value = 0.1;
    // const texture = this.ts.cubeCamera.renderTarget.texture;

    // texture.flipY = true;
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.repeat.x = - 1;
    // clonedTexture.mapping = THREE.CubeRefractionMapping;

    // const material = new THREE.MeshBasicMaterial({
    //     color: 0x363636,
    //     side: THREE.BackSide,
    //     // refractionRatio: 0.1,
    //     // reflection: 0
    // });

    // const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2000), material);
    // this.ts.mainScene.add(mesh);
    // mesh.position.y = -40;

    // // const light = new THREE.DirectionalLight(0xdfebff, 10, 1);
    // // light.position.set(0, 0, 0);
    // // this.ts.mainScene.add(light);

    // this.skyBox = new THREE.Mesh(new THREE.SphereGeometry(1), material);
    // // this.skyBox.frustumCulled = false;
    // this.skyBox.scale.setScalar(40);
    // // this.skyBox.scale.y = -40;
    // this.ts.mainScene.add(this.skyBox);

    // Add Sun Helper
    this.sunSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(10, 16, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 0.5, 0), fog: false, blending: AdditiveBlending, depthWrite: false }));
    // , blending: THREE.AdditiveBlending
    // this.sunSphere.visible = false;
    // this.ts.mainScene.add(this.sunSphere);

    this.createSunLight();

    // setInterval((params) => {
    //   this.sky.visible = !this.sky.visible;
    // }, 1000);
  }
  createSunLight() {
    // this.sunLight = new THREE.DirectionalLight(0xdfebff, 1);
    // this.sunLight = new THREE.DirectionalLight(0xdfebff, 0.01);
    // this.sunLight.position.set(100, 200, -10);
    // this.ts.scene.add(this.sunLight);
    // this.sunLight.castShadow = true;
    // this.sunLight.shadowCameraVisible = true;
    // this.sunLight.castShadow = true;
    // this.sunLight.shadow.mapSize.width = 4512;
    // this.sunLight.shadow.mapSize.height = 4512;
    // this.sunLight.shadow.camera = new THREE.OrthographicCamera(-20, 20,
    //     20, -20, 110, 130);
    // this.sunLight.shadow.camera.updateProjectionMatrix();
    // this.sunLight.shadowDarkness = 100;
    // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
    // this.ts.mainScene.add(helper);
  }

  onRender() {
    // console.time('concatenation');
    // const tempV = new THREE.Vector3().subVectors(this.sunRealPos, this.ts.camera.position).normalize();
    // const dist = new THREE.Vector3().setScalar(100);
    // this.sunFakePos = this.sunFakePos.copy(this.ts.camera.position).add(tempV.multiply(dist));
    this.stars.position.copy(this.ts.camera.position);
    // console.timeEnd('concatenation');
    this.sunSphere.position.copy(this.sunPos).add(this.ts.camera.position);
  }

  onSkyUpdate() {
    const uniforms = this.sky.material.uniforms;
    uniforms.turbidity.value = this.ts.skyController.turbidity;
    uniforms.rayleigh.value = this.ts.skyController.rayleigh;
    uniforms.luminance.value = this.ts.lightningRunning && this.ts.lightningHappening ? this.ts.luminanceOverride : this.ts.skyController.luminance;
    uniforms.mieCoefficient.value = this.ts.skyController.mieCoefficient;
    uniforms.mieDirectionalG.value = this.ts.skyController.mieDirectionalG;

    uniforms.totalRayleigh.value = new THREE.Vector3(this.ts.skyController.totalRayleighX * Math.pow(10, -6), this.ts.skyController.totalRayleighY * Math.pow(10, -5), this.ts.skyController.totalRayleighZ * Math.pow(10, -5));

    // this.sunLight.intensity = 1 - this.ts.skyController.inclination;

    const theta = Math.PI * (this.ts.skyController.inclination - 0.5);
    const phi = 2 * Math.PI * (this.ts.skyController.azimuth - 0.5);

    const distance = this.distance;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    this.sunRealPos.x = distance * cosPhi;
    this.sunRealPos.y = distance * sinPhi * sinTheta;
    this.sunRealPos.z = distance * sinPhi * cosTheta;

    const lightDist = 1190;

    this.sunPos.x = lightDist * cosPhi;
    this.sunPos.y = lightDist * sinPhi * sinTheta;
    this.sunPos.z = lightDist * sinPhi * cosTheta;

    // this.sunLight.lookAt(new THREE.Vector3(0, 0, 0));
    this.stars.material.uniforms.strength.value = this.ts.skyController.stars;

    // this.sunLight.shadow.camera.position.set(this.sunLight.x, this.sunLight.y, this.sunLight.z);
    // this.sunLight.shadow.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // this.sunSphere.visible = this.ts.skyController.sun;

    uniforms.sunPosition.value.copy(this.sunRealPos);

    // this.renderTarget = this.ts.renderer.getRenderTarget();
    // this.ts.renderer.setRenderTarget(null);
    // this.ts.renderer.clear();
    this.ts.scene.background = null;
    this.ts.mainScene.visible = false;
    this.stars.visible = false;

    this.sky.visible = true;
    // this.cubeCamera.position.set(100, 100, 100);
    this.ts.cubeCamera.update(this.ts.renderer, this.ts.scene);
    this.ts.mainScene.visible = true;
    this.sky.visible = false;
    this.stars.visible = true;
    this.ts.scene.background = this.ts.cubeCamera.renderTarget;

    // this.ts.renderer.setRenderTarget(this.renderTarget);
  }
}
