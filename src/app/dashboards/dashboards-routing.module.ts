import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'admin', data: { breadcrumb: 'Admin Dashboard' }, loadChildren: () => import('./admin/admin.dashboard.module').then((m) => m.AdminDashboardModule) },
            { path: 'employee', data: { breadcrumb: 'Hr Dashboard' }, loadChildren: () => import('./hr/employeedashboard.module').then((m) => m.EmployeeDashboardModule) }
        ])
    ],
    exports: [RouterModule]
})
export class DashboardsRoutingModule {}
