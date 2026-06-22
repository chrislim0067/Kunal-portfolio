import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from "@angular/core";
import { GridGalleryProject } from "../grid-gallery.interface";
// import { Image } from "../../image.model";

@Component({
  selector: "app-grid-gallery-item",
  templateUrl: "./grid-gallery-item.component.html",
  styleUrls: ["./grid-gallery-item.component.scss"],
})
export class GridGalleryItemComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() project: GridGalleryProject;
  @Input() rowHeight: number = 1;
  @Input() gutterSize: number = 1;
  @ViewChild("img") img: ElementRef;

  

  public rows: number = 0;
  height = 0;
  timeout;
  loaded = false;
  constructor(private el: ElementRef, private renderer: Renderer2, private cd: ChangeDetectorRef) {}

  @HostListener("window:resize")
  onResize() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.calculateHeight();
      const img = this.project.prevImage ? this.project.prevImage : this.project.images[0];
      if (!img) return;

      this.rows = Math.floor(((this.el.nativeElement.offsetWidth / img.data.width) * img.data.height) / (this.rowHeight + this.gutterSize));
      // this.rows = Math.floor(this.img.nativeElement.offsetHeight / (this.rowHeight + this.gutterSize));
      this.cd.markForCheck();
      this.cd.detectChanges();
    });
  }
  onLoad() {
    this.loaded = true;
    this.onResize();
  }
  ngOnInit() {}
  ngAfterViewInit() {
    this.calculateHeight();
    this.onResize();
    this.cd.detectChanges();
  }

  calculateHeight() {
    const img = this.project.prevImage ? this.project.prevImage : this.project.images[0];
    if (!img) return;
    const w = img.data.width;
    const h = img.data.height;
    this.height = (this.el.nativeElement.offsetWidth / w) * h;
    // console.log(this.height);
    this.renderer.setStyle(this.el.nativeElement, "height", this.height + "px");
  }
  ngOnDestroy() {
    clearTimeout(this.timeout);
  }
}
