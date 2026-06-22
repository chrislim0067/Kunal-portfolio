import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { GoogleAnalyticsService } from "ngx-google-analytics";
import { ContactComponent } from "./contact/contact.component";
import { ThreeService } from "./core/main/three/three.service";
import { SiteService } from "./shared/services/site.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "soli";
  interactions = [];
  @HostListener("document:click") clicked() {
    if (this.soundOverlayVisible) {
      this.ga.event("sound_overlay_close", "sound_overlay", "Sound Overlay Close");
    }
    this.soundOverlayVisible = false;
  }
  freeflightSkip = false;
  soundOverlayVisible = false;
  returnClicked = false;
  menuOpen = false;
  // @ViewChild("audioRef", { static: false }) audioRef: ElementRef<HTMLAudioElement>;

  constructor(private dialog: MatDialog, public ts: ThreeService, public site: SiteService, public router: Router, private renderer: Renderer2, private ga: GoogleAnalyticsService) {
    console.log(`
    ██████▄▄▄█████▓▄▄▄    ▓██   ██▓                   
  ▒██    ▒▓  ██▒ ▓▒████▄   ▒██  ██▒                   
  ░ ▓██▄  ▒ ▓██░ ▒▒██  ▀█▄  ▒██ ██░                   
    ▒   ██░ ▓██▓ ░░██▄▄▄▄██ ░ ▐██▓░                   
  ▒██████▒▒ ▒██▒ ░ ▓█   ▓██▒░ ██▒▓░                   
  ▒ ▒▓▒ ▒ ░ ▒ ░░   ▒▒   ▓▒█░ ██▒▒▒                    
  ░ ░▒  ░ ░   ░     ▒   ▒▒ ▓██ ░▒░                    
  ░  ░  ░   ░       ░   ▒  ▒ ▒ ░░                     
        ░               ░  ░ ░                        
   ▄████▄  █    ██ ██▀███  ██▓▒█████  █    ██  ██████ 
  ▒██▀ ▀█  ██  ▓██▓██ ▒ ██▓██▒██▒  ██▒██  ▓██▒██    ▒ 
  ▒▓█    ▄▓██  ▒██▓██ ░▄█ ▒██▒██░  ██▓██  ▒██░ ▓██▄   
  ▒▓▓▄ ▄██▓▓█  ░██▒██▀▀█▄ ░██▒██   ██▓▓█  ░██░ ▒   ██▒
  ▒ ▓███▀ ▒▒█████▓░██▓ ▒██░██░ ████▓▒▒▒█████▓▒██████▒▒
  ░ ░▒ ▒  ░▒▓▒ ▒ ▒░ ▒▓ ░▒▓░▓ ░ ▒░▒░▒░░▒▓▒ ▒ ▒▒ ▒▓▒ ▒ ░
    ░  ▒  ░░▒░ ░ ░  ░▒ ░ ▒░▒ ░ ░ ▒ ▒░░░▒░ ░ ░░ ░▒  ░ ░
  ░        ░░░ ░ ░  ░░   ░ ▒ ░ ░ ░ ▒  ░░░ ░ ░░  ░  ░  
  ░ ░        ░       ░     ░     ░ ░    ░          ░  
  ░                                                   
  `);
  }
  // setupInteractions() {
  //   // this.interactions.push(this.renderer.listen(document.body, "mousemove", this.handleInteraction.bind(this)));
  //   this.interactions.push(this.renderer.listen(document.body, "wheel", this.handleInteraction.bind(this)));
  //   this.interactions.push(this.renderer.listen(document.body, "keydown", this.handleInteraction.bind(this)));
  //   this.interactions.push(this.renderer.listen(document.body, "click", this.handleInteraction.bind(this)));
  //   this.interactions.push(this.renderer.listen(document.body, "touchstart", this.handleInteraction.bind(this)));
  // }

  // handleInteraction() {
  //   if (this.audioRef) {
  //     this.audioRef.nativeElement.play();
  //     this.interactions.forEach((unlisten) => {
  //       unlisten();
  //     });
  //   }
  // }

  ngOnInit() {
    // this.setupInteractions();
    this.freeflightSkip = localStorage.getItem("freeflight") === "true";
  }

  toggleSoundOverlay() {
    this.soundOverlayVisible = !this.soundOverlayVisible;
    if (this.soundOverlayVisible) {
      this.ga.event("sound_overlay_open", "sound_overlay", "Sound Overlay Open");
    } else {
      this.ga.event("sound_overlay_close", "sound_overlay", "Sound Overlay Close");
    }
  }
  openMenu() {
    this.menuOpen = true;
  }
  closeMenu() {
    this.menuOpen = false;
  }
  openIllustration() {
    this.router.navigate(["/illustration"]);
    this.closeMenu();
  }
  openDev() {
    this.router.navigate(["/design-and-dev"]);
    this.closeMenu();
  }
  openContact() {
    const dialogRef = this.dialog.open(ContactComponent, {
      width: "600px",
      maxHeight: "100%",
      data: {},
      autoFocus: false,
      panelClass: "contact-modal",
    });
    this.closeMenu();
  }
  toggleSound() {
    this.ts.onFirstContact.next(true);
    this.ts.firstContact = true;
    this.ts.isSoundOn.next(!this.ts.isSoundOn.value);
    this.ts.isMusicOn.next(this.ts.isSoundOn.value);
    if (this.ts.isSoundOn.value) {
      this.ga.event("sound_overlay_allSoundsOn", "sound_overlay", "All sounds turned on with button");
    } else {
      this.ga.event("sound_overlay_allSoundsOff", "sound_overlay", "All sounds turned off with button");
    }
  }
  toggleMusic() {
    this.ts.isMusicOn.next(!this.ts.isMusicOn.value);
    if (this.ts.isMusicOn.value) {
      this.ts.isSoundOn.next(true);
      this.ga.event("sound_overlay_musicOn", "sound_overlay", "Music turned on with button");
    } else {
      this.ga.event("sound_overlay_musicOff", "sound_overlay", "Music turned off with button");
    }
  }
  openAbout() {
    this.router.navigate(["about"]);
    this.closeMenu();
  }

  freeFlightOff() {
    this.returnClicked = true;
    this.freeflightSkip = true;
    this.ga.event("button_click_return", "button_click", "Return button clicked");
    this.site.forcePreloader = true;
    setTimeout(() => {
      this.ts.stopFreeFlight();
      this.site.scrolledEl.scrollTop = 0;
      this.ts.anim.setState(0, true, 0);
      setTimeout((params) => {
        this.site.forcePreloader = false;
        this.returnClicked = false;
      }, 1000);
    }, 1000);
  }

  freeFlightOn() {
    this.ga.event("button_click_directfreeflight", "button_click", "Directly to Freeflight clicked");
    // this.site.forcePreloader = true;
    this.ts.startFreeFlight();
    this.ts.anim.setState(null, true, -1, this.ts.anim.stateOverrides[0]);
    // setTimeout(() => {
    //   this.site.scrolledEl.scrollTop = 0;
    //   setTimeout((params) => {
    //     this.site.forcePreloader = false;
    //   }, 1000);
    // }, 1000);
  }
}
