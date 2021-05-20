import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../../services/http.service';
import { Platform, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
declare var google;
@Component({
  selector: 'app-addgo',
  templateUrl: './addgo.page.html',
  styleUrls: ['./addgo.page.scss'],
})
export class AddgoPage implements OnInit {
  public route_id;
  public loading: any;
  public form_edit: FormGroup;
  public getRouteCompanyData: any;

  public directionsService = new google.maps.DirectionsService();
  public directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: false,
    draggable: true,
  });

  public infoWindow = new google.maps.InfoWindow();
  public testpoint: Array<any> = [
    { lat: 14.959040765156375, lng: 102.05514995434011 },
    { lat: 14.958320477238818, lng: 102.06597987178677 },
    { lat: 14.973431902486043, lng: 102.08167610877017 },
    { lat: 14.973057914358312, lng: 102.0964027919332 },
    { lat: 14.979758423342853, lng: 102.09761036418655 },
    { lat: 14.988855553579752, lng: 102.11683534866626 },
  ];
  public map: any;
  public marker: any;
  public flightPath = new google.maps.Polyline({
    path: [],
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 1,
  });
  public direction = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loadmap();
    this.getRouteCompany();
    this.calculateAndDisplayRoute(
      this.directionsService,
      this.directionsRenderer
    );
    this.form_edit = this.formBuilder.group({
      route_name: ['', Validators.required],
      route_price: ['', Validators.required],
      route_company_id: ['', Validators.required],
    });
  }

  getRouteCompany = async () => {
    let httpRespone: any = await this.http.post('getroutecompany');
    if (httpRespone.response.success) {
      this.getRouteCompanyData = httpRespone.response.data;
      this.getRouteCompanyData.sort(function (a, b) {
        // Compare the 2 dates
        if (parseInt(a.route_number) < parseInt(b.route_number)) return -1;
        if (parseInt(a.route_number) > parseInt(b.route_number)) return 1;
        return 0;
      });
    } else {
      this.getRouteCompanyData = [];
    }
  };
  submitDirection = async () => {
    let formData = new FormData();
    let waypoint = await this.computeTotalDistance(
      this.directionsRenderer.getDirections()!
    );
    Object.keys(this.form_edit.value).forEach((key) => {
      formData.append(key, this.form_edit.controls[key].value);
    });
    formData.append('direction', this.direction.toString());
    formData.append('position', JSON.stringify(waypoint));

    let httpRespone: any = await this.http.post('addroute', formData);
    if (httpRespone.response.success) {
      Swal.fire('สำเร็จ', httpRespone.response.message + ' !', 'success').then(
        () => {
          this.http.navRouter('/home/admin/routes');
        }
      );
    } else {
      Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
    }
  };

  computeTotalDistance(result: any) {
    let waypointLength = result.request.waypoints.length;
    let way = result.request.waypoints;
    let origin = result.request.origin;
    let destination = result.request.destination;
    let point = [];
    for (let i = 0; i < waypointLength; i++) {
      if (way[i].location.location != undefined) {
        point.push({
          lat: way[i].location.location.lat(),
          lng: way[i].location.location.lng(),
        });
      } else {
        point.push({ lat: way[i].location.lat(), lng: way[i].location.lng() });
      }
    }
    if (origin.location != undefined) {
      point.unshift({ lat: origin.location.lat(), lng: origin.location.lng() });
    } else {
      point.unshift({ lat: origin.lat(), lng: origin.lng() });
    }
    if (destination.location != undefined) {
      point.push({
        lat: destination.location.lat(),
        lng: destination.location.lng(),
      });
    } else {
      point.push({ lat: destination.lat(), lng: destination.lng() });
    }
    return point;
  }

  async loadmap() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await this.loading.present();

    this.map = new google.maps.Map(document.getElementById('gomap'), {
      zoom: 16,
      center: { lat: 14.9736915, lng: 102.0827157 },
    });
    this.directionsRenderer.setMap(this.map);
    this.flightPath.setMap(this.map);

    this.loading.dismiss();
  }
  calculateAndDisplayRoute = (
    directionsService: any,
    directionsRenderer: any
  ) => {
    const waypts = [];
    let n = this.testpoint.length;
    for (let i = 1; i < this.testpoint.length - 1; i++) {
      waypts.push({
        location: {
          lat: this.testpoint[i].lat,
          lng: this.testpoint[i].lng,
        },
        stopover: true,
      });
    }

    directionsService.route(
      {
        origin: { lat: this.testpoint[0].lat, lng: this.testpoint[0].lng },
        destination: {
          lat: this.testpoint[n - 1].lat,
          lng: this.testpoint[n - 1].lng,
        },
        waypoints: waypts,
        optimizeWaypoints: false,
        travelMode: 'WALKING',
      },
      (response, status) => {
        if (status === 'OK' && response) {
          this.infoWindow.setPosition({
            lat: this.testpoint[0].lat,
            lng: this.testpoint[0].lng,
          });
          this.infoWindow.setContent('จุดเริ่มต้น');
          this.infoWindow.open(this.map);
          directionsRenderer.setOptions({
            polylineOptions: {
              strokeColor: 'red',
              strokeOpacity: 0.5,
              strokeWeight: 5,
            },
          });
          directionsRenderer.setDirections(response);
          if (this.direction == 0) {
            directionsRenderer.setOptions({
              polylineOptions: {
                strokeColor: 'blue',
                strokeOpacity: 0.5,
                strokeWeight: 5,
              },
            });
            directionsRenderer.setDirections(response);
          }
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  };
}
