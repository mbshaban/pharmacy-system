import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {NotificationService} from "../../core/services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {MedicineOutService} from "../medicine-out.service";
import {DropDownService} from "../../core/services/drop-down.service";
import {ConfirmDialogComponent} from "../../shared/confirm-dialog/confirm-dialog.component";
import {generalMessages, messages} from "../../shared/validators/commonErrorMessages";
import {MatTableDataSource} from "@angular/material/table";
import {AddEditComponent} from "../add-edit/add-edit.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {PaymentDialogComponent} from "../payment-dialog/payment-dialog.component";

@Component({
    selector: 'app-list-details',
    templateUrl: './list-details.component.html',
    styleUrls: ['./list-details.component.css']
})
export class ListDetailsComponent implements OnInit {

    displayedColumns: string[] =
        [
            'id',
            'name',
            'company_name',
            'medicine_type',
            'measurement_unit',
            'quantity',
            'price',
            'total',
            'action'
        ];
    errorMessages = messages;
    dataSource;
    loading;
    medicincesOut: any[];
    medicinces: any[];
    patientId = 0;
    billNumber = 0;
    total = 0;
    date = new Date().getDate();
    patientForm: FormGroup;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        private notificationService: NotificationService,
        private dialog: MatDialog,
        private medicineService: MedicineOutService,
        private formBuilder: FormBuilder,
        private dropDownService: DropDownService,
        private activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.medicinces = this.dropDownService.getAll("medicines");
        setTimeout(() => {
            this.listStoredMedicineOut();
        }, 0);
        if (this.activatedRoute.snapshot.params.patientId) {
            this.patientId = this.activatedRoute.snapshot.params.patientId;
            this.billNumber = this.activatedRoute.snapshot.params.billNumber;
            this.createForm(this.activatedRoute.snapshot.params.patientName ? this.activatedRoute.snapshot.params.patientName : '', this.patientId);
        } else {
            this.createForm(null, null);
        }

    }

    insertName(value) {
        this.medicineService.storeName(value).subscribe((res) => {
            this.patientId = res.id;
        }, error => console.log(error))
    }


    addNewMedicine() {
        const dialogRef = this.dialog.open(AddEditComponent, {
            height: '400px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {editData: null, isUpdateMode: false, patientId: this.patientId, billNumber: this.billNumber}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const medicine = this.medicinces.find((item) => {
                    return item.id === result.medicine_id;
                });
                setTimeout(() => {
                    result.name = medicine.name;
                    result.company_name = medicine.company_name;
                    result.medicine_type = this.dropDownService.get("MedicineType", medicine.medicine_type_id).title;
                    result.packing = this.dropDownService.get("packings", result.medicine_main_packing_id).title;
                    result.medicine_price_out = medicine.medicine_main_price_out;
                    result.measurement_unit = this.dropDownService.get("medicineMeasUnites", medicine.measurement_unit_id).title;
                    result.measurement_value = medicine.measurement_value;
                    this.medicincesOut.push(result);
                    this.dataSource = new MatTableDataSource(this.medicincesOut);
                    this.dataSource.sort = this.sort;
                    this.calculatePrice();
                }, 1);
            }
        });
    }

    payment() {
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
            panelClass: 'custom-dialog-container',
            data: {total: this.total, patientId: this.patientId, billNumber: this.billNumber}
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log(this.total)
            }
        });
    }

    listStoredMedicineOut() {
        this.loading = true;
        this.medicineService.listStoredMedicineStockOut(this.patientId, this.billNumber).subscribe((res: any) => {
            this.loading = false;
            this.medicincesOut = res.data;
            this.arrangeData();
            this.dataSource = new MatTableDataSource(this.medicincesOut);
            this.dataSource.sort = this.sort;
            this.notificationService.openSnackBar(generalMessages.successReceived);
        }, (error) => {
            console.log(error);
            this.loading = false;
            this.notificationService.openSnackBar(generalMessages.serverProblem);
        });
    }

    editMedicine(value) {
        const dialogRef = this.dialog.open(AddEditComponent, {
            height: '400px',
            width: '600px',
            panelClass: 'custom-dialog-container',
            //backdropClass: 'backdropBackground',
            data: {editData: value, isUpdateMode: true, patientId: this.patientId, billNumber: this.billNumber}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const medicine = this.medicinces.find((item) => {
                    return item.id === result.medicine_id;
                });
                setTimeout(() => {
                    this.medicincesOut.filter((item) => {
                        if (item.id === result.id) {
                            item.name = medicine.name;
                            item.company_name = medicine.company_name;
                            item.medicine_type = this.dropDownService.get("MedicineType", medicine.medicine_type_id).title;
                            item.measurement_unit = this.dropDownService.get("medicineMeasUnites", medicine.measurement_unit_id).title;
                            item.measurement_value = medicine.measurement_value;
                            item.packing = this.dropDownService.get("packings", result.medicine_main_packing_id).title;
                            item.medicine_price_out = medicine.medicine_main_price_out;
                            item.quantity = result.quantity;
                        }
                    });
                    this.calculatePrice();
                }, 100);
            }
        });
    }

    public createForm(name: string, patientId: number) {
        this.patientForm = this.formBuilder.group({
            full_name: [name, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(256),
            ]],
            patient_id: [patientId]
        });
    }

    arrangeData() {
        this.medicincesOut.forEach((item) => {
            item.packing = this.dropDownService.get('packings', item.medicine_main_packing_id).title;
            this.total += item.medicine_price_out * item.quantity;
        });
    }


    calculatePrice() {
        this.total = 0;
        this.medicincesOut.forEach((item) => {
            this.total += item.medicine_price_out * item.quantity;
        });
    }

    deleteMedicine(id: number) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            panelClass: 'custom-dialog-container',
            data: {title: "Record", message: generalMessages.doYouWantDeleted}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.medicineService.delete(id).subscribe((res: any) => {
                    this.loading = false;
                    this.dataSource = new MatTableDataSource(this.medicincesOut = this.medicincesOut.filter(item => item.id !== id));
                    this.dataSource.sort = this.sort;
                    this.calculatePrice();
                    this.notificationService.openSnackBar(generalMessages.successDeleted);
                }, (error) => {
                    console.log(error);
                    this.loading = false;
                    this.notificationService.openSnackBar(generalMessages.serverProblem);
                });
            }
        });
    }


}
