import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { SettingsComponent } from './auth/settings/settings.component';
import { CanDeactivateGuard } from './_guards/can-deactivate.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    
    { path: '', loadChildren: () => import('src/app/auth/login/login.module').then(m => m.LoginModule) },
    { path: 'login', loadChildren: () => import('src/app/auth/login/login.module').then(m => m.LoginModule) },
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            { path: 'settings', component: SettingsComponent, canDeactivate: [CanDeactivateGuard] },
            { path: 'dashboard', loadChildren: () => import('./dashboards/dashboards.module').then((m) => m.DashboardsModule) },
            { path: 'uikit', data: { breadcrumb: 'UI Kit' }, loadChildren: () => import('./demo/components/uikit/uikit.module').then((m) => m.UIkitModule) },
            { path: 'employee', data: { breadcrumb: 'Employee' }, loadChildren: () => import('./employee/employee.module').then((m) => m.EmployeeModule) },
            { path: 'security', data: { breadcrumb: 'Security' }, loadChildren: () => import('./security/security.module').then((m) => m.SecurityModule) },
            { path: 'admin', data: { breadcrumb: 'Admin' }, loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule) }
        ]
    },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
