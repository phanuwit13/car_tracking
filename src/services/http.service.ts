import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // public rootPath: string = 'http://192.168.1.43:3000/api/';
  public rootPath: string = 'https://cartracking-service.herokuapp.com/api/';
  // public rootPath: string = 'http://localhost:4020/api/';
  constructor(
    private http: HttpClient,
    private router: Router,
    private platform: Platform
  ) {}

  public post = (path: string, formdata: any = null) => {
    return new Promise((resolve) => {
      this.http
        .post(this.rootPath + path, formdata)
        .toPromise()
        .then((value) => {
          resolve({ connect: true, response: value });
        })
        .catch((reason) => {
          resolve({ connect: false, response: reason });
        });
    });
  };

  public get = (path: string) => {
    return new Promise((resolve) => {
      this.http
        .get(this.rootPath + path)
        .toPromise()
        .then((value) => {
          resolve({ connect: true, response: value });
        })
        .catch((reason) => {
          resolve({ connect: false, response: reason });
        });
    });
  };
  public localStorage = {
    get: (key: string) => {
      return JSON.parse(window.localStorage.getItem(key));
    },
    set: (key: string, value: any) => {
      value = JSON.stringify(value);
      window.localStorage.setItem(key, value);
    },
    clear: () => {
      window.localStorage.clear();
    },
  };

  public navRouter = (path: string, params: any = {}) => {
    this.router.navigate([`${path}`], { queryParams: params });
  };

  public setUserLogin = (data: any) => {
    this.localStorage.set('userLogin', data);
  };
  public getDate = () => {
    let date = new Date();
    let y: any = date.getFullYear();
    let m: any = date.getMonth() + 1;
    let d: any = date.getDay();
    if (m < 10) {
      m = '0' + m;
    }
    if (d < 10) {
      d = '0' + d;
    }
    return y + '-' + m + '-' + d;
  };
  public checkEXD = (day) => {
    let date = new Date();
    let exd = day.split('-');
    let y: any = date.getFullYear();
    let m: any = date.getMonth() + 1;
    let d: any = date.getDate();

    var dateOne = new Date(exd[0], exd[1], exd[2]);
    var dateTwo = new Date(y, m, d);

    console.log(y + '-' + m + '-' + d + ' : ' + day);
    if (dateOne > dateTwo) {
      return true;
    } else {
      return false;
    }
    // if (parseInt(exd[0]) >= y) {
    //   if (parseInt(exd[1]) >= m) {
    //     if (parseInt(exd[2]) >= d) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   } else {
    //     return false;
    //   }
    // } else {
    //   return false;
    // }
  };
}
