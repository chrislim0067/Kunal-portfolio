import { Component, OnInit } from "@angular/core";
import { SiteService } from "src/app/shared/services/site.service";
import { ThreeService } from "../../../three/three.service";

@Component({
  selector: "app-scroll-indicator",
  templateUrl: "./scroll-indicator.component.html",
  styleUrls: ["./scroll-indicator.component.scss"],
})
export class ScrollIndicatorComponent implements OnInit {
  constructor(public ts: ThreeService, public site: SiteService) {}

  ngOnInit(): void {}
}
