import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicineOutRoutingModule } from './medicine-out-routing.module';
import { MedicineOutComponent } from './medicine-out.component';
import {SharedModule} from "../shared/shared.module";
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListDetailsComponent } from './list-details/list-details.component';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import { PatientNameDialogComponent } from './patient-name-dialog/patient-name-dialog.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';


@NgModule({
  declarations: [MedicineOutComponent, AddEditComponent, ListDetailsComponent, PatientNameDialogComponent, PaymentDialogComponent],
  entryComponents:[
      AddEditComponent,
      PatientNameDialogComponent,
    PaymentDialogComponent
  ],
  imports: [
    CommonModule,
    MedicineOutRoutingModule,
    SharedModule,
    NgxMatSelectSearchModule
  ]
})
export class MedicineOutModule { }
