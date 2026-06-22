import { ColorManipulator } from "../../../../shared/utils/colormanipulator";
import { AbstractThreeManager } from "./abstract-three-manager";
import * as THREE from "three";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare";

export class LogLensFlareManager extends AbstractThreeManager {
  textureFlare0: any;
  textureFlare3: any;
  textureFlare4: any;
  light: THREE.PointLight;
  pointLightHelper;
  sunColor = { h: 0, s: 0, l: 1 };

  create() {
    // lensflares
    this.textureFlare0 = this.ts.assets.getAsset("lensflare1").data;
    this.textureFlare3 = this.ts.assets.getAsset("lensflare2").data;
    this.textureFlare4 = this.ts.assets.getAsset("lensflare3").data;
    // this.addLight(0.55, 0.9, 0.5, 0, 0, -500);
    // this.addLight(0.08, 0.8, 0.5, 0, 0, -1000);
    this.addLight(0.995, 0.5, 0.9, 0, 500, -500);
  }
  addLight(h, s, l, x, y, z) {
    this.light = new THREE.PointLight(0xffffff, 0);
    // this.light.castShadow = true;
    // this.light.shadow.mapSize.width = 4512;
    // this.light.shadow.mapSize.height = 4512;

    // this.light.shadow.camera.position.set(this.ts.camera.position.x, this.ts.camera.position.y, this.ts.camera.position.z);
    // this.light.shadow.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // this.light = new THREE.PointLight(0x111111, 0.3);
    // this.light.frustumCulled = false;

    // this.light.color.setHSL(h, s, l);
    this.light.position.set(x, y, z);
    this.ts.mainScene.add(this.light);
    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(this.textureFlare0, 400, 0, this.light.color));
    lensflare.addElement(new LensflareElement(this.textureFlare4, 300, 0.01, this.light.color));
    lensflare.addElement(new LensflareElement(this.textureFlare3, 60, 0.6, this.light.color));
    lensflare.addElement(new LensflareElement(this.textureFlare3, 400, 0.7, this.light.color));
    lensflare.addElement(new LensflareElement(this.textureFlare3, 200, 0.2, this.light.color));
    lensflare.addElement(new LensflareElement(this.textureFlare3, 140, 1, this.light.color));
    this.light.add(lensflare);

    // const sphereSize = 50;
    // this.pointLightHelper = new THREE.PointLightHelper(this.light, sphereSize);
    // this.ts.scene.add(this.pointLightHelper);
  }
  onRender(clock: { elapsedTime: number; delta: number }) {
    this.light.position.copy(this.ts.sky.sunSphere.position);
    this.light.lookAt(0, 0, 0);

    // this.ts.sky.sunSphere.visible = false;
    // this.pointLightHelper.update();
    // console.log(this.light.position);
  }

  onSkyUpdate() {
    // const lightness = 250 * this.ts.skyController.inclination;
    // const color = parseInt(ColorManipulator.LightenDarkenColor("e07e6e", lightness), 16);
    // this.light.color.setHex(color);
    // * this.ts.skyController.inclination
    // this.light.color.setHSL(this.sunColor.h, this.sunColor.s, this.sunColor.l);
    // console.log(color)
  }
}
