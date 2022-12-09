/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable quote-props */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Products } from '../models/IGetAll';
import { AuthService } from '../core/login/auth.service';

import { MapBoxService, Feature } from '../service/map-box.service';
@Component({
  selector: 'app-nuovapagina',
  templateUrl: './nuovapagina.page.html',
  styleUrls: ['./nuovapagina.page.scss'],
})
export class NuovapaginaPage {

  products: Products[] = [];
  lat = 41.9099856;
  lng = 12.4855817;
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
        .subscribe((features: Feature[]) => {
          this.addresses = features.map(feat => feat.place_name);
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

