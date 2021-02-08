import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {IPaginatedData, PaginatorInterface} from "../shared/shared.module";
import {MatSort} from "@angular/material/sort";
import {NotificationService} from "../core/services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {DropDownService} from "../core/services/drop-down.service";
import {LENGTH, PAGE_SIZE, PAGE_SIZE_OPTION} from "../../environments/environment";
import {MatTableDataSource} from "@angular/material/table";
import {generalMessages} from "../shared/validators/commonErrorMessages";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {AddEditDialogComponent} from "./add-edit-dialog/add-edit-dialog.component";
import {MedicineInService} from "./medicine-in.service";
import set = Reflect.set;

@Component({
  selector: 'app-medicine-in',
  templateUrl: './medicine-in.component.html',
  styleUrls: ['./medicine-in.component.css']
})
export class MedicineInComponent implements OnInit {
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  paginationData: PaginatorInterface;

  displayedColumns: string[] =
      [
          'id',
          'name',
          'company_name',
          'medicine_type',
          'quantity',
          'price_per_item',
          'sells_price_per_item',
          'squantity',
          'sprice_per_item',
          'total',
          'expire_date',
          'action'];
  dataSource ;
  loading;
  medicincesIn:any[];
  medicinces:any[];
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
      private notificationService: NotificationService,
      private dialog: MatDialog,
      private medicineService:MedicineInService,
      private dropDownService:DropDownService,
  ){

  }

  ngOnInit() {
    this.paginator.pageSizeOptions = PAGE_SIZE_OPTION;
    this.paginator.length = LENGTH;
    this.paginator.pageSize = PAGE_SIZE;
    this.paginationData = {
      pageIndex: 1,
      pageSize: PAGE_SIZE
    };
    this.listStoredTest(this.paginationData);
    this.medicinces=this.dropDownService.getAll("medicines");
  }

  addNewMedicine(){
    const dialogRef = this.dialog.open(AddEditDialogComponent, {
      height: '600px',
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: {editData: null,isUpdateMode:false}
    });
    dialogRef.afterClosed().subscribe( (result) => {
      if (result) {
         const medicine=this.medicinces.find((item) => { return item.id === result.medicine_id;   });
         setTimeout(()=>{
           result.name = medicine.name;
           result.company_name = medicine.company_name;
           result.mttitle = this.dropDownService.get("MedicineType", medicine.medicine_type_id).title;
           result.mquantity = result.quantity;
           result.putitle = this.dropDownService.get("packings", result.medicine_main_packing_id).title;
           result.mprice = result.medicine_price_in;
           result.mpriceout = result.medicine_price_out;
           result.squantity = result.sm_quantity;
           result.smpriceout = result.sm_medicine_price_out;
           result.packing_unit_id = result.medicine_main_packing_id;
           this.medicincesIn.push(result);
           this.dataSource = new MatTableDataSource(this.medicincesIn);
           this.dataSource.sort = this.sort;
         },10);
      }
    });
  }

  listStoredTest(paginationData: PaginatorInterface) {
    this.loading=true;
    this.medicineService.listStoredMedicineStockIn(paginationData).subscribe((res:IPaginatedData)=>{
      this.loading=false;
      this.medicincesIn=res.data;
      this.paginator.length = res.total;
      this.dataSource=new MatTableDataSource(this.medicincesIn);
      this.dataSource.sort = this.sort;
      this.notificationService.openSnackBar(generalMessages.successReceived);
    },(error)=>{
      console.log(error);
      this.loading=false;
      this.notificationService.openSnackBar(generalMessages.serverProblem);
    });
  }

  editMedicine(value){
    const dialogRef = this.dialog.open(AddEditDialogComponent, {
      height: '600px',
      width: '600px',
      panelClass: 'custom-dialog-container',
      //backdropClass: 'backdropBackground',
      data: {editData: value,isUpdateMode:true}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.medicinces.filter((item)=>{
          if(item.id === result.id){
            item.name=result.name;
            item.company_name=result.company_name;
            item.generic_name=result.generic_name;
            item.measurement_value=result.measurement_value;
            item.measurement_unit_id=result.measurement_unit_id;
            item.medicine_type_id=result.medicine_type_id;
            result.mmuTitle=this.dropDownService.get("medicineMeasUnites",result.measurement_unit_id).title;
            result.mtTitle=this.dropDownService.get("medicineMeasUnites",result.medicine_type_id).title;
          }
        })
      }
    });
  }

  deleteMedicine(id:number){
    const dialogRef=this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-dialog-container',
      data: {title: "Medicine",message:generalMessages.doYouWantDeleted}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.medicineService.delete(id).subscribe((res:any)=>{
          this.loading=false;
          this.dataSource=new MatTableDataSource(this.medicincesIn.filter(item=> item.id != id));
          this.dataSource.sort = this.sort;
          this.notificationService.openSnackBar(generalMessages.successDeleted);
        },(error)=>{
          console.log(error);
          this.loading=false;
          this.notificationService.openSnackBar(generalMessages.serverProblem);
        });
      }
    });
  }
  onPageChangeEvent(event) {
    this.paginationData = {
      pageIndex: event.pageIndex + 1,
      pageSize: event.pageSize
    };
    this.listStoredTest(this.paginationData);
  }

}
