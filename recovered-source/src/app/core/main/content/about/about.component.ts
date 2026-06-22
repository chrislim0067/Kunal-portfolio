import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { GoogleAnalyticsService } from "ngx-google-analytics";

export interface Metric {
  value: string;
  label: string;
}

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {
  metrics: Metric[] = [
    { value: "10+", label: "Years Experience" },
    { value: "50+", label: "Projects Delivered" },
    { value: "AI", label: "Solutions Architect" },
    { value: "Lead", label: "Technical Team Leader" },
  ];

  highlights = ["Enterprise Architecture", "LLM & RAG Systems", "Cloud-Native Platforms"];

  constructor(public dialogRef: MatDialogRef<any>, private ga: GoogleAnalyticsService) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
}
