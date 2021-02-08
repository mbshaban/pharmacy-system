import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicineInRoutingModule } from './medicine-in-routing.module';
import { MedicineInComponent } from './medicine-in.component';
import {SharedModule} from "../shared/shared.module";
import { AddEditDialogComponent } from './add-edit-dialog/add-edit-dialog.component';


@NgModule({
  declarations: [MedicineInComponent, AddEditDialogComponent],
  entryComponents:[AddEditDialogComponent],
  imports: [
    CommonModule,
    MedicineInRoutingModule,
    SharedModule
  ]
})
export class MedicineInModule { }
