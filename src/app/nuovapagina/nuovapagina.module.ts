import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuovapaginaPageRoutingModule } from './nuovapagina-routing.module';

import { NuovapaginaPage } from './nuovapagina.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuovapaginaPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDMgwrW11u3Jyn9A-xWWukvPDMN8c33N_I'
    })
  ],
  declarations: [
    NuovapaginaPage,
  ]
})
export class NuovapaginaPageModule {}


