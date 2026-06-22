import { SiteService } from "./../../../shared/services/site.service";
import { LogBuilderManager } from "./utils/log-builder-manager";
import { LogPoiManager } from "./utils/log-poi-manager";
import { LogPopulationManager } from "./utils/spawnables/log-population-manager";
import { LogSpawnerManager } from "./utils/spawnables/log-spawner-manager";
import { LogControlManager } from "./utils/log-control-manager";
import { LogPassManager } from "./utils/log-pass-manager";
import { LogSkyManager } from "./utils/log-sky-manager";
import { Injectable, NgZone } from "@angular/core";
import * as THREE from "three";
import { Subject, BehaviorSubject } from "rxjs";
import * as dat from "dat.gui";

// import * as Stats from "stats-js";
// import { LogLensFlareManager } from "./utils/log-lensflare-manager";

import { LogAnimManager } from "./utils/log-anim-manager";

import { LogAssetManager } from "./utils/log-asset-manager";
import { LogAudioManager } from "./utils/log-audio-manager";
import { NippleService } from "src/app/shared/modules/nipple/nipple.service";
import { AreaManager } from "./utils/log-area-manager";
import { first, takeWhile } from "rxjs/operators";
import { LogApiManager } from "./utils/log-api-manager";

import { EffectComposer } from "postprocessing";

import { WebGLCubeRenderTarget } from "three";
import { LogLensFlareManager } from "./utils/log-lensflare-manager";

@Injectable({
  providedIn: "root",
})
export class ThreeService {
  // stats = new Stats();

  canvas: HTMLCanvasElement;
  wrapper: HTMLElement;

  isDebug = false;
  debugZ = this.isDebug ? 7000 : 0;

  helperCanvas: HTMLCanvasElement;

  scene: any;
  camera: THREE.PerspectiveCamera;
  cameraTemp: THREE.Vector3 = new THREE.Vector3();
  cameraDir: THREE.Vector3 = new THREE.Vector3();
  controls: any;
  cubeCamera: THREE.CubeCamera;

  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;

  api: LogApiManager;
  builder: LogBuilderManager;
  sky: LogSkyManager;
  lensflare: LogLensFlareManager;
  anim: LogAnimManager;
  assets: LogAssetManager;
  audio: LogAudioManager;
  control: LogControlManager;
  poi: LogPoiManager;
  pass: LogPassManager;
  spawner: LogSpawnerManager;
  population: LogPopulationManager;

  listener = new THREE.AudioListener();
  // positionalListener = new THREE.AudioListener();
  plane: THREE.Mesh;
  cube: THREE.Mesh;
  quad: THREE.Mesh;
  mainScene: THREE.Object3D = new THREE.Object3D();
  gui: any;

  onRender: Subject<any> = new Subject();
  onResize: Subject<{ width: number; height: number }> = new Subject();
  onSkyUpdate: Subject<any> = new Subject();
  onEffectsUpdate: Subject<any> = new Subject();
  onCameraUpdate: Subject<any> = new Subject();
  onAssetLoaded: Subject<any> = new Subject();
  onInited: BehaviorSubject<boolean> = new BehaviorSubject(false);
  onFirstContact: BehaviorSubject<any> = new BehaviorSubject(false);
  siteEntered: BehaviorSubject<any> = new BehaviorSubject(false);
  contextLost: Subject<any> = new Subject();
  contextRestored: Subject<any> = new Subject();

  isFreeFlight: BehaviorSubject<any> = new BehaviorSubject(false);
  isSoundOn: BehaviorSubject<any> = new BehaviorSubject(false);
  isMusicOn: BehaviorSubject<any> = new BehaviorSubject(false);
  isTempMuteOff: BehaviorSubject<any> = new BehaviorSubject(true);

  autofly = false;
  dark = 0;
  darkChange: BehaviorSubject<any> = new BehaviorSubject(0);

  lightning = 0;
  lightningChange: Subject<any> = new Subject();
  luminanceOverride = 0;
  lightningRunning = false;
  lightningHappening = false;
  lightningTimeout;
  lightningTween;
  lightningTimeout2;

