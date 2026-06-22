import { ProjectViewComponent } from "./project-view/project-view.component";
import { NavigationEnd, Router } from "@angular/router";
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, NgZone, OnInit, Renderer2, ViewChild } from "@angular/core";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import gsap from "gsap/all";
import { Power2, Expo } from "gsap/all";
import { ElementRef } from "@angular/core";
import { SiteService } from "src/app/shared/services/site.service";
import { ThreeService } from "../three/three.service";
import { DataService } from "src/app/shared/services/data.service";
import { Section2Component } from "./sections/section2/section2.component";
import { SplitT } from "./etc/split";
import { MatDialog } from "@angular/material/dialog";
import { Section5Component } from "./sections/section5/section5.component";
import { AboutComponent } from "./about/about.component";
import { GoogleAnalyticsService } from "ngx-google-analytics";
import normalizeWheel from "normalize-wheel";
import { merge, Subject } from "rxjs";
import { debounceTime, takeLast } from "rxjs/operators";
import { closestNumIndexInSortedArray, closestNumInSortedArray } from "src/app/shared/utils/closest-num-in-arary";

(function () {
  const blurProperty = gsap.utils.checkPrefix("filter"),
    blurExp = /blur\((.+)?px\)/,
    getBlurMatch = (target) => ((gsap.getProperty(target, blurProperty) || "") as any).match(blurExp) || [];

  gsap.registerPlugin({
    name: "blur",
    get(target) {
      return +getBlurMatch(target)[1] || 0;
    },
    init(target, endValue) {
      let data = this,
        filter = gsap.getProperty(target, blurProperty) as any,
        endBlur = "blur(" + endValue + "px)",
        match = getBlurMatch(target)[0],
        index;
      if (filter === "none") {
        filter = "";
      }
      if (match) {
        index = filter.indexOf(match);
        endValue = filter.substr(0, index) + endBlur + filter.substr(index + match.length);
      } else {
        endValue = filter + endBlur;
        filter += filter ? " blur(0px)" : "blur(0px)";
      }
      data.target = target;
      data.interp = gsap.utils.interpolate(filter, endValue);
    },
    render(progress, data) {
      data.target.style[blurProperty] = data.interp(progress);
    },
  });
})();

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
})
export class ContentComponent implements OnInit, AfterViewInit {
  @ViewChild("wrapperRef", { static: true }) wrapperRef: ElementRef;

  @ViewChild("section2Ref", { static: true }) section2Ref: Section2Component;
  @ViewChild("section5Ref", { static: true }) section5Ref: Section5Component;

  start;
  end;
  delta = 0;
  startpos = 0;
  timelines;

  trigger: gsap.plugins.ScrollTriggerInstance;
  speed = 0;
  tween;
  tween2;
  frameId;
  animRunning = false;

  dif = 0;
  startPos = 0;
  progress;
  dur;
  tdur;
  touching;

  snapPositions = [0, 7, 12, 16.6, 24, 32.5, 44, 65, 80, 92.2];
  // positions = [0, 937, 1194, 6000, 9000, 12000, 14000];

  tl: gsap.core.Timeline;
  catprogress = 0;

  scrollTimeout;
  showScrollIndicator = true;
  atBottom = false;
  scrollIndicatorDelay = 2000;
  initial = true;
  splitTexts: any = {};

  currentIndex = 0;
  dialogRef;
  @HostListener("scroll") winFocus() {
    this.site.scrollEvent.next();
    // if (this.trigger) {
    //   if (this.site.isMobile) {
    //     this.el.nativeElement.scrollTop = 0;
    //     this.tl.progress(0);
    //   }
    // }
  }

  // @HostListener("window:keydown", ["$event"])
  // keydown(evt) {
  //   if (evt.ctrlKey) {
  //     const full = this.el.nativeElement.scrollHeight - this.el.nativeElement.offsetHeight;
  //     gsap.to(this.el.nativeElement, {
  //       duration: 30,
  //       scrollTop: full / 2.8,
  //       onUpdate: () => {
  //         this.resetIndicator();
  //       },
  //     });
  //     gsap.to(this.el.nativeElement, {
  //       delay: 30,
  //       duration: 15,
  //       scrollTop: full,
  //       onUpdate: () => {
  //         this.resetIndicator();
  //       },
  //     });
  //   }
  // }

