import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
declare var require: any;
@Component({
  selector: 'app-car',
  templateUrl: './car.page.html',
  styleUrls: ['./car.page.scss'],
})
export class CarPage implements OnInit {
  public provinces: Array<any> = require('../../../../services/province/province.json');
  public carData: Array<any>;
  public carRaw: Array<any>;
  public companyApproved: Array<any> = [];
  public form_add: FormGroup;
  public form_edit: FormGroup;
  public company_id: any;
  public company_name: any;
  public route: any;
  public route_company_id: any;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.company_id = this.http.localStorage.get('user').company_id;
    this.getCar(this.company_id);
    this.getCompany(this.company_id);
    this.getCarRouteCompany(this.company_id);
    this.form_add = this.formBuilder.group({
      car_number: ['', Validators.required],
      provinces: ['', Validators.required],
      car_color: ['', Validators.required],
      car_brand: ['', Validators.required],
      car_detail: [''],
      route_id: ['', Validators.required],
      company_id: [this.company_id, Validators.required],
    });
    this.form_edit = this.formBuilder.group({
      car_id: ['', Validators.required],
      car_number: ['', Validators.required],
      provinces: ['', Validators.required],
      car_color: ['', Validators.required],
      car_brand: ['', Validators.required],
      car_detail: [''],
      route_id: ['', Validators.required],
      company_id: [this.company_id, Validators.required],
    });
  }
  searchArray(event) {
    const q = event.target.value;
    let data = this.carRaw;
    data = data.filter(function (value) {
      return (
        value.car_number.indexOf(q) !== -1 || value.provinces.indexOf(q) !== -1
      ); // returns true or false
    });
    this.carData = data;
  }
  getCarRouteCompany = async (value) => {
    this.getRoute(value);
  };
  getRoute = async (value) => {
    let formData = new FormData();
    formData.append('company_id', value);
    let httpRespone: any = await this.http.post('getrouteselection', formData);
    if (httpRespone.response.success) {
      this.route = httpRespone.response.data;
    } else {
      this.route = null;
    }
  };
  getCar = async (value) => {
    let formData = new FormData();
    formData.append('company_id', value);
    let httpRespone: any = await this.http.post('getcar', formData);
    if (httpRespone.response.success) {
      this.carData = httpRespone.response.data;
      this.carRaw = httpRespone.response.data;
    } else {
      this.carData = null;
    }
  };
  getCompany = async (value) => {
    let formData = new FormData();
    formData.append('status', 'approved');
    formData.append('company_id', value);
    let httpRespone: any = await this.http.post('getcompanydata', formData);
    if (httpRespone.response.success) {
      this.company_name = httpRespone.response.data[0].company_name;
    } else {
      this.company_name = null;
    }
  };
  deleteCar = (id) => {
    let formData = new FormData();
    Swal.fire({
      title: '???????????????????',
      icon: 'warning',
      text: '?????????????????????????????????????????????!',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `??????????????????`,
      denyButtonText: `??????????????????`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        formData.append('car_id', id);
        let httpRespone: any = await this.http.post('deletecar', formData);
        if (httpRespone.response.success) {
          Swal.fire(
            '??????????????????',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            this.getCar(this.company_id);
            this.getCompany(this.company_id);
          });
        } else {
          Swal.fire('?????????????????????', httpRespone.response.message + ' !', 'error');
        }
      } else {
      }
    });
  };
  onRegister = async () => {
    let formData = new FormData();
    Object.keys(this.form_add.value).forEach((key) => {
      formData.append(key, this.form_add.controls[key].value);
    });

    let httpRespone: any = await this.http.post('addcar', formData);

    if (httpRespone.response.success) {
      Swal.fire('??????????????????', httpRespone.response.message + ' !', 'success').then(
        () => {
          this.resetForm();
          document.getElementById('closeModal2').click();
          this.getCar(this.company_id);
          this.getCompany(this.company_id);
          this.getCarRouteCompany(this.company_id);
        }
      );
    } else {
      Swal.fire('?????????????????????', httpRespone.response.message + ' !', 'error');
    }
  };
  onUpdate = async () => {
    let formData = new FormData();
    Swal.fire({
      title: '???????????????????',
      icon: 'warning',
      text: '????????????????????????????????????????????????????????????????????????!',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `??????????????????`,
      denyButtonText: `??????????????????`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Object.keys(this.form_edit.value).forEach((key) => {
          formData.append(key, this.form_edit.controls[key].value);
        });
        let httpRespone: any = await this.http.post('updatecar', formData);
        if (httpRespone.response.success) {
          Swal.fire(
            '??????????????????',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            document.getElementById('closeModal1').click();
            this.getCar(this.company_id);
            this.getCompany(this.company_id);
            this.getCarRouteCompany(this.company_id);
          });
        } else {
          Swal.fire('?????????????????????', httpRespone.response.message + ' !', 'error');
        }
      } else {
      }
    });
  };
  resetForm = () => {
    this.form_add.controls['car_number'].setValue('');
    this.form_add.controls['provinces'].setValue('');
    this.form_add.controls['car_color'].setValue('');
    this.form_add.controls['car_brand'].setValue('');
    this.form_add.controls['car_detail'].setValue('');
    this.form_add.controls['company_id'].setValue(this.company_id);
    this.form_add.controls['route_id'].setValue('');
  };
  setDriverEdit = (value) => {
    this.form_edit.controls['car_id'].setValue(value.car_id);
    this.form_edit.controls['car_number'].setValue(value.car_number);
    this.form_edit.controls['provinces'].setValue(value.provinces);
    this.form_edit.controls['car_color'].setValue(value.car_color);
    this.form_edit.controls['car_brand'].setValue(value.car_brand);
    this.form_edit.controls['car_detail'].setValue(value.car_detail);
    this.form_edit.controls['company_id'].setValue(value.company_id);
    this.form_edit.controls['route_id'].setValue(value.route_id);
  };
}
