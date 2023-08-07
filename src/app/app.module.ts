import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { EmployeeRoutingModule } from './employee/employee-routing.module';
import { HrmsAPIInterceptor } from './_helpers/hrms.api.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
@NgModule({
    declarations: [AppComponent],
    imports: [AppRoutingModule, AppLayoutModule, EmployeeRoutingModule],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: HrmsAPIInterceptor, multi: true },],
    bootstrap: [AppComponent]
})
export class AppModule {}
