import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListareaPage } from './listarea';

@NgModule({
  declarations: [
    ListareaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListareaPage),
  ],
})
export class ListareaPageModule {}
