import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
import { DeviceDetectorService } from "ngx-device-detector";
import { debounceTime } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SiteService {
  screenSizeChange: Subject<{ w: number; h: number; aspect: number; orientation: string }> = new Subject();
  resize$: Subject<any> = new Subject();
  screen: { w: number; h: number; aspect: number; aspect2: number } = { w: 0, h: 0, aspect: 1, aspect2: 1 };

  scrollEvent: Subject<number> = new Subject();
  scrolledEl;
  forcePreloader = false;

  vpHeight = 0;
  vpWidth = 0;

  onInited: BehaviorSubject<boolean> = new BehaviorSubject(false);
  focus: BehaviorSubject<boolean> = new BehaviorSubject(false);

  isMobile = false;

  isDark = false;
  closestSnapIndex = 0;
  keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
  supportsPassive = false;
  wheelOpt: any = false;
  wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

  boundPreventDefault;
  boundPreventDefaultForScrollKeys;

  // browser = "";
  constructor(private dd: DeviceDetectorService, public router: Router) {
    if (this.dd.isDesktop()) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
    // this.browser = this.dd.browser;
    window.addEventListener("resize", () => {
      this.refreshScreenSize();
      this.resize$.next();
    });
    window.addEventListener("focus", () => {
      this.focus.next(true);
    });
    window.addEventListener("blur", () => {
      this.focus.next(false);
    });
    this.refreshScreenSize();

    this.resize$.pipe(debounceTime(100)).subscribe((params) => {
      this.refreshScreenSize();
    });
    this.resize$.pipe(debounceTime(500)).subscribe((params) => {
      this.refreshScreenSize();
    });
    this.resize$.pipe(debounceTime(1500)).subscribe((params) => {
      this.refreshScreenSize();
    });
    this.boundPreventDefault = this.preventDefault.bind(this);
    this.boundPreventDefaultForScrollKeys = this.preventDefaultForScrollKeys.bind(this);

    // modern Chrome requires { passive: false } when adding event
    try {
      window.addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", {
          get: () => {
            this.supportsPassive = true;
          },
        })
      );
    } catch (e) {}
    this.wheelOpt = this.supportsPassive ? { passive: false } : false;
    this.wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
    // this.epicFunction();
  }
  // epicFunction() {
  //   console.log("hello `Home` component");
  //   this.deviceInfo = this.deviceService.getDeviceInfo();
  //   const isMobile = this.deviceService.isMobile();
  //   const isTablet = this.deviceService.isTablet();
  //   const isDesktopDevice = this.deviceService.isDesktop();
  //   console.log(this.deviceInfo);
  //   console.log(isMobile); // returns if the device is a mobile device (android / iPhone / windows-phone etc)
  //   console.log(isTablet); // returns if the device us a tablet (iPad etc)
  //   console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
  // }

  refreshScreenSize() {
    this.screen.w = window.innerWidth;
    this.screen.h = window.innerHeight;
    this.screen.aspect = this.screen.h / this.screen.w;
    this.screen.aspect2 = this.screen.w / this.screen.h;
    this.screenSizeChange.next();
  }

  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36

  preventDefault(e) {
    e.preventDefault();
  }

  preventDefaultForScrollKeys(e) {
    if (this.keys[e.keyCode]) {
      this.preventDefault(e);
      return false;
    }
  }

  // call this to Disable
  disableScroll() {
    this.scrolledEl.addEventListener("DOMMouseScroll", this.boundPreventDefault, false); // older FF
    this.scrolledEl.addEventListener(this.wheelEvent, this.boundPreventDefault, this.wheelOpt); // modern desktop
    this.scrolledEl.addEventListener("touchmove", this.boundPreventDefault, this.wheelOpt); // mobile
    this.scrolledEl.addEventListener("keydown", this.boundPreventDefaultForScrollKeys, false);
  }

  // call this to Enable
  enableScroll() {
    this.scrolledEl.removeEventListener("DOMMouseScroll", this.boundPreventDefault, false);
    this.scrolledEl.removeEventListener(this.wheelEvent, this.boundPreventDefault, this.wheelOpt);
    this.scrolledEl.removeEventListener("touchmove", this.boundPreventDefault, this.wheelOpt);
    this.scrolledEl.removeEventListener("keydown", this.boundPreventDefaultForScrollKeys, false);
  }
}
