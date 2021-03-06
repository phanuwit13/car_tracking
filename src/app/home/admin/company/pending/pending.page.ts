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
  public companyPending: Array<any> = [];
  public form_edit: FormGroup;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.getCompanyPending();
    this.form_edit = this.formBuilder.group({
      driver_id: ['', Validators.required],
      company_id: ['', Validators.required],
      company_name: ['', Validators.required],
      company_address: ['', Validators.required],
      company_phone: ['', Validators.required],
      driver_title: ['', Validators.required],
      password: ['', Validators.required],
      identification_id: ['', Validators.required],
      carcard_id: ['', Validators.required],
      driver_fname: ['', Validators.required],
      driver_lname: ['', Validators.required],
      status: ['', Validators.required],
    });
  }
  getCompanyPending = async () => {
    let formData = new FormData();
    formData.append('status', 'pending');
    formData.append('company_id', '');
    let httpRespone: any = await this.http.post('getcompanydata', formData);
    if (httpRespone.response.success) {
      this.companyPending = httpRespone.response.data;
    } else {
      this.companyPending = null;
    }
  };
  setCompanyEdit = (value, status) => {
    this.form_edit.controls['company_name'].setValue(value.company_name);
    this.form_edit.controls['company_address'].setValue(value.company_address);
    this.form_edit.controls['company_phone'].setValue(value.company_phone);
    this.form_edit.controls['driver_title'].setValue(value.driver_title);
    this.form_edit.controls['password'].setValue(value.password);
    this.form_edit.controls['driver_fname'].setValue(value.driver_fname);
    this.form_edit.controls['driver_lname'].setValue(value.driver_lname);
    this.form_edit.controls['status'].setValue(status);
    this.form_edit.controls['identification_id'].setValue(
      value.identification_id
    );
    this.form_edit.controls['carcard_id'].setValue(value.carcard_id);
    this.form_edit.controls['driver_id'].setValue(value.driver_id);
    this.form_edit.controls['company_id'].setValue(value.company_id);
  };

  onUpdate = async (item, status) => {
    let formData = new FormData();
    this.setCompanyEdit(item, status);
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
        let httpRespone: any = await this.http.post('updatecompany', formData);
        if (httpRespone.response.success) {
          Swal.fire(
            '??????????????????',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            this.getCompanyPending();
          });
        } else {
          Swal.fire('?????????????????????', httpRespone.response.message + ' !', 'error');
        }
      } else {
      }
    });
  };
}
