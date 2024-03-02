import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps'
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  myForm = new FormGroup({
    name: new FormControl('')
  });

  constructor(private mapService: MapService){}

  latLong = { lat: 40.303076237904484, lng: -111.15625186242676 }

  center = this.latLong
  zoom = 10
  
  markerOptions: google.maps.MarkerOptions = {draggable: true};


  async myAdress(coordinates: { lat: number, lng: number }): Promise<any> {
    const {lat, lng} = coordinates
    const {results} = await this.mapService.geocode(lat, lng);

    this.myForm.get('name')?.setValue(results[0].formatted_address)
  }

  async getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
     navigator.geolocation.getCurrentPosition(resolve, reject);
    });
   }

  async locateMe() {
    try {
      if (navigator.geolocation) {
        const position = await this.getPosition();
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        await this.myAdress(this.center);
        // await navigator.geolocation.getCurrentPosition(async (position) => {
        //    this.center = {
        //      lat: position.coords.latitude,
        //      lng: position.coords.longitude,
        //     };
        //     await this.myAdress(this.center)
        //  });
       } else {
         console.log("La geolocalización no está disponible.");
       }
    } catch (error) {
      console.error('error:', error)
    }
  }

  async updateMarkerPosition(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      try {
        const latLng = event.latLng.toJSON()
        await this.myAdress(latLng)
        this.center = latLng;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
