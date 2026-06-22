import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DataService } from "src/app/shared/services/data.service";

@Component({
  selector: "app-section3",
  templateUrl: "./section3.component.html",
  styleUrls: ["./section3.component.scss"],
})
export class Section3Component implements OnInit {
  // @ViewChild("lineRef", { static: true }) lineRef: ElementRef;
  projects;
  constructor(public data: DataService, private dialog: MatDialog, private router: Router) {}
  open() {
    this.router.navigate(["/illustration"]);
  }
  ngOnInit(): void {}
}
