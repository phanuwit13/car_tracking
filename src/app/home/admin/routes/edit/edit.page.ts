import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../../services/http.service';
import { Platform, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
declare var google;
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  public route_id;
  public loading: any;
  public form_edit: FormGroup;
  public companyApproved: any;
  getRouteCompanyData: Array<any> = [];
  public directionsService = new google.maps.DirectionsService();
  public directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: false,
    draggable: true,
  });
  public infoWindow = new google.maps.InfoWindow();
  public testpoint: Array<any> = [];
  public map: any;
  public marker: any;
  public flightPath = new google.maps.Polyline({
    path: this.testpoint,
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
    this.route_id = this.route.snapshot.paramMap.get('route_id');
    console.log(this.route_id);
    this.getRoute(this.route_id);
    this.getRouteEdit(this.route_id);
    this.loadmap();
    this.getRouteCompany();
    this.form_edit = this.formBuilder.group({
      route_name: ['', Validators.required],
      route_id: ['', Validators.required],
      // route_number: ['', Validators.required],
      route_price: ['', Validators.required],
      route_company_id: ['', Validators.required],
      position: ['', Validators.required],
    });
  }
  getRouteCompany = async () => {
    let httpRespone: any = await this.http.post('getroutecompany');
    console.log(httpRespone.response);
    if (httpRespone.response.success) {
      this.getRouteCompanyData = httpRespone.response.data;
    } else {
      this.getRouteCompanyData = [];
    }
  };
  // getCompany = async () => {
  //   let formData = new FormData();
  //   formData.append('status', 'approved');
  //   formData.append('company_id', '');
  //   let httpRespone: any = await this.http.post('getcompanydata', formData);
  //   console.log(httpRespone.response.data);
  //   if (httpRespone.response.success) {
  //     this.companyApproved = httpRespone.response.data;
  //   } else {
  //     this.companyApproved = null;
  //   }
  // };
  setDirection(value) {
    this.direction = value.detail.value;
    this.getRoute(this.route_id);
  }
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

    formData.forEach((value, key) => {
      console.log(key + ' : ' + value);
    });
    let httpRespone: any = await this.http.post('updateroute', formData);
    if (httpRespone.response.success) {
      Swal.fire('สำเร็จ', httpRespone.response.message + ' !', 'success').then(
        () => {
          this.http.navRouter('/home/admin/routes')
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

    this.map = new google.maps.Map(document.getElementById('map2'), {
      zoom: 16,
      center: { lat: 14.9736915, lng: 102.0827157 },
    });
    this.directionsRenderer.setMap(this.map);
    //console.log(this.testpoint[0].lat);
    // this.marker = await new google.maps.Marker({
    //   map: this.map,
    //   animation: google.maps.Animation.DROP,
    //   position: { lat: 14.9736915, lng: 102.0827157 },
    // });
    this.flightPath.setMap(this.map);

    this.loading.dismiss();
  }
  getRoute = async (route_id) => {
    let formData = new FormData();
    formData.append('route_id', route_id);
    formData.append('direction', this.direction.toString());
    let httpRespone: any = await this.http.post('getroute', formData);
    if (httpRespone.response.success) {
      // console.log(httpRespone.response.data);
      this.testpoint = httpRespone.response.data.map((value) => {
        return { lat: parseFloat(value.lat), lng: parseFloat(value.lng) };
      });
      this.calculateAndDisplayRoute(
        this.directionsService,
        this.directionsRenderer
      );
    } else {
      this.testpoint = [];
    }
  };
  getRouteEdit = async (route_id) => {
    let formData = new FormData();
    formData.append('route_id', route_id);
    let httpRespone: any = await this.http.post('getrouteedit', formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);
      this.setRouteEdit(httpRespone.response.data[0]);
    } else {
    }
  };
  setRouteEdit = (value) => {
    this.form_edit.controls['route_name'].setValue(value.route_name);
    this.form_edit.controls['route_id'].setValue(value.route_id);
    // this.form_edit.controls['route_number'].setValue(value.route_number);
    this.form_edit.controls['route_price'].setValue(value.route_price);
    this.form_edit.controls['route_company_id'].setValue(value.route_company_id);
  };
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

          // const route = response.routes[0];
          // const summaryPanel = document.getElementById(
          //   "directions-panel"
          // ) as HTMLElement;
          // summaryPanel.innerHTML = "";

          // // For each route, display summary information.
          // for (let i = 0; i < route.legs.length; i++) {
          //   const routeSegment = i + 1;
          //   summaryPanel.innerHTML +=
          //     "<b>Route Segment: " + routeSegment + "</b><br>";
          //   summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          //   summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
          //   summaryPanel.innerHTML += route.legs[i].distance!.text + "<br><br>";
          // }
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  };
}
