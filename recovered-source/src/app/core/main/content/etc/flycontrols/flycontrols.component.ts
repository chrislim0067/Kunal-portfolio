import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { GoogleAnalyticsService } from "ngx-google-analytics";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NippleService } from "src/app/shared/modules/nipple/nipple.service";
import { SiteService } from "src/app/shared/services/site.service";
import { ThreeService } from "../../../three/three.service";

@Component({
  selector: "app-flycontrols",
  templateUrl: "./flycontrols.component.html",
  styleUrls: ["./flycontrols.component.scss"],
})
export class FlycontrolsComponent implements OnInit, AfterViewInit, OnDestroy {
  panelOpen = false;
  delayed = false;
  dotTop = 0;
  dotLeft = 0;
  angle = 0;
  transform = "";
  destroy: Subject<any> = new Subject();
  constructor(public ts: ThreeService, private site: SiteService, private cd: ChangeDetectorRef, public ns: NippleService, private ga: GoogleAnalyticsService) {}

  ngOnInit(): void {
    this.ts.onRender.pipe(takeUntil(this.destroy)).subscribe((params) => {
      // this.dotTop = 100 * ((this.ts.dir.z + 1) / 2);
      // this.dotLeft = 100 * ((this.ts.dir.x + 1) / 2);
      // this.angle = -45 + (Math.atan2(this.ts.dir.z, -this.ts.dir.x) * 180) / Math.PI;
      // this.transform = `translateX(-50%) translateY(-50%) rotate(${this.angle}deg)`;
      // console.log(this.ts.dir.z);
      this.cd.markForCheck();
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.delayed = true;
      if (!this.site.isMobile) this.panelOpen = true;
      this.cd.detectChanges();
    }, 10);
  }
  panelToggle() {
    this.panelOpen = !this.panelOpen;
    if (this.panelOpen) {
      this.ga.event("button_click_panelOpen", "button_click", "Panel open clicked");
    } else {
      this.ga.event("button_click_panelClose", "button_click", "Panel close clicked");
    }
  }
  autoFlyChange(e) {
    this.ts.autofly = e.target.checked;
    this.ga.event("button_click_autofly", "button_click", "Autofly start clicked");
  }
  moodChange(e) {
    this.ga.event("mood_selected_" + e, "mood_select", "Mood selected: " + e);
    this.ts.anim.setState(null, true, 4, this.ts.anim.stateOverrides[e]);
  }
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
