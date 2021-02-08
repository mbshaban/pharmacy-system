import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MedicineInComponent} from "./medicine-in.component";
import {LayoutComponent} from "../shared/layout/layout.component";
import {DashboardHomeComponent} from "../dashboard/dashboard-home/dashboard-home.component";


const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      { path: '', component: MedicineInComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicineInRoutingModule { }
