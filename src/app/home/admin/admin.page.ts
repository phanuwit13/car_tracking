import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  public companyPending: Array<any> = [];
  public driverExp: Array<any> = [];
  public driverPending: Array<any> = [];
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}
  ionViewDidEnter() {
    this.getCompanyPending();
    this.getDriverPending();
    this.getDriverExp();
  }
  ngOnInit() {
    this.getCompanyPending();
    this.getDriverPending();
    this.getDriverExp();
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
  getDriverPending = async () => {
    let formData = new FormData();
    formData.append('status', 'pending');
    formData.append('company_id', '');
    let httpRespone: any = await this.http.post('getdriver', formData);
    if (httpRespone.response.success) {
      this.driverPending = httpRespone.response.data;
    } else {
      this.driverPending = [];
    }
  };
  getDriverExp = async () => {
    let formData = new FormData();
    formData.append('company_id', '');
    let httpRespone: any = await this.http.post('getloseexduser', formData);
    if (httpRespone.response.success) {
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
