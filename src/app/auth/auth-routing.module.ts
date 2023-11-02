import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { EmailconfirmationComponent } from './emailconfirmation/emailconfirmation.component';
import { ErrorComponent } from './error/error.component';
import { LockScreenComponent } from './lockscreen/lockscreen.component';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { SecurityquestionsComponent } from './securityquestions/securityquestions.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'error', data: { breadcrumb: 'Error' }, component: ErrorComponent },
            { path: 'settings', data: { breadcrumb: 'Error' }, component: SettingsComponent },
            { path: 'access', data: { breadcrumb: 'Access' }, component: AccessdeniedComponent },
            { path: 'login', loadChildren: () => import('./login/login.module').then((m) => m.LoginModule) },
            { path: 'forgotpassword', loadChildren: () => import('./forgotpassword/forgotpassword.module').then((m) => m.ForgotPasswordModule) },
            { path: 'newpassword', data: { breadcrumb: 'NewPassword' }, component: NewPasswordComponent },
            { path: 'security',data:{breadcrumb:'Security Quesitons'},component:SecurityquestionsComponent},
            { path: 'lockscreen', data: { breadcrumb: 'LockScreen' }, component: LockScreenComponent },
            { path: 'emailconfirmaton', data: { breadcrumb: 'Email Confirmation' }, component: EmailconfirmationComponent },
            { path: '**', redirectTo: '/notfound' }
        ])
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