  firstContact = false;
  inited = false;
  // onSettingsChange: Subject<any> = new Subject();

  clock: THREE.Clock = new THREE.Clock();

  cameraPosObj = { value: new THREE.Vector3(0, 0, 0) };

  boundRender = this.render.bind(this);
  boundContextLost = (event) => {
    event.preventDefault();
    this.contextLost.next();
    console.warn("WEBGL_CONTEXT_LOST");
  };
  boundContextRestored = (event) => {
    this.contextRestored.next();
    this.updateContextListeners();
    console.warn("WEBGL_CONTEXT_RESTORED");
  };

  width = 0;
  height = 0;
  pixelRatio = 0;

  qualityLevel = 0;
  qualityDef = {
    groundVertices: [11, 6],
    shadow: [true, false],
    treeDensity: [14, 7],
    stoneDensity: [7, 1],
    birdDensity: [3, 1],
    birdFlockSize: [10, 5],
  };
  qc: { groundVertices?: number; shadow?: boolean; treeDensity?: number; stoneDensity?: number; birdDensity?: number; birdFlockSize?: number } = {};

  skyController = {
    turbidity: 6,
    rayleigh: 0.37,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    inclination: 0.51,
    azimuth: 0.41,
    totalRayleighX: 42,
    totalRayleighY: 24,
    totalRayleighZ: 22,
    stars: 1,
    sunStrength: 1,
  };

  effectController = {
    focus: 0,
    focalLength: 0,
    near: 0.1,
    wind: 0.005,
    cloudOpacity: 1,
    fogDensity: 0.002,
    far: 1200,
  };
  volumeController = {
    thunder: 0,
    bgm: 0,
    night: 0,
    wind: 0,
    forest: 0,
    electric: 0,
    chimes: 0,
  };
  volumeChange: any = new BehaviorSubject(null);

  cameraController = {
    extraY: this.isDebug ? 400 : 0,
    shiftY: 0,
  };
  mouse: { pos: THREE.Vector2; isDown: boolean } = {
    pos: new THREE.Vector2(),
    isDown: false,
  };
  cameraIsAnimating = false;
  controlPos = new THREE.Vector3(0, 350, 1500);
  controlObj = new THREE.Object3D();
  rotationDistort = new THREE.Vector3();
  floatingHeightDif = this.controlPos.y;
  // rotationDistort = new THREE.Quaternion();

  mainAreaSize = 1000;
  areas: { [id: string]: AreaManager } = {
    mainArea: new AreaManager(new THREE.Vector3(this.mainAreaSize, 0, this.mainAreaSize)),
    bigArea: new AreaManager(new THREE.Vector3(this.mainAreaSize * 10, 0, this.mainAreaSize * 10)),
    aClouds: new AreaManager(new THREE.Vector3(250, 0, 250), new THREE.Vector3(5, 1, 5)),
    aGrass: new AreaManager(new THREE.Vector3(50, 0, 50)),
  };
  isRenderPaused = false;

  dir = new THREE.Vector3();
  // homeVector = new THREE.Vector3(-1055, 0, -697);
  homeVector = new THREE.Vector3(0, 0, 0);
  arrow = new THREE.Mesh(new THREE.BoxGeometry(10, 1000, 10), new THREE.MeshBasicMaterial({ color: "#ff0000" }));

  slowTicks = 0;
  average10 = -1;

  constructor(private zone: NgZone, public nippleService: NippleService, public site: SiteService) {
    // this.gui.domElement.style.display = "none";

    this.nippleService.userInteraction.subscribe((params) => {
      this.autofly = false;
    });
    this.lightningChange.subscribe((params) => {
      if (this.lightning <= 0 && this.lightningRunning) {
        this.anim.stopLighting();
      } else if (this.lightning >= 0.5 && !this.lightningRunning) {
        this.anim.startLighting();
      }
    });
    this.listener.setMasterVolume(0);
    // this.stats.dom.style.display = "none";
    const savedEff = JSON.parse(localStorage.getItem("effectSettings"));
    const savedSky = JSON.parse(localStorage.getItem("skySettings"));
    if (savedEff) {
      this.effectController = Object.assign(this.effectController, savedEff);
    }
    if (savedSky) {
      this.skyController = Object.assign(this.skyController, savedSky);
    }
  }

