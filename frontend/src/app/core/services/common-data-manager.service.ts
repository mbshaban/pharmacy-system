import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class CommonDataManagerService {
  private baseUrl = 'api/common-data-manager/';
  private requestHeader;

  constructor(private httpServices: HttpService) {
  }

  getCommonDataCollection(): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'common-data', this.requestHeader);
  }

  // getServiceCategory(): Observable<any> {
  //   return this.httpServices.get(this.baseUrl + 'service-category', this.requestHeader);
  // }
}
