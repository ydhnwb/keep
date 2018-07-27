import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartPage } from './part';

@NgModule({
  declarations: [
    PartPage,
  ],
  imports: [
    IonicPageModule.forChild(PartPage),
  ],
})
export class PartPageModule {}