  startFreeFlight() {
    this.isFreeFlight.next(true);
    this.control.damping = 40;
    this.control.ydamping = 10;
  }

  stopFreeFlight() {
    this.isFreeFlight.next(false);
    this.control.damping = 10;
    this.control.ydamping = 10;
    this.autofly = false;
  }

  pauseRender() {
    this.isRenderPaused = true;
  }
  resumeRender() {
    this.isRenderPaused = false;
  }

  updateContextListeners() {
    if (this.renderer?.getContext()?.canvas) {
      this.renderer.getContext().canvas.removeEventListener("webglcontextlost", this.boundContextLost, false);
      this.renderer.getContext().canvas.removeEventListener("webglcontextrestored", this.boundContextRestored, false);
      this.renderer.getContext().canvas.addEventListener("webglcontextlost", this.boundContextLost, false);
      this.renderer.getContext().canvas.addEventListener("webglcontextrestored", this.boundContextRestored, false);
    }
  }

  init() {
    // this.stats.dom.style.display = "none";
    this.resize();
    // console.log("dpr", window.devicePixelRatio, this.pixelRatio);
    // window.addEventListener("resize", () => {
    //   this.resize();
    // });
    this.site.screenSizeChange.subscribe((params) => {
      this.resize();
    });
    this.zone.runOutsideAngular(() => {
      this.boundRender();
      window.document.addEventListener("mousemove", this.mouseMove.bind(this));
      window.document.addEventListener("mousedown", this.mouseDown.bind(this));
      window.document.addEventListener("mouseup", this.mouseUp.bind(this));
      window.document.addEventListener("click", this.clickEvent.bind(this));
      window.document.addEventListener("touchstart", this.touchStart.bind(this));
    });
    this.inited = true;
  }
  create(wrapperRef, canvasRef, helperCanvasRef = null) {
    Object.keys(this.qualityDef).forEach((key) => {
      this.qc[key] = this.qualityDef[key][this.qualityLevel];
    });
    // this.createGui();
    // this.gui.domElement.style.display = "none";

    if (helperCanvasRef) {
      this.helperCanvas = helperCanvasRef.nativeElement;
    }
    // this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild(this.stats.dom);
    // this.stats.dom.style["z-index"] = 1000000000;

    // The first step is to get the reference of the canvas element from our HTML document
    this.wrapper = wrapperRef.nativeElement;
    this.canvas = canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: false, // transparent background
      antialias: false, // smooth edges
      powerPreference: "high-performance",
    });
    this.composer = new EffectComposer(this.renderer);
    this.updateContextListeners();
    // let context = this.renderer.context.getExtension("WEBGL_lose_context");
    // setTimeout((params) => {
    //   context.loseContext();
    // }, 5000);
    // setTimeout((params) => {
    //   context.restoreContext();
    // }, 6000);

    // setTimeout((params) => {
    //   context = this.renderer.context.getExtension("WEBGL_lose_context");
    //   this.renderer.context.getExtension("WEBGL_lose_context").loseContext();
    // }, 7000);
    // setTimeout((params) => {
    //   context.restoreContext();
    // }, 8000);

    // this.renderer.shadowMap.enabled = true;
    // this.renderer.outputEncoding = THREE.sRGBEncoding;
    // create the scene
    this.scene = new THREE.Scene();
    this.scene.add(this.mainScene);
    // this.scene.add(this.arrow);
    this.camera = new THREE.PerspectiveCamera(70, this.wrapper.clientWidth / this.wrapper.clientHeight, 5, 1200);
    // this.camera.position.z = 50;
    this.camera.add(this.listener);
    // this.camera.add(this.positionalListener);
    // this.camera.position.y = 110;
    // this.camera.position.copy(this.controlObj.position);
    // this.camera.lookAt(new THREE.Vector3(0, 80, -100));

    this.scene.add(this.camera);

    this.cubeCamera = new THREE.CubeCamera(1, 50, new WebGLCubeRenderTarget(512));
    // this.cubeCamera.renderTarget.texture.generateMipmaps = true;
    // this.cubeCamera.renderTarget.texture.mapping = THREE.UVMapping;
    // this.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
    this.scene.background = this.cubeCamera.renderTarget;

    // setInterval(() => {
    //   console.log(this.controlObj.rotation);
    // });
    // this.cam = new LogCamManager(this);
    // this.cam.create();

    // this.createWhiteFrame();
    this.initAssets();

    // const light = new THREE.AmbientLight(0x415861, 0.6);
    // light.position.z = 40;
    // this.scene.add(light);

    this.assets.onAllAssetLoaded.pipe(first()).subscribe(() => {
      // this.initAudio();
      this.initComposer();
      // this.initPhysics();
      // this.initRoom();
      this.initSky();

      this.effectChange();
      this.skyChange();
      this.init();

      this.api = new LogApiManager(this);
      this.api.create();
      this.assetsLoaded();
    });
  }
  setStartingPos() {
    this.camera.position.x = this.anim.states[0].cameraPos.x;
    this.camera.position.z = this.anim.states[0].cameraPos.z;
    this.camera.position.y = this.spawner.ground.getGroundLevel(this.camera.position) + this.anim.states[0].floatingHeightDif + 200;
    this.controlObj.position.copy(this.camera.position);
    this.anim.create();
    this.camera.rotation.x = this.anim.states[0].rotationDistort.x;
    this.camera.rotation.y = this.anim.states[0].rotationDistort.y;
    this.camera.rotation.z = this.anim.states[0].rotationDistort.z;
    this.controlObj.rotation.x = this.camera.rotation.x;
    this.controlObj.rotation.y = this.camera.rotation.y;
    this.controlObj.rotation.z = this.camera.rotation.z;
    this.controlObj.rotation.order = "YXZ";
  }
  assetsLoaded() {
    setTimeout(() => {
      this.poi = new LogPoiManager(this);
      this.poi.create();
      this.population = new LogPopulationManager(this);
      this.population.create();
      this.spawner = new LogSpawnerManager(this);
      this.spawner.create().then(() => {
        this.anim = new LogAnimManager(this);

        this.setStartingPos();
        // this.initActor();
        this.initControl();
        this.initAudio();
        // this.builder = new LogBuilderManager(this);
        // this.builder.create();

        setTimeout(() => {
          this.onInited.next(true);
          this.site.onInited.next(true);
        });
      });
    });
  }

  // initActor() {
  //   this.actor = new LogActor2Manager(this);
  //   this.actor.create();
  // }

  // createWhiteFrame() {
  //   this.wframe = new LogWhiteFrameManager(this);
  //   this.wframe.create();
  // }

  createGui() {
    this.gui = new dat.GUI({ width: 300 });
    this.gui.domElement.parentElement.style.zIndex = "10000";
    this.gui.domElement.parentElement.style.right = "300px";
    this.gui.add(this.effectController, "focus", 10.0, 3000.0, 10).onChange(this.effectChange.bind(this)).listen();
    // this.gui.add(this.effectController, "aperture", 0, 10, 0.1).onChange(this.effectChange.bind(this)).listen();
    // this.gui.add(this.effectController, "maxblur", 0.0, 3.0, 0.025).onChange(this.effectChange.bind(this)).listen();
    // this.gui.add(this.effectController, "near", 0.1, 100, 0.1).onChange(this.effectChange.bind(this)).listen();
    // this.gui.add(this.effectController, "far", 10, 3000, 1).onChange(this.effectChange.bind(this)).listen();
    // this.gui.add(this.effectController, "glitch", 0, 1, 0.01).onChange(this.effectChange.bind(this)).listen();
    this.gui.add(this.effectController, "wind", 0, 0.05, 0.001).onChange(this.effectChange.bind(this)).listen();
    this.gui.add(this.effectController, "fogDensity", 0, 0.1, 0.001).onChange(this.effectChange.bind(this)).listen();
    this.gui.add(this.effectController, "far", 0, 3000, 1).onChange(this.effectChange.bind(this)).listen();

    this.gui.add(this.skyController, "turbidity", 1.0, 20.0, 0.1).onChange(this.skyChange.bind(this)).listen();
    this.gui.add(this.skyController, "rayleigh", 0.0, 4, 0.001).onChange(this.skyChange.bind(this)).listen();
    this.gui.add(this.skyController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(this.skyChange.bind(this)).listen();
    this.gui.add(this.skyController, "mieDirectionalG", 0.0, 1, 0.001).onChange(this.skyChange.bind(this)).listen();
    this.gui.add(this.skyController, "luminance", 0.0, 2).onChange(this.skyChange.bind(this)).listen();
    this.gui.add(this.skyController, "inclination", 0, 2, 0.0001).onChange(this.skyChange.bind(this)).listen();
    this.gui.add(this.skyController, "azimuth", 0, 1, 0.0001).onChange(this.skyChange.bind(this)).listen();

    this.gui.add(this.skyController, "totalRayleighX", 1, 100, 0.0001).onChange(this.skyChange.bind(this)).listen();
    this.gui.add(this.skyController, "totalRayleighY", 1, 100, 0.0001).onChange(this.skyChange.bind(this)).listen();
    this.gui.add(this.skyController, "totalRayleighZ", 1, 100, 0.0001).onChange(this.skyChange.bind(this)).listen();

    this.gui.add(this.rotationDistort, "x", -Math.PI, Math.PI, 0.01).onChange(this.camChange.bind(this)).listen();
    this.gui.add(this.rotationDistort, "z", -Math.PI, Math.PI, 0.01).onChange(this.camChange.bind(this)).listen();

    this.gui.close();
  }
  initAssets() {
    this.assets = new LogAssetManager(this);
    this.assets.create();
  }
  initControl() {
    this.control = new LogControlManager(this);
    this.control.create();
  }
  initAudio() {
    this.onFirstContact.pipe(takeWhile((v) => v === false, true)).subscribe((contactHappend) => {
      if (contactHappend) {
        this.audio = new LogAudioManager(this);
        this.audio.create();
      }
    });
  }

  initComposer() {
    this.pass = new LogPassManager(this);
    this.pass.create();
  }

  initSky() {
    this.sky = new LogSkyManager(this);
    this.sky.create();

    this.lensflare = new LogLensFlareManager(this);
    this.lensflare.create();

    this.skyChange();
  }

  effectChange() {
    // localStorage.setItem("effectSettings", JSON.stringify(this.effectController));
    // localStorage.setItem("skySettings", JSON.stringify(this.skyController));
    // console.log(this.skyController);

    this.onEffectsUpdate.next();
    this.resize();
  }
  skyChange() {
    // this.camera.near = this.effectController.near;
    // this.camera.far = this.effectController.far;

    // localStorage.setItem("effectSettings", JSON.stringify(this.effectController));
    // localStorage.setItem("skySettings", JSON.stringify(this.skyController));

    this.onSkyUpdate.next();
    this.resize();
  }
  camChange() {}

  prepareFogMaterial(material: THREE.Material) {
    return new Promise((resolve) => {
      material.onBeforeCompile = (shader) => {
        // console.log( shader )

        shader.uniforms.fogMap = { value: this.cubeCamera.renderTarget.texture };
        shader.uniforms.cameraPosition = this.cameraPosObj;

        shader.vertexShader =
          `
          varying vec3 myViewDir;
          varying vec3 myWorldPos;
              ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
          "#include <fog_vertex>",
          `#include <fog_vertex>

                vec4 myworldPosition = vec4( transformed, 1.0 );
                myWorldPos = (modelMatrix *  myworldPosition).xyz;
                #ifdef USE_INSTANCING
                myworldPosition = instanceMatrix * myworldPosition;
                #endif
                myworldPosition = modelMatrix * myworldPosition;
                myViewDir = normalize(myworldPosition.xyz - cameraPosition ); 
                  `
        );
        shader.fragmentShader =
          `
                  uniform samplerCube fogMap;
                  varying vec3 myViewDir;
                  varying vec3 myWorldPos;
                  ` + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <fog_fragment>",
          `
                      
                      vec4 myFogColor = textureCube( fogMap, vec3( 1.0 * myViewDir.x, myViewDir.yz )  );
                      #ifdef USE_FOG
                          
                          #ifdef FOG_EXP2
                              float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
                          #else
                              float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
                          #endif
                          gl_FragColor.rgb = mix( gl_FragColor.rgb, myFogColor.xyz, fogFactor);

                      #endif
                    `
        );
        // console.log(shader.fragmentShader);
        resolve(shader);
      };
    });
  }

  updateAreas() {
    Object.keys(this.areas).forEach((key: string) => {
      const am: AreaManager = this.areas[key];

      this.cameraTemp.copy(this.camera.position);
      this.camera.getWorldDirection(this.cameraDir);
      const pos = this.cameraTemp.add(this.cameraDir.multiplyScalar(500));

      const camGridX = Math.floor((pos.x + am.size.x / 2) / am.size.x);
      const camGridZ = Math.floor((pos.z + am.size.z / 2) / am.size.z);

      if (am.currentArea.x !== camGridX || am.currentArea.z !== camGridZ) {
        am.currentArea.x = camGridX;
        am.currentArea.z = camGridZ;
        am.triggerAreaChange();
      }

      if (am.dimension.y > 1) {
        const camGridY = Math.floor((pos.y + am.size.y / 2) / am.size.y);
        if (am.currentArea.y !== camGridY || am.currentArea.y !== camGridY) {
          am.currentArea.y = camGridY;
          am.triggerAreaChange();
        }
      }
    });
  }
  render() {
    if (!this.isRenderPaused) {
      // this.stats.begin();
      // console.time('stat');
      const delta = this.clock.getDelta();
      const elapsedTime = this.clock.getElapsedTime();
      this.updateAreas();
      if (this.controls) {
        this.controls.update();
      }

      this.dir.subVectors(this.camera.position, this.homeVector).normalize();
      // this.dir.subVectors(this.dir, this.cameraDir).normalize();
      this.dir.multiplyVectors(this.dir, this.cameraDir);
      // .subVectors(this.dir, this.cameraDir)
      this.cameraPosObj.value.copy(this.camera.position);
      if (this.camera.far !== this.effectController.far) {
        this.camera.far = this.effectController.far;
        this.camera.updateProjectionMatrix();
      }
      this.onRender.next({ elapsedTime, delta });
      this.composer.render(delta);
      // this.renderer.render(this.scene, this.camera);

      // this.stats.end();
      // this.stats.update();
      this.slowTicks += delta > 0.05 ? 1 : 0;
      if (delta < 0.02) this.slowTicks = 0;
      if (this.average10 === -1) {
        this.average10 = delta;
      } else {
        this.average10 = (this.average10 * 9 + delta) / 10;
      }
    }

    requestAnimationFrame(this.boundRender);
  }
  touchStart() {
    if (!this.firstContact) {
      this.firstContact = true;
      this.onFirstContact.next(true);
    }
  }
  clickEvent(event) {
    if (!this.firstContact) {
      this.firstContact = true;
      this.onFirstContact.next(true);
    }
    if (this.builder) {
      const raycaster = new THREE.Raycaster();

      this.mouse.pos.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.pos.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(this.mouse.pos, this.camera);
      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(this.spawner.ground.groundobj.children, true);
      for (var i = 0; i < intersects.length; i++) {
        if (i === 0) {
          this.builder.build(intersects[i].point);
        }
      }
    }
  }

  mouseMove(event) {
    // event.preventDefault();
    this.mouse.pos.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.pos.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  mouseDown() {
    // event.preventDefault();
    this.mouse.isDown = true;
  }
  mouseUp() {
    // event.preventDefault();
    this.mouse.isDown = false;
  }

  resize() {
    this.width = this.site.screen.w;
    // this.height = this.wrapper.clientHeight;
    // this.width = window.innerWidth;
    this.height = this.site.screen.h;
    this.pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
    if (this.site.isMobile) {
      this.pixelRatio = Math.min(2, window.devicePixelRatio);
    } else {
      this.pixelRatio = Math.min(3, window.devicePixelRatio);
    }

    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setViewport(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.onResize.next({ width: this.width, height: this.height });
  }
}
