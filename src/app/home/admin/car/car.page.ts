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
  public route :Array<any>
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    //console.log(this.provinces)
    this.getCar('');
    this.getCompany();
    this.form_add = this.formBuilder.group({
      car_number: ['', Validators.required],
      provinces: ['', Validators.required],
      car_color: ['', Validators.required],
      car_brand: ['', Validators.required],
      car_detail: [''],
      route_id: ['', Validators.required],
      company_id: ['', Validators.required],
    });
    this.form_edit = this.formBuilder.group({
      car_id: ['', Validators.required],
      car_number: ['', Validators.required],
      provinces: ['', Validators.required],
      car_color: ['', Validators.required],
      car_brand: ['', Validators.required],
      car_detail: [''],
      route_id: ['', Validators.required],
      company_id: ['', Validators.required],
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
  getRoute = async (value) => {
    console.log(value);
    this.form_add.controls['route_id'].setValue('');
    let formData = new FormData();
    formData.append('company_id', value);
    let httpRespone: any = await this.http.post('getrouteselect', formData);
    console.log(httpRespone.response);
    if (httpRespone.response.success) {
      this.route = httpRespone.response.data;
    } else {
      this.route = null;
    }
  };
  getCar = async (value) => {
    console.log(value);

    let formData = new FormData();
    formData.append('company_id', value);
    let httpRespone: any = await this.http.post('getcar', formData);
    // console.log(httpRespon);
    if (httpRespone.response.success) {
      this.carData = httpRespone.response.data;
      this.carRaw = httpRespone.response.data;
    } else {
      this.carData = null;
    }
  };
  getCompany = async () => {
    let formData = new FormData();
    formData.append('status', 'approved');
    formData.append('company_id', '');
    let com = { company_id: '', company_name: 'กรุณาเลือก' };
    let httpRespone: any = await this.http.post('getcompanydata', formData);
    console.log(httpRespone.response.data);
    if (httpRespone.response.success) {
      this.companyApproved = httpRespone.response.data;
      this.companyApproved.unshift(com);
    } else {
      this.companyApproved = null;
    }
  };
  deleteCar = (id) => {
    let formData = new FormData();
    Swal.fire({
      title: 'ยืนยัน?',
      icon: 'warning',
      text: 'ข้อมูลรถจะหายไป!',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `ยืนยัน`,
      denyButtonText: `ยกเลิก`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        formData.append('car_id', id);
        let httpRespone: any = await this.http.post('deletecar', formData);
        if (httpRespone.response.success) {
          Swal.fire(
            'สำเร็จ',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            this.getCar('');
            this.getCompany();
          });
        } else {
          Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
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
    formData.forEach((value, key) => {
      console.log(key + ' : ' + value);
    });
    let httpRespone: any = await this.http.post('addcar', formData);
    console.log(httpRespone);
    if (httpRespone.response.success) {
      Swal.fire('สำเร็จ', httpRespone.response.message + ' !', 'success').then(
        () => {
          this.resetForm();
          document.getElementById('closeModal2').click();
          this.getCar('');
          this.getCompany();
        }
      );
    } else {
      Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
    }
  };
  onUpdate = async () => {
    let formData = new FormData();
    Swal.fire({
      title: 'ยืนยัน?',
      icon: 'warning',
      text: 'คุณต้องการยืนยันการกระทำ!',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `ยืนยัน`,
      denyButtonText: `ยกเลิก`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Object.keys(this.form_edit.value).forEach((key) => {
          formData.append(key, this.form_edit.controls[key].value);
        });
        formData.forEach((value, key) => {
          console.log(key + ' : ' + value);
        });
        let httpRespone: any = await this.http.post('updatecar', formData);
        if (httpRespone.response.success) {
          Swal.fire(
            'สำเร็จ',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            document.getElementById('closeModal1').click();
            this.getCar('');
            this.getCompany();
          });
        } else {
          Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
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
    this.form_add.controls['company_id'].setValue('');
    this.form_add.controls['route_id'].setValue('');
  };
  setDriverEdit = (value) => {
    this.getRoute(value.company_id)
    this.form_edit.controls['car_id'].setValue(value.car_id);
    this.form_edit.controls['car_number'].setValue(value.car_number);
    this.form_edit.controls['provinces'].setValue(value.provinces);
    this.form_edit.controls['car_color'].setValue(value.car_color);
    this.form_edit.controls['car_brand'].setValue(value.car_brand);
    this.form_edit.controls['car_detail'].setValue(value.car_detail);
    this.form_edit.controls['company_id'].setValue(value.company_id);
    this.form_edit.controls['route_id'].setValue(value.route_id);
  };
  clearRoute(){
    this.route =[]
  }
}
