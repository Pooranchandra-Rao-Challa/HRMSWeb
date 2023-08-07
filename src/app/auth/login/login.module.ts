import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HrmsAPIInterceptor } from 'src/app/_helpers/hrms.api.interceptor';

@NgModule({
    imports: [CommonModule,
        LoginRoutingModule,
        ButtonModule,
         InputTextModule,
        CheckboxModule,
        AppConfigModule, 
        FormsModule,
        PasswordModule,
        ReactiveFormsModule,
        ToastModule],
    declarations: [LoginComponent],
    providers: [MessageService,{ provide: HTTP_INTERCEPTORS, useClass: HrmsAPIInterceptor, multi: true }],
})
export class LoginModule { }
