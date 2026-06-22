import { Component, OnInit } from "@angular/core";
import { SiteService } from "../shared/services/site.service";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
})
export class LoaderComponent implements OnInit {
  constructor(public site: SiteService) {}

  ngOnInit(): void {}
}
