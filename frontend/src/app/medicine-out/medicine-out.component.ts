import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {IPaginatedData, PaginatorInterface} from "../shared/shared.module";
import {MatSort} from "@angular/material/sort";
import {NotificationService} from "../core/services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {DropDownService} from "../core/services/drop-down.service";
import {LENGTH, PAGE_SIZE, PAGE_SIZE_OPTION} from "../../environments/environment";
import {AddEditDialogComponent} from "../medicine-in/add-edit-dialog/add-edit-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
import {generalMessages} from "../shared/validators/commonErrorMessages";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {MedicineOutService} from "./medicine-out.service";
import {Router} from "@angular/router";
import {PatientNameDialogComponent} from "./patient-name-dialog/patient-name-dialog.component";
import {PaymentDialogComponent} from "./payment-dialog/payment-dialog.component";

@Component({
    selector: 'app-medicine-out',
    templateUrl: './medicine-out.component.html',
    styleUrls: ['./medicine-out.component.css']
})
export class MedicineOutComponent implements OnInit {

    @ViewChild(MatPaginator, null) paginator: MatPaginator;
    paginationData: PaginatorInterface;

    displayedColumns: string[] =
        [
            'id',
            'full_name',
            'total',
            'paid_price',
            'bill_number',
            'created_at',
            'action'
        ];
    dataSource;
    loading;
    medicincesOut: any[];
    medicinces: any[];
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(
        private notificationService: NotificationService,
        private dialog: MatDialog,
        private medicineService: MedicineOutService,
        private dropDownService: DropDownService,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.paginator.pageSizeOptions = PAGE_SIZE_OPTION;
        this.paginator.length = LENGTH;
        this.paginator.pageSize = PAGE_SIZE;
        this.paginationData = {
            pageIndex: 1,
            pageSize: PAGE_SIZE
        };
        setTimeout(() => this.list(this.paginationData), 100);
        this.medicinces = this.dropDownService.getAll("medicines");
    }

    addNewMedicine() {
        const dialogRef = this.dialog.open(PatientNameDialogComponent, {
            panelClass: 'custom-dialog-container',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(">>>>>>>>>>>>>>>", result);
                this.redirect({
                    fullName: result.full_name,
                    patientId: result.id,
                    billNumber: result.billNumber,
                });
            }
        });
    }

    redirect(result) {
        this.router.navigate(['medicine-out', 'list-details', result.fullName, result.patientId, result.billNumber]);

    }

    payment(value) {
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
            panelClass: 'custom-dialog-container',
            data: {
                total: (parseInt(value.total ? value.total : 0) - parseInt(value.total_payment ? value.total_payment : 0)),
                patientId: value.patient_id,
                billNumber: value.bill_number
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.medicincesOut.filter((item) => {
                    if (item.bill_number === result.bill_number) {
                        item.total_payment = (parseInt(item.total_payment ? item.total_payment : 0) + parseInt(result.payed_price));
                    }
                });

            }
        });
    }

    list(paginationData: PaginatorInterface) {
        this.loading = true;
        this.medicineService.list(paginationData).subscribe((res) => {
            this.loading = false;
            this.medicincesOut = res;
            this.paginator.length = res.total;
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
        this.redirect({
            fullName: value.full_name,
            patientId: value.patient_id,
            billNumber: value.bill_number,
        })
    }

    deleteMedicine(id: number) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            panelClass: 'custom-dialog-container',
            data: {title: "Medicine", message: generalMessages.doYouWantDeleted}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.medicineService.delete(id).subscribe((res: any) => {
                    this.loading = false;
                    this.dataSource = new MatTableDataSource(this.medicincesOut.filter(item => item.id != id));
                    this.dataSource.sort = this.sort;
                    this.notificationService.openSnackBar(generalMessages.successDeleted);
                }, (error) => {
                    console.log(error);
                    this.loading = false;
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
        this.list(this.paginationData);
    }


}
