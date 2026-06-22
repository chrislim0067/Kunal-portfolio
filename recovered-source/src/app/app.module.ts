import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injectable } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import * as Hammer from "hammerjs";
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { CoreModule } from "./core/core.module";
import { LoaderComponent } from "./loader/loader.component";
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ContactComponent } from "./contact/contact.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ReactiveFormsModule } from "@angular/forms";
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha";
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from "ngx-google-analytics";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";

@Injectable()
// export class MyHammerConfig extends HammerGestureConfig {
//   overrides = {
//     // override hammerjs default configuration
//     swipe: { direction: Hammer.DIRECTION_ALL },
//   } as any;
// }

@NgModule({
  declarations: [AppComponent, LoaderComponent, ContactComponent],
  imports: [
    BrowserModule,
    NgxGoogleAnalyticsModule.forRoot("G-7WH50KCDPS"),
    NgxGoogleAnalyticsRouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production, registrationStrategy: "registerImmediately" }),
  ],
  providers: [
    // {
    //   provide: HAMMER_GESTURE_CONFIG,
    //   useClass: MyHammerConfig,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
