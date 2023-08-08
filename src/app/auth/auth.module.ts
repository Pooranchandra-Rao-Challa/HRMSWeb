import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { PrimengModule } from '../_shared/primeng.module';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { LockScreenComponent } from './lockscreen/lockscreen.component';
import { ErrorComponent } from './error/error.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { AppConfigModule } from '../layout/config/app.config.module';

@NgModule({
    declarations: [
        NewPasswordComponent,
        LockScreenComponent,
        ErrorComponent,
        AccessdeniedComponent
    ],
    imports: [CommonModule, AuthRoutingModule,PrimengModule,AppConfigModule]
})
export class AuthModule {}
