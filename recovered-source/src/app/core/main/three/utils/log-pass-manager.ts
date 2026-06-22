import { AbstractThreeManager } from "./abstract-three-manager";
import * as THREE from "three";

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// import { EffectComposer } from 'postprocessing';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";
import { BloomEffect, EffectComposer, EffectPass, RenderPass, BlendFunction, ColorChannel, DepthDownsamplingPass, EdgeDetectionMode, NormalPass, SSAOEffect, SMAAEffect, SMAAImageLoader, SMAAPreset, TextureEffect, ShaderPass, CopyMaterial, DepthOfFieldEffect, DepthEffect, VignetteEffect, NoiseEffect, ChromaticAberrationEffect, KernelSize } from "postprocessing";
export class LogPassManager extends AbstractThreeManager {
  passes: any = {};

  smaaEffect;
  effectPass;
  ssaoEffect;
  depthDownsamplingPass;
  normalDepthBuffer;
  depthOfFieldEffect;

  light: THREE.AmbientLight;
  light2: THREE.DirectionalLight;
  light3;
  camLightVector = new THREE.Vector3();
  shadowArea = 200;
  groundPos = new THREE.Vector3();
  create() {
    this.ts.composer.addPass(new RenderPass(this.ts.scene, this.ts.camera));
    if (this.ts.qc.shadow) {
      this.ts.renderer.shadowMap.enabled = true;
    }

    const backgroundColor = 0xd6d6d6;
    const color = backgroundColor;
    this.ts.scene.fog = this.ts.isDebug ? null : new THREE.FogExp2(color, this.ts.effectController.fogDensity);

    this.light = new THREE.AmbientLight(0x000000, 1);

    this.ts.scene.add(this.light);

    this.smaaEffect = new SMAAEffect(this.ts.assets.getAsset("smaa").data.search, this.ts.assets.getAsset("smaa").data.area, this.ts.site.isMobile ? SMAAPreset.LOW : SMAAPreset.ULTRA, EdgeDetectionMode.DEPTH);

    this.depthOfFieldEffect = new DepthOfFieldEffect(this.ts.camera, {
      focusDistance: 0.06,
      focalLength: 0.35,
      bokehScale: 5.0,
      // width: 320,
      // height: 720,
    });

    this.ts.effectController.focus = this.depthOfFieldEffect.circleOfConfusionMaterial.uniforms.focusDistance.value;
    this.ts.effectController["focalLength"] = this.depthOfFieldEffect.circleOfConfusionMaterial.uniforms.focalLength.value;

    const noiseEffect = new NoiseEffect({
      blendFunction: BlendFunction.OVERLAY,
    });

    noiseEffect.blendMode.opacity.value = 0.1;

    this.effectPass = new EffectPass(this.ts.camera, this.smaaEffect, this.depthOfFieldEffect, noiseEffect);

    // if (this.ts.isDebug) {
    //   this.effectPass = new EffectPass(this.ts.camera);
    // }

    this.ts.composer.addPass(this.effectPass);

    this.registerOptions(this.ts.gui);
  }

  addPass(id: string, pass: any) {
    this.passes[id] = pass;
    pass.renderToScreen = false;
    this.ts.composer.addPass(pass);
    this.activatePass(id);
  }
  activatePass(id: string) {
    Object.keys(this.passes).forEach((key) => {
      const pass = this.passes[key];
      pass.renderToScreen = false;
    });
    this.passes[id].renderToScreen = true;
  }

