import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {generalMessages, messages} from "../../shared/validators/commonErrorMessages";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {DropDownService} from "../../core/services/drop-down.service";
import {NotificationService} from "../../core/services/notification.service";
import {MedicineInService} from "../medicine-in.service";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-add-edit-dialog',
  templateUrl: './add-edit-dialog.component.html',
  styleUrls: ['./add-edit-dialog.component.css']
})
export class AddEditDialogComponent implements OnInit {
  medicineForm: FormGroup;
  loading: boolean;
  errorMessages = messages;
  packings;
  medicines;
  isSmallPacking=false;
  selectedMId;
  filteredOptions: Observable<string[]>;
  constructor(public dialogRef: MatDialogRef<AddEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private medicineInService:MedicineInService,
              private formBuilder:FormBuilder,
              private dropDownService:DropDownService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.packings=this.dropDownService.getAll("packings");
    this.medicines=this.dropDownService.getAll("medicines");
    if (this.data.isUpdateMode){
      this.updateForm(this.data.editData);
    }else {
      this.createForm();
    }
    this.filteredOptions = this.medicineForm.get("medicine_id").valueChanges
        .pipe(
            startWith(''),
            map(value => this._filter(value))
        );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toString().toLowerCase();
    return this.medicines.filter(option => option.name.toString().toLowerCase().includes(filterValue));
  }
  private createForm() {

    this.medicineForm =  this.formBuilder.group({
      medicine_id: [null, [
        Validators.required,
      ]],
      medicine_main_packing_id: [null, [
        Validators.required
      ]],
      quantity: [null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100000),
      ]],
      medicine_price_in: [null, [
        Validators.min(0),
        Validators.max(100000),
        Validators.required
      ]],
      medicine_price_out: [null, [
        Validators.min(0),
        Validators.max(100000),
        Validators.required
      ]],
      medicine_expire_date: [null,[
        Validators.required
      ]],
      has_small_pack:[false],
      sm_medicine_small_packing_id: [null, [
        // Validators.required
      ]],
      sm_quantity: [null, [
        // Validators.required,
        Validators.min(0),
        Validators.max(100000),
      ]],
      sm_medicine_price_out: [null, [
        Validators.min(0),
        Validators.max(100000),
      ]],
      user_id: [1,[Validators.required]],
    });
  }

  private updateForm(data) {

    this.medicineForm =  this.formBuilder.group({
      id: [data && data.id],
      medicine_id: [data && data.medicine_id, [
        Validators.required,
      ]],
      medicine_main_packing_id: [data && data.packing_unit_id, [
        Validators.required
      ]],
      quantity: [data && data.mquantity, [
        Validators.required,
        Validators.min(0),
        Validators.max(100000),
      ]],
      medicine_price_in: [data && data.mprice, [
        Validators.min(0),
        Validators.max(100000),
      ]],
      medicine_price_out: [data && data.mpriceout, [
        Validators.min(0),
        Validators.max(100000),
      ]],
      medicine_expire_date: [data && data.medicine_expire_date,[
        Validators.required
      ]],
      has_small_pack:[(!!data.sm_medicine_main_packing_id) ],
      sm_medicine_small_packing_id: [null, [
        Validators.required
      ]],
      sm_quantity: [data && data.squantity, [
        Validators.required,
        Validators.min(0),
        Validators.max(100000),
      ]],
      sm_medicine_price_out: [data && data.smpriceout, [
        Validators.min(0),
        Validators.max(100000),
      ]],
      user_id: [1,[Validators.required]],
    });
  }

  store() {
    this.medicineForm.get("medicine_id").setValue(this.selectedMId);
    this.medicineForm.get("medicine_expire_date").setValue(this.formatDate(this.medicineForm.get("medicine_expire_date").value));
    if (this.data.isUpdateMode){
      this.medicineInService.update(this.medicineForm.value).subscribe((res) => {
        this.loading = false;
        this.closeDialog(res);
        this.notificationService.openSnackBar(generalMessages.successUpdated);
      }, (error) => {
        console.log(error);
        this.loading = false;
        this.notificationService.openSnackBar(generalMessages.serverProblem);
      });
    }else {
      console.log(this.medicineForm.value);
      this.medicineInService.store(this.medicineForm.value).subscribe((res) => {
        this.closeDialog(this.medicineForm.value);
        this.loading = false;
        this.notificationService.openSnackBar(generalMessages.successInserted);
      }, (error) => {
        console.log(error);
        this.loading = false;
        this.notificationService.openSnackBar(generalMessages.serverProblem);
      });
    }
  }

  closeDialog(result = null) {
    if (result) {
      this.dialogRef.close(result);
    } else {
      this.dialogRef.close(null);
    }
  }
  changeState(){
    this.isSmallPacking = !this.medicineForm.controls['has_small_pack'].value;
  }

  getMedicineId(value){
    this.selectedMId=value;
  }

  formatDate(value){
    let d=new Date(value);
    let actualDate=d.getDate();
    let actualMonth=d.getMonth()+1;
    let actualYear=d.getFullYear();
    return actualYear+ '-' + actualMonth + '-' + actualDate  ;
  }

}
