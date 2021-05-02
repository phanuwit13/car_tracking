import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
  public driverExp: Array<any> = [];
  public driverApproved: Array<any> = [];
  public driverData: Array<any> = [];
  public driverPending: Array<any> = [];
  public companyApproved: Array<any> = [];
  public form_register: FormGroup;
  public form_edit: FormGroup;
  public status = ['approved', 'pending', 'reject'];
  public titleName = ['นาย', 'นาง', 'นางสาว'];
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}
  ionViewDidEnter() {
    this.getDriverApproved();
    this.getDriverPending();
    this.getDriverExp();
    this.getCompany();
  }
  ngOnInit() {
    this.getDriverApproved();
    this.getDriverPending();
    this.getDriverExp();
    this.getCompany();

    this.form_edit = this.formBuilder.group({
      driver_title: ['', Validators.required],
      password: ['', Validators.required],
      driver_fname: ['', Validators.required],
      driver_lname: ['', Validators.required],
      identification_id: ['', Validators.required],
      carcard_id: ['', Validators.required],
      type_driver: ['0', Validators.required],
      company_id: ['', Validators.required],
      exd_carcard_id: [this.http.getDate(), Validators.required],
      status_carcard_id: ['0', Validators.required],
      status: ['approved', Validators.required],
      driver_phone: ['', Validators.required],
      driver_id: ['', Validators.required],
    });
    this.form_register = this.formBuilder.group({
      driver_title: ['', Validators.required],
      password: ['', Validators.required],
      driver_fname: ['', Validators.required],
      driver_lname: ['', Validators.required],
      identification_id: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      carcard_id: ['', Validators.required],
      type_driver: ['0', Validators.required],
      company_id: ['', Validators.required],
      exd_carcard_id: [this.http.getDate(), Validators.required],
      status_carcard_id: ['0', Validators.required],
      status: ['approved', Validators.required],
      driver_phone: ['', Validators.required],
    });
  }
  searchArray(event) {
    const q = event.target.value;
    let data = this.driverData;
    data = data.filter(function (value) {
      return value.driver_fname.indexOf(q) !== -1 || value.driver_lname.indexOf(q) !== -1; // returns true or false
    });
    this.driverApproved = data;
  }
  getCompany = async () => {
    let formData = new FormData();
    formData.append('status', 'approved');
    formData.append('company_id', '');
    let httpRespone: any = await this.http.post('getcompanydata', formData);
    // console.log(httpRespon);
    if (httpRespone.response.success) {
      this.companyApproved = httpRespone.response.data;
    } else {
      this.companyApproved = null;
    }
  };
  getDriverApproved = async () => {
    let formData = new FormData();
    formData.append('status', 'approved');
    formData.append('company_id', '');
    let httpRespone: any = await this.http.post('getdriver', formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);

      this.driverApproved = httpRespone.response.data;
      this.driverData = httpRespone.response.data;
    } else {
      this.driverApproved = null;
    }
  };
  getDriverPending = async () => {
    let formData = new FormData();
    formData.append('status', 'pending');
    formData.append('company_id', '');
    let httpRespone: any = await this.http.post('getdriver', formData);
    if (httpRespone.response.success) {
      this.driverPending = httpRespone.response.data;
    } else {
      this.driverPending = null;
    }
  };
  getDriverExp = async () => {
    let formData = new FormData();
    formData.append('company_id', '');
    let httpRespone: any = await this.http.post('getloseexduser',formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);

      this.driverExp = httpRespone.response.data;
    } else {
      this.driverExp = null;
    }
  };
  setDriverEdit = (value) => {
    this.form_edit.controls['driver_title'].setValue(value.driver_title);
    this.form_edit.controls['password'].setValue(value.password);
    this.form_edit.controls['driver_fname'].setValue(value.driver_fname);
    this.form_edit.controls['driver_lname'].setValue(value.driver_lname);
    this.form_edit.controls['status'].setValue(value.status);
    this.form_edit.controls['identification_id'].setValue(
      value.identification_id
    );
    this.form_edit.controls['carcard_id'].setValue(value.carcard_id);
    this.form_edit.controls['driver_id'].setValue(value.driver_id);
    this.form_edit.controls['company_id'].setValue(value.company_id);
    this.form_edit.controls['exd_carcard_id'].setValue(value.exd_carcard_id);
    this.form_edit.controls['status_carcard_id'].setValue(
      value.status_carcard_id
    );
    this.form_edit.controls['driver_phone'].setValue(value.driver_phone);
  };
  onUpdate = async () => {
    if (this.http.checkEXD(this.form_edit.value.exd_carcard_id)) {
      this.form_edit.controls['status_carcard_id'].setValue(0);
    } else {
      this.form_edit.controls['status_carcard_id'].setValue(1);
    }
    let formData = new FormData();
    Object.keys(this.form_edit.value).forEach((key) => {
      formData.append(key, this.form_edit.controls[key].value);
    });
    formData.forEach((value, key) => {
      console.log(key + ' : ' + value);
    });
    let httpRespone: any = await this.http.post('updatedriver', formData);
    if (httpRespone.response.success) {
      Swal.fire('สำเร็จ', httpRespone.response.message + ' !', 'success').then(
        () => {
          document.getElementById('closeModal').click();
          this.getDriverApproved();
          this.getDriverPending();
          this.getDriverExp();
        }
      );
    } else {
      Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
    }
  };
  onRegister = async () => {
    if (
      this.form_register.value.password !==
      this.form_register.value.confirmPassword
    ) {
      return Swal.fire('ผิดพลาด', 'รหัสผ่านไม่ตรงกัน !', 'error');
    } else {
      let formData = new FormData();
      Object.keys(this.form_register.value).forEach((key) => {
        formData.append(key, this.form_register.controls[key].value);
      });
      formData.forEach((value, key) => {
        console.log(key + ' : ' + value);
      });
      let httpRespone: any = await this.http.post('registeruser', formData);
      console.log(httpRespone);
      if (httpRespone.response.success) {
        Swal.fire(
          'สำเร็จ',
          httpRespone.response.message + ' !',
          'success'
        ).then(() => {
          this.resetForm();
          document.getElementById('closeModal2').click();
          this.getDriverApproved();
          this.getDriverPending();
          this.getDriverExp();
        });
      } else {
        Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
      }
    }
  };
  deleteUser = (id) => {
    let formData = new FormData();
    Swal.fire({
      title: 'ยืนยัน?',
      icon: 'warning',
      text: 'ข้อมูลพนักงานขับรถจะหายไป!',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `ยืนยัน`,
      denyButtonText: `ยกเลิก`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        formData.append('driver_id', id);
        let httpRespone: any = await this.http.post('deleteuser', formData);
        if (httpRespone.response.success) {
          Swal.fire(
            'สำเร็จ',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            this.getDriverApproved();
            this.getDriverPending();
            this.getDriverExp();
          });
        } else {
          Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
        }
      } else {
      }
    });
  };
  resetForm = () => {
    this.form_register.controls['driver_title'].setValue('');
    this.form_register.controls['password'].setValue('');
    this.form_register.controls['driver_fname'].setValue('');
    this.form_register.controls['driver_lname'].setValue('');
    this.form_register.controls['status'].setValue('approved');
    this.form_register.controls['identification_id'].setValue('');
    this.form_register.controls['confirmPassword'].setValue('');
    this.form_register.controls['carcard_id'].setValue('');
    this.form_register.controls['type_driver'].setValue('0');
    this.form_register.controls['company_id'].setValue('');
    this.form_register.controls['exd_carcard_id'].setValue('');
    this.form_register.controls['driver_phone'].setValue('');
    this.form_register.controls['status_carcard_id'].setValue(0);
  };
}
