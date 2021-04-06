import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CheckDriverGuard implements CanActivate {
  constructor(private service: HttpService) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLoggedIn()) {
      return true;
      // this.service.setUserLogin(this.service.localStorage.get("userLogin"));
    } else {
      this.service.navRouter('/home/login');
      return false;
    }
  }
  public isLoggedIn(): boolean {
    let status = false;
    if (this.service.localStorage.get('user')?.type_driver === 0) {
      status = true;
    } else {
      status = false;
    }
    return status;
  }
}