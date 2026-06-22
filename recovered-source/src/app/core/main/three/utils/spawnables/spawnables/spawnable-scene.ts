import { LogBasicShader } from "../../../shaders/logbasicmaterial/LogBasicShader";
import { AbstractSpawnable, SpawnablePosition } from "./abstract-spawnable";
import { SpawnerInstance } from "./SpawnerInstance";
import gsap from "gsap/all";
import { Power2, Expo } from "gsap/all";
import * as THREE from "three";
import { MeshBasicMaterial } from "three";

export class SpawnableScene extends AbstractSpawnable {
  treeHeight;
  spriteWorldPos = new THREE.Vector3();
  mixer: THREE.AnimationMixer;
  catmixer: THREE.AnimationMixer;
  actions: THREE.AnimationAction[] = [];
  tweens = [];
  // plane;
  create() {
    // this.childMat = new THREE.SpriteMaterial({
    //   // map: spriteMap,
    //   color: 0xff0000,
    //   // color: new THREE.Color(0.2, 0.2, 0.2),
    //   // depthWrite: false,
    //   // alphaTest: 0.5,
    //   transparent: true,
    //   //   blending: THREE.AdditiveBlending,
    // });
  }
  createMe() {
    const obj = new THREE.Object3D();
    const me = this.ts.assets.getAsset("me").data;
    const anim = this.ts.assets.getAsset("meAnim").data;
    const memat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 0.3, 0.3) });
    (memat as any).skinning = true;
    this.ts.prepareFogMaterial(memat).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });
    // child.mater
    me.traverse((child) => {
      if (child.name.endsWith("border")) {
        child.visible = false;
      }
      // if (child.isMesh || child.type === "SkinnedMesh") {
      if (child.material && !child.name.endsWith("border")) {
        child.receiveShadow = false;
        child.castShadow = true;
        child.material = memat;
        //   // mat.color = new THREE.Color(1, 1, 1);
        //   this.ts.prepareFogMaterial(mat).then((shader: THREE.ShaderMaterial) => {
        //     shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
        //   });
        // });
      }
      // }
    });

    obj.add(me);
    me.animations.push(anim.animations[0]);
    anim.animations[0].name = "gesture";
    this.mixer = new THREE.AnimationMixer(me);
    this.mixer.timeScale = 0.5;
    const action = this.mixer.clipAction(me.animations[1]);
    action.play();

    return obj;
  }
  createCat() {
    const cat = this.ts.assets.getAsset("cat2").data.scene;
    const animations = this.ts.assets.getAsset("cat2").data.animations;
    // const anim = this.ts.assets.getAsset("catAnim").data;

    cat.traverse((child) => {
      if (child.isMesh) {
        // child.receiveShadow = true;
        // child.castShadow = true;
        const newMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 0.3, 0.3) });
        (newMat as any).skinning = true;

        child.material = newMat;

        this.ts.prepareFogMaterial(child.material).then((shader: THREE.ShaderMaterial) => {
          shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
        });
      }
    });

    this.catmixer = new THREE.AnimationMixer(cat);
    this.catmixer.timeScale = 1;
    let currentAnim = 0;
    // this.catmixer.addEventListener("finished", () => {
    //   currentAnim++;
    //   if (currentAnim > actions.length - 1) {
    //     currentAnim = 0;
    //   }
    //   console.log(currentAnim);
    //   actions[currentAnim].setLoop(THREE.LoopRepeat, 1);
    //   actions[currentAnim].reset();
    //   // actions[currentAnim].fadeIn(0.2);
    //   actions[currentAnim].play();
    //   console.log(actions);
    // });
    const animLength = 2;
    const fadeLength = 0.6;
    const fullLength = fadeLength + animLength;
    // const actions = [animations[2], animations[11], animations[15], animations[9], animations[3], animations[4], animations[7], animations[10]];
    const actions = [animations[10], animations[5], animations[8], animations[9], animations[21], animations[13], animations[14]];
    actions.forEach((anim, index) => {
      const action = this.catmixer.clipAction(anim);
      // if ([6].indexOf(index) >= 0) {
      //   action.setLoop(THREE.LoopRepeat, 1);
      // }

      action.setEffectiveWeight(0);
      this.actions.push(action);
      const obj = { weight: 1 };

      const tl = gsap.timeline({ repeat: -1, delay: index * fullLength, repeatDelay: (actions.length - 1) * fullLength - fadeLength });

      tl.from(obj, {
        weight: 0,
        duration: fadeLength,
        onUpdate: () => {
          this.actions[index].setEffectiveWeight(obj.weight);
        },
      });
      tl.to(obj, {
        delay: animLength,
        weight: 0,
        duration: fadeLength,
        onUpdate: () => {
          this.actions[index].setEffectiveWeight(obj.weight);
        },
      });
      // tl.pause();

      action.play();
    });

    // this.actions[0].play();
    // animations.push(anim.animations[0]);

    const pointlight = new THREE.PointLight(0xffffff, 1, 20, 1);
    pointlight.position.y = 0.3;
    // pointlight.position.x = -10;
    // pointlight.position.z = 0;
    pointlight.castShadow = true;

    // const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new MeshBasicMaterial({ color: 0xff0000 }));
    // m.position.y = 0.2;
    // cat.add(m);
    // cat.add(pointlight);

    return cat;
  }
  // createCat() {
  //   const cat = this.ts.assets.getAsset("cat").data;
  //   cat.traverse((child) => {
  //     if (child.isMesh) {
  //       child.receiveShadow = true;
  //       this.ts.prepareFogMaterial(child.material).then((shader: THREE.ShaderMaterial) => {
  //         shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
  //       });
  //     }
  //   });

  //   return cat;
  // }

  createChild(instance, x, y, z, pos: SpawnablePosition): THREE.Object3D {
    const obj = new THREE.Object3D();

    switch (pos.data.scene) {
      case "me":
        // const lightColor = 0xfb9e3b;
        const lightColor = 0xffffff;
        const pointlight = new THREE.PointLight(lightColor, 1, 150, 0.8);
        pointlight.position.y = 50;
        pointlight.position.x = -10;
        pointlight.position.z = 0;
        pointlight.castShadow = true;

        pointlight.shadow.mapSize.width = 512; // default
        pointlight.shadow.mapSize.height = 512; // default
        pointlight.shadow.camera.near = 8; // default
        pointlight.shadow.camera.far = 150; // default
        pointlight.shadow.bias = 0.0001;

        const roommat = new THREE.MeshPhongMaterial({ color: new THREE.Color(0xaaaaaa) });
        this.ts.prepareFogMaterial(roommat).then((shader: THREE.ShaderMaterial) => {
          shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
        });
        const room = new THREE.Mesh(new THREE.BoxGeometry(25, 4, 37), roommat);
        room.receiveShadow = true;
        room.castShadow = true;
        obj.add(room);
        room.position.y = 5;
        room.position.z = -25;
        room.position.x = -25;

        const house = this.ts.assets.getAsset("house").data;
        house.traverse((child) => {
          if (child.isMesh) {
            if (child.name === "Windows") {
              child.visible = false;
              // const mat: THREE.MeshPhongMaterial = child.material;
              // mat.envMap = this.ts.cubeCamera.renderTarget.texture;
              // mat.reflectivity = 1;
              // mat.side = THREE.DoubleSide;
              // // mat.refractionRatio = 0.2;
              // mat.color = new THREE.Color(1, 1, 1);
              // // mat.emissiveIntensity = 1;
              // // mat.combine = THREE.AddOperation;
              // mat.opacity = 0.5;
              // mat.transparent = true;
              // // child.visible = false;
              // mat.emissive = new THREE.Color(0.5, 0.5, 0.5);
            }
            child.material.color = new THREE.Color(0xaaaaaa);

            this.ts.prepareFogMaterial(child.material).then((shader: THREE.ShaderMaterial) => {
              shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
            });
            child.material.needsUpdate = true;
            if (child.name !== "Windows") {
              // child.material.side = THREE.DoubleSide;
              child.castShadow = true;
            }
            child.receiveShadow = true;
          }
        });
        house.position.y = -18;
        house.scale.setScalar(2);
        house.rotation.y = Math.PI / 2;
        obj.add(house);
        obj.add(pointlight);

        const me = this.createMe();
        me.scale.setScalar(0.2);
        me.position.x = 80;
        me.position.z = 55;
        me.position.y = 3;
        me.rotation.y = (97 / 180) * Math.PI;

        obj.add(me);

        // const cat = this.createCat();
        // cat.position.x = 80;
        // cat.position.z = 40;
        // cat.position.y = 3;
        // cat.scale.setScalar(1.7);
        // cat.rotation.y = (110 / 180) * Math.PI;

        const cat2 = this.createCat();
        cat2.position.x = 70;
        cat2.position.z = 35;
        // cat2.position.y = 3;

        cat2.position.x = 90;
        cat2.position.y = 78.8;
        // cat2.position.z = 35;

        cat2.scale.setScalar(15);
        cat2.rotation.y = (20 / 180) * Math.PI;

        obj.add(cat2);

        break;

      default:
        break;
    }

    return obj;
  }

  manipulateChild(child: THREE.Object3D) {
    // child.position.y = this.ts.spawner.ground.getGroundLevelRay(this.tempPos.add(child.children[0].position));
    child.children[0].updateMatrixWorld();
    // if (this.options.isPositional) {
    //     console.log(child);
    // }

    const ch = child.children[0];
    ch.getWorldPosition(this.tempPos);
    ch.position.y = this.ts.spawner.ground.getGroundLevel(this.tempPos);
    // for (let i = 0; i < child.children[0].children.length; i++) {
    //   const ch = child.children[0].children[i];
    //   ch.getWorldPosition(this.tempPos);
    //   ch.position.y = this.ts.spawner.ground.getGroundLevel(this.tempPos);
    // }
    // child.position.y = 0;
    //  this.ts.spawner.ground.getGroundLevel(this.tempPos.add(child.children[0].position));
  }

  manipulateChildRender(clock, instance, childInstance) {
    if (this.mixer) {
      this.mixer.update(clock.delta);
    }
    if (this.catmixer) {
      // console.log(this.actions[0].getEffectiveWeight(), this.actions[1].getEffectiveWeight(), this.actions[2].getEffectiveWeight());
      this.catmixer.update(clock.delta);
    }

    // const sprite = childInstance.children[0].children[0];
    // sprite.getWorldPosition(this.spriteWorldPos);
    // const distance = this.ts.camera.position.distanceToSquared(this.spriteWorldPos);
    // sprite.material.opacity = Math.max(0, 1 - distance / 30000);
    // sprite.material.needsUpdate = true;
    //  Math.max(0, 1 - distance / 1000);
  }

  destroy() {
    super.destroy();
  }
}
