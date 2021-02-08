import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {Observable, of} from 'rxjs';
import {HttpService} from "../core/services/http.service";
import {IPaginatedData, PaginatorInterface} from "../shared/shared.module";


@Injectable({
  providedIn: 'root'
})

export class MedicineInService {
  baseUrl = 'api/medicine-in/';
  private env = localEnvironment || productionEnvironment;

  constructor(private httpServices: HttpService) {
  }

  store(formValue:any): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'store-medicine-in/' ,formValue);
  }

  update(formValue:any): Observable<any> {
    return this.httpServices._post(this.baseUrl + 'update-medicine-in/' ,formValue);
  }

  delete(id:number): Observable<any> {
    return this.httpServices.get(this.baseUrl + 'delete-medicine-in/' + id);
  }

  listStoredMedicineStockIn(paginationData: PaginatorInterface): Observable<IPaginatedData> {
    return this.httpServices.get(this.baseUrl + 'list-medicine-stock-in/' + paginationData.pageSize + '?page=' + paginationData.pageIndex);
  }

}

