import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { GoogleAnalyticsService } from "ngx-google-analytics";
import { ThreeService } from "../../three/three.service";

@Component({
  selector: "app-slownotice",
  templateUrl: "./slownotice.component.html",
  styleUrls: ["./slownotice.component.scss"],
})
export class SlownoticeComponent implements OnInit {
  @ViewChild("videoRef", { static: true }) videoRef: ElementRef;
  showPlay = false;
  constructor(public dialogRef: MatDialogRef<any>, private ga: GoogleAnalyticsService, private ts: ThreeService) {}

  ngOnInit(): void {
    const promise = this.videoRef.nativeElement.play();

    if (promise !== undefined) {
      promise
        .then((_) => {
          this.showPlay = false;
        })
        .catch((error) => {
          this.showPlay = true;
        });
    }
  }
  playClicked() {
    this.ga.event("slow_notice_playprev", "slow_notice", "Play preview clicked");
    this.showPlay = false;
    this.videoRef.nativeElement.play();
  }
  continue() {
    this.ga.event("slow_notice_continue", "slow_notice", "Continue anyway clicked");
    this.dialogRef.close();
    this.ts.resumeRender();
  }
}
