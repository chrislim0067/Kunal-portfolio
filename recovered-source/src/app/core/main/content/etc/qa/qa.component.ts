import { Output } from "@angular/core";
import { ChangeDetectorRef, Component, EventEmitter, OnInit } from "@angular/core";
import { isNil } from "lodash-es";
export interface QAOption {
  a: string;
  r: string;
  e: any;
}
@Component({
  selector: "app-qa",
  templateUrl: "./qa.component.html",
  styleUrls: ["./qa.component.scss"],
})
export class QaComponent implements OnInit {
  currentQ: { q: string; options: QAOption[]; c: string[] };
  isTransitioning: boolean = false;
  @Output() resultEvent: EventEmitter<any> = new EventEmitter();
  qa: any = {
    0: {
      // q: "Do you want sound?",
      options: [
        { a: "Explore", r: "0a", c: ["big", "mb-3", "mb-md-0"], e: true },
        { a: "Explore without sound", r: "0b", c: ["small"], e: false },
      ],
    },

    "0a": {
      // q: "Good choice, thank you!",
    },

    // "0b": {
    //   q: "Are you sure?",
    //   options: [
    //     { a: "yes", r: "0a" },
    //     { a: "no", r: "1" },
    //   ],
    // },

    // "1": {
    //   q: "Are you really sure?",
    //   options: [
    //     { a: "yes", r: "0a" },
    //     { a: "no", r: "2" },
    //   ],
    // },

    // "2": {
    //   q: "Are you really sure?",
    //   options: [
    //     { a: "Yes", r: "0a" },
    //     { a: "I Don't want sounds!", r: "3" },
    //   ],
    // },

    // "3": {
    //   q: "Are you really really sure? I worked a lot on the sound, please",
    //   options: [
    //     { a: "Ok I reconsider", r: "0a" },
    //     { a: "Still no", r: "4" },
    //   ],
    // },

    // "4": {
    //   q: "Well sound is on anyways!!",
    //   options: [
    //     { a: "Ok", r: "0a" },
    //     { a: "Ok", r: "3" },
    //   ],
    // },
  };
  constructor(private cd: ChangeDetectorRef) {}

  clicked(option: QAOption) {
    this.isTransitioning = true;
    this.cd.detectChanges();

    if (!isNil(option.e)) {
      this.resultEvent.next(option.e);
    } else {
      setTimeout((params) => {
        this.currentQ = this.qa[option.r];
        this.isTransitioning = false;
        this.cd.detectChanges();
      }, 300);
    }
  }

  ngOnInit(): void {
    this.currentQ = this.qa[0];
  }
}
