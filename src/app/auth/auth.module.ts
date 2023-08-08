import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HrmsAPIInterceptor } from '../_helpers/hrms.api.interceptor';

@NgModule({
    declarations: [],
    imports: [CommonModule, AuthRoutingModule],
    providers:[{ provide: HTTP_INTERCEPTORS, useClass: HrmsAPIInterceptor, multi: true }]
})
export class AuthModule {}
