import { ColorManipulator } from "../../../../shared/utils/colormanipulator";
import { AbstractThreeManager } from "./abstract-three-manager";
import * as THREE from "three";
import { TweenMax, Expo } from "gsap/all";
import { LogAsset } from "./log-asset-manager";
import { BehaviorSubject, from, Subject } from "rxjs";
import gsap from "gsap/all";
import { takeUntil, takeWhile } from "rxjs/operators";
import { Vector3 } from "three";
export class LogAudio {
  sound: THREE.Audio;
  positionalSound: THREE.PositionalAudio;
  isInited = false;
  isLoaded: BehaviorSubject<any> = new BehaviorSubject(false);
  audioController;
  tempVol = 0;
  constructor(public src: string, public delay: number = 0, public volume: number = 1, public refDistance = 1, public refRolloff = 1, public isBgMusic = false) {}

  // createController() {
  //   this.audioController = {
  //     sound: this.sound,
  //     volume: function (val) {
  //       if (arguments.length === 0) {
  //         return this.sound.getVolume();
  //       } else {
  //         this.sound.setVolume(val);
  //       }
  //     },
  //   };
  // }
}

export class LogAudioManager extends AbstractThreeManager {
  audioLoader = new THREE.AudioLoader(this.ts.assets.loadingManager);
  audioChange: Subject<any> = new Subject();
  sounds = {
    electric: new LogAudio("assets/sounds/electric.mp3"),
    forest: new LogAudio("assets/sounds/forest.mp3"),
    wind: new LogAudio("assets/sounds/wind.mp3"),
    chimes: new LogAudio("assets/sounds/chimes.mp3"),
    night: new LogAudio("assets/sounds/night.mp3"),
    thunder: new LogAudio("assets/sounds/thunder2.mp3"),
    bgm: new LogAudio("assets/sounds/bg.mp3", 0, 1, 1, 1, true),
  };
  // bgm = new LogAudio("assets/sounds/bg.mp3");

  volumeChange: Subject<any> = new Subject();

  currentlyPlaying: LogAudio;
  nextUp: LogAudio;
  // onRender(clock: { elapsedTime: number; delta: number }) {
  //   console.log(this.ts.volumeController);
  // }
  masterVolume = 0;
  masterVolumeTempVol = 1;
  masterTween;

  bgmVolume = 0;
  bgmTween;

