import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { PrimengModule } from '../_shared/primeng.module';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { LockScreenComponent } from './lockscreen/lockscreen.component';
import { ErrorComponent } from './error/error.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { AppConfigModule } from '../layout/config/app.config.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HrmsAPIInterceptor } from '../_helpers/hrms.api.interceptor';
import { SecurityquestionsComponent } from './securityquestions/securityquestions.component';

@NgModule({
    declarations: [
        NewPasswordComponent,
        LockScreenComponent,
        ErrorComponent,
        AccessdeniedComponent,
        SecurityquestionsComponent
    ],
    imports: [CommonModule, AuthRoutingModule,PrimengModule,AppConfigModule],
    providers:[{ provide: HTTP_INTERCEPTORS, useClass: HrmsAPIInterceptor, multi: true }]

})
export class AuthModule {}
