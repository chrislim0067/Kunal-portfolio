import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, HostListener, ViewChild, EventEmitter, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatGridList } from "@angular/material/grid-list";
import { GridGalleryProject } from "./grid-gallery.interface";
import { MatDialog } from "@angular/material/dialog";
import { GridGalleryProjectComponent } from "./grid-gallery-project/grid-gallery-project.component";
import { NoopScrollStrategy } from "@angular/cdk/overlay";
// import { Image } from "../image.model";

@Component({
  selector: "app-grid-gallery",
  templateUrl: "./grid-gallery.component.html",
  styleUrls: ["./grid-gallery.component.scss"],
})
export class GridGalleryComponent implements OnInit, OnDestroy {
  @Input() projects: any[];
  @Input() cols: number = 3;
  @Input("cols.xs") cols_xs: number = 2;
  @Input("cols.sm") cols_sm: number = 2;
  @Input("cols.md") cols_md: number = 3;
  @Input("cols.lg") cols_lg: number = 3;
  @Input("cols.xl") cols_xl: number = 3;
  @Input() rowHeight: number = 1;
  @Input() gutterSize: number = 10;
  @Output() openProject: EventEmitter<GridGalleryProject> = new EventEmitter();

  mediaWatcher: Subscription;

  @ViewChild("gridlistRef", { static: true }) gridlistRef: MatGridList;

  @HostListener("window:resize")
  onResize() {
    setTimeout(() => {});
  }

  constructor(private breakpointObserver: BreakpointObserver, private cd: ChangeDetectorRef, private dialog: MatDialog) {
    // private media: MediaObserver
  }
  // private media: MediaObserver
  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe((result) => {
      if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
        this.cols = this.cols_xs;
      }
      if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
        this.cols = this.cols_sm;
      }
      if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
        this.cols = this.cols_md;
      }
      if (this.breakpointObserver.isMatched(Breakpoints.Large)) {
        this.cols = this.cols_lg;
      }
      if (this.breakpointObserver.isMatched(Breakpoints.XLarge)) {
        this.cols = this.cols_xl;
      }
      this.cd.detectChanges();
      //  switch () {
      //    case value:
      //      break;
      //    default:
      //      break;
      //  }
      // if (result.matches) {
      //   console.log(result);
      //   // this.activateHandsetLayout();
      // }
    });
    // this.mediaWatcher = this.media.asObservable().subscribe((change: MediaChange[]) => {
    //   this.cols = this[`cols_${change[0].mqAlias}`];
    // });
  }
  clicked(project: GridGalleryProject) {
    // const dialogRef = this.dialog.open(GridGalleryProjectComponent, {
    //   maxWidth: "1200px",
    //   // height: "auto",
    //   maxHeight: "100vh",
    //   data: project,
    //   backdropClass: "gallery-backdrop",
    //   panelClass: "gallery-panel",
    //   scrollStrategy: new NoopScrollStrategy(),
    // });
    this.openProject.next(project);
  }
  ngOnDestroy(): void {
    if (this.mediaWatcher) {
      this.mediaWatcher.unsubscribe();
    }
  }
}
