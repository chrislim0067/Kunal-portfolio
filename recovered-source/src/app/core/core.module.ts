import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// import { LayoutModule } from "@angular/cdk/layout";
// LayoutModule, ScrollingModule,
import { SharedModule } from "../shared/shared.module";
import { MainComponent } from "./main/main.component";
// import { ScrollingModule } from "@angular/cdk/scrolling";
import { ThreeComponent } from "./main/three/three.component";
import { NippleModule } from "../shared/modules/nipple/nipple.module";
import { CoreRoutingModule } from "./core-routing.module";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ContentComponent } from "./main/content/content.component";
import { ThreeService } from "./main/three/three.service";
import { Section2Component } from "./main/content/sections/section2/section2.component";
import { Section3Component } from "./main/content/sections/section3/section3.component";
import { Section4Component } from "./main/content/sections/section4/section4.component";
import { ProgressComponent } from "./main/content/progress/progress.component";
import { ScrollIndicatorComponent } from "./main/content/etc/scroll-indicator/scroll-indicator.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GridGalleryComponent } from "./main/content/grid-gallery/grid-gallery.component";
import { GridGalleryItemComponent } from "./main/content/grid-gallery/grid-gallery-item/grid-gallery-item.component";
// import { FlexLayoutModule } from "@angular/flex-layout";
import { MatGridListModule } from "@angular/material/grid-list";
import { GridGalleryProjectComponent } from "./main/content/grid-gallery/grid-gallery-project/grid-gallery-project.component";
import { PreloaderComponent } from "./main/content/grid-gallery/preloader/preloader.component";
import { Section5Component } from "./main/content/sections/section5/section5.component";
import { ProjectViewComponent } from "./main/content/project-view/project-view.component";
// import { NavdotsComponent } from "./main/content/etc/navdots/navdots.component";
import { AboutComponent } from "./main/content/about/about.component";
import { FlycontrolsComponent } from "./main/content/etc/flycontrols/flycontrols.component";
import { MoodselectorComponent } from "./main/content/etc/flycontrols/moodselector/moodselector.component";
import { QaComponent } from "./main/content/etc/qa/qa.component";
import { SlownoticeComponent } from "./main/content/slownotice/slownotice.component";
import { ManoComponent } from "./main/content/etc/mano/mano.component";
@NgModule({
  declarations: [
    MainComponent,
    ThreeComponent,
    ContentComponent,
    Section2Component,
    Section3Component,
    ProjectViewComponent,
    Section4Component,
    ProgressComponent,
    ScrollIndicatorComponent,
    GridGalleryComponent,
    GridGalleryItemComponent,
    GridGalleryProjectComponent,
    PreloaderComponent,
    Section5Component,
    // NavdotsComponent,
    AboutComponent,
    FlycontrolsComponent,
    MoodselectorComponent,
    QaComponent,
    SlownoticeComponent,
    ManoComponent,
  ],
  imports: [CommonModule, SharedModule, NippleModule, CoreRoutingModule, MatButtonModule, MatIconModule, MatDialogModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule, MatGridListModule],
  entryComponents: [],
  exports: [MainComponent],
  // providers: [ThreeService],
})
export class CoreModule {}
