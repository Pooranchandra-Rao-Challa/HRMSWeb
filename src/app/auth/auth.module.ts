import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { LockScreenComponent } from './lockscreen/lockscreen.component';
import { ErrorComponent } from './error/error.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HrmsAPIInterceptor } from '../_helpers/hrms.api.interceptor';
import { SecurityquestionsComponent } from './securityquestions/securityquestions.component';
import { SharedModule } from '../_shared/shared.module';
import { SettingsComponent } from './settings/settings.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [
        NewPasswordComponent,
        LockScreenComponent,
        ErrorComponent,
        AccessdeniedComponent,
        SecurityquestionsComponent,
        SettingsComponent],
    imports: [
        AuthRoutingModule,
        SharedModule,
        ToastModule,
    ],
    providers:[MessageService,{ provide: HTTP_INTERCEPTORS, useClass: HrmsAPIInterceptor, multi: true }]

})
export class AuthModule {}
