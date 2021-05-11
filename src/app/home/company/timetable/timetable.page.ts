import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.page.html',
  styleUrls: ['./timetable.page.scss'],
})
export class TimetablePage implements OnInit {
  public carRoundData: Array<any> = [];
  public carRoundRaw: Array<any> = [];
  public company_id: any;
  public form_edit: FormGroup;
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.company_id = this.http.localStorage.get('user').company_id;
    this.getCarRound(this.company_id)
    this.form_edit = this.formBuilder.group({
      car_round_id:['', Validators.required],
      route_name:[''],
      round_1: [''],
      round_2: [''],
      round_3: [''],
      round_4: [''],
      round_5: [''],
      round_6: [''],
      round_7: [''],
      round_8: [''],
      round_9: [''],
      round_10: [''],
    });
  }
  searchArray(event) {
    const q = event.target.value;
    let data = this.carRoundRaw;
    data = data.filter(function (value) {
      return (
        value.car_number.indexOf(q) !== -1 || value.provinces.indexOf(q) !== -1
      ); // returns true or false
    });
    this.carRoundData = data;
  }
  async getCarRound(value) {
    let formData = new FormData();
    formData.append('company_id', value);
    let httpRespone: any = await this.http.post('getcarround', formData);
    console.log(httpRespone.response);
    if (httpRespone.response.success) {
      this.carRoundData = httpRespone.response.data;
      this.carRoundRaw= httpRespone.response.data;
    } else {
      this.carRoundData = [];
      this.carRoundRaw = []
    }
  }
  async updateCarRound() {
    let formData = new FormData();
    Swal.fire({
      title: 'ยืนยัน?',
      icon: 'warning',
      text: 'คุณต้องการยืนยันการกระทำ!',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `ยืนยัน`,
      denyButtonText: `ยกเลิก`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Object.keys(this.form_edit.value).forEach((key) => {
          formData.append(key, this.form_edit.controls[key].value);
        });
        formData.forEach((value, key) => {
          console.log(key + ' : ' + value);
        });
        let httpRespone: any = await this.http.post('updateround', formData);
        if (httpRespone.response.success) {
          Swal.fire(
            'สำเร็จ',
            httpRespone.response.message + ' !',
            'success'
          ).then(() => {
            document.getElementById('closeModal1').click();
            this.getCarRound(this.company_id)
          });
        } else {
          Swal.fire('ผิดพลาด', httpRespone.response.message + ' !', 'error');
        }
      } else {
      }
    });
  };
  setRoundEdit = (value) => {
    console.log(value);
    this.form_edit.controls['car_round_id'].setValue(value.car_round_id);
    this.form_edit.controls['route_name'].setValue(value.route_name);
    this.form_edit.controls['round_1'].setValue(value.round_1);
    this.form_edit.controls['round_2'].setValue(value.round_2);
    this.form_edit.controls['round_3'].setValue(value.round_3);
    this.form_edit.controls['round_4'].setValue(value.round_4);
    this.form_edit.controls['round_5'].setValue(value.round_5);
    this.form_edit.controls['round_6'].setValue(value.round_6);
    this.form_edit.controls['round_7'].setValue(value.round_7);
    this.form_edit.controls['round_8'].setValue(value.round_8);
    this.form_edit.controls['round_9'].setValue(value.round_9);
    this.form_edit.controls['round_10'].setValue(value.round_10);
  };
}
