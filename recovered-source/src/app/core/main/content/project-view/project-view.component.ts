import { NoopScrollStrategy } from "@angular/cdk/overlay";
import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DataService } from "src/app/shared/services/data.service";
import { GridGalleryProjectComponent } from "../grid-gallery/grid-gallery-project/grid-gallery-project.component";
import { GridGalleryProject } from "../grid-gallery/grid-gallery.interface";

// export interface Image {
//   src: string;
//   srcset: string;
//   sizes: string;
//   description: string;
//   data: {
//     width: number;
//     height: number;
//     type: string;
//   };
//   gifSrc?: string;
// }
@Component({
  selector: "app-project-view",
  templateUrl: "./project-view.component.html",
  styleUrls: ["./project-view.component.scss"],
})
export class ProjectViewComponent implements OnInit, OnDestroy {
  destroy: Subject<any> = new Subject();
  numOfImages = 30;
  @Input() projects: GridGalleryProject[];
  category;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, public dialogRef: MatDialogRef<any>, private data: DataService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {
    this.data.dataLoaded.subscribe((isLoaded) => {
      if (isLoaded) {
        this.category = this.data.projects.categories[dialogData.project];
        this.projects = this.data.projects.categories[dialogData.project].projects;
        this.init();
      }
    });
  }
  openProject(project: GridGalleryProject) {
    const queryParams: Params = { project: project ? encodeURIComponent(project.title) : null };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: "merge", // remove to replace all query params by provided
    });
  }

  init() {
    this.route.queryParams.pipe(takeUntil(this.destroy)).subscribe((params) => {
      const projectTitle = params["project"];

      if (projectTitle && this.projects) {
        const project = this.projects.find((proj) => {
          return encodeURIComponent(proj.title) === projectTitle;
        });
        if (project) {
          const dialogRef = this.dialog.open(GridGalleryProjectComponent, {
            maxWidth: "1200px",
            // height: "auto",
            width: "100%",
            maxHeight: "100%",
            data: project,
            backdropClass: "gallery-backdrop",
            panelClass: "gallery-panel",
            scrollStrategy: new NoopScrollStrategy(),
          });
          dialogRef.afterClosed().subscribe((params) => {
            this.openProject(null);
          });
        }
      }
    });
  }
  close() {
    this.dialogRef.close();
  }
  ngOnInit(): void {}
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
