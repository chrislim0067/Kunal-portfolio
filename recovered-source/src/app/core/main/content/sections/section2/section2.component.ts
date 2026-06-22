import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { GoogleAnalyticsService } from "ngx-google-analytics";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SiteService } from "src/app/shared/services/site.service";
import { AnimService } from "../../anim.service";
import { ManoComponent } from "../../etc/mano/mano.component";

@Component({
  selector: "app-section2",
  templateUrl: "./section2.component.html",
  styleUrls: ["./section2.component.scss"],
})
export class Section2Component implements OnInit, AfterViewInit, OnDestroy {
  destroy$: Subject<void> = new Subject();
  @ViewChild("circleRef", { static: true }) circleRef: ElementRef;
  @ViewChild("circRef", { static: true }) circRef: ElementRef;
  @ViewChild("btnRef", { static: true, read: ElementRef }) btnRef: ElementRef;
  @ViewChild("btnRef2", { static: true, read: ElementRef }) btnRef2: ElementRef;
  @HostBinding("class.mobile") isMobile = this.site.isMobile;

  circleSize = 20;
  circleActualSize = 20;
  overlayRef: OverlayRef;
  scrollStartPos = 0;
  constructor(private renderer: Renderer2, private ga: GoogleAnalyticsService, private site: SiteService, private router: Router, private overlay: Overlay) {}

  ngOnInit(): void {}
  @HostListener("window:click") click() {
    this.closeOverlay();
  }
  ngAfterViewInit(): void {
    this.site.screenSizeChange.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.updateSize();
    });
    this.updateSize();
    const scrollEvt = this.site.scrollEvent.pipe().subscribe((params) => {
      if (this.overlayRef) {
        if (Math.abs(this.scrollStartPos - this.site.scrolledEl.scrollTop) > 200) {
          this.closeOverlay();
        }
      }
    });
  }
  openMe() {
    this.router.navigate(["/about"]);
  }
  closeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
  openMano() {
    this.ga.event("button_click_mano", "button_click", "Mano image opened");

    setTimeout(() => {
      if (this.overlayRef) return;
      this.scrollStartPos = this.site.scrolledEl.scrollTop;
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

      const positionStrategy: any = this.overlay
        .position()
        .flexibleConnectedTo(this.btnRef2.nativeElement)
        .withPositions([
          {
            originX: vw < 767 ? "center" : "end",
            originY: "top",
            overlayX: vw < 767 ? "center" : "start",
            overlayY: "bottom",
            offsetY: vw < 767 ? -10 : 0,
            // offsetX: vw < 767 ? -30 : 0,
          },
        ]);
      //  const scrollStrategy: ScrollStrategyOptions={}

      this.overlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close({}),
        // minWidth: cellDiv.offsetWidth,
        // minHeight: cellDiv.offsetHeight,
        width: 250,
        height: 250,
        // hasBackdrop: true,
      });
      const userProfilePortal = new ComponentPortal(ManoComponent);
      this.overlayRef.attach(userProfilePortal);
    });

    // const overlayRef = this.overlay.create();
    // const overlayRef = overlay.create({
    //   height: "400px",
    //   width: "600px",
    // });
  }
  updateSize() {
    this.isMobile = this.site.isMobile;
    const screen = this.site.screen;
    const fullW = this.site.screen.w;
    let circW;
    const circRad = this.circleSize - 4.2;
    if (screen.aspect < 1) {
      this.renderer.setAttribute(this.circleRef.nativeElement, "rx", (this.circleSize * screen.aspect).toString());
      this.renderer.setAttribute(this.circleRef.nativeElement, "ry", this.circleSize.toString());
      this.circleActualSize = this.circleSize * screen.aspect * 1.5;
      circW = (circRad / 100) * this.site.screen.h;
    } else {
      this.circleActualSize = this.circleSize * 1.5;
      this.renderer.setAttribute(this.circleRef.nativeElement, "rx", this.circleSize.toString());
      this.renderer.setAttribute(this.circleRef.nativeElement, "ry", (this.circleSize * screen.aspect2).toString());
      circW = (circRad / 100) * this.site.screen.w;
    }
    // [ngStyle]="{ left: }"
    this.renderer.setStyle(this.btnRef.nativeElement, "left", "calc(50% - " + circW + "px)");
    this.renderer.setStyle(this.btnRef2.nativeElement, "left", "calc(50% + " + circW + "px)");
    // // this.renderer.setStyle(this.btnRef.nativeElement, "left", "calc(50% + " + circW + "px)");
    this.renderer.setAttribute(this.circRef.nativeElement, "r", (circRad > 0 ? circRad : 0).toString());
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
