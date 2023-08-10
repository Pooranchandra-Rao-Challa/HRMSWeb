import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { EmployeeRoutingModule } from './employee/employee-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { MessageService } from 'primeng/api';
import { HRMSAPIInterceptor } from './_helpers/HRMS.api.interceptor';
@NgModule({
    declarations: [AppComponent],
    imports: [AppRoutingModule, AppLayoutModule, EmployeeRoutingModule, AuthRoutingModule],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HRMSAPIInterceptor, multi: true },
        MessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
