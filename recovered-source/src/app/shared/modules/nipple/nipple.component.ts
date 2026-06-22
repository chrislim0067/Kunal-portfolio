import { Component, OnInit, ChangeDetectorRef, NgZone, Input, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import nipplejs from "./utils/nipplejs/index";
import { NippleService } from "./nipple.service";
@Component({
  selector: "app-nipple",
  templateUrl: "./nipple.component.html",
  styleUrls: ["./nipple.component.scss"],
})
export class NippleComponent implements OnInit, OnDestroy {
  @ViewChild("nipRef") nipRef: ElementRef;
  @Input() zoneElement: any;
  nipp: any;

  // width: 100;
  // height: 100;
  // joystick: Joystick;

  // mouse: { pos: { x: number, y: number }, isDown: boolean } = { pos: { x: 0, y: 0 }, isDown: false };
  constructor(private nippleService: NippleService, private zone: NgZone) {}

  ngOnInit() {
    const options = {
      zone: this.zoneElement,
    };

    this.zone.runOutsideAngular(() => {
      this.nipp = nipplejs.create(options);
      this.nipp
        .on("start", (evt, data) => {
          this.nippleService.isActive = true;
          this.nippleService.startX = data.position.x;
          this.nippleService.startY = data.position.y;
          this.nippleService.firstInteraction.next(true);
          this.nippleService.userInteraction.next(true);
        })
        .on("end", (evt, data) => {
          this.nippleService.force = 0;
          this.nippleService.distance = 0;
          this.nippleService.isActive = false;
          this.nippleService.speed.x = 0;
          this.nippleService.speed.y = 0;
        })
        .on("move", (evt, data) => {
          this.nippleService.speed.x = (data.position.x - this.nippleService.startX) / (this.nipp.options.size / 2);
          this.nippleService.speed.y = -(data.position.y - this.nippleService.startY) / (this.nipp.options.size / 2);
          this.nippleService.force = data.force;
          this.nippleService.angle = data.angle;
          this.nippleService.distance = data.distance;
        })
        .on("dir:up plain:up dir:left plain:left dir:down " + "plain:down dir:right plain:right", (evt, data) => {
          // console.log(evt.type);
        })
        .on("pressure", (evt, data) => {});
    });
  }
  ngOnDestroy() {
    this.nipp.destroy();
  }
  // mouseMove(event) {
  //   this.mouse.pos.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   this.mouse.pos.y = - (event.clientY / window.innerHeight) * 2 + 1;
  //   if (this.mouse.isDown) {
  //     // console.log(this.mouse);
  //   }
  // }
  // mouseDown(event) {
  //   console.log("touchstart")
  //   // this.mouse.isDown = true;
  // }
  // mouseUp(event) {
  //   this.mouse.isDown = false;
  // }
}
