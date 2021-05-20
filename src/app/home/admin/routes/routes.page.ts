import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {
  public routeData: Array<any>;
  public routeRaw: Array<any>;
  public companyApproved: Array<any> = [];
  public getRouteCompanyData: Array<any> = [];
  public form_add: FormGroup;
  public form_edit: FormGroup;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}
  ionViewDidEnter() {
    this.getRoute('');
    this.getCompany();
  }
  ngOnInit() {
    this.getRoute('');
    this.getCompany();
    this.getRouteCompany();
  }
  getRoute = async (value) => {
    let formData = new FormData();
    formData.append('route_company_id', value);
    let httpRespone: any = await this.http.post('getrouteselect', formData);
    if (httpRespone.response.success) {
      this.routeData = httpRespone.response.data;
      this.routeRaw = httpRespone.response.data;
      this.routeData.sort(function (a, b) {
        // Compare the 2 dates
        if (parseInt(a.route_number) < parseInt(b.route_number)) return -1;
        if (parseInt(a.route_number) > parseInt(b.route_number)) return 1;
        return 0;
      });
      this.routeRaw.sort(function (a, b) {
        // Compare the 2 dates
        if (parseInt(a.route_number) < parseInt(b.route_number)) return -1;
        if (parseInt(a.route_number) > parseInt(b.route_number)) return 1;
        return 0;
      });
    } else {
      this.routeData = null;
    }
  };

  getRouteCompany = async () => {
    let httpRespone: any = await this.http.post('getroutecompany');
    let com = { route_company_id: '', route_number: 'กรุณาเลือก' };
    if (httpRespone.response.success) {
      this.getRouteCompanyData = httpRespone.response.data;
      this.getRouteCompanyData.sort(function (a, b) {
        // Compare the 2 dates
        if (parseInt(a.route_number) < parseInt(b.route_number)) return -1;
        if (parseInt(a.route_number) > parseInt(b.route_number)) return 1;
        return 0;
      });
      this.getRouteCompanyData.unshift(com);
    } else {
      this.getRouteCompanyData = [];
    }
  };
  searchArray(event) {
    const q = event.target.value;
    let data = this.routeRaw;
    data = data.filter(function (value) {
      return value.route_name.indexOf(q) !== -1; // returns true or false
    });
    this.routeData = data;
  }
  getCompany = async () => {
    let formData = new FormData();
    formData.append('status', 'approved');
    formData.append('company_id', '');
    let com = { company_id: '', company_name: 'กรุณาเลือก' };
    let httpRespone: any = await this.http.post('getcompanydata', formData);
    if (httpRespone.response.success) {
      this.companyApproved = httpRespone.response.data;
      this.companyApproved.unshift(com);
      
    } else {
      this.companyApproved = null;
    }
  };
  deleteRoute = (id) => {
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
        formData.append('route_id', id);
        let httpRespone: any = await this.http.post('deleteroute', formData);
        if (httpRespone.response.success) {
          Swal.fire(
            'สำเร็จ',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            this.getRoute('');
            this.getCompany();
          });
        } else {
          Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
        }
      } else {
      }
    });
  };
}
