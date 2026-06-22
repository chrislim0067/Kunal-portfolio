import { Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { GoogleAnalyticsService } from "ngx-google-analytics";
import { Subject } from "rxjs";
import { NippleService } from "src/app/shared/modules/nipple/nipple.service";
import { SiteService } from "src/app/shared/services/site.service";
import { ThreeService } from "../../../three/three.service";

@Component({
  selector: "app-section5",
  templateUrl: "./section5.component.html",
  styleUrls: ["./section5.component.scss"],
})
export class Section5Component implements OnInit {
  destroy$: Subject<void> = new Subject();

  circleSize = 20;
  constructor(public ts: ThreeService, public ns: NippleService, private renderer: Renderer2, private ga: GoogleAnalyticsService, private site: SiteService) {}

  startFlight() {
    localStorage.setItem("freeflight", "true");
    this.ga.event("button_click_freeflight", "button_click", "Start freeflight clicked");
    this.ts.startFreeFlight();
    this.ts.autofly = true;
  }
  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
