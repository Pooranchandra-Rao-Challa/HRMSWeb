import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordRoutingModule } from './forgotpassword-routing.module';
import { ForgotPasswordComponent } from './forgotpassword.component';
import { PrimengModule } from 'src/app/_shared/primeng.module';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { RequestforgotpasswordComponent } from './requestforgotpassword/requestforgotpassword.component';
import { SecurityquestionComponent } from './securityquestion/securityquestion.component';
import { SuccessmsgComponent } from './successmsg/successmsg.component';
import { UsernameComponent } from './username/username.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { MessageService } from 'primeng/api';
@NgModule({
    imports: [CommonModule, PrimengModule, ForgotPasswordRoutingModule, AppConfigModule],
    declarations: [ForgotPasswordComponent, ChangepasswordComponent, RequestforgotpasswordComponent, SecurityquestionComponent, SuccessmsgComponent, UsernameComponent,

    ],
    providers: [MessageService]
})
export class ForgotPasswordModule { }
