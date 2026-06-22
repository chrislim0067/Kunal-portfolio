import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NippleComponent } from './nipple.component';

@NgModule({
  declarations: [NippleComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [NippleComponent]
})
export class NippleModule { }
