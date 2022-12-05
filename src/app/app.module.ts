import { HttpCustomInterceptor } from './service/http-custom-interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginPageModule } from './core/login/login/login.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NuovapaginaPageModule } from './nuovapagina/nuovapagina.module';
import { FormsModule } from '@angular/forms';


const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: false,
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    AppRoutingModule,
    CommonModule,
    LoginPageModule,
    HttpClientModule,
    NuovapaginaPageModule,
    FormsModule
    ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCustomInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
