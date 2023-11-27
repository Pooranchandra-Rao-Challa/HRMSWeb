import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardsRoutingModule } from './dashboards-routing.module';
import { EmployeeDashboardComponent } from './hr/employeedashboard.component';

@NgModule({
    imports: [CommonModule, DashboardsRoutingModule],
    declarations: [
    ]
})
export class DashboardsModule {}