  onRender() {
    // this.ts.camera.updateMatrixWorld(); //Update the camera location
    // this.camLightVector = this.ts.camera.position.clone(); //Get camera position and put into variable
    // this.camLightVector.applyMatrix4(this.ts.camera.matrixWorld); //Hold the camera location in matrix world
    // this.light2.position.set(this.camLightVector.x + 2, 0, this.camLightVector.z + 2);
    // this.light2.position.copy(this.ts.camera.position);
    // this.light2.target.position.z += 10;
    // this.light2.target.position.copy(this.ts.camera.position);
    // this.light2.target.position.x += 10;
    // this.light2.target.position.set(this.camLightVector.x, 0, this.camLightVector.z);
    //Move Light Along With Camera
    // this.ts.camera.updateMatrixWorld(); //Update the camera location
    // this.camLightVector = this.ts.camera.position.clone(); //Get camera position and put into variable
    // this.camLightVector.applyMatrix4(camera.matrixWorld); //Hold the camera location in matrix world
    // light.position.set(vector.x, vector.y, vector.z); //Set light position from that we get
    //render(); use if the scene is static
    // this.light2.shadow.camera.position.copy(this.ts.camera.position);
    // this.light3.position.copy(this.ts.controlPos);
    this.ts.scene.fog.density = this.ts.effectController.fogDensity;

    // if (this.light2 && this.ts.spawner) {
    //   const groundLevel = this.ts.spawner.ground.getGroundLevel(this.ts.controlPos);

    //   this.ts.camera.getWorldDirection(this.camLightVector);
    //   this.light2.position.z = this.ts.controlPos.z - 10;
    //   this.light2.position.x = this.ts.controlPos.x - 10;
    //   this.light2.position.y = groundLevel + 200;

    //   this.light2.position.add(this.camLightVector.multiplyScalar(this.shadowArea / 2));

    //   this.light2.target.position.z = this.light2.position.z + 1;
    //   this.light2.target.position.x = this.light2.position.x + 1;
    //   this.light2.target.position.y = this.light2.position.y - 5;
    // }
  }

  onResize(size: { width: number; height: number }) {
    // this.ts.composer.setSize(this.ts.width, this.ts.height);
    // this.ts.composer.setViewport(0, 0, this.ts.width * this.ts.pixelRatio, this.ts.height * this.ts.pixelRatio);
    this.ts.composer.setSize(this.ts.width, this.ts.height);
    // if (this.passes.fxaa) {
    //   this.passes.fxaa.material.uniforms.resolution.value.x = 1 / (this.ts.width * pixelRatio);
    //   this.passes.fxaa.material.uniforms.resolution.value.y = 1 / (this.ts.height * pixelRatio);
    // }

    // this.passes.fxaa.material.uniforms.resolution.value.x = 1 / (this.ts.width * pixelRatio);
    // this.passes.fxaa.material.uniforms.resolution.value.y = 1 / (this.ts.height * pixelRatio);
  }
  onSkyUpdate() {}
  onEffectsUpdate() {
    // this.passes.bokeh.uniforms.focus.value = this.ts.effectController.focus;
    // this.passes.bokeh.uniforms.aperture.value = this.ts.effectController.aperture * 0.00001;
    // this.passes.bokeh.uniforms.maxblur.value = this.ts.effectController.maxblur;
    // if (this.passes.glitch) {
    //   this.passes.glitch.strength = this.ts.effectController.glitch;
    // }
    this.updateFocus();
  }

