import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgotPasswordComponent } from './forgotpassword.component';
import { SecurityquestionComponent } from './securityquestion/securityquestion.component';
import { SuccessmsgComponent } from './successmsg/successmsg.component';
import { UsernameComponent } from './username/username.component';

@NgModule({
    imports: [RouterModule.forChild([{
        path: '', component: ForgotPasswordComponent,

        children: [
            { path: '', redirectTo: 'username', pathMatch: 'full' },
            { path: 'username', component: UsernameComponent },
            { path: 'securityquestion', component: SecurityquestionComponent },
            { path: 'changepassword', component: ChangepasswordComponent },
            { path: 'successmessage', component: SuccessmsgComponent },
        ],
    }])],
    exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
