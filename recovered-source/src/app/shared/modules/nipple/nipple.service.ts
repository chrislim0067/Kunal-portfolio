import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NippleService {
  firstInteraction = new BehaviorSubject(false);
  userInteraction = new Subject();
  isActive = false;
  angle: { degree: number; radian: number } = { degree: 0, radian: 0 };
  force = 0;
  distance = 0;
  startX = 0;
  startY = 0;
  speed: { x: number; y: number } = { x: 0, y: 0 };
  constructor() {}
}
