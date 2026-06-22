import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DataService } from "src/app/shared/services/data.service";

@Component({
  selector: "app-section4",
  templateUrl: "./section4.component.html",
  styleUrls: ["./section4.component.scss"],
})
export class Section4Component implements OnInit {
  constructor(public data: DataService, private dialog: MatDialog, private router: Router) {}
  open() {
    this.router.navigate(["design-and-dev"]);
  }
  ngOnInit(): void {}
}
