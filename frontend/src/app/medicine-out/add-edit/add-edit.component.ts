import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {NotificationService} from "../../core/services/notification.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DropDownService} from "../../core/services/drop-down.service";
import {generalMessages, messages} from "../../shared/validators/commonErrorMessages";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";
import {MedicineOutService} from "../medicine-out.service";

@Component({
    selector: 'app-add-edit',
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
    medicineForm: FormGroup;
    loading: boolean;
    errorMessages = messages;
    packings;
    options;
    medicines;
    isSmallPacking = false;
    selectedMId;
    selectedStockInId;
    filteredOptions: Observable<string[]>;

    constructor(public dialogRef: MatDialogRef<AddEditComponent>,
                @Inject(MAT_DIALOG_DATA) public data,
                private medicineOutService: MedicineOutService,
                private formBuilder: FormBuilder,
                private dropDownService: DropDownService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.packings = this.dropDownService.getAll("packings");
        this.medicines = this.dropDownService.getAll("medicines").filter(item => item.totalIn > item.totalOut);
        if (this.data.isUpdateMode) {
            this.updateForm(this.data.editData);
        } else {
            this.createForm();
        }
        this.filteredOptions = this.medicineForm.get("medicine_id").valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value)));
    }

    private _filter(value: string): string[] {
        const filterValue = value.toString().toLowerCase();
        return this.medicines.filter(option => option.name.toString().toLowerCase().includes(filterValue));
    }

    private createForm() {
        this.medicineForm = this.formBuilder.group({
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
            patient_id: [this.data.patientId, [Validators.required]],
            user_id: [1, [Validators.required]],
            medicine_stock_in_id: [null],
            bill_number: [this.data.billNumber],
        });
    }

    private updateForm(data) {
        this.medicineForm = this.formBuilder.group({
            id: [data && data.id],
            medicine_id: [data && data.name + ' ' + data.measurement_value + ' ' + data.measurement_unit, [
                Validators.required,
            ]],
            medicine_main_packing_id: [data && data.medicine_main_packing_id, [
                Validators.required
            ]],
            quantity: [data && data.quantity, [
                Validators.required,
                Validators.min(0),
                Validators.max(100000),
            ]],
            user_id: [1, [Validators.required]],
            patient_id: [this.data.patientId, [Validators.required]],
            bill_number: [this.data.billNumber],
            medicine_stock_in_id: [data && data.medicine_stock_in_id],
        });
        this.getMedicineId(data.medicine_id);


    }

    store() {
        this.medicineForm.get("medicine_id").setValue(this.selectedMId);
        this.medicineForm.get("medicine_stock_in_id").setValue(this.selectedStockInId);
        if (this.data.isUpdateMode) {
            this.medicineOutService.update(this.medicineForm.value).subscribe((res) => {
                this.loading = false;
                this.closeDialog(res);
                this.notificationService.openSnackBar(generalMessages.successUpdated);
            }, (error) => {
                console.log(error);
                this.loading = false;
                this.notificationService.openSnackBar(generalMessages.serverProblem);
            });
        } else {
            this.medicineOutService.store(this.medicineForm.value).subscribe((res) => {
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

    getMedicineId(value) {
        this.selectedMId = value;
        let medicine = this.medicines.filter(item => item.id === value);
        if (medicine.length > 0) {
            medicine = medicine[0];
            this.selectedStockInId=medicine.medicine_stock_id;
            this.packings = this.dropDownService.getAll("packings");
            this.packings = this.packings.filter(item => item.id === medicine.medicine_main_packing_id || item.id === medicine.medicine_packing_unit_id);
            this.medicineForm.get('quantity').setValidators([
                Validators.max(medicine.totalIn ? medicine.totalIn : 0 - medicine.totalOut ? medicine.totalOut : 0),
                Validators.min(0)
            ]);
        }

    }


}
