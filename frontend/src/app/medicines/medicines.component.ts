import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {NotificationService} from "../core/services/notification.service";
import {AddEditMedicineDialogComponent} from "./add-edit-medicine-dialog/add-edit-medicine-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginator} from "@angular/material/paginator";
import {LENGTH, PAGE_SIZE, PAGE_SIZE_OPTION} from "../../environments/environment";
import {generalMessages} from "../shared/validators/commonErrorMessages";
import {MedicineService} from "./medicine.service";
import {DropDownService} from "../core/services/drop-down.service";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {IPaginatedData, PaginatorInterface} from "../shared/shared.module";


@Component({
  selector: 'app-medicines',
  templateUrl: './medicines.component.html',
  styleUrls: ['./medicines.component.css']
})
export class MedicinesComponent implements OnInit {
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  paginationData: PaginatorInterface;


  displayedColumns: string[] = ['id', 'name','company_name','generic_name', 'measurement_value', 'medicine_type','created_date','action'];
  dataSource ;
  loading;
  medicinces:any[];
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
      private notificationService: NotificationService,
      private dialog: MatDialog,
      private medicineService:MedicineService,
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
  }

  addNewMedicine(){
    const dialogRef = this.dialog.open(AddEditMedicineDialogComponent, {
      height: '600px',
      width: '600px',
      panelClass: 'custom-dialog-container',
      //backdropClass: 'backdropBackground',
      data: {editData: null,isUpdateMode:false}

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.mmuTitle=this.dropDownService.get("medicineMeasUnites",result.measurement_unit_id).title;
        result.mtTitle=this.dropDownService.get("MedicineType",result.medicine_type_id).title;
        console.log(result);
        this.medicinces.push(result);
        this.dataSource=new MatTableDataSource(this.medicinces);
        this.dataSource.sort = this.sort;
      }
    });
  }

  listStoredTest(paginationData: PaginatorInterface) {
    this.loading=true;
    this.medicineService.listStoredMedicine(paginationData).subscribe((res:IPaginatedData)=>{
      this.loading=false;
      this.medicinces=res.data;
      this.paginator.length = res.total;
      this.dataSource=new MatTableDataSource(this.medicinces);
      this.dataSource.sort = this.sort;
      this.notificationService.openSnackBar(generalMessages.successReceived);
    },(error)=>{
      console.log(error);
      this.loading=false;
      this.notificationService.openSnackBar(generalMessages.serverProblem);
    });
  }

  editMedicine(value){
    const dialogRef = this.dialog.open(AddEditMedicineDialogComponent, {
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
          this.dataSource=new MatTableDataSource(this.medicinces.filter(item=> item.id != id));
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
