import { LogBasicShader } from "../../../shaders/logbasicmaterial/LogBasicShader";
import { AbstractSpawnable } from "./abstract-spawnable";
import { SpawnerInstance } from "./SpawnerInstance";

import * as THREE from "three";
import { LogStandardShader } from "../../../shaders/logstandardmaterial/LogStandardShader";
import { LogAsset } from "../../log-asset-manager";
import { LogNoise } from "src/app/shared/utils/noise";

export class SpawnableTree3d extends AbstractSpawnable {
  treeHeight;

  treeTrunkGeom;
  treeTrunkMat;
  treeHeadGeom;
  treeHeadMat;

  // plane;
  create() {
    // this.childGeom = new THREE.PlaneGeometry(this.treeHeight / 4, this.treeHeight, 1, 1);
    // this.childMesh = this.createTree().clone();
    // const i = 0;

    const fo = this.ts.assets.getAsset("fo0").data.clone();
    const fod = this.ts.assets.getAsset("fo0d").data;
    const tr = this.ts.assets.getAsset("tr0").data.clone();

    const maxAnisotropy = this.ts.renderer.capabilities.getMaxAnisotropy();
    fod.anisotropy = maxAnisotropy;

    // const trd = this.ts.assets.getAsset("tr0d").data as THREE.Texture;
    // trd.wrapS = trd.wrapT = THREE.RepeatWrapping;
    // trd.anisotropy = maxAnisotropy;

    this.treeHeadGeom = fo.children[0].geometry;
    // this.treeHeadMat = new THREE.MeshLambertMaterial({ map: fod, alphaTest: 0.6, envMap: this.ts.cubeCamera.renderTarget.texture, reflectivity: 0, refractionRatio: 1, side: THREE.DoubleSide, color: new THREE.Color(0x689688) });
    this.treeHeadMat = new THREE.MeshBasicMaterial({ map: fod, alphaTest: 0.6, envMap: this.ts.cubeCamera.renderTarget.texture, side: THREE.DoubleSide, color: new THREE.Color(0x689688) });

    this.treeTrunkGeom = tr.children[0].geometry;
    // this.treeTrunkMat = new THREE.MeshLambertMaterial({ map: trd, envMap: this.ts.cubeCamera.renderTarget.texture, reflectivity: 0.5, refractionRatio: 1 });
    // map: trd,
    // this.treeTrunkMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(0, 0, 0), envMap: this.ts.cubeCamera.renderTarget.texture, reflectivity: 0.5, refractionRatio: 1 });
    this.treeTrunkMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0), envMap: this.ts.cubeCamera.renderTarget.texture, reflectivity: 0.5, refractionRatio: 1 });

    this.ts.prepareFogMaterial(this.treeHeadMat).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });
    this.ts.prepareFogMaterial(this.treeTrunkMat).then((shader: THREE.ShaderMaterial) => {
      shader.uniforms.fogMap = { value: this.ts.cubeCamera.renderTarget.texture };
    });
    //  new THREE.MeshBasicMaterial({ map: fod });

    // const tree = this.ts.assets.getAsset("pine2_lod2").data.clone();
    // tree.children.forEach((m) => {
    //   // m.castShadow = true;
    //   m.material.side = THREE.DoubleSide;
    // });
    // console.log(tree.children[0]);
    // // this.treeTrunkGeom = tree.children[0].geometry;
    // // this.treeTrunkMat = tree.children[0].material.clone();
    // // tree.children[1].material[1];
    // // this.treeHeadGeom = tree.children[1].geometry;
    // // this.treeHeadMat = tree.children[1].material[1].clone();
    // this.treeHeadGeom = tree.children[0].geometry;
    // this.treeHeadMat = tree.children[0].material[0].clone();
    //  new THREE.MeshBasicMaterial({ map: tree.children[1].material[1].map });
    // console.log(tree.children[1].material[1].map);
  }

  createTree() {
    const tree = new THREE.Object3D();

    const head = new THREE.Mesh(this.treeHeadGeom.clone(), this.treeHeadMat);
    const trunk = new THREE.Mesh(this.treeTrunkGeom.clone(), this.treeTrunkMat);

    tree.add(head);
    tree.add(trunk);
    const rotation = new THREE.Euler();
    rotation.y = Math.PI * this.noiseGenerators[2].simplex2(this.tempPos.x * 50, this.tempPos.z * 50);
    rotation.x = this.noiseGenerators[2].simplex2(this.tempPos.x * 11, this.tempPos.z * 80) / 10;
    rotation.z = this.noiseGenerators[2].simplex2(this.tempPos.x * 1000, this.tempPos.z * 5000) / 10;
    tree.quaternion.setFromEuler(rotation);
    const sc = 10 + Math.abs(this.noiseGenerators[1].simplex2(this.tempPos.x * 10, this.tempPos.z * 10)) * 10;
    tree.scale.setScalar(sc * 1.5);

    return tree;
  }
  // createTree(name: string, lodNum = 4) {
  //   const lod = new THREE.LOD();
  //   const dist = 300;

  //   for (let i = 0; i < lodNum; i++) {
  //     const tree = this.ts.assets.getAsset(i === 0 ? name : name + `_lod${i}`).data.clone();
  //     tree.children.forEach((m) => {
  //       m.castShadow = true;
  //       m.material.side = THREE.DoubleSide;
  //     });
  //     lod.addLevel(tree, dist * i);
  //   }
  //   return lod;
  // }

  createChildMatrix(instance: SpawnerInstance, pos: THREE.Vector3): THREE.Matrix4 {
    const matrix = new THREE.Matrix4();
    const position = pos;
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    instance.obj.getWorldPosition(this.tempPos);
    this.tempPos.add(pos);
    const y = this.ts.spawner.ground.getGroundLevel(this.tempPos) - 10;

    pos.y = y;

    rotation.y = Math.PI * this.noiseGenerators[2].simplex2(this.tempPos.x * 50, this.tempPos.z * 50);
    rotation.x = this.noiseGenerators[2].simplex2(this.tempPos.x * 11, this.tempPos.z * 80) / 10;
    rotation.z = this.noiseGenerators[2].simplex2(this.tempPos.x * 1000, this.tempPos.z * 5000) / 10;
    quaternion.setFromEuler(rotation);

    const sc = 10 + Math.abs(this.noiseGenerators[1].simplex2(this.tempPos.x * 10, this.tempPos.z * 10)) * 10;
    scale.setScalar(sc * 1.5);

    matrix.compose(position, quaternion, scale);

    return matrix;
  }

  createInstancedMeshes(matrixes: THREE.Matrix4[]) {
    const meshes: THREE.InstancedMesh[] = [];
    const instancedMesh = new THREE.InstancedMesh(this.treeHeadGeom.clone(), this.treeHeadMat, matrixes.length);
    const instancedMeshTrunk = new THREE.InstancedMesh(this.treeTrunkGeom.clone(), this.treeTrunkMat, matrixes.length);
    // instancedMesh.castShadow = true;
    // instancedMeshTrunk.castShadow = true;
    for (let a = 0; a < matrixes.length; a++) {
      const matrix = matrixes[a];
      instancedMesh.setMatrixAt(a, matrix);
      instancedMeshTrunk.setMatrixAt(a, matrix);
    }
    meshes.push(instancedMesh, instancedMeshTrunk);
    return meshes;
  }

  createChild(instance, x, y, z): THREE.Object3D {
    const obj = new THREE.Object3D();
    // const tree = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshBasicMaterial({ color: new THREE.Color(255, 255, 255) }));
    const tree = this.createTree();
    // // const tree = this.createTree("fallen1", 3).clone();
    // tree.castShadow = true;
    // const scale = (1 + Math.abs(this.noiseGenerators[1].simplex2(x * 10, z * 10))) / 9;
    // tree.scale.setScalar(scale);
    // tree.rotation.y = Math.PI * this.noiseGenerators[2].simplex2(x * 50, z * 50);
    // tree.rotation.x = this.noiseGenerators[2].simplex2(x * 11, z * 80) / 10;
    // tree.rotation.z = this.noiseGenerators[2].simplex2(x * 1000, z * 5000) / 10;
    obj.add(tree);

    // for (let l = 0; l < 10; l++) {
    //   const tree = new THREE.Object3D();
    //   const pm1 = this.childMesh.clone();
    //   // pm1.rotation.z = 180 * Math.PI / 180;
    //   pm1.rotation.y = (-90 * Math.PI) / 180;
    //   // pm1.position.y = this.treeHeight / 2;
    //   tree.add(pm1);

    //   const pm2 = this.childMesh.clone();
    //   // pm2.rotation.z = 180 * Math.PI / 180;
    //   // pm2.rotation.y = -90 * Math.PI / 180;
    //   pm2.position.y = this.treeHeight / 2;
    //   pm2.position.y = this.treeHeight / 2 - 5;
    //   pm1.position.y = this.treeHeight / 2 - 5;
    //   tree.position.x = (this.noiseGenerators[1].simplex2(x * 1000 * l, z * 1000 * l) * this.am.size.x) / this.options.density.x;
    //   tree.position.z = (this.noiseGenerators[2].simplex2(x * 1000 * l, z * 1000 * l) * this.am.size.z) / this.options.density.z;
    //   tree.rotation.y = (360 * Math.random() * Math.PI) / 180;
    //   tree.rotation.x = (5 * Math.random() * Math.PI) / 180;
    //   tree.rotation.z = (5 * Math.random() * Math.PI) / 180;
    //   tree.add(pm2);
    //   let scale = 0.2 + ((1 + this.noiseGenerators[0].simplex2(x * 1000 * l, z * 1000 * l)) / 2) * 0.8;
    //   scale = scale * 3;
    //   tree.scale.setScalar(scale);

    //   obj.add(tree);
    // }

    // obj.rotation.y = (360 * Math.random() * Math.PI) / 180;
    // obj.rotation.x = (5 * Math.random() * Math.PI) / 180;
    // obj.rotation.z = (5 * Math.random() * Math.PI) / 180;

    // obj.position.y = this.treeHeight / 2 * scale;

    // const testmat = new THREE.MeshBasicMaterial({
    //     color: new THREE.Color(1, 0, 0),
    //     wireframe: true,
    //     depthTest: false,
    //     depthWrite: false
    // });
    // const testobj = new THREE.Mesh(
    //     new THREE.BoxGeometry(this.am.size / this.options.density,
    //         0.001, this.am.size / this.options.density), testmat);

    return obj;
  }

  manipulateChild(child: THREE.Object3D) {
    // child.position.y = this.ts.spawner.ground.getGroundLevelRay(this.tempPos.add(child.children[0].position));
    child.children[0].updateMatrixWorld();
    // if (this.options.isPositional) {
    //     console.log(child);
    // }

    for (let i = 0; i < child.children[0].children.length; i++) {
      const ch = child.children[0].children[i];
      const pos = ch.getWorldPosition(this.tempPos);
      ch.position.y = this.ts.spawner.ground.getGroundLevel(this.tempPos);
    }
    // child.position.y = 0;
    //  this.ts.spawner.ground.getGroundLevel(this.tempPos.add(child.children[0].position));
  }

  destroy() {
    super.destroy();
  }
}
