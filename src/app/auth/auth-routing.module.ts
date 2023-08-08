import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { ErrorComponent } from './error/error.component';
import { LockScreenComponent } from './lockscreen/lockscreen.component';
import { LoginComponent } from './login/login.component';
import { NewPasswordComponent } from './newpassword/newpassword.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'error',data: { breadcrumb: 'Error' }, component:ErrorComponent  },
            { path: 'access', data: {breadcrumb: 'Access'},component:AccessdeniedComponent},
            { path: 'login',  loadChildren: () => import('./login/login.module').then((m) => m.LoginModule) },
            { path: 'forgotpassword', loadChildren: () => import('./forgotpassword/forgotpassword.module').then((m) => m.ForgotPasswordModule) },
            { path: 'newpassword',data: {breadcrumb: 'NewPassword'},component:NewPasswordComponent},
            { path: 'lockscreen',data:{breadcrumb:'LockScreen'},component:LockScreenComponent},
            { path: '**', redirectTo: '/notfound' }
        ])
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
