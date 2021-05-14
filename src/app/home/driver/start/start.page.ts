import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  public user: any;
  public carData: Array<any> = [];
  public carData2: Array<any> = [];
  public enable = true;
  public carShow: any = [];
  public carDrive: any = null;
  public loading: any;
  public latLocal: any;
  public lngLocal: any;
  public runLocation: any;
  public timeTable: Array<any> = [];
  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation
  ) {}

  ngOnInit() {
    this.user = this.http.localStorage.get('user');
    console.log(this.user.company_id);
    this.getCarSelect();
    this.getCarSelecter();
    this.getDriverEnable();
  }

  async getCarSelect() {
    let formData = new FormData();
    formData.append('company_id', this.user.company_id);
    let httpRespone: any = await this.http.post('carselectdrive', formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);
      this.carData = httpRespone.response.data;
      //this.setCompanyEdit(httpRespone.response.data[0]);
    } else {
      this.carData = [];
    }
  }
  async getCarSelecter() {
    let formData = new FormData();
    formData.append('company_id', this.user.company_id);
    let com = { car_id: '', car_number: 'กรุณาเลือก' , provinces:''};
    let httpRespone: any = await this.http.post('carselectdrive', formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);
      this.carData2 = httpRespone.response.data;
      this.carData2.unshift(com);
      //this.setCompanyEdit(httpRespone.response.data[0]);
    } else {
      this.carData2 = [];
    }
  }
  getCarRoundShow = async (value) => {
    let formData = new FormData();
    formData.append('car_id', value);
    let httpRespone: any = await this.http.post('getcarroundcar', formData);
    console.log(httpRespone.response);
    if (httpRespone.response.success) {
      this.timeTable = httpRespone.response.data
    } else {
      this.timeTable = []
    }
  };
  async getDriverEnable() {
    let formData = new FormData();
    formData.append('driver_id', this.user.driver_id);
    let httpRespone: any = await this.http.post('getdriverenable', formData);
    console.log(httpRespone.response);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);
      this.enable = httpRespone.response.success;
      //this.setCompanyEdit(httpRespone.response.data[0]);
      this.carShow = httpRespone.response.data[0];
      this.carDrive = httpRespone.response.data[0].car_id;
      this.getCarRoundShow(this.carDrive )
      console.log(this.carShow);
    } else {
      clearInterval(this.runLocation);
      this.enable = httpRespone.response.success;
    }
  }
  async setDriverEnable(value) {
    this.carDrive = value;
    let formData = new FormData();
    console.log(value);
    formData.append('driver_id', this.user.driver_id);
    formData.append('car_id', value);
    formData.forEach((value, key) => {
      console.log(key + ' : ' + value);
    });
    let httpRespone: any = await this.http.post('setdriverenable', formData);
    console.log(httpRespone.response.data);
    if (httpRespone.response.success) {
      document.getElementById('closeModal2').click();
      this.getDriverEnable();
      this.run();
      this.getCarSelect();
      this.carShow = this.carData.filter((value) => {
        return value.car_id == this.carDrive;
      });
      console.log(...this.carShow);
      //this.setCompanyEdit(httpRespone.response.data[0]);
    } else {
      this.getCarSelect();
    }
  }
  async setDriverDisable() {
    this.carDrive = null;
    let formData = new FormData();
    formData.append('driver_id', this.user.driver_id);
    formData.forEach((value, key) => {
      console.log(key + ' : ' + value);
    });
    let httpRespone: any = await this.http.post('setdriverdisable', formData);
    console.log(httpRespone.response.data);
    if (httpRespone.response.success) {
      document.getElementById('closeModal2').click();
      this.getDriverEnable();
      this.getCarSelect();
      clearInterval(this.runLocation);
      //this.setCompanyEdit(httpRespone.response.data[0]);
    } else {
      this.getCarSelect();
    }
  }
  run = () => {
    this.runLocation = setInterval(() => {
      this.getLocation();
      if (this.latLocal && this.lngLocal) {
        this.setPosition();
      }
     // console.log('sda');
    }, 1500);
  };

  async setPosition() {
    let formData = new FormData();
    formData.append('lat', this.latLocal);
    formData.append('lng', this.lngLocal);
    formData.append('car_id', this.carDrive);
    formData.forEach((value, key) => {
      console.log(key + ' : ' + value);
    });
    let httpRespone: any = await this.http.post('setposition', formData);
    console.log(httpRespone.response);
    if (httpRespone.response.success) {
      
    } else {
      // this.getCarSelect();
    }
  }
  getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log('ตำแหน่ง',pos);
        
        this.latLocal = position.coords.latitude;
        this.lngLocal = position.coords.longitude;
      });
    } else {
      console.log('error');
    }
  };
  // async getMyLocation() {
  //   this.geolocation.getCurrentPosition().then(async (resp) => {
  //     this.latLocal = resp.coords.latitude
  //       this.lngLocal = resp.coords.longitude;
  //   });
  // }
}
