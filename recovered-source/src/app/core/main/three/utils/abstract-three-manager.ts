import * as THREE from "three";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ThreeService } from "../three.service";
import { AreaManager } from "./log-area-manager";
import { SiteService } from "src/app/shared/services/site.service";

export class AbstractThreeManager {
  ngUnsubscribe: Subject<null> = new Subject();

  constructor(public ts: ThreeService, public am: AreaManager = null) {
    this.ts.onRender.pipe(takeUntil(this.ngUnsubscribe)).subscribe((clock) => {
      this.onRender(clock);
    });

    this.ts.onResize.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onResize(params);
    });
    this.ts.onSkyUpdate.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onSkyUpdate(params);
    });
    this.ts.onEffectsUpdate.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onEffectsUpdate(params);
    });
    this.ts.onAssetLoaded.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onAssetLoaded(params);
    });
    this.ts.contextLost.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onContextLost();
    });
    this.ts.contextRestored.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.onContextRestored();
    });
  }

  create() {}
  onAssetLoaded(asset) {}
  onRender(clock: { elapsedTime: number; delta: number }) {}
  onResize(size: { width: number; height: number }) {}
  onSkyUpdate(params) {}
  onEffectsUpdate(params) {}
  onContextLost() {}
  onContextRestored() {}

  destroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
