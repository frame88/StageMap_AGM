/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable quote-props */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { AuthService } from '../core/login/auth.service';

import { MapBoxService } from '../service/map-box.service';
import { Features } from '../models/IFeature';

import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-nuovapagina',
  templateUrl: './nuovapagina.page.html',
  styleUrls: ['./nuovapagina.page.scss'],
})
export class NuovapaginaPage {

  lat = 41.9011156;
  lng = 12.4855817;
  newlat;
  newlng;
  zoom = 12;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private mapboxService: MapBoxService
    ) {}

  addresses: string[] = [];
  selectedAddress = null;

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService
        .search_word(searchTerm)
        .subscribe((features: Features) => {
          //PARAMETRI PER SPOSTARE IL MARKER DOPO LA SCRITTURA NELLA SEARCHBAR
          //center[0] longitudine
          //center[1] latitudine
          this.newlng = features[0].center[0];
          this.newlat = features[0].center[1];
          this.lat =  this.newlat;
          this.lng = this.newlng;
          console.log('LNG: ', this.newlng, 'LAT: ', this.newlat);
          this.addresses = features.map(feat => feat.place_name);
          console.log(this.addresses);
        });
      } else {
        this.addresses = [];
      }
  }

  onSelect(address: string) {
    this.selectedAddress = address;
    this.addresses = [];
  }
}
