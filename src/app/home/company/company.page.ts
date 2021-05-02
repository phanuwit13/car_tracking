import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  public company_id: any;
  public driverPending: Array<any> = [];
  public driverExp: Array<any> = [];
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}
  ionViewDidEnter() {
    this.company_id = this.http.localStorage.get('user').company_id;
    this.getDriverPending();
    this.getDriverExp(this.company_id)
  }
  ngOnInit() {
    this.company_id = this.http.localStorage.get('user').company_id;
    this.getDriverPending();
    this.getDriverExp(this.company_id)
  }
  getDriverPending = async () => {
    let formData = new FormData();
    formData.append('status', 'pending');
    formData.append('company_id', this.company_id);
    let httpRespone: any = await this.http.post('getdriver', formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);

      this.driverPending = httpRespone.response.data;
    } else {
      this.driverPending = [];
    }
  };
  getDriverExp = async (value) => {
    let formData = new FormData();
    formData.append('company_id', value);
    let httpRespone: any = await this.http.post('getloseexduser',formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);

      this.driverExp = httpRespone.response.data;
    } else {
      this.driverExp = [];
    }
  };
  Logout = () => {
    Swal.fire({
      title: 'ยืนยัน?',
      icon: 'warning',
      text: 'คุณต้องการออกจากระบบ!',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `ยืนยัน`,
      denyButtonText: `ยกเลิก`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.http.localStorage.clear();
        this.http.navRouter('/home');
      } else {
      }
    });
  };
}