  constructor(private el: ElementRef, private renderer: Renderer2, private cd: ChangeDetectorRef, private ga: GoogleAnalyticsService, public site: SiteService, public ts: ThreeService, private zone: NgZone, public data: DataService, public dialog: MatDialog, private router: Router) {
    this.site.scrolledEl = this.el.nativeElement;

    merge(this.ts.isFreeFlight, this.ts.siteEntered).subscribe((val) => {
      if (!this.ts.isFreeFlight.value && this.ts.siteEntered.value) {
        this.site.enableScroll();
      } else {
        this.site.disableScroll();
      }
    });

    this.ts.isFreeFlight.subscribe((val) => {
      if (!this.ts.isFreeFlight.value) {
        this.currentIndex = 0;
      }
    });

    this.site.scrollEvent.pipe(debounceTime(50)).subscribe((scroll) => {
      const time = this.dur * this.progress;
      const closestIndex = closestNumIndexInSortedArray(time, this.snapPositions);
      this.currentIndex = closestIndex;
      this.cd.markForCheck();
    });

    let current;
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const mainPath = this.router.url.split("/")[1].split("?")[0];
        if (current === mainPath) return;
        if (this.dialogRef) this.dialogRef.close();
        current = mainPath;
        if (mainPath === "illustration") {
          this.ts.isTempMuteOff.next(false);
          this.ts.pauseRender();

          this.dialogRef = this.dialog.open(ProjectViewComponent, {
            width: "100%",
            height: "100%",
            maxHeight: "100%",
            maxWidth: "1440px",
            backdropClass: "dark-backdrop",
            panelClass: "full-screen-modal",
            data: { project: 1 },
            closeOnNavigation: false,
          });
          this.dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(["/"]);
          });
        } else if (mainPath === "design-and-dev") {
          this.ts.isTempMuteOff.next(false);
          this.ts.pauseRender();

          this.dialogRef = this.dialog.open(ProjectViewComponent, {
            width: "100%",
            height: "100%",
            maxHeight: "100%",
            maxWidth: "1440px",
            backdropClass: "dark-backdrop",

            panelClass: "full-screen-modal",
            data: { project: 0 },
            closeOnNavigation: false,
          });
          this.dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(["/"]);
          });
        } else if (mainPath === "about") {
          this.ts.isTempMuteOff.next(true);

          this.dialogRef = this.dialog.open(AboutComponent, {
            width: "100%",
            maxHeight: "680px",
            maxWidth: "920px",
            backdropClass: "about-backdrop",
            panelClass: "about-modal",
            data: {},
            autoFocus: false,
          });
          this.dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(["/"]);
          });
        } else {
          this.ts.isTempMuteOff.next(true);
          this.ts.resumeRender();
        }
      }
    });
  }
  swipeLeft() {
    this.prevClicked();
  }
  swipeRight() {
    this.nextClicked();
  }
  swipe() {
    this.nextClicked();
  }
  prevClicked() {
    this.resetIndicator();
    const nextIndex = this.currentIndex - 1 >= 0 ? this.currentIndex - 1 : 0;
    const pos = (this.snapPositions[nextIndex] / this.dur) * (this.el.nativeElement.scrollHeight - this.el.nativeElement.offsetHeight);
    const prog = this.snapPositions[nextIndex] / this.dur;
    const dist = Math.abs(prog - this.progress) * 10;
    gsap.to(this.el.nativeElement, { ease: Power2.easeInOut, duration: dist, scrollTop: pos });

    // this.dif = pos - this.el.nativeElement.scrollTop;
    // if (!this.animRunning) {
    //   this.dif += this.el.nativeElement.scrollTop;
    //   this.startAnim();
    // }
  }
  nextClicked() {
    this.resetIndicator();
    const nextIndex = this.currentIndex + 1 < this.snapPositions.length ? this.currentIndex + 1 : this.snapPositions.length - 1;
    const pos = (this.snapPositions[nextIndex] / this.dur) * (this.el.nativeElement.scrollHeight - this.el.nativeElement.offsetHeight);
    const prog = this.snapPositions[nextIndex] / this.dur;
    const dist = Math.abs(prog - this.progress) * 10;
    gsap.to(this.el.nativeElement, { ease: Power2.easeInOut, duration: dist, scrollTop: pos });
    // this.dif = pos - this.el.nativeElement.scrollTop;
    // if (!this.animRunning) {
    //   this.dif += this.el.nativeElement.scrollTop;
    //   this.startAnim();
    // }
  }
  qaResult(isSoundOn) {
    if (isSoundOn) {
      this.ts.isSoundOn.next(true);
      this.ts.isMusicOn.next(true);
      this.ga.event("button_click_exploreWithSound", "button_click", "Explore with sound clicked");
    } else {
      this.ts.isSoundOn.next(false);
      this.ts.isMusicOn.next(false);
      this.ga.event("button_click_exploreWithoutSound", "button_click", "Explore without sound clicked");
    }
    this.ts.siteEntered.next(true);
  }
  ngOnInit(): void {
    const el = this.wrapperRef.nativeElement;
    if (!this.site.isMobile) {
      el.addEventListener("wheel", this.wheelEvt.bind(this), { passive: true });
    } else {
      el.addEventListener("touchstart", this.touchStart.bind(this), { passive: true });
      el.addEventListener("touchmove", this.touchMove.bind(this), { passive: true });
      el.addEventListener("touchend", this.touchEnd.bind(this), { passive: true });
    }
  }
  toggleSound() {
    this.ts.isSoundOn.next(!this.ts.isSoundOn.value);
  }
  toggleMusic() {
    this.ts.isMusicOn.next(!this.ts.isMusicOn.value);
  }
  resetIndicator() {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.showScrollIndicator = true;
      this.cd.detectChanges();
      this.scrollIndicatorDelay += 3000;
    }, this.scrollIndicatorDelay);
    this.showScrollIndicator = false;
  }
  wheelEvt(evt) {
    if (this.ts.isFreeFlight.value || !this.ts.siteEntered.value) return;
    const normalized = normalizeWheel(evt);
    this.resetIndicator();
    this.dif += normalized.pixelY;
    if (!this.animRunning) {
      this.dif += this.el.nativeElement.scrollTop;
      this.startAnim();
    }
  }

  startAnim() {
    this.startPos = this.el.nativeElement.scrollTop;
    this.animRunning = true;
    this.zone.runOutsideAngular(() => {
      this.animFunc();
    });
  }

  animFunc() {
    if (this.dif < 0) {
      this.dif = 0;
    }
    const max = this.el.nativeElement.scrollHeight - this.el.nativeElement.offsetHeight;
    if (this.dif > max) {
      this.dif = max;
    }

    const dist = this.dif - this.el.nativeElement.scrollTop;
    this.el.nativeElement.scrollTop += dist / 5;

    if (Math.abs(dist / 5) < 1 && !this.touching) {
      this.stopAnim();
    } else {
      this.frameId = requestAnimationFrame(() => {
        this.animFunc();
      });
    }
  }

  stopAnim() {
    this.dif = 0;
    window.cancelAnimationFrame(this.frameId);
    this.animRunning = false;
  }

  touchStart(event) {
    if (this.ts.isFreeFlight.value || !this.ts.siteEntered.value) return;
    this.start = event.changedTouches[0];
    this.touching = true;
    this.startpos = this.el.nativeElement.scrollTop;
    this.resetIndicator();

    // if (!this.animRunning) {
    this.dif = this.el.nativeElement.scrollTop;
    //   this.startAnim();
    // }
  }

  touchMove(event) {
    if (this.ts.isFreeFlight.value || !this.ts.siteEntered.value) return;
    this.end = event.changedTouches[0];
    this.delta = this.start.screenY - this.end.screenY;
    this.dif = this.startpos + this.start.screenY - this.end.screenY;
    this.speed = this.startpos + this.start.screenY - this.end.screenY - this.el.nativeElement.scrollTop;

    this.el.nativeElement.scrollTop = this.dif;
    // this.el.nativeElement.scrollTop = this.startpos + this.start.screenY - this.end.screenY;
  }
  touchEnd() {
    if (this.ts.isFreeFlight.value || !this.ts.siteEntered.value) return;
    this.resetIndicator();
    this.touching = false;
    // this.dif += this.speed * 5;
    // this.killTween();
    // this.delta = 0;
    // const val = { value: this.speed };
    // this.tween = gsap.to(val, {
    //   value: 0,
    //   duration: Math.min(Math.abs(this.speed / 20), 2),
    //   ease: Power2.easeOut,
    //   onUpdate: () => {
    //     this.el.nativeElement.scrollTop += val.value;
    //   },
    // });
  }

  // disposeTL() {
  //   this.trigger.kill();
  //   // this.tl.progress(0);
  //   this.tl.restart();
  //   // this.tl.clear();
  //   const targets = this.tl.getChildren();
  //   this.tl.kill();
  //   for (let i = 0; i < targets.length; i++) {
  //     if (targets[i].targets().length) {
  //       gsap.set(targets[i].targets(), { clearProps: "all" });
  //     }
  //   }
  //   this.tl = null;
  //   this.renderer.setStyle(this.el.nativeElement, "overflow", "hidden");
  //   this.trigger = null;
  //   ScrollTrigger.getAll().forEach((a) => {
  //     a.kill();
  //   });
  // }

  setupSplitTexts() {
    if (!this.site.isMobile && this.initial) {
      const s1_text1 = this.el.nativeElement.querySelector(".section1 .t");
      const s1_text2 = this.el.nativeElement.querySelectorAll(".section1 .t")[1];
      this.splitTexts.s1_splitText1 = SplitT(s1_text1, { words: 1, chars: 1, spacing: 10 });
      this.splitTexts.s1_splitText2 = SplitT(s1_text2, { words: 1, chars: 1, spacing: 10 });
      const s2_text1 = this.el.nativeElement.querySelectorAll(".section2 .t")[0];
      const s2_text2 = this.el.nativeElement.querySelectorAll(".section2 .t")[1];
      this.splitTexts.s2_splitText1 = SplitT(s2_text1, { words: 1, chars: 1, spacing: 10 });
      this.splitTexts.s2_splitText2 = SplitT(s2_text2, { words: 1, chars: 1, spacing: 10 });
      const s2_text3 = this.el.nativeElement.querySelectorAll(".section2 .t2")[0];
      const s2_text4 = this.el.nativeElement.querySelectorAll(".section2 .t2")[1];
      this.splitTexts.s2_splitText3 = SplitT(s2_text3, { words: 1, chars: 1, spacing: 10 });
      this.splitTexts.s2_splitText4 = SplitT(s2_text4, { words: 1, chars: 1, spacing: 10 });
      const s2_text5 = this.el.nativeElement.querySelectorAll(".section2 .t3")[0];
      const s2_text6 = this.el.nativeElement.querySelectorAll(".section2 .t3")[1];
      this.splitTexts.s2_splitText5 = SplitT(s2_text5, { words: 1, chars: 1, spacing: 10 });
      this.splitTexts.s2_splitText6 = SplitT(s2_text6, { words: 1, chars: 1, spacing: 10 });
      const s2_text7 = this.el.nativeElement.querySelectorAll(".section2 .t4")[0];
      const s2_text8 = this.el.nativeElement.querySelectorAll(".section2 .t4")[1];
      this.splitTexts.s2_splitText7 = SplitT(s2_text7, { words: 1, chars: 1, spacing: 10 });
      this.splitTexts.s2_splitText8 = SplitT(s2_text8, { words: 1, chars: 1, spacing: 10 });
      const s5_text7 = this.el.nativeElement.querySelectorAll(".section5 .t5")[0];
      const s5_text8 = this.el.nativeElement.querySelectorAll(".section5 .t5")[1];
      this.splitTexts.s5_splitText7 = SplitT(s5_text7, { words: 1, chars: 1, spacing: 10 });
      this.splitTexts.s5_splitText8 = SplitT(s5_text8, { words: 1, chars: 1, spacing: 10 });
      this.initial = true;
    }
  }

  setupTL() {
    //SPLIT TEXTS

    this.tl = gsap.timeline();
    const tl = this.tl;
    tl.to(".section1 .btnwrap", { duration: 0.2, opacity: 0, ease: Power2.easeInOut });
    tl.set(".section1 .btnwrap", { "pointer-events": "none" });
    tl.set(".section1", { "pointer-events": "none" });
    if (!this.site.isMobile) {
      tl.to(this.splitTexts.s1_splitText1.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: -20, textShadow: "0px 0px 30px #000", stagger: { from: "random", ease: Power2.easeIn, amount: 0.6 } });
      tl.to(this.splitTexts.s1_splitText2.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: -20, textShadow: "0px 0px 30px #000", stagger: { from: "random", ease: Power2.easeIn, amount: 0.6 } }, "<");
    } else {
      tl.to(".section1 .t", { ease: Expo.easeIn, y: -50, opacity: 0, rotation: -2, textShadow: "0px 0px 10px #000", stagger: { from: "random", ease: Power2.easeOut, amount: 0.6 }, delay: 0 });
    }

    tl.from(".section2", {
      ease: Expo.easeOut,
      duration: 1.5,
      xPercent: 100,
      yPercent: 100,
      onStart: () => {
        this.section2Ref.updateSize();
      },
    });
    // tl.set(".section2 .bgsvg", { attr: { points: "0,100 0,100 0,100 100,0 100,0 100,100 0,100" } });
    tl.from(".section2 .bgsvg", { ease: "none", attr: { points: "0,100 0,100 100,100 100,100 100,100 100,100" } }, "<");

    tl.from(".section2 .circle", { ease: "none", strokeDashoffset: 1000 }, "<+0.6");
    tl.set(".section2 .mano-button", { opacity: 0, scale: 0.01, pointerEvents: "none" });
    tl.set(".section2 .me-button", { opacity: 0, scale: 0.01 });
    tl.to(".section2 .me-button", { opacity: 1, ease: Expo.easeInOut, scale: 1 }, "<+0.6");
    // tl.set(".section2 .me-button .eye", { ease: "none", scale: 0 }, "<+0.6");

    if (!this.site.isMobile) {
      tl.from(this.splitTexts.s2_splitText1.chars, { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { from: "random", ease: Power2.easeOut, amount: 0.6 } }, "<+0.2");
      tl.from(this.splitTexts.s2_splitText2.chars, { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { from: "random", ease: Power2.easeOut, amount: 0.6 } }, "<+0.5");
      tl.to(this.splitTexts.s2_splitText1.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: -20, textShadow: "0px 0px 30px #000", stagger: { from: "random", ease: Power2.easeOut, amount: 0.6 }, delay: 2 });
      tl.to(this.splitTexts.s2_splitText2.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: -20, textShadow: "0px 0px 30px #000", stagger: { from: "random", ease: Power2.easeOut, amount: 0.6 } }, "<");
    } else {
      tl.from(".section2 .t", { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 0, textShadow: "0px 0px 10px #000", stagger: { from: "random", ease: Power2.easeOut, amount: 0.6 } }, "<+0.7");
      tl.to(".section2 .t", { ease: Expo.easeIn, y: -50, opacity: 0, rotation: -20, textShadow: "0px 0px 10px #000", stagger: { from: "random", ease: Power2.easeOut, amount: 0.6 }, delay: 2 });
    }

    tl.set(".section2 .mano-button", { pointerEvents: "all" }, "<");
    tl.set(".section2 .me-button", { pointerEvents: "none" }, "<+2");
    tl.to(".section2 .bgsvg", { duration: 2, ease: Expo.easeInOut, attr: { points: "0,0 0,0 0,0 100,100 100,100 100,100 0,100" } }, "<-2");
    tl.to(".section2 .me-button", { duration: 2, ease: Expo.easeInOut, scale: 0, opacity: 0 }, "<");
    tl.to(".section2 .mano-button", { duration: 2, opacity: 1, ease: Expo.easeInOut, scale: 1 }, "<");

    // const controller = {
    //   el: gsap.utils.toArray(".section2 .circle"),
    //   radius: function (val) {
    //     if (arguments.length === 0) {
    //       return this.el[0].getAttribute("r");
    //     } else {
    //       this.el[0].setAttribute("r", val);
    //     }
    //   },
    // };
    // tl.to(controller, { duration: 2, ease: Expo.easeInOut, radius: 8 }, "<");
    // tl.to(".section2 .me-button", { duration: 2, ease: Expo.easeInOut, top: "58%" }, "<");
    // tl.to(".section2 .me-button .eye", { duration: 2, ease: Expo.easeInOut, opacity: 1 }, "<");
    // tl.to(".section2 .me-button .info", { duration: 2, ease: Expo.easeInOut, opacity: 0 }, "<");

    tl.to(
      this.section2Ref,
      {
        ease: Expo.easeInOut,
        circleSize: 13,
        duration: 2,
        onUpdate: () => {
          this.section2Ref.updateSize();
        },
      },
      "<"
    );

    if (!this.site.isMobile) {
      tl.from(this.splitTexts.s2_splitText3.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<+0.5");
      tl.from(this.splitTexts.s2_splitText4.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<");

      tl.to(this.splitTexts.s2_splitText3.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.9, from: "random", ease: Power2.easeOut }, delay: 1.4 });
      tl.to(this.splitTexts.s2_splitText4.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.9, from: "random", ease: Power2.easeOut } }, "<");
    } else {
      tl.from(".section2 .t2", { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 0, textShadow: "0px 0px 10px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<+0.9");
      tl.to(".section2 .t2", { ease: Expo.easeIn, y: -50, opacity: 0, rotation: -20, textShadow: "0px 0px 10px #000", stagger: { amount: 0.9, from: "random", ease: Power2.easeOut }, delay: 1 });
    }
    tl.to(".section2 .mano-button", { duration: 2, opacity: 0, ease: Expo.easeInOut, scale: 0 }, "<+0.2");
    tl.set(".section2 .mano-button", { pointerEvents: "none" }, "<+2");

    tl.to(".section2 .circle", { duration: 2, ease: "none", strokeDashoffset: 1000 }, "<-1.8");

    // tl.to(".section2 .me-button .eye", { duration: 1, opacity: 0 }, "<");

    tl.from(".section2 .dashcontent", { duration: 0.001, display: "none", stagger: { amount: 4 } }, "<-5");

    tl.set(".section2 .bgsvg", { attr: { points: "0,0 0,0 50,50 100,100 100,100 100,100 0,100" } });

    tl.to(".section2 .bgsvg", { duration: 1, attr: { points: "0,0 100,0 50,50 100,0 100,0 100,100 0,100" } });
    tl.to(this.section2Ref, {
      circleSize: this.site.isMobile ? 60 : 30,
      duration: 1,
      onUpdate: () => {
        this.section2Ref.updateSize();
      },
    });

    if (!this.site.isMobile) {
      tl.from(this.splitTexts.s2_splitText5.chars, { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<-1");
      tl.from(this.splitTexts.s2_splitText6.chars, { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<+0.5");
      tl.to(this.splitTexts.s2_splitText5.chars, { delay: 4.2, ease: Expo.easeIn, y: -50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<+0.2");
      tl.to(this.splitTexts.s2_splitText6.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<+0.5");

      tl.from(this.splitTexts.s2_splitText7.chars, { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<+0.2");
      tl.from(this.splitTexts.s2_splitText8.chars, { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<+0.5");
      tl.to(this.splitTexts.s2_splitText7.chars, { delay: 4, ease: Expo.easeIn, y: -50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<+0.2");
      tl.to(this.splitTexts.s2_splitText8.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: 20, textShadow: "0px 0px 30px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut } }, "<+0.5");
    } else {
      tl.from(".section2 .t3", { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 0, textShadow: "0px 0px 10px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut }, duration: 1.4 }, "<-1");
      tl.to(".section2 .t3", { ease: Expo.easeIn, y: -50, opacity: 0, rotation: -20, textShadow: "0px 0px 10px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut }, duration: 2, delay: 1.5 });
      tl.from(".section2 .t4", { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 0, textShadow: "0px 0px 10px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut }, duration: 1.4 }, "<+0.9");
      tl.to(".section2 .t4", { ease: Expo.easeIn, y: -50, opacity: 0, rotation: -20, textShadow: "0px 0px 10px #000", stagger: { amount: 0.6, from: "random", ease: Power2.easeOut }, duration: 2.9, delay: 2.5 });
    }

    tl.to(this.section2Ref, {
      circleSize: 0,
      duration: 1,
      onUpdate: () => {
        this.section2Ref.updateSize();
      },
    });
    tl.to(".section2 .masked", { fill: "#000000" }, "<");
    tl.from(".section3", { duration: 2, ease: Expo.easeOut, yPercent: 100 }, "<+0.5");
    tl.from(".section3 .apptitle", { duration: 2, ease: Expo.easeOut, y: 200 }, "<+0.5");
    tl.from(".section3 .custom-button ", { ease: Expo.easeOut, duration: 2, opacity: 0, y: 40 }, "<+2");
    tl.from(".section3prog .dashcontent", { duration: 0.001, display: "none", stagger: { amount: 4 } }, "<-1");

    tl.to(".section2", { opacity: 0 }, "<+2");

    tl.to(".section3", { ease: Expo.easeInOut, duration: 4, yPercent: -100 }, "<+6");

    tl.from(".section4", { ease: Expo.easeInOut, duration: 4, yPercent: 100 }, "<");
    tl.from(".section4 .apptitle", { duration: 4, ease: Expo.easeInOut, y: 400 }, "<");
    tl.from(".section4 .custom-button ", { ease: Expo.easeInOut, duration: 4, opacity: 0, y: 40 }, "<+2");

    tl.to(".section4", { delay: 2, duration: 4, ease: Expo.easeInOut, yPercent: -100 });

    if (!this.site.isMobile) {
      tl.from(this.splitTexts.s5_splitText7.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: 0, textShadow: "0px 0px 30px #000", stagger: { each: 0.03, from: "random", ease: Power2.easeOut }, duration: 10 }, "<+27");
      tl.from(this.splitTexts.s5_splitText8.chars, { ease: Expo.easeIn, y: -50, opacity: 0, rotation: 0, textShadow: "0px 0px 30px #000", stagger: { each: 0.03, from: "random", ease: Power2.easeOut }, duration: 10 }, "<+3");
    } else {
      tl.from(".section5 .t5", { ease: Expo.easeIn, y: 50, opacity: 0, rotation: 0, textShadow: "0px 0px 10px #000", stagger: { each: 0.03, from: "random", ease: Power2.easeOut }, duration: 15.33 }, "<+25");
    }

    tl.to(
      {},
      {
        duration: 0.1,
        onComplete: () => {
          this.atBottom = true;
          this.cd.detectChanges();
        },
      }
    );
    tl.set(" .section5 .custom-button", { "pointer-events": "all" });

    tl.from(".section5 .custom-button", { opacity: 0, duration: 4 }, "<-2");

    this.dur = tl.duration();
  }
  createTrigger() {
    this.trigger = ScrollTrigger.create({
      animation: this.tl,
      scroller: this.el.nativeElement,
      trigger: this.wrapperRef.nativeElement,
      pin: true,
      scrub: 1,
      anticipatePin: 3,
      pinType: "fixed",
      start: "top top",
      onUpdate: (a) => {
        this.progress = Math.floor(a.progress * 1000) / 1000;
        if (this.timelines) {
          const time = a.progress * this.tl.duration();
          Object.keys(this.timelines).forEach((key) => {
            const el: gsap.core.Animation = this.timelines[key];
            el.seek(time, false);
          });
        }
      },
      end: () => {
        return this.site.screen.h * 17;
      },
    });
  }

  ngAfterViewInit(): void {
    this.ts.onInited.subscribe((isInited) => {
      if (isInited) {
        this.setupThreeTimelines();
        this.tdur = this.timelines[Object.keys(this.timelines)[0]].duration();

        gsap.registerPlugin(ScrollTrigger);
        gsap.registerPlugin(ScrollToPlugin);

        gsap.defaults({ duration: 1, ease: "none" });

        this.el.nativeElement.scrollTop = 0;
        this.setupSplitTexts();
        this.setupTL();
        // console.log(this.tl.duration());

        this.ts.isFreeFlight.subscribe((isFreeflight) => {
          if (!isFreeflight && !this.trigger) {
            // this.trigger.enable();
            this.createTrigger();
          } else if (isFreeflight && this.trigger) {
            this.trigger.disable();
            this.trigger.kill();
            this.trigger = null;
            this.renderer.setStyle(this.el.nativeElement, "overflow", "hidden");

            // this.disposeTL();
          }
        });
      }
    });
  }

  setupThreeTimelines() {
    this.timelines = this.ts.anim.createTimeline();
    Object.keys(this.timelines).forEach((key) => {
      const el: gsap.core.Animation = this.timelines[key];
      el.pause();
    });
  }

  setFreeFlight() {
    this.ts.control.damping = 40;
  }
}
