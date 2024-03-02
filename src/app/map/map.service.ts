import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  async geocode(lat: number, lng: number): Promise<any> {
    const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR-KEY`)
    return data
  }
}
