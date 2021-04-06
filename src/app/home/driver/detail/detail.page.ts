import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public driverApproved: Array<any> = [];
  public carData: Array<any> = [];
  public titleName = ['นาย', 'นาง', 'นางสาว'];
  public form_edit: FormGroup;
  public user: any;
  public isEdit: boolean = false;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.user = this.http.localStorage.get('user');
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
      exd_carcard_id: [this.http.getDate(), Validators.required],
      status_carcard_id: ['0', Validators.required],
      driver_fname: ['', Validators.required],
      driver_lname: ['', Validators.required],
      status: ['', Validators.required],
    });
    console.log(this.user.company_id);
    this.getDriverApproved();
    this.form_edit.disable();
  }
  getDriverApproved = async () => {
    let formData = new FormData();
    formData.append('status', 'approved');
    formData.append('driver_id', this.user.driver_id);
    let httpRespone: any = await this.http.post('getdriverone', formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);

      this.driverApproved = httpRespone.response.data;
      this.setCompanyEdit(httpRespone.response.data[0]);
    } else {
      this.driverApproved = [];
    }
  };
  setCompanyEdit = (value) => {
    console.log(value);
    this.form_edit.controls['company_name'].setValue(value.company_name);
    this.form_edit.controls['company_address'].setValue(value.company_address);
    this.form_edit.controls['company_phone'].setValue(value.company_phone);
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
  };
 
  disableFormEdit = (value) => {
    if (value == 'disable') {
      this.form_edit.disable();
      this.isEdit = false;
    } else {
      this.form_edit.enable();
      this.isEdit = true;
    }
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
    let httpRespone: any = await this.http.post('updatecompany', formData);
    if (httpRespone.response.success) {
      Swal.fire('สำเร็จ', httpRespone.response.message + ' !', 'success').then(
        () => {
          this.getDriverApproved();
          this.form_edit.disable();
          this.isEdit = false;
        }
      );
    } else {
      Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
    }
  };
}