  registerOptions(menu) {
    if (!menu) return;
    const color = new THREE.Color();
    const capabilities = this.ts.composer.getRenderer().capabilities;

    const effectPass = this.effectPass;
    const depthDownsamplingPass = this.depthDownsamplingPass;

    // const ssaoEffect = this.ssaoEffect;
    // // const textureEffect = this.textureEffect;
    // const blendMode = ssaoEffect.blendMode;
    // const uniforms = ssaoEffect.ssaoMaterial.uniforms;

    const RenderMode = {
      DEFAULT: 0,
      NORMALS: 1,
      DEPTH: 2,
    };

    // const params = {
    //   coc: {
    //     "edge blur kernel": this.depthOfFieldEffect.blurPass.kernelSize,
    //     // focus: this.depthOfFieldEffect.circleOfConfusionMaterial.uniforms.focusDistance.value,
    //     // "focal length": this.depthOfFieldEffect.circleOfConfusionMaterial.uniforms.focalLength.value,
    //   },
    //   "bokeh scale": this.depthOfFieldEffect.bokehScale,

    //   // vignette: {
    //   //   enabled: true,
    //   //   offset: vignetteEffect.uniforms.get('offset').value,
    //   //   darkness: vignetteEffect.uniforms.get('darkness').value,
    //   // },
    //   distance: {
    //     threshold: uniforms.distanceCutoff.value.x,
    //     falloff: uniforms.distanceCutoff.value.y - uniforms.distanceCutoff.value.x,
    //   },
    //   proximity: {
    //     threshold: uniforms.proximityCutoff.value.x,
    //     falloff: uniforms.proximityCutoff.value.y - uniforms.proximityCutoff.value.x,
    //   },
    //   upsampling: {
    //     enabled: ssaoEffect.defines.has("DEPTH_AWARE_UPSAMPLING"),
    //     threshold: Number(ssaoEffect.defines.get("THRESHOLD")),
    //   },
    //   distanceScaling: {
    //     enabled: ssaoEffect.distanceScaling,
    //     "min scale": uniforms.minRadiusScale.value,
    //   },
    //   "lum influence": ssaoEffect.uniforms.get("luminanceInfluence").value,
    //   intensity: uniforms.intensity.value,
    //   bias: uniforms.bias.value,
    //   fade: uniforms.fade.value,
    //   "render mode": RenderMode.DEFAULT,
    //   resolution: ssaoEffect.resolution.scale,
    //   color: 0x000000,
    //   opacity: blendMode.opacity.value,
    //   "blend mode": blendMode.blendFunction,
    // };

    // function toggleRenderMode() {
    //   const mode = Number(params['render mode']);

    //   if (mode === RenderMode.DEPTH) {
    //     textureEffect.setTextureSwizzleRGBA(ColorChannel.ALPHA);
    //   } else if (mode === RenderMode.NORMALS) {
    //     textureEffect.setTextureSwizzleRGBA(
    //       ColorChannel.RED,
    //       ColorChannel.GREEN,
    //       ColorChannel.BLUE,
    //       ColorChannel.ALPHA
    //     );
    //   }

    //   textureEffect.blendMode.setBlendFunction(
    //     mode !== RenderMode.DEFAULT ? BlendFunction.NORMAL : BlendFunction.SKIP
    //   );
    // }

    // if (capabilities.isWebGL2) {
    //   menu.add(params, 'render mode', RenderMode).onChange(toggleRenderMode);
    // }

    // menu
    //   .add(params, "resolution")
    //   .min(0.25)
    //   .max(1.0)
    //   .step(0.25)
    //   .onChange(() => {
    //     ssaoEffect.resolution.scale = params.resolution;
    //     depthDownsamplingPass.resolution.scale = params.resolution;
    //   });

    // menu.add(ssaoEffect, "samples").min(1).max(32).step(1);
    // menu.add(ssaoEffect, "rings").min(1).max(16).step(1);
    // menu.add(ssaoEffect, "radius").min(1e-6).max(1.0).step(0.001);

    // let f = menu.addFolder("Distance Scaling");

    // f.add(params.distanceScaling, "enabled").onChange(() => {
    //   ssaoEffect.distanceScaling = params.distanceScaling.enabled;
    // });

    // f.add(params.distanceScaling, "min scale")
    //   .min(0.0)
    //   .max(1.0)
    //   .step(0.001)
    //   .onChange(() => {
    //     uniforms.minRadiusScale.value = params.distanceScaling["min scale"];
    //   });

    // if (capabilities.isWebGL2) {
    //   f = menu.addFolder("Depth-Aware Upsampling");

    //   f.add(params.upsampling, "enabled").onChange(() => {
    //     ssaoEffect.depthAwareUpsampling = params.upsampling.enabled;
    //   });

    //   f.add(params.upsampling, "threshold")
    //     .min(0.0)
    //     .max(1.0)
    //     .step(0.001)
    //     .onChange(() => {
    //       // Note: This threshold is not really supposed to be changed.
    //       ssaoEffect.defines.set("THRESHOLD", params.upsampling.threshold.toFixed(3));
    //       effectPass.recompile();
    //     });
    // }

    // f = menu.addFolder("Distance Cutoff");

    // f.add(params.distance, "threshold")
    //   .min(0.0)
    //   .max(1.0)
    //   .step(0.0001)
    //   .onChange(() => {
    //     ssaoEffect.setDistanceCutoff(params.distance.threshold, params.distance.falloff);
    //   });

    // f.add(params.distance, "falloff")
    //   .min(0.0)
    //   .max(1.0)
    //   .step(0.0001)
    //   .onChange(() => {
    //     ssaoEffect.setDistanceCutoff(params.distance.threshold, params.distance.falloff);
    //   });

    // f = menu.addFolder("Proximity Cutoff");

    // f.add(params.proximity, "threshold")
    //   .min(0.0)
    //   .max(0.01)
    //   .step(0.0001)
    //   .onChange(() => {
    //     ssaoEffect.setProximityCutoff(params.proximity.threshold, params.proximity.falloff);
    //   });

    // f.add(params.proximity, "falloff")
    //   .min(0.0)
    //   .max(0.01)
    //   .step(0.0001)
    //   .onChange(() => {
    //     ssaoEffect.setProximityCutoff(params.proximity.threshold, params.proximity.falloff);
    //   });

    // menu
    //   .add(params, "bias")
    //   .min(0.0)
    //   .max(1.0)
    //   .step(0.001)
    //   .onChange(() => {
    //     uniforms.bias.value = params.bias;
    //   });

    // menu
    //   .add(params, "fade")
    //   .min(0.0)
    //   .max(1.0)
    //   .step(0.001)
    //   .onChange(() => {
    //     uniforms.fade.value = params.fade;
    //   });

    // menu
    //   .add(params, "lum influence")
    //   .min(0.0)
    //   .max(1.0)
    //   .step(0.001)
    //   .onChange(() => {
    //     ssaoEffect.uniforms.get("luminanceInfluence").value = params["lum influence"];
    //   });

    // menu
    //   .add(params, "intensity")
    //   .min(1.0)
    //   .max(4.0)
    //   .step(0.01)
    //   .onChange(() => {
    //     uniforms.intensity.value = params.intensity;
    //   });

    // menu.addColor(params, "color").onChange(() => {
    //   ssaoEffect.color = params.color === 0x000000 ? null : color.setHex(params.color).convertSRGBToLinear();
    // });

    // menu
    //   .add(params, "opacity")
    //   .min(0.0)
    //   .max(1.0)
    //   .step(0.001)
    //   .onChange(() => {
    //     blendMode.opacity.value = params.opacity;
    //   });

    // menu.add(params, "blend mode", BlendFunction).onChange(() => {
    //   blendMode.setBlendFunction(Number(params["blend mode"]));
    // });

    // menu.add(params, "resolution", [240, 360, 480, 720, 1080]).onChange(() => {
    //   this.depthOfFieldEffect.resolution.height = Number(params.resolution);
    // });

    // menu
    //   .add(params, "bokeh scale")
    //   .min(1.0)
    //   .max(5.0)
    //   .step(0.001)
    //   .onChange(() => {
    //     this.depthOfFieldEffect.bokehScale = params["bokeh scale"];
    //   });

    let folder = menu.addFolder("Circle of Confusion");

    // folder.add(params.coc, "edge blur kernel", KernelSize).onChange(() => {

    // 	this.depthOfFieldEffect.blurPass.kernelSize = Number(params.coc["edge blur kernel"]);

    // });

    folder
      .add(this.ts.effectController, "focus")
      .min(0.0)
      .max(1.0)
      .step(0.001)
      .onChange(() => {
        this.updateFocus();
      });

    folder
      .add(this.ts.effectController, "focalLength")
      .min(0.0)
      .max(1.0)
      .step(0.0001)
      .onChange(() => {
        this.updateFocus();
      });
  }
  updateFocus() {
    this.depthOfFieldEffect.circleOfConfusionMaterial.uniforms.focusDistance.value = this.ts.effectController.focus;
    this.depthOfFieldEffect.circleOfConfusionMaterial.uniforms.focalLength.value = this.ts.effectController.focalLength;
  }
}
