import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: './auth/auth.module#AuthModule'
    },
    {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'customers',
        loadChildren: './customers/customers.module#CustomersModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        loadChildren: './users/users.module#UsersModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'account',
        loadChildren: './account/account.module#AccountModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'medicine',
        loadChildren: './medicines/medicines.module#MedicinesModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'medicine-in',
        loadChildren: './medicine-in/medicine-in.module#MedicineInModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'medicine-out',
        loadChildren: './medicine-out/medicine-out.module#MedicineOutModule',
        canActivate: [AuthGuard]
    },

    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
