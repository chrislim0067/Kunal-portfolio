import { AfterViewInit, ChangeDetectorRef, HostListener, OnDestroy } from "@angular/core";
import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GridGalleryProject } from "../grid-gallery.interface";

@Component({
  selector: "app-grid-gallery-project",
  templateUrl: "./grid-gallery-project.component.html",
  styleUrls: ["./grid-gallery-project.component.scss"],
})
export class GridGalleryProjectComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("imagesRef", { static: true }) imagesRef: ElementRef<any>;

  width;
  heights: number[] = [];
  timeouts = [];
  @HostListener("window:resize") resize() {
    this.updateSize();
  }
  @HostListener("click") click() {
    this.close();
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: GridGalleryProject, private el: ElementRef, public dialogRef: MatDialogRef<any>, private cd: ChangeDetectorRef) {}
  calculateHeights() {
    for (let index = 0; index < this.data.images.length; index++) {
      const img: { width: number; height: number } = this.data.images[index].data;
      this.heights[index] = (this.imagesRef.nativeElement.offsetWidth / img.width) * img.height;
      this.heights[index] = this.heights[index] > img.height ? img.height : this.heights[index];
      // if (this.heights[index] > img.height) this.heights[index] = img.height;
    }

    // console.log(this.height);
    // this.renderer.setStyle(this.el.nativeElement, "height", this.height + "px");
  }

  updateSize() {
    this.width = this.imagesRef.nativeElement.offsetWidth;
    this.calculateHeights();
  }
  ngAfterViewInit() {
    this.updateSize();
    this.cd.detectChanges();
    this.timeouts.push(
      setTimeout((params) => {
        this.updateSize();
      }, 50)
    );
    this.timeouts.push(
      setTimeout((params) => {
        this.updateSize();
      }, 500)
    );
  }
  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.timeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
  }
}
