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
  public companyApproved: Array<any> = [];
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
    this.form_add = this.formBuilder.group({
      car_number: ['', Validators.required],
      provinces: ['', Validators.required],
      car_color: ['', Validators.required],
      car_brand: ['', Validators.required],
      car_detail: [''],
      company_id: ['', Validators.required],
    });
  }
  getRoute = async (value) => {
    console.log(value);

    let formData = new FormData();
    formData.append('company_id', value);
    let httpRespone: any = await this.http.post('getrouteselect', formData);
    console.log(httpRespone.response);
    if (httpRespone.response.success) {
      this.routeData = httpRespone.response.data;
    } else {
      this.routeData = null;
    }
  };
  getCompany = async () => {
    let formData = new FormData();
    formData.append('status', 'approved');
    formData.append('company_id', '');
    let com = { company_id: '', company_name: 'กรุณาเลือก' };
    let httpRespone: any = await this.http.post('getcompanydata', formData);
    console.log(httpRespone.response.data);
    if (httpRespone.response.success) {
      this.companyApproved = httpRespone.response.data;
      this.companyApproved.unshift(com);
    } else {
      this.companyApproved = null;
    }
  };
  deleteCar = (id) => {
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
        formData.append('car_id', id);
        let httpRespone: any = await this.http.post('deletecar', formData);
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
  onRegister = async () => {
    // let formData = new FormData();
    // Object.keys(this.form_add.value).forEach((key) => {
    //   formData.append(key, this.form_add.controls[key].value);
    // });
    // formData.forEach((value, key) => {
    //   console.log(key + ' : ' + value);
    // });
    // let httpRespone: any = await this.http.post('addcar', formData);
    // console.log(httpRespone);
    // if (httpRespone.response.success) {
    //   Swal.fire('สำเร็จ', httpRespone.response.message + ' !', 'success').then(
    //     () => {
    //       this.resetForm();
    //       document.getElementById('closeModal2').click();
    //       this.getRoute('');
    //       this.getCompany();
    //     }
    //   );
    // } else {
    //   Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
    // }
  };
  onUpdate = async () => {
    // let formData = new FormData();
    // Swal.fire({
    //   title: 'ยืนยัน?',
    //   icon: 'warning',
    //   text: 'คุณต้องการยืนยันการกระทำ!',
    //   showDenyButton: true,
    //   showCancelButton: false,
    //   confirmButtonText: `ยืนยัน`,
    //   denyButtonText: `ยกเลิก`,
    // }).then(async (result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {
    //     Object.keys(this.form_edit.value).forEach((key) => {
    //       formData.append(key, this.form_edit.controls[key].value);
    //     });
    //     formData.forEach((value, key) => {
    //       console.log(key + ' : ' + value);
    //     });
    //     let httpRespone: any = await this.http.post('updatecar', formData);
    //     if (httpRespone.response.success) {
    //       Swal.fire(
    //         'สำเร็จ',
    //         httpRespone.response.message + ' !',
    //         'success'
    //       ).then(() => {
    //         document.getElementById('closeModal1').click();
    //         this.getRoute('');
    //         this.getCompany();
    //       });
    //     } else {
    //       Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
    //     }
    //   } else {
    //   }
    // });
  };
  resetForm = () => {
    this.form_add.controls['car_number'].setValue('');
    this.form_add.controls['provinces'].setValue('');
    this.form_add.controls['car_color'].setValue('');
    this.form_add.controls['car_brand'].setValue('');
    this.form_add.controls['car_detail'].setValue('');
    this.form_add.controls['company_id'].setValue('');
  };
  setDriverEdit = (value) => {
    this.form_edit.controls['car_id'].setValue(value.car_id);
    this.form_edit.controls['car_number'].setValue(value.car_number);
    this.form_edit.controls['provinces'].setValue(value.provinces);
    this.form_edit.controls['car_color'].setValue(value.car_color);
    this.form_edit.controls['car_brand'].setValue(value.car_brand);
    this.form_edit.controls['car_detail'].setValue(value.car_detail);
    this.form_edit.controls['company_id'].setValue(value.company_id);
  };

}
