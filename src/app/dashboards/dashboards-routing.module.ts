import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'admin', data: { breadcrumb: 'Admin Dashboard' }, loadChildren: () => import('./admin/admin.dashboard.module').then((m) => m.AdminDashboardModule) },
            // { path: 'dashboard-employee', data: { breadcrumb: 'Employee Dashboard' }, loadChildren: () => import('./employee/employee.dashboard.module').then((m) => m.EmployeeDashboardModule) }
        ])
    ],
    exports: [RouterModule]
})
export class DashboardsRoutingModule {}
