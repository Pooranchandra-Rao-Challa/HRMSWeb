import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeeLeaveDialogComponent } from 'src/app/_dialogs/employeeleave.dialog/employeeleave.dialog.component';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { Actions, DialogRequest } from 'src/app/_models/common';
import { SelfEmployeeDto, selfEmployeeMonthlyLeaves } from 'src/app/_models/dashboard';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { JwtService } from 'src/app/_services/jwt.service';

@Component({
    selector: 'app-employeedashboard',
    templateUrl: './employeedashboard.component.html',
})
export class EmployeeDashboardComponent {
    empDetails: SelfEmployeeDto;
    defaultPhoto: string;
    mediumDate: string = MEDIUM_DATE
    ActionTypes = Actions;
    permissions:any
    employeeleaveDialogComponent = EmployeeLeaveDialogComponent;
    dialogRequest: DialogRequest = new DialogRequest();
    month: number = new Date().getMonth() + 1;
    year: number = 2023;
    selectedMonth: Date;
    days: number[] = [];
    monthlyLeaves:selfEmployeeMonthlyLeaves;

    constructor(private dashBoardService: DashboardService,
        private jwtService: JwtService,
        private dialogService: DialogService,
        public ref: DynamicDialogRef,
    ) { }

    ngOnInit() {
        this.permissions = this.jwtService.Permissions;
        this.getEmployeeDataBasedOnId()
        this.getDaysInMonth(this.year, this.month);
        this.initGetLeavesForMonth();
    }
    initGetLeavesForMonth(){
        this.dashBoardService.GetEmployeeLeavesForMonth(this.month,this.jwtService.EmployeeId).subscribe(resp=>{
            this.monthlyLeaves=resp[0] as unknown as selfEmployeeMonthlyLeaves; 
        });
    }
    getEmployeeDataBasedOnId() {
        this.dashBoardService.GetEmployeeDetails(this.jwtService.EmployeeId).subscribe((resp) => {
            this.empDetails = resp as unknown as SelfEmployeeDto;
            this.empDetails.projects = JSON.parse(this.empDetails.workingProjects);
            /^male$/gi.test(this.empDetails.gender)
                ? this.defaultPhoto = './assets/layout/images/men-emp.jpg'
                : this.defaultPhoto = './assets/layout/images/women-emp.jpg'
        })
    }

    gotoPreviousMonth() {
        if (this.month > 1)
            this.month--;
        else {
            this.month = 12;        // Reset to December
            this.year--;            // Decrement the year
        }
        this.selectedMonth = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonth(this.year, this.month);
        this.getEmployeeDataBasedOnId();
        this.initGetLeavesForMonth();
    }

    gotoNextMonth() {
        if (this.month < 12)
            this.month++;
        else {
            this.month = 1; // Reset to January
            this.year++;    // Increment the year
        }
        this.selectedMonth = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonth(this.year, this.month);
        this.getEmployeeDataBasedOnId();
        this.initGetLeavesForMonth();
    }

    getDaysInMonth(year: number, month: number) {
        const date = new Date(year, month - 1, 1);
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);
        let day = date.getDate();
        this.days = [];
        for (let i = 1; i <= day; i++) 
            this.days.push(i);
    }

    onMonthSelect(event) {
        console.log(this.selectedMonth);
        this.month = this.selectedMonth.getMonth() + 1; // Month is zero-indexed
        this.year = this.selectedMonth.getFullYear();
        this.getDaysInMonth(this.year, this.month);
        this.getEmployeeDataBasedOnId();
      }

    openComponentDialog(content: any,
        dialogData, action: Actions = this.ActionTypes.add) {
        if (action == Actions.save && content === this.employeeleaveDialogComponent) {
            this.dialogRequest.dialogData = dialogData;
            this.dialogRequest.header = "Leave";
            this.dialogRequest.width = "60%";
        }
        this.ref = this.dialogService.open(content, {
            data: this.dialogRequest.dialogData,
            header: this.dialogRequest.header,
            width: this.dialogRequest.width
        });
        this.ref.onClose.subscribe((res: any) => {
            if (res) this.getEmployeeDataBasedOnId();
            event.preventDefault(); // Prevent the default form submission
        });
    }
}
