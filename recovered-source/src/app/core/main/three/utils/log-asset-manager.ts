import { ColorManipulator } from "../../../../shared/utils/colormanipulator";
import { AbstractThreeManager } from "./abstract-three-manager";
import * as THREE from "three";
import { TweenMax, Expo } from "gsap/all";
import { Subject, BehaviorSubject, from } from "rxjs";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { CompressedTextureLoader, LoadingManager, MeshBasicMaterial, MeshStandardMaterial } from "three";
import { SMAAImageLoader } from "postprocessing";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { LogAudio } from "./log-audio-manager";

class AssetTypes {
  static TEXTURE = "texture";
  static AUDIO = "audio";
  static OBJ = "obj";
  static MATERIAL = "mtl";
  static FONT = "font";
  static OBJMTL = "objmtl";
  static IMAGE = "image";
  static SMAA = "smaa";
  static FBX = "fbx";
  static TGA = "tga";
  static GLTF = "gltf";
}

export class LogAsset {
  onLoad: BehaviorSubject<any> = new BehaviorSubject(this);
  isLoaded = false;
  data: any;
  constructor(public id: string, public type: string, public src: string, public props: any = {}) {}
  loaded(data: any, firstContactHappend = true) {
    this.data = data;
    this.isLoaded = true;
    if (firstContactHappend) {
      this.onLoad.next(this);
    }
  }
}

export class LogAssetManager extends AbstractThreeManager {
  loadingManager: LoadingManager = new LoadingManager();
  onAllAssetLoaded: Subject<any> = new Subject();
  audioLoader = new THREE.AudioLoader(this.loadingManager);
  textureLoader = new THREE.TextureLoader(this.loadingManager);
  objLoader = new OBJLoader(this.loadingManager);
  fbxLoader = new FBXLoader(this.loadingManager);
  // imageLoader = new THREE.ImageLoader(this.loadingManager);
  smaaImageLoader = new SMAAImageLoader(this.loadingManager);
  gltfLoader = new GLTFLoader(this.loadingManager);
  // fontLoader = new THREE.FontLoader(this.loadingManager);
  // mtlLoader = new MTLLoader(this.loadingManager);
  // tgaLoader = new TGALoader(this.loadingManager);
  // compressedTextureLoader = new CompressedTextureLoader(this.loadingManager);
  positionalSounds = {
    chapel: new LogAudio("assets/sounds/chapel.mp3", null, 1, 20, 1),
    village: new LogAudio("assets/sounds/village.mp3", null, 2, 100, 1),
  };
  assets: LogAsset[] = [
    new LogAsset("smaa", AssetTypes.SMAA, ""),
    new LogAsset("cloud", AssetTypes.TEXTURE, "assets/cloud.png"),

    new LogAsset("lensflare1", AssetTypes.TEXTURE, "assets/lensflare2.png"),
    new LogAsset("lensflare2", AssetTypes.TEXTURE, "assets/lensflare3.png"),
    new LogAsset("lensflare3", AssetTypes.TEXTURE, "assets/lensflare4.png"),

    new LogAsset("fo0", AssetTypes.OBJ, "assets/models/converted/fo.obj"),
    new LogAsset("tr0", AssetTypes.OBJ, "assets/models/converted/tr.obj"),
    new LogAsset("fo0d", AssetTypes.TEXTURE, "assets/models/converted/fo_diff1.png"),

    new LogAsset("me", AssetTypes.FBX, "assets/models/man/man_tshirt_jeans.FBX"),
    new LogAsset("meAnim", AssetTypes.FBX, "assets/models/man/animations/@idle.FBX"),
    new LogAsset("house", AssetTypes.FBX, "assets/models/house/house.FBX"),

    new LogAsset("cat2", AssetTypes.GLTF, "assets/models/cat_animated/cat.gltf"),

    new LogAsset(`rock2`, AssetTypes.OBJ, `assets/models/converted/rock/Rock_2.obj`),
    // new LogAsset(`rock2normal`, AssetTypes.TEXTURE, `assets/models/converted/rock/Rock_2_Normal1.jpg`),
    new LogAsset("tower", AssetTypes.OBJ, "assets/obj/tower.obj"),
    new LogAsset("chapel", AssetTypes.OBJ, "assets/models/chapel/chapel.obj"),
    new LogAsset("v1", AssetTypes.OBJ, "assets/models/village/1.obj"),
    new LogAsset("v2", AssetTypes.OBJ, "assets/models/village/2.obj"),
    new LogAsset("v3", AssetTypes.OBJ, "assets/models/village/3.obj"),
  ];
  createTreeLoaders(id: string, filename: string, lodNum = 4) {
    const ret = [];

    for (let i = 0; i < lodNum; i++) {
      let asset;
      if (i === 0) {
        asset = new LogAsset(id, AssetTypes.OBJMTL, `assets/models/goodpines/${filename}.obj`, {
          path: "assets/models/goodpines/",
          mtl: `${filename}.mtl`,
        });
      } else {
        asset = new LogAsset(id + `_lod${i}`, AssetTypes.OBJMTL, `assets/models/goodpines/${filename}_lod${i}.obj`, {
          path: "assets/models/goodpines/",
          mtl: `${filename}_lod${i}.mtl`,
        });
      }
      ret.push(asset);
    }
    return ret;
  }
  createRockLoaders(rocks: number[]) {
    const ret = [];

    for (let i = 0; i < rocks.length; i++) {
      const rockId = rocks[i];
      const asset = new LogAsset(`rock${rockId}`, AssetTypes.OBJ, `assets/models/rocks/Rock_${rockId}.obj`);
      // const asset = new LogAsset(`rock${rockId}`, AssetTypes.FBX, `assets/models/rocks/Rock_${rockId}_Tex/Rock_${rockId}.fbx`);
      const map = new LogAsset(`rock${rockId}map`, AssetTypes.TEXTURE, `assets/models/rocks/Rock_${rockId}_Tex/Rock_${rockId}_Base_Color.jpg`);
      const ao = new LogAsset(`rock${rockId}ao`, AssetTypes.TEXTURE, `assets/models/rocks/Rock_${rockId}_Tex/Rock_${rockId}_Mixed_AO.jpg`);
      const glossiness = new LogAsset(`rock${rockId}glossiness`, AssetTypes.TEXTURE, `assets/models/rocks/Rock_${rockId}_Tex/Rock_${rockId}_Glossiness.jpg`);
      const normal = new LogAsset(`rock${rockId}normal`, AssetTypes.TEXTURE, `assets/models/rocks/Rock_${rockId}_Tex/Rock_${rockId}_Normal.jpg`);
      ret.push(asset, map, ao, glossiness, normal);
    }
    return ret;
  }

  create() {
    // this.loadingManager.addHandler(/\.dds$/i, new DDSLoader());
    // this.loadingManager.addHandler(/\.tga$/i, new TGALoader());
    this.ts.onFirstContact.subscribe((contactHappend) => {
      if (contactHappend) {
        this.fireAudioEventsAfterFirstContact();
      }
    });
    this.assets.forEach((asset) => {
      this.loadAsset(asset);
    });
  }
  getPositionalAudio(id: string): THREE.PositionalAudio {
    const audio: LogAudio = this.positionalSounds[id];
    let posiAudio;
    // console.log("getPositionalAudio init", id);
    if (!audio.isInited) {
      audio.isInited = true;
      posiAudio = audio.positionalSound = new THREE.PositionalAudio(this.ts.listener);
      this.loadAudio(audio).subscribe((asset: any) => {
        audio.isLoaded.next(true);
        audio.positionalSound.setBuffer(asset);
        audio.positionalSound.setRolloffFactor(audio.refRolloff);
        audio.positionalSound.setRefDistance(audio.refDistance);
        audio.positionalSound.setLoop(true);
        audio.positionalSound.setVolume(audio.volume);
        // audio.positionalSound.play();
      });
    } else {
      posiAudio = new THREE.PositionalAudio(this.ts.listener);
      if (audio.isLoaded.value) {
        posiAudio.setBuffer(audio.positionalSound.buffer);
      } else {
        audio.isLoaded.subscribe((isLoaded) => {
          if (isLoaded) {
            posiAudio.setBuffer(audio.positionalSound.buffer);
          }
        });
      }
      posiAudio.setRolloffFactor(audio.refRolloff);
      posiAudio.setRefDistance(audio.refDistance);
      posiAudio.setLoop(true);
      posiAudio.setVolume(audio.volume);
      // posiAudio.play();
      // setInterval(() => {
      //   console.log(posiAudio.getWorldPosition(new THREE.Vector3()));
      //   posiAudio.updateMatrixWorld();
      // }, 1000);
    }
    return posiAudio;
  }
  loadAudio(asset) {
    return from(
      new Promise((resolve, reject) => {
        this.audioLoader.load(
          asset.src,
          (buffer) => {
            resolve(buffer);
          },
          (progress) => {},
          (error) => {}
        );
      })
    );
  }
  loadAsset(asset: LogAsset) {
    if (asset.type === AssetTypes.TEXTURE) {
      this.textureLoader.load(
        asset.src,
        (texture) => {
          asset.loaded(texture);
          // this.assetLoaded(asset);
        },
        (xhr) => {
          // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (xhr) => {
          // console.log('An error happened');
        }
      );
    } else if (asset.type === AssetTypes.AUDIO) {
      this.audioLoader.load(
        asset.src,
        (buffer) => {
          asset.loaded(buffer, this.ts.firstContact);
          // this.assetLoaded(asset);
        },
        (progress) => {},
        (error) => {}
      );
    } else if (asset.type === AssetTypes.OBJ) {
      this.objLoader.load(
        asset.src,
        (object) => {
          asset.loaded(object);
        }
        // (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
        // (error) => { console.log('An error happened'); }
      );
    }
    // else if (asset.type === AssetTypes.MATERIAL) {
    //   this.mtlLoader.load(
    //     asset.src,
    //     (data) => {
    //       asset.loaded(data);
    //     }
    //     // (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
    //     // (error) => { console.log('An error happened'); }
    //   );
    // } else if (asset.type === AssetTypes.FONT) {
    //   this.fontLoader.load(
    //     asset.src,
    //     (data) => {
    //       asset.loaded(data);
    //     }
    //     // (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
    //     // (error) => { console.log('An error happened'); }
    //   );
    // } else if (asset.type === AssetTypes.OBJMTL) {
    //   const mtlLoader = new MTLLoader(this.loadingManager);
    //   mtlLoader.setPath(asset.props.path);
    //   mtlLoader.load(
    //     asset.props.mtl,
    //     (materials: any) => {
    //       materials.preload();
    //       Object.keys(materials.materials).forEach((key) => {
    //         const oldmat = materials.materials[key];
    //         materials.materials[key] = new THREE.MeshStandardMaterial({
    //           name: oldmat.name,
    //           map: oldmat.map,
    //           alphaTest: 0.5,
    //         });
    //         // materials.materials[key].transparent = true;
    //         //   materials.materials[key].receiveShadows = true;
    //         //   materials.materials[key].castShadows = true;
    //         // materials.materials[key].depthTest = false;
    //         // materials.materials[key].depthWrite = false;
    //         // materials.materials[key].color = new Color(0x000000);
    //         materials.materials[key].alphaTest = 0.1;
    //         //   materials.materials[key].lights = false;
    //         // materials.materials[key].lights = false;
    //         const maxAnisotropy = this.ts.renderer.capabilities.getMaxAnisotropy();
    //         if (materials.materials[key].map) {
    //           materials.materials[key].map.anisotropy = maxAnisotropy;
    //           // materials.materials[key].fog: true,
    //         }
    //       });
    //       const objLoader = new OBJLoader(this.loadingManager);

    //       objLoader.setMaterials(materials); //Set the materials for the objects using OBJLoader's setMaterials method
    //       objLoader.load(asset.src, (data) => {
    //         asset.loaded(data);
    //       });
    //     }
    //     // (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
    //     // (error) => { console.log('An error happened'); }
    //   );
    // }
    else if (asset.type === AssetTypes.SMAA) {
      this.smaaImageLoader.load(([search, area]) => {
        asset.loaded({ search, area });
      });
    } else if (asset.type === AssetTypes.FBX) {
      this.fbxLoader.load(asset.src, (object) => {
        asset.loaded(object);
      });
    }
    // else if (asset.type === AssetTypes.TGA) {
    //   this.tgaLoader.load(asset.src, (object) => {
    //     asset.loaded(object);
    //   });
    // }
    else if (asset.type === AssetTypes.GLTF) {
      this.gltfLoader.load(
        asset.src,
        (object) => {
          asset.loaded(object);
        }
        // (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
        // (error) => { console.log('An error happened'); }
      );
    }

    asset.onLoad.subscribe((_asset) => {
      this.assetLoaded(_asset);
    });
  }
  assetLoaded(asset: LogAsset) {
    let isAllLoadeded = true;
    this.assets.forEach((_asset) => {
      if (_asset.isLoaded !== true && _asset.type !== AssetTypes.AUDIO) {
        isAllLoadeded = false;
      }
    });
    if (isAllLoadeded) {
      this.onAllAssetLoaded.next();
    }
  }

  fireAudioEventsAfterFirstContact() {
    this.assets.forEach((asset) => {
      if (asset.type === AssetTypes.AUDIO) {
        if (asset.isLoaded) {
          asset.onLoad.next(asset);
        }
      }
    });
  }

  getAsset(id: string) {
    const asset = this.assets.find((x) => {
      return x.id === id;
    });
    if (asset) {
      return asset;
    } else {
      console.log("Asset not found");
    }
  }

  onRender(clock: { elapsedTime: number; delta: number }) {}

  onSkyUpdate() {}
}