  create() {
    const handleMusicChange = () => {
      if (this.ts.isSoundOn.value && this.ts.isMusicOn.value) {
        if (this.bgmTween) {
          this.bgmTween.kill();
          this.bgmTween = null;
        }
        this.bgmTween = TweenMax.to(this, 2, {
          bgmVolume: 1,
          onUpdate: () => {
            this.ts.volumeChange.next();
          },
        });
      } else {
        if (this.bgmTween) {
          this.bgmTween.kill();
          this.bgmTween = null;
        }
        this.bgmTween = TweenMax.to(this, 1, {
          bgmVolume: 0,
          onUpdate: () => {
            this.ts.volumeChange.next();
          },
        });
      }
    };
    const handleSoundChange = () => {
      if (this.ts.isSoundOn.value && this.ts.isTempMuteOff.value) {
        if (this.masterTween) this.masterTween.kill();
        this.masterTween = TweenMax.to(this, 2, {
          masterVolume: 1,
          onUpdate: () => {
            this.ts.listener.setMasterVolume(this.masterVolume);
          },
        });
      } else {
        if (this.masterTween) this.masterTween.kill();
        // this.masterVolume = 0;
        // this.ts.listener.setMasterVolume(0);
        this.masterTween = TweenMax.to(this, 1, {
          masterVolume: 0,
          onUpdate: () => {
            this.ts.listener.setMasterVolume(this.masterVolume);
          },
        });
      }
      this.ts.volumeChange.next();
    };

    this.ts.isTempMuteOff.subscribe(() => {
      handleSoundChange();
    });
    this.ts.isSoundOn.subscribe(() => {
      handleMusicChange();
      handleSoundChange();
    });
    this.ts.isMusicOn.subscribe(() => {
      handleMusicChange();
    });

    this.preloadAll();
    // this.ts.camera.add(this.ts.listener);
    // this.initEnterAudio();
    this.ts.volumeChange.subscribe(() => {
      Object.keys(this.sounds).forEach((id) => {
        const audio: LogAudio = this.sounds[id];
        let vol: number = this.ts.volumeController[id];
        if (audio.isBgMusic) {
          vol = vol * this.bgmVolume;
        }
        if (!audio.isInited && vol > 0) {
          this.initAudio(id, audio);
        }
        // console.log(id, vol);
        if (audio.sound) {
          audio.sound.setVolume(vol * 0.5);
          if (vol === 0) {
            audio.sound.pause();
          } else if (!audio.sound.isPlaying) {
            audio.sound.play(audio.delay);
          }
        }
      });

      // console.log(this.ts.volumeController);
      // if (this.currentlyPlaying) {
      //   TweenMax.to(this.currentlyPlaying.audioController, 1, { volume: 0 });
      // }
      // const audio = this.sounds[soundId];
      // this.nextUp = audio;
      // if (soundId < 0) return this.fadeOutCurrent();
      // if (audio !== this.currentlyPlaying) this.audioChange.next();
      // this.playAudio(audio).then((params) => {
      //   console.log("PLAYING");
      //   if (audio !== this.currentlyPlaying) this.fadeOutCurrent();
      //   this.currentlyPlaying = audio;
      // });
    });
  }
  preloadAll() {
    Object.keys(this.sounds).forEach((id) => {
      const audio: LogAudio = this.sounds[id];
      if (!audio.isInited) {
        this.initAudio(id, audio);
      }
    });
  }

  // fadeOutCurrent() {
  //   if (this.currentlyPlaying) {
  //     const currentSound = this.currentlyPlaying.sound;
  //     TweenMax.to(this.currentlyPlaying.audioController, 1, {
  //       volume: 0,
  //       onComplete: () => {
  //         console.log("stopping", currentSound);

  //         currentSound.stop();
  //       },
  //     });
  //   }
  // }

  initAudio(id, audio: LogAudio) {
    if (!audio.isInited) {
      audio.isInited = true;
      audio.sound = new THREE.Audio(this.ts.listener);
      // audio.createController();
      this.loadAudio(audio).subscribe((asset: any) => {
        audio.isLoaded.next(true);
        audio.sound.setBuffer(asset);
        audio.sound.setLoop(true);
        const vol = id ? this.ts.volumeController[id] : this.bgmVolume;
        audio.sound.pause();
        audio.sound.setVolume(0);

        if (vol > 0) {
          audio.sound.play(audio.delay);
          TweenMax.to(audio, 5, {
            tempVol: vol,
            onUpdate: () => {
              audio.sound.setVolume(audio.tempVol);
            },
          });
        } else {
          audio.sound.pause();
        }

        // console.log("LOAD DONE");
        // if (this.nextUp === audio) {
        //   console.log("TWEENUP");
        //   TweenMax.to(audio.audioController, 1, { volume: 1 });
        //   audio.sound.play();
      });
    }
    // } else {
    //   audio.isLoaded.pipe(takeUntil(this.audioChange)).subscribe((isLoaded) => {
    //     if (isLoaded) {
    //       console.log("LOADED");
    //       audio.sound.play();
    //       TweenMax.to(audio.audioController, 1, { volume: 1 });
    //       resolve(true);
    //     }
    //   });
    // }
  }

  loadAudio(asset) {
    return from(
      new Promise((resolve, reject) => {
        this.audioLoader.load(
          asset.src,
          (buffer) => {
            resolve(buffer);
          },
          (progress) => {},
          (error) => {}
        );
      })
    );
  }
}
