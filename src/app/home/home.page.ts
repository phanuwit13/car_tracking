import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public map: any;
  public direction = 0;
  public timeCheck = true
  public infoWindow = new google.maps.InfoWindow();
  public carInfo = new google.maps.InfoWindow();
  public userData: Array<any> = [];
  public marker: any;
  public loading: any;
  public roueName: Array<any> = [];
  public getRouteCompanyData: Array<any> = [];
  public carMarkDisplay: any = [];
  public route_id: any = '001';
  public carShow: any = [];
  public timeTable: Array<any> = [];
  public myLocation: any = { lat: 14.9736915, lng: 102.0827157 };
  public showAlert: boolean = false;
  public directionsService = new google.maps.DirectionsService();
  public distanceMatrixService = new google.maps.DistanceMatrixService();
  public directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
  });
  public testpoint: Array<any> = [];
  public flightPath = new google.maps.Polyline({
    path: this.testpoint,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 1,
  });
  // public carLocation: any = [
  //   ['กว 2343 นครราชสีมา', 13.784122, 100.481522],
  //   ['กข 2122 นครราชสีมา', 13.783122, 100.489522],
  // ];
  public carLocation: any = [];
  public carDistance: any = [];
  public test = [1, 2, 3, 4];
  public carMark: any;
  constructor(
    private http: HttpService,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation
  ) {}
  ionViewDidEnter() {
    this.checkEXD();
    this.getRoute('001');
    this.getCarRoundShow('001')
    this.getRouteName();
  }
  ngOnInit() {
    this.checkEXD();
    this.loadmap();
    this.getRoute('001');
    this.getCarRoundShow('001')
    this.getRouteName();
    this.run();
  }
  loadCar() {
    let i = 0;
    this.carMarkDisplay = [];
    // console.log(this.carLocation);

    for (i; i < this.carLocation.length; i++) {
      this.carMark = new google.maps.Marker({
        position: new google.maps.LatLng(
          this.carLocation[i][1],
          this.carLocation[i][2]
        ),
        map: this.map,
        icon: 'assets/icon/car2.png',
      });

      (function (marker, i, location) {
        google.maps.event.addListener(marker, 'click', function () {
          let carInfo = new google.maps.InfoWindow({
            content: location[i][0],
          });
          carInfo.open(this.map, marker);
        });
      })(this.carMark, i, this.carLocation);
      this.carMarkDisplay.push(this.carMark);
    }
  }
  async loadmap() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await this.loading.present();

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: { lat: 14.9736915, lng: 102.0827157 },
    });
    this.directionsRenderer.setMap(this.map);
    // console.log(this.testpoint[0].lat);
    this.marker = await new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: { lat: 14.9736915, lng: 102.0827157 },
      icon: 'assets/icon/person.png',
    });
    // this.loadCar();
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
              strokeOpacity: 0.8,
              strokeWeight: 5,
            },
          });
          directionsRenderer.setDirections(response);
          if (this.direction == 0) {
            directionsRenderer.setOptions({
              polylineOptions: {
                strokeColor: 'blue',
                strokeOpacity: 0.8,
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
  checkEXD = async () => {
    let httpRespone: any = await this.http.get('getexduser');
    if (httpRespone.response.success) {
      // console.log(httpRespone.response.data);
      this.userData = httpRespone.response.data;
    } else {
      this.userData = null;
    }
    if (this.userData) {
      this.userData.forEach(async (item) => {
        let formData = new FormData();
        formData.append('status_carcard_id', '1');
        formData.append('driver_id', item.driver_id);
        if (this.http.checkEXD(item.exd_carcard_id) === false) {
          let httpRespone: any = await this.http.post(
            'updatestatuscarcardid',
            formData
          );
          // console.log(httpRespone);
        }
      });
    }
  };
  checkUser = async () => {
    let type = await this.http.localStorage.get('user');
    // console.log(type);

    if (type) {
      if (type.type_driver === 2) {
        this.http.navRouter('/home/admin');
      } else if (type.type_driver === 1) {
        this.http.navRouter('/home/company');
      } else if (type.type_driver === 0) {
        this.http.navRouter('/home/driver');
      }
    } else {
      this.http.navRouter('/home/login');
    }
  };
  // getLocation = async () => {
  //   this.loading = await this.loadingCtrl.create({
  //     message: 'Please wait...',
  //   });
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position: any) => {
  //         const pos = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         this.myLocation = pos;
  //         // this.infoWindow.setPosition(pos);
  //         // this.infoWindow.setContent("ตำแหน่งของคุณ");
  //         //this.infoWindow.open(this.map);
  //         this.map.setCenter(pos);
  //         this.loading.dismiss();
  //         this.marker.setPosition(pos);
  //       },
  //       () => {
  //         //this.handleLocationError(true, infoWindow, map.getCenter()!);
  //       }
  //     );
  //   } else {
  //     // Browser doesn't support Geolocation
  //     // handleLocationError(false, infoWindow, map.getCenter()!);
  //   }
  // };
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
  getCarRoundShow = async (route_id) => {
    let formData = new FormData();
    formData.append('route_id', route_id);
    let httpRespone: any = await this.http.post('getcarroundshow', formData);
    console.log(httpRespone.response);
    if (httpRespone.response.success) {
      this.timeTable = httpRespone.response.data
    } else {
      this.timeTable = []
    }
  };
  getCarEnable = async (route_id) => {
    let formData = new FormData();
    formData.append('route_id', route_id);
    let data = [];
    this.carDistance = [];
    let httpRespone: any = await this.http.post('getcarenable', formData);
    if (httpRespone.response.success) {
      this.carShow = httpRespone.response.data;
      // console.log(httpRespone.response.data);
      httpRespone.response.data.map((value) => {
        this.carDistance.push({
          lat: parseFloat(value.lat),
          lng: parseFloat(value.lng),
        });
        data.push([
          value.car_number + ' ' + value.provinces,
          parseFloat(value.lat),
          parseFloat(value.lng),
        ]);
      });

      //console.log(this.carLocation);
    } else {
      this.carShow = [];
      this.carDistance = [];
      // console.log(httpRespone.response.message);
    }
    return data;
  };
  setDirection(value) {
    this.direction = value.detail.value;
    this.getRoute(this.route_id);
  }
  getRouteName = async () => {
    let formData = new FormData();
    formData.append('route_company_id', '');
    let httpRespone: any = await this.http.post('getrouteselect', formData);
    // console.log(httpRespone);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);
      this.roueName = httpRespone.response.data;
      this.roueName.sort(function(a, b) {
        // Compare the 2 dates
        if (parseInt( a.route_number) < parseInt(b.route_number)) return -1;
        if (parseInt(a.route_number) > parseInt(b.route_number)) return 1;
        return 0;
      });
    } else {
      this.roueName = null;
    }
  };
  // getRouteCompany = async () => {
  //   let httpRespone: any = await this.http.post('getroutecompany');
  //   let com = { route_company_id: '', route_number: 'กรุณาเลือก' };
  //   console.log(httpRespone.response);
  //   if (httpRespone.response.success) {
  //     this.getRouteCompanyData = httpRespone.response.data;
  //     this.getRouteCompanyData.unshift(com);
  //   } else {
  //     this.getRouteCompanyData = [];
  //   }
  // };
  run() {
    setInterval(async () => {
      this.carLocation = await this.getCarEnable(this.route_id);
      this.DeleteMarkers();
      // this.loadCar();
      if (this.carLocation.length > 0) {
        this.loadCar();
        // console.log(this.carDistance);

        this.calculateDistance(this.myLocation, this.carDistance);
        // console.log('โหลด');
      }
    }, 2000);
  }
  DeleteMarkers() {
    //Loop through all the markers and remove
    for (var i = 0; i < this.carMarkDisplay.length; i++) {
      this.carMarkDisplay[i].setMap(null);
    }
    this.carMarkDisplay = [];
  }
  setAlert() {
    this.showAlert = !this.showAlert;
    // console.log(this.showAlert);
  }
  calculateDistance(origin1, destination) {
    this.distanceMatrixService.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: destination,
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          // console.log(response.rows[0].elements);
          response.rows[0].elements.forEach((value) => {
            if (value.distance.value < 1000) this.showAlert = true
            else{
              // console.log('รอไปก่อน')
            }
          });
        }
      }
    );
  }
  async getMyLocation() {
    this.loading = await this.loadingCtrl.create({
      message: "Please wait...",
    });
    await this.loading.present();
    this.geolocation.getCurrentPosition().then(async (resp) => {
      const pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude,
      };
      this.myLocation = pos;
      this.map.setCenter(pos);
      this.loading.dismiss();
      this.marker.setPosition(pos);
      this.loading.dismiss();
    });
  }
}
