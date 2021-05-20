import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-pending-user',
  templateUrl: './pending-user.page.html',
  styleUrls: ['./pending-user.page.scss'],
})
export class PendingUserPage implements OnInit {

  constructor(private http: HttpService) {}

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
