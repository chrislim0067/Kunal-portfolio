import { SiteService } from "./../../shared/services/site.service";
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { ThreeService } from "./three/three.service";
import { DataService } from "src/app/shared/services/data.service";
import { coerceNumberProperty } from "@angular/cdk/coercion";
import { MatDialog } from "@angular/material/dialog";
import { SlownoticeComponent } from "./content/slownotice/slownotice.component";
import { GoogleAnalyticsService } from "ngx-google-analytics";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit, AfterViewInit {
  isInited = false;
  images;

  constructor(public site: SiteService, public ts: ThreeService, private cd: ChangeDetectorRef, private ga: GoogleAnalyticsService, public data: DataService, private dialog: MatDialog) {
    this.data.getData();

    this.site.focus.subscribe((hasFocus) => {
      if (hasFocus) {
        this.ts.slowTicks = 0;
      }
    });

    const slowCheck = setInterval(() => {
      if (this.ts.slowTicks > 5 && this.ts.average10 > 0.2 && this.site.focus.value) {
        this.ga.event("slow_notice_shown", "slow_notice", "Browser running slow notice shown");
        this.dialog.open(SlownoticeComponent, {
          maxWidth: "600px",
          closeOnNavigation: false,
          disableClose: true,
          panelClass: "notice-modal",
        });
        this.ts.pauseRender();
        clearInterval(slowCheck);
      }
    }, 1000);

    this.ts.onInited.subscribe((isInited) => {
      if (isInited) {
        this.isInited = true;
        this.cd.markForCheck();
      }
    });
  }

  ngOnInit() {
    this.data.dataLoaded.subscribe((isLoaded) => {
      if (isLoaded) {
        this.images = this.data.projects.categories[1].projects;
      }
    });
  }
  ngAfterViewInit() {}
}
