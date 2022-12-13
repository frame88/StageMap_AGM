/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Features } from '../models/IFeature';

export interface MapboxOutput {
  attribution: string;
  features: Features;
  query: [];
}

export interface Feature {
  place_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapBoxService {

  constructor(private http: HttpClient) { }

  search_word(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(url + query + '.json?types=address&access_token='
    + environment.mapbox.accessToken)
    .pipe(map((res: MapboxOutput) => {
      return res.features;
      //console.log(res); Risultati di ricerca
    }));
  }

}
