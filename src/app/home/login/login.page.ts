import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public form_user: FormGroup;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form_user = this.formBuilder.group({
      identification_id: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    let formData = new FormData();

    Object.keys(this.form_user.value).forEach((key) => {
      formData.append(key, this.form_user.controls[key].value);
    });
    formData.forEach((value, key) => {
      console.log(key + ' : ' + value);
    });
    let httpRespone: any = await this.http.post('login', formData);
    console.log(httpRespone);
    if (httpRespone.response.success) {
      Swal.fire('สำเร็จ', httpRespone.response.message + ' !', 'success').then(
        () => {
          // console.log('bif')
          if (httpRespone.response.data.status === 'approved') {
            if (httpRespone.response.data.type_driver === 2) {
              this.http.localStorage.set('user', httpRespone.response.data);
              this.http.navRouter('/home/admin');
            } else if (httpRespone.response.data.type_driver === 1) {
              this.http.localStorage.set('user', httpRespone.response.data);
              this.http.navRouter('/home/company');
            } else if (httpRespone.response.data.type_driver === 0) {
              this.http.localStorage.set('user', httpRespone.response.data);
              this.http.navRouter('/home/driver');
            }
          } else if (httpRespone.response.data.status === 'pending') {
          } else {
          }

          // this.http.navRouter("/home/login/homeadmin");
          // console.log(httpRespone.response.message)
        }
      );
    } else {
      Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
    }
  }
}
