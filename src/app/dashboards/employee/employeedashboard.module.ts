
import { CommonModule } from '@angular/common';
import { EmployeeDashboardRoutigModule } from './employeedashboard-routing.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessagesModule } from 'primeng/messages';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { EmployeeDashboardComponent } from './employeedashboard.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        EmployeeDashboardRoutigModule,
        ButtonModule,
        RippleModule,
        DropdownModule,
        FormsModule,
        TableModule,
        InputTextModule,
        InputTextareaModule,
        ChartModule,
        RatingModule,
        KnobModule,
        ProgressBarModule,
        MessagesModule,
        TabViewModule,
        TagModule,
        MenuModule,
        BadgeModule
    ],
    declarations: [EmployeeDashboardComponent]
})
export class EmployeeDashboardModule {}
