import {Injectable} from '@angular/core';
import {CommonDataManagerService} from './common-data-manager.service';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DropDownService {

  constructor(private http: HttpService, private commonDataMangerService: CommonDataManagerService) {
  }

  performTheProcess() {
    this.commonDataMangerService.getCommonDataCollection().subscribe((data) => {
      localStorage.setItem('roles', JSON.stringify(data.roles));
      localStorage.setItem('MedicineType', JSON.stringify(data.MedicineType));
      localStorage.setItem('medicineMeasUnites', JSON.stringify(data.medicineMeasUnites));
      localStorage.setItem('medicines', JSON.stringify(data.medicines));
      localStorage.setItem('packings', JSON.stringify(data.packings));

    }, (err) => {
      console.log(err);
    });
  }
  getAll(tableName: string) {
    return JSON.parse(localStorage.getItem(tableName));
  }

  get(tableName: string, id: number) {
    const items = JSON.parse(localStorage.getItem(tableName));
    const item = items.filter((current) => {
      return current.id === parseInt(id.toString());
    });
    return item[0];
  }
}
