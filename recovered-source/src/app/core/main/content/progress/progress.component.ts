import { Component, HostBinding, Input, OnInit } from "@angular/core";
import { SiteService } from "src/app/shared/services/site.service";

@Component({
  selector: "app-progress",
  templateUrl: "./progress.component.html",
  styleUrls: ["./progress.component.scss"],
})
export class ProgressComponent implements OnInit {
  dashes = [];
  _start = 0;
  _end = 0;
  pinpos = 0;
  space = 0;
  size = 20;

  // public get start(): number {
  //   return this._start;
  // }

  // @Input() public set start(v: number) {
  //   this._start = v;
  //   this.update();
  // }
  // public get end(): number {
  //   return this._end;
  // }

  // @Input() public set end(v: number) {
  //   this._end = v;
  //   this.update();
  // }
  pos = 0;
  @Input() direction = 1;
  @Input() @HostBinding("class.flip") flip = false;
  @Input() points = [{ label: "works", position: 10 }];
  constructor(public site: SiteService) {}

  ngOnInit(): void {
    this.site.screenSizeChange.subscribe((params) => {
      this.resize();
    });
    this.resize();
  }

  // update() {
  //   // this.pos = this.start;
  //   // this.pinpos = (this.site.screen.h - 50) * this.pos;
  // }
  resize() {
    this.dashes = [];
    const s = this.site.screen.w > this.site.screen.h ? this.site.screen.w : this.site.screen.h;
    const num = 15;
    this.space = s / num;
    this.size = 45;
    for (let i = 0; i < num; i++) {
      this.dashes.push(i);
    }
  }
}
