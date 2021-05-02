import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-number-route',
  templateUrl: './number-route.page.html',
  styleUrls: ['./number-route.page.scss'],
})
export class NumberRoutePage implements OnInit {
  routeData: Array<any> = [];
  companyApproved: Array<any> = [];
  companyEdit: Array<any> = [];
  public form_edit: FormGroup;
  public form_add: FormGroup;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ionViewDidEnter() {
    // this.getRoute('');
    // this.getCompany();
  }
  ngOnInit() {
    this.getRouteCompany();
    this.getCompany();
    this.form_add = this.formBuilder.group({
      company_id: [''],
      route_number: ['', Validators.required],
    });
    this.form_edit = this.formBuilder.group({
      route_company_id: ['', Validators.required],
      company_id: [''],
      route_number_old: ['', Validators.required],
      route_number: ['', Validators.required],
    });
  }
  getRouteCompany = async () => {
    let httpRespone: any = await this.http.post('getroutecompany');
    console.log(httpRespone.response);
    if (httpRespone.response.success) {
      this.routeData = httpRespone.response.data;
    } else {
      this.routeData = [];
    }
  };
  getCompany = async () => {
    let formData = new FormData();
    formData.append('company_id', '');
    let com = { company_id: '', company_name: 'กรุณาเลือก' };
    let httpRespone: any = await this.http.post('getcompanynotroute', formData);
    console.log(httpRespone.response.data);
    if (httpRespone.response.success) {
      this.companyApproved = httpRespone.response.data;
      this.companyApproved.unshift(com);
    } else {
      this.companyApproved = null;
    }
  };
  getCompanyEdit = async (value) => {
    let formData = new FormData();
    formData.append('company_id', value);
    let com = { company_id: '', company_name: 'กรุณาเลือก' };
    let httpRespone: any = await this.http.post('getcompanynotroute', formData);
    console.log(httpRespone.response.data);
    if (httpRespone.response.success) {
      this.companyEdit = httpRespone.response.data;
      this.companyEdit.unshift(com);
      // this.form_edit.controls['company_id'].setValue(value);
    } else {
      this.companyEdit = null;
    }
  };
  addRouteCompany = async () => {
    let formData = new FormData();
    Object.keys(this.form_add.value).forEach((key) => {
      formData.append(key, this.form_add.controls[key].value);
    });
    formData.forEach((value, key) => {
      console.log(key + ' : ' + value);
    });
    let httpRespone: any = await this.http.post('addroutecompany', formData);
    console.log(httpRespone.response.data);
    if (httpRespone.response.success) {
      Swal.fire('สำเร็จ', httpRespone.response.message + ' !', 'success').then(
        () => {
          document.getElementById('closeModal2').click();
          this.getRouteCompany();
          this.getCompany();
          this.resetForm();
        }
      );
    } else {
      Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
    }
  };
  deleteRouteCompany = async (value) => {
    let formData = new FormData();
    Swal.fire({
      title: 'ยืนยัน?',
      icon: 'warning',
      text: 'ข้อมูลสายและเส้นทางรถจะหายไป!',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `ยืนยัน`,
      denyButtonText: `ยกเลิก`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        formData.append('route_company_id', value);
        let httpRespone: any = await this.http.post(
          'deleteroutecompany',
          formData
        );
        console.log(httpRespone.response.data);
        if (httpRespone.response.success) {
          Swal.fire(
            'สำเร็จ',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            this.getRouteCompany();
            this.getCompany();
          });
        } else {
          Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
        }
      } else {
      }
    });
  };
  updateRoute = async () => {
    let formData = new FormData();
    Object.keys(this.form_edit.value).forEach((key) => {
      formData.append(key, this.form_edit.controls[key].value);
    });
    formData.forEach((value, key) => {
      console.log(key + ' : ' + value);
    });
    let httpRespone: any = await this.http.post('updateroutecompany', formData);
    console.log(httpRespone.response.data);
    if (httpRespone.response.success) {
      Swal.fire('สำเร็จ', httpRespone.response.message + ' !', 'success').then(
        () => {
          document.getElementById('closeModal1').click();
          this.getRouteCompany();
          this.getCompany();
        }
      );
    } else {
      Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
    }
  };
  resetForm = () => {
    this.form_add.controls['company_id'].setValue('');
    this.form_add.controls['route_number'].setValue('');
  };
  setRouteEdit = (value) => {
    this.form_edit.controls['route_company_id'].setValue(
      value.route_company_id
    );
    this.form_edit.controls['route_number_old'].setValue(parseInt(value.route_number));
    this.form_edit.controls['company_id'].setValue(parseInt(value.company_id));
    this.form_edit.controls['route_number'].setValue(value.route_number);
    
  };
}
