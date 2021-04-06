import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {

  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit() {
  }
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
