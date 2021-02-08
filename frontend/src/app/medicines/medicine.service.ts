import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {Observable, of} from 'rxjs';
import {HttpService} from "../core/services/http.service";
import {IPaginatedData, PaginatorInterface} from "../shared/shared.module";

@Injectable({
  providedIn: 'root'
})

export class MedicineService {
  baseUrl = 'api/medicine/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService) {
  }

  store(formValue:any): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'store-medicine/' ,formValue);
  }

  update(formValue:any): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'update-medicine/' ,formValue);
  }

  delete(id:number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'delete-medicine/' + id);
  }


  listStoredMedicine(paginationData: PaginatorInterface): Observable<IPaginatedData> {
    return this.httpServices.get(this.baseUrl + 'list-medicines/' + paginationData.pageSize + '?page=' + paginationData.pageIndex);
  }

}

