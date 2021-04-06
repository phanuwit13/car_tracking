import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  public companyApproved: Array<any> = [];
  public companyPending: Array<any> = [];
  public form_register: FormGroup;
  public form_edit: FormGroup;
  public status = ['approved', 'pending', 'reject'];
  public titleName = ['นาย', 'นาง', 'นางสาว'];
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}
  ionViewDidEnter() {
    this.getCompanyApproved();
    this.getCompanyPending()
  }
  ngOnInit() {
    this.getCompanyApproved();
    this.getCompanyPending()
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
    this.form_register = this.formBuilder.group({
      company_name: ['', Validators.required],
      company_address: ['', Validators.required],
      company_phone: ['', Validators.required],
      driver_title: ['', Validators.required],
      password: ['', Validators.required],
      driver_fname: ['', Validators.required],
      driver_lname: ['', Validators.required],
      identification_id: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      carcard_id: ['', Validators.required],
      exd_carcard_id: [this.http.getDate(), Validators.required],
      status_carcard_id: ['0', Validators.required],
      type_driver: ['1', Validators.required],
      status: ['approved', Validators.required],
    });
  }

  getCompanyApproved = async () => {
    let formData = new FormData();
    formData.append('status', 'approved');
    formData.append('company_id', '');
    let httpRespone: any = await this.http.post('getcompanydata', formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);

      this.companyApproved = httpRespone.response.data;
    } else {
      this.companyApproved = null;
    }
  };
  getCompanyPending = async () => {
    let formData = new FormData();
    formData.append('status', 'pending');
    formData.append('company_id', '');
    let httpRespone: any = await this.http.post('getcompanydata', formData);
    if (httpRespone.response.success) {
      console.log(httpRespone.response.data);

      this.companyPending = httpRespone.response.data;
    } else {
      this.companyPending = null;
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
          document.getElementById('closeModal').click();
          this.getCompanyApproved();
    this.getCompanyPending()
        }
      );
    } else {
      Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
    }
  };
  onRegister = async () => {
    if (this.http.checkEXD(this.form_register.value.exd_carcard_id)) {
      this.form_register.controls['status_carcard_id'].setValue(0);
    } else {
      this.form_register.controls['status_carcard_id'].setValue(1);
    }
    if (
      this.form_register.value.password !== this.form_register.value.confirmPassword
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
      let httpRespone: any = await this.http.post('registercompany', formData);
      console.log(httpRespone);
      if (httpRespone.response.success) {
        Swal.fire(
          'สำเร็จ',
          httpRespone.response.message + ' !',
          'success'
        ).then(() => {
          document.getElementById('closeModal2').click();
          this.getCompanyApproved();
    this.getCompanyPending()
        });
      } else {
        Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
      }
    }
  };
  deleteCompany = (id) => {
    let formData = new FormData();
    Swal.fire({
      title: 'ยืนยัน?',
      icon: 'warning',
      text: 'ข้อมูลพนักงานขับรถทั้งหมดจะหายไป!',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `ยืนยัน`,
      denyButtonText: `ยกเลิก`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        formData.append('company_id', id);
        let httpRespone: any = await this.http.post('deletecompany', formData);
        if (httpRespone.response.success) {
          Swal.fire(
            'สำเร็จ',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            this.getCompanyApproved();
    this.getCompanyPending()
          });
        } else {
          Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
        }
      } else {
      }
    });
  };
}
