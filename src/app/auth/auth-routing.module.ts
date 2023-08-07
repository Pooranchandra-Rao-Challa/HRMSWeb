import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'error', loadChildren: () => import('./error/error.module').then((m) => m.ErrorModule) },
            { path: 'access', loadChildren: () => import('./accessdenied/accessdenied.module').then((m) => m.AccessdeniedModule) },
            { path: 'login', loadChildren: () => import('./login/login.module').then((m) => m.LoginModule) },
            { path: 'forgotpassword', loadChildren: () => import('./forgotpassword/forgotpassword.module').then((m) => m.ForgotPasswordModule) },
            { path: 'newpassword', loadChildren: () => import('./newpassword/newpassword.module').then((m) => m.NewPasswordModule) },
            { path: 'lockscreen', loadChildren: () => import('./lockscreen/lockscreen.module').then((m) => m.LockScreenModule) },
            { path: '**', redirectTo: '/notfound' }
        ])
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
