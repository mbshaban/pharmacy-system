import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MedicinesComponent} from "./medicines.component";
import {LayoutComponent} from "../shared/layout/layout.component";

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {path: '', component: MedicinesComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MedicineRoutingModule {
}
