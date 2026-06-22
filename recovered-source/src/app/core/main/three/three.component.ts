import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { ThreeService } from "./three.service";
// import * as THREE from 'three';
import * as THREE from "three";
import { logLinefragmentShader, logLineVertexShader } from "./shaders/logshader/logLineShader";
import { logPointVertexShader, logPointFragmentShader } from "./shaders/logshader/logPointShader";
// import * as THREE from 'thre./glitchpass
import { DeviceDetectorService } from "ngx-device-detector";
import { SiteService } from "src/app/shared/services/site.service";
import { compileInjector } from "@angular/compiler";

@Component({
  selector: "app-three",
  templateUrl: "./three.component.html",
  styleUrls: ["./three.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreeComponent implements OnInit {
  @ViewChild("noiseCanvasRef", { static: true }) noiseCanvas: ElementRef;
  @ViewChild("canvasRef", { static: true }) canvasRef: ElementRef;
  @ViewChild("wrapperRef", { static: true }) wrapperRef: ElementRef;
  obj: THREE.Object3D = new THREE.Object3D();
  objects: any = {};

  // @HostListener("window:keydown", ["$event"])
  // keydown(evt) {
  //   if (evt.ctrlKey) {
  //     let skycontroller: any = Object.assign({}, this.ts.skyController);
  //     delete skycontroller["_gsap"];
  //     skycontroller = JSON.stringify({ skyController: skycontroller });
  //     skycontroller = skycontroller.slice(1, skycontroller.length);
  //     skycontroller = skycontroller.slice(0, skycontroller.length - 1) + ",";
  //     console.log(skycontroller);
  //     // console.log(this.ts.camera.position);
  //     // console.log("campos", this.ts.camera.position, "camrot", this.ts.camera.rotation, "camrotDistort", this.ts.rotationDistort, "skycontroller", JSON.stringify({ skyController: skycontroller }), "effectctrl", this.ts.effectController);
  //   }
  // }

  constructor(public ts: ThreeService, private ss: SiteService, private cd: ChangeDetectorRef) {
    if (!this.ss.isMobile) {
      this.ts.qualityLevel = 0;
    } else {
      this.ts.qualityLevel = 1;
    }
    this.ts.onInited.subscribe((isInited) => {
      if (isInited) {
        this.cd.markForCheck();
      }
    });
  }

  @HostListener("window:click")
  mouseClick() {
    this.ts.onFirstContact.next(true);
    this.ts.firstContact = true;
  }

  ngOnInit() {
    this.ts.create(this.wrapperRef, this.canvasRef, this.noiseCanvas);

    this.ts.onResize.subscribe((size: { width: number; height: number }) => {
      this.onResize(size);
    });
  }

  onResize(size: { width: number; height: number }) {
    setTimeout(() => {
      this.cd.markForCheck();
    });
  }
}
