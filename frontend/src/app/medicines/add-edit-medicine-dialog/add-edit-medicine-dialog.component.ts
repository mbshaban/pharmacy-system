import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {NotificationService} from "../../core/services/notification.service";
import {generalMessages, messages} from "../../shared/validators/commonErrorMessages";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DropDownService} from "../../core/services/drop-down.service";
import {MedicineService} from "../medicine.service";

@Component({
  selector: 'app-add-edit-medicine-dialog',
  templateUrl: './add-edit-medicine-dialog.component.html',
  styleUrls: ['./add-edit-medicine-dialog.component.css']
})
export class AddEditMedicineDialogComponent implements OnInit {
  medicineForm: FormGroup;
  loading: boolean;
  errorMessages = messages;
  measurementUnits;
  medicinesType;
  constructor(public dialogRef: MatDialogRef<AddEditMedicineDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private medicineService:MedicineService,
              private formBuilder:FormBuilder,
              private dropDownService:DropDownService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.measurementUnits=this.dropDownService.getAll("medicineMeasUnites");
    this.medicinesType=this.dropDownService.getAll("MedicineType");
    if (this.data.isUpdateMode){
      this.updateForm(this.data.editData);
    }else {
      this.createForm();
    }
  }

  private createForm() {

    this.medicineForm =  this.formBuilder.group({
      name: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      company_name: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      generic_name: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      measurement_value: [null, [
        Validators.min(0),
        Validators.max(10000),
      ]],
      measurement_unit_id: [null,[
          Validators.required,
      ]],
      medicine_type_id: [null,[Validators.required]],
    });
  }

  private updateForm(data) {

    this.medicineForm =  this.formBuilder.group({
      id: [data && data.id],
      name: [data && data.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      company_name: [data && data.company_name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      generic_name: [data && data.generic_name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(254),
      ]],
      measurement_value: [data && data.measurement_value, [
        Validators.min(0),
        Validators.max(100000),
      ]],
      measurement_unit_id: [data && data.measurement_unit_id,[
        Validators.required,
      ]],
      medicine_type_id: [data && data.medicine_type_id,[Validators.required]],
    });
  }

  store() {

    if (this.data.isUpdateMode){
      this.medicineService.update(this.medicineForm.value).subscribe((res) => {
        this.loading = false;
        this.closeDialog(res);
        this.notificationService.openSnackBar(generalMessages.successUpdated);
      }, (error) => {
        console.log(error);
        this.loading = false;
        this.notificationService.openSnackBar(generalMessages.serverProblem);
      });
    }else {
      this.medicineService.store(this.medicineForm.value).subscribe((res) => {
        this.closeDialog(res);
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
}
