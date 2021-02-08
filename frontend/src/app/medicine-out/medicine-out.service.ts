import {Injectable} from '@angular/core';
import {environment as localEnvironment} from '../../environments/environment';
import {environment as productionEnvironment} from '../../environments/environment.prod';
import {Observable, of} from 'rxjs';
import {HttpService} from "../core/services/http.service";
import {IPaginatedData, PaginatorInterface} from "../shared/shared.module";


@Injectable({
    providedIn: 'root'
})

export class MedicineOutService {
    baseUrl = 'api/medicine-out/';
    private env = localEnvironment || productionEnvironment;

    constructor(private httpServices: HttpService) {
    }

    store(formValue: any): Observable<any> {
        return this.httpServices._post(this.baseUrl + 'store-medicine-out', formValue);
    }

    update(formValue: any): Observable<any> {
        return this.httpServices._post(this.baseUrl + 'update-medicine-out', formValue);
    }

    delete(id: number): Observable<any> {
        return this.httpServices.get(this.baseUrl + 'delete-medicine-out/' + id);
    }

    listStoredMedicineStockOut(patientId: number, billNumber: number): Observable<any> {
        return this.httpServices.get(this.baseUrl + 'list-medicine-stock-out/' + patientId + '/' + billNumber);
    }

    list(paginationData: PaginatorInterface): Observable<any> {
        return this.httpServices.get(this.baseUrl + 'list-main-medicine-stock-out/' + paginationData.pageSize + '?page=' + paginationData.pageIndex);
    }

    storeName(value: any): Observable<any> {
        return this.httpServices._post(this.baseUrl + 'store-patient-name', value);
    }

    storePayment(value: any): Observable<any> {
        return this.httpServices._post(this.baseUrl + 'store-patient-payment', value);
    }

}

