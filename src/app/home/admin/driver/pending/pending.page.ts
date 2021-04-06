import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-pending',
  templateUrl: './pending.page.html',
  styleUrls: ['./pending.page.scss'],
})
export class PendingPage implements OnInit {
  public driverPending: Array<any> = [];
  public form_edit: FormGroup;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.getDriverPending();
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
  }
  getDriverPending = async () => {
    let formData = new FormData();
    formData.append('status', 'pending');
    formData.append('company_id', '');
    let httpRespone: any = await this.http.post('getdriver', formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);

      this.driverPending = httpRespone.response.data;
    } else {
      this.driverPending = null;
    }
  };
  setCompanyEdit = (value, status) => {

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
    this.form_edit.controls['status_carcard_id'].setValue(value.status_carcard_id);
    this.form_edit.controls['driver_phone'].setValue(value.driver_phone);
  };

  onUpdate = async (item, status) => {
    if (this.http.checkEXD(this.form_edit.value.exd_carcard_id)) {
      this.form_edit.controls['status_carcard_id'].setValue(0);
    } else {
      this.form_edit.controls['status_carcard_id'].setValue(1);
    }
    let formData = new FormData();
    this.setCompanyEdit(item, status);
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
        let httpRespone: any = await this.http.post('updatedriver', formData);
        if (httpRespone.response.success) {
          Swal.fire(
            'สำเร็จ',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            this.getDriverPending();
          });
        } else {
          Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
        }
      } else {
      }
    });
  };
}
