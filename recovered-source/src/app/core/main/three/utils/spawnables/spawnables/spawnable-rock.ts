import { LogBasicShader } from "../../../shaders/logbasicmaterial/LogBasicShader";
import { AbstractSpawnable, SpawnablePosition } from "./abstract-spawnable";
import { SpawnerInstance } from "./SpawnerInstance";

import * as THREE from "three";

export class SpawnableRock extends AbstractSpawnable {
  treeHeight;
  spriteWorldPos = new THREE.Vector3();

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

  createChildMatrix(instance: SpawnerInstance, pos: THREE.Vector3): THREE.Matrix4 {
    const matrix = new THREE.Matrix4();
    const position = pos;
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    instance.obj.getWorldPosition(this.tempPos);
    this.tempPos.add(pos);
    const y = this.ts.spawner.ground.getGroundLevel(this.tempPos);
    rotation.y = Math.PI * this.noiseGenerators[2].simplex2(this.tempPos.x * 50, this.tempPos.z * 50);
    rotation.x = this.noiseGenerators[2].simplex2(this.tempPos.x * 11, this.tempPos.z * 80);
    rotation.z = this.noiseGenerators[2].simplex2(this.tempPos.x * 1000, this.tempPos.z * 5000);
    quaternion.setFromEuler(rotation);
    const sc = 30 + Math.abs(this.noiseGenerators[1].simplex2(this.tempPos.x * 10, this.tempPos.z * 10)) * 15;
    scale.setScalar(sc / 200);
    pos.y = y - 50;

    matrix.compose(position, quaternion, scale);
    return matrix;
  }

  createInstancedMeshes(matrixes: THREE.Matrix4[]) {
    const rock = this.createRock(2);
    const rockGeom = rock.children[0].geometry;
    // const rockMat = rock.children[0].material;
    const rockMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0) });

    const meshes: THREE.InstancedMesh[] = [];
    this.ts.prepareFogMaterial(rockMat).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });

    const instancedMesh = new THREE.InstancedMesh(rockGeom.clone(), rockMat, matrixes.length);
    // instancedMesh.castShadow = true;
    // instancedMesh.receiveShadow = true;
    for (let a = 0; a < matrixes.length; a++) {
      const matrix = matrixes[a];
      instancedMesh.setMatrixAt(a, matrix);
    }
    meshes.push(instancedMesh);
    return meshes;
  }

  createRock(i: number) {
    const rock = this.ts.assets.getAsset(`rock${i}`).data.clone();
    // const map = this.ts.assets.getAsset(`rock${i}map`).data as THREE.Texture;

    // const normal = this.ts.assets.getAsset(`rock${i}normal`).data;
    // const ao = this.ts.assets.getAsset(`rock${i}ao`).data;
    // const glossiness = this.ts.assets.getAsset(`rock${i}glossiness`).data;
    rock.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.material = new THREE.MeshBasicMaterial({
          // map: map,
          // aoMap: ao,
          // normalMap: normal,
          color: new THREE.Color(0, 0, 0),
          // envMap: this.ts.cubeCamera.renderTarget.texture,
          // reflectivity: 0.5,
          // refractionRatio: 1,
        });
        // , roughnessMap: glossiness
        // child.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        child.geometry.computeVertexNormals();
        child.geometry.buffersNeedUpdate = true;
        child.geometry.uvsNeedUpdate = true;
        // child.material.map = this.ts.assets.getAsset(`groundroughness`).data.clone();
        // child.material.normalMap = normal;
      }
    });

    // rock.children.forEach((m) => {
    //   // m.castShadow = true;
    //   console.log(m);
    //   m.material = new THREE.MeshBasicMaterial({ map: map, color: new THREE.Color(1, 1, 1), side: THREE.DoubleSide });
    //   // m.material.side = THREE.DoubleSide;
    // });

    return rock;
  }
  createChild(instance, x, y, z, spawnablePos: SpawnablePosition = null): THREE.Object3D {
    const obj = new THREE.Object3D();

    const rock = this.createRock(2);

    const rockMat = rock.children[0].material;
    this.ts.prepareFogMaterial(rockMat).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });
    rock.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = false;
        child.castShadow = false;
      }
    });
    rock.scale.setScalar(0.1 + 0.6 * this.noiseGenerators[0].simplex2(x * 100, y * 100));
    rock.rotation.x = this.noiseGenerators[1].simplex2(x * 100, y * 100);
    rock.rotation.y = this.noiseGenerators[2].simplex2(x * 100, y * 10);
    rock.rotation.z = this.noiseGenerators[1].simplex2(x * 10, y * 50);
    rock.position.y = spawnablePos.pos.y;
    obj.add(rock);

    return obj;
  }

  manipulateChild(child: THREE.Object3D) {
    // child.position.y = this.ts.spawner.ground.getGroundLevelRay(this.tempPos.add(child.children[0].position));
    child.children[0].updateMatrixWorld();
    // if (this.options.isPositional) {
    //     console.log(child);
    // }

    for (let i = 0; i < child.children.length; i++) {
      const ch = child.children[i];
      ch.getWorldPosition(this.tempPos);
      ch.position.y = this.ts.spawner.ground.getGroundLevel(this.tempPos);
    }
    // child.position.y = 0;
    //  this.ts.spawner.ground.getGroundLevel(this.tempPos.add(child.children[0].position));
  }

  // manipulateChildRender(clock, instance, childInstance) {
  //   const sprite = childInstance.children[0].children[0];
  //   sprite.getWorldPosition(this.spriteWorldPos);
  //   const distance = this.ts.camera.position.distanceToSquared(this.spriteWorldPos);
  //   sprite.material.opacity = Math.max(0, 1 - distance / 30000);
  //   // sprite.material.needsUpdate = true;
  //   //  Math.max(0, 1 - distance / 1000);
  // }

  destroy() {
    super.destroy();
  }
}
