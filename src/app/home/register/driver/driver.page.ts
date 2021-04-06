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
  public form_register: FormGroup;
  public titleName = ['นาย', 'นาง', 'นางสาว'];
  public companyApproved: Array<any> = [];
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit() {
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
      status: ['pending', Validators.required],
      driver_phone: ['', Validators.required],
    });
    this.getCompany();
    console.log();
  }
  getCompany = async () => {
    let formData = new FormData();
    formData.append('status', 'approved');
    let httpRespone: any = await this.http.post('getcompanydata', formData);
    // console.log(httpRespon);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);

      this.companyApproved = httpRespone.response.data;
    } else {
      this.companyApproved = null;
    }
  };
  onSubmit = async () => {
    if (this.http.checkEXD(this.form_register.value.exd_carcard_id)) {
      this.form_register.controls['status_carcard_id'].setValue(0);
    } else {
      this.form_register.controls['status_carcard_id'].setValue(1);
    }
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
          this.http.navRouter("/home/login");
          console.log(httpRespone.response.message);
        });
      } else {
        Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
      }
    }
  };
}