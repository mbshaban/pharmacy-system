import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MedicinesComponent} from './medicines.component';
import {MedicineRoutingModule} from "./medicine-routing.module";
import {SharedModule} from "../shared/shared.module";
import { AddEditMedicineDialogComponent } from './add-edit-medicine-dialog/add-edit-medicine-dialog.component';


@NgModule({
    declarations: [MedicinesComponent, AddEditMedicineDialogComponent],
    entryComponents:[
        AddEditMedicineDialogComponent
    ],
    imports: [
        CommonModule,
        MedicineRoutingModule,
        SharedModule
    ]
})
export class MedicinesModule {
}
