import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-moodselector",
  templateUrl: "./moodselector.component.html",
  styleUrls: ["./moodselector.component.scss"],
})
export class MoodselectorComponent implements OnInit {
  options: any[] = [{ label: "Hazy morning" }, { label: "Early sunrise" }, { label: "Summer evening" }, { label: "Starry night" }, { label: "Rainy day" }, { label: "Velvet sky" }, { label: "Cotton candy" }, { label: "Winter night" }, { label: "Bright day" }, { label: "Pastel dreams" }, { label: "Midnight thunder" }, { label: "Warm days" }];

  @Output() moodChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  radioChange(e) {
    this.moodChange.next(e);
  }
}
