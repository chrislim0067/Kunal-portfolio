import { AbstractThreeManager } from "./abstract-three-manager";
import * as THREE from "three";

export class LogControlManager extends AbstractThreeManager {
  helper = new THREE.Object3D();
  moveState = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    forward: 0,
    back: 0,
    pitchUp: 0,
    pitchDown: 0,
    yawLeft: 0,
    yawRight: 0,
    rollLeft: 0,
    rollRight: 0,
  };
  prevPos = new THREE.Vector3(0, 0, 0);
  lookAtGoal = new THREE.Vector3(0, 0, 0);

  bclookAtGoal = new THREE.Vector3(0, 0, -10);

  nextPosVector = new THREE.Vector3(0, 0, 0);
  goalPos = new THREE.Vector3(0, 0, 0);
  tempWorldDir = new THREE.Vector3(0, 0, 0);
  tempWorldPos = new THREE.Vector3(0, 0, 0);

  currRotSpeed: { x: number; y: number } = { x: 0, y: 0 };
  // currPosSpeed = new THREE.Vector3();
  currPosSpeed = new THREE.Vector3();
  speedDamp = 10;

  speedGoal = new THREE.Vector3();
  speedGoal2 = new THREE.Vector3();
  localForward = new THREE.Vector3();

  camGoalPos = new THREE.Vector3();
  camBehindDirection = new THREE.Vector3();

  camSpeed = new THREE.Vector3();

  rotQuat = new THREE.Quaternion();
  localUp = new THREE.Vector3(0, 1, 0);

  camZShift = 10;

  camXShift = 0;

  camBehindMulti = this.ts.isDebug ? 30 : 10;

  currRotY = 0;
  damping = 10;
  ydamping = 10;

  // extraY = this.ts.isDebug ? 400 : 0;

  // floatingHeightMin = 0;

  create() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
    });
    const box = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(box, mat);
    this.helper.add(mesh);
    const mat2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const arrow1g = new THREE.BoxGeometry(0.3, 0.3, 2);
    const arrow1 = new THREE.Mesh(arrow1g, mat2);
    arrow1.position.z = 1;
    this.helper.add(arrow1);

    const mat3 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const arrow2g = new THREE.BoxGeometry(20, 0.2, 0.2);
    const arrow2 = new THREE.Mesh(arrow2g, mat3);
    arrow2.position.z = 1.6;
    this.helper.add(arrow2);
    // const gridHelper = new THREE.GridHelper(1000, 3, 0x0000ff, 0x808080);
    // this.ts.mainScene.add(gridHelper);
    // gridHelper.position.y = 10;

    // this.ts.actor.boxObj.add(this.ts.camera);
    // this.ts.camera.position.set(0, 0.5, 0);
    // this.ts.mainScene.add(this.ts.controlObj);
    // this.ts.controlObj.add(this.helper);
    // this.ts.camera.position.y = this.camPosShift;
    // this.ts.camera.position.y = (this.getYGoal(this.ts.camera.position) + this.extraY);
    setTimeout((params) => {
      // this.setCameraPos(1);
      this.onResize({ width: this.ts.width, height: this.ts.height });
    });
  }

  onRender(clock: { elapsedTime: number; delta: number }) {
    const ns = this.ts.nippleService;
    const bc = this.ts.controlObj;
    // const goalY = this.ts.poi.getYGoal(bc.position);
    // bc.position.y = goalY.absoluteY;
    if (ns.isActive) {
      bc.translateZ(-ns.speed.y * 10);
      this.ts.rotationDistort.y = bc.rotation.y;
      bc.rotateY(-ns.speed.x / 120);
      // bc.rotateX(ns.speed.y / 180);
      bc.rotateZ((-ns.speed.x * 2) / 120);
      // bc.getWorldDirection(this.localForward);
      // this.speedGoal.set(ns.speed.x, 0, ns.speed.y);

      // this.speedGoal = this.speedGoal
      //   .setScalar(1 + ns.speed.y * 5)
      //   .negate()
      //   .multiply(this.localForward);
      // bc.position.add(this.speedGoal);
    } else {
      if (this.ts.autofly) {
        bc.translateZ(-3);
        // bc.rotateY(Math.sin(clock.elapsedTime) / 50);
        // bc.rotateX(Math.sin(clock.elapsedTime) / 50);
        bc.rotateZ(Math.sin(clock.elapsedTime / 4) / 180);
      }

      bc.rotateY((this.ts.rotationDistort.y - bc.rotation.y) / this.damping);
    }
    bc.rotateZ((this.ts.rotationDistort.z - bc.rotation.z) / this.damping);
    bc.rotateX((this.ts.rotationDistort.x - bc.rotation.x) / this.damping);

    this.setCameraPos(this.damping);
  }
  setCameraPos(damping = 5) {
    const bc = this.ts.controlObj;
    // this.lookAtGoal.copy(bc.position);
    // this.lookAtGoal.y = bc.position.y + this.ts.cameraController.shiftY;
    // this.lookAtGoal.x = this.lookAtGoal.x + this.camXShift;
    // bc.getWorldDirection(this.camBehindDirection);
    // this.camBehindDirection.multiplyScalar(this.camBehindMulti);
    // const camBehindGoal = this.camBehindDirection.add(bc.position);
    // this.ts.camera.lookAt(this.lookAtGoal);
    // this.ts.camera.position.x += (camBehindGoal.x - this.ts.camera.position.x + this.camXShift) / damping;
    // this.ts.camera.position.z += (camBehindGoal.z - this.ts.camera.position.z) / damping;
    // this.ts.camera.position.y += (bc.position.y + this.ts.cameraController.extraY - this.ts.camera.position.y + this.ts.cameraController.shiftY + 1) / damping;

    this.ts.camera.quaternion.x += bc.quaternion.x - this.ts.camera.quaternion.x;
    this.ts.camera.quaternion.y += bc.quaternion.y - this.ts.camera.quaternion.y;
    this.ts.camera.quaternion.z += bc.quaternion.z - this.ts.camera.quaternion.z;
    this.ts.camera.quaternion.w += bc.quaternion.w - this.ts.camera.quaternion.w;
    const goalY = this.ts.poi.getYGoal(this.ts.camera.position);
    // this.ts.camera.position.y = goalY.absoluteY;
    this.ts.camera.position.x += (bc.position.x - this.ts.camera.position.x + this.camXShift) / damping;
    this.ts.camera.position.z += (bc.position.z - this.ts.camera.position.z) / damping;
    this.ts.camera.position.y += (goalY.absoluteY + this.ts.cameraController.extraY - this.ts.camera.position.y + this.ts.cameraController.shiftY + 1) / this.ydamping;

    // this.ts.camera.lookAt(bc.position);
  }

  onResize(size: { width: number; height: number }) {}
}
