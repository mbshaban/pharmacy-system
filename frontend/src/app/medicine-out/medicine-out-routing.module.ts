import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MedicineOutComponent} from "./medicine-out.component";
import {LayoutComponent} from "../shared/layout/layout.component";
import {ListDetailsComponent} from "./list-details/list-details.component";


const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      { path: '', component: MedicineOutComponent },
      { path: 'list-details/:patientName/:patientId/:billNumber', component:ListDetailsComponent },
      { path: 'list-details', component:ListDetailsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicineOutRoutingModule { }
