import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeeLeaveDialogComponent } from 'src/app/_dialogs/employeeleave.dialog/employeeleave.dialog.component';
import { DATE_OF_JOINING, FORMAT_DATE, MEDIUM_DATE, ORIGINAL_DOB } from 'src/app/_helpers/date.formate.pipe';
import { HolidaysViewDto } from 'src/app/_models/admin';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { SelfEmployeeDto, selfEmployeeMonthlyLeaves, workingProjects } from 'src/app/_models/dashboard';
import { AdminService } from 'src/app/_services/admin.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { JwtService } from 'src/app/_services/jwt.service';
//import { GroupByPipe } from 'src/app/_directives/groupby'
interface Year {
    year: string;
}

@Component({
    selector: 'app-employeedashboard',
    templateUrl: './employeedashboard.component.html',
})
export class EmployeeDashboardComponent {
    empDetails: SelfEmployeeDto;
    defaultPhoto: string;
    originalDOB: string = ORIGINAL_DOB;
    dateOfJoining: string = DATE_OF_JOINING;
    mediumDate: string = MEDIUM_DATE;
    ActionTypes = Actions;
    permissions: any
    employeeleaveDialogComponent = EmployeeLeaveDialogComponent;
    dialogRequest: DialogRequest = new DialogRequest();
    month: number = new Date().getMonth() + 1;
    year: number = new Date().getFullYear();
    monthlyPLs: number = new Date().getMonth() + 1;
    yearlyPLs: number = new Date().getFullYear();
    monthlyCLs: number = new Date().getMonth() + 1;
    yearlyCLs: number = new Date().getFullYear();
    monthlyLWP: number = new Date().getMonth() + 1;
    yearlyLWP: number = new Date().getFullYear();
    selectedMonth: Date;
    days: number[] = [];
    monthlyLeaves: selfEmployeeMonthlyLeaves;
    selectedYear: any | undefined;
    holidays: HolidaysViewDto[] = [];
    years: any
    projects: {name:string, projectLogo: string, description:string, projectId:number, periods:{sinceFrom: Date, endAt:Date}[]}[] = [];

    constructor(private dashBoardService: DashboardService,
        private adminService: AdminService,
        private jwtService: JwtService,
       // private groupby:GroupByPipe,
        private dialogService: DialogService,
        public ref: DynamicDialogRef,
    ) { }

    headers: ITableHeader[] = [
        { field: 'title', header: 'title', label: 'Holiday Title' },
        { field: 'fromDate', header: 'fromDate', label: 'From Date' },
        { field: 'toDate', header: 'toDate', label: 'To Date' }
    ];

    ngOnInit() {
        this.permissions = this.jwtService.Permissions;
        this.getEmployeeDataBasedOnId()
        this.initializeYears();
        this.getHoliday()
        this.initGetLeavesForMonth();
    }

    getHoliday(): void {
        if (this.selectedYear) {
            const year = this.selectedYear.year;
            this.adminService.GetHolidays(year).subscribe((resp) => {
                this.holidays = resp as unknown as HolidaysViewDto[];
            });
        }
    }

    initializeYears(): void {
        const currentYear = new Date().getFullYear().toString();
        this.adminService.GetYearsFromHolidays().subscribe((years) => {
            this.years = years as unknown as Year[];
            this.selectedYear = this.years.find((year) => year.year.toString() === currentYear);
            if (!this.selectedYear) {
                this.selectedYear = { year: currentYear };
            }
            this.getHoliday();
        });
    }

    initGetLeavesForMonth() {
        this.dashBoardService.GetEmployeeLeavesForMonth(this.month, this.jwtService.EmployeeId,this.year).subscribe(resp => {
            this.monthlyLeaves = resp[0] as unknown as selfEmployeeMonthlyLeaves;

        });
    }



    getEmployeeDataBasedOnId() {

        this.dashBoardService.GetEmployeeDetails(this.jwtService.EmployeeId).subscribe((resp) => {
            this.empDetails = resp as unknown as SelfEmployeeDto;
            this.empDetails.assets = JSON.parse(this.empDetails.allottedAssets);
            this.empDetails.empaddress = JSON.parse(this.empDetails.addresses);
            this.empDetails.projects = JSON.parse(this.empDetails.workingProjects);

            this.updateProjects();

            /^male$/gi.test(this.empDetails.gender)
                ? this.defaultPhoto = './assets/layout/images/men-emp.jpg'
                : this.defaultPhoto = './assets/layout/images/women-emp.jpg'
        })
    }


    updateProjects(){
        let projectNames = this.empDetails.projects.map((item) => item.projectName)
            .filter((value, index, self) => self.indexOf(value) === index);
            console.log(projectNames);
            projectNames.forEach(projectName => {
                let values = this.empDetails.projects.filter(fn => fn.projectName == projectName);
                let periods: {sinceFrom: Date, endAt:Date}[] = [];
                values.forEach(p => { periods.push({sinceFrom:p.sinceFrom,endAt:p.endAt }) })
                this.projects.push(
                    {
                        projectId:values[0].projectId,
                        description:values[0].projectDescription,
                        name:projectName,
                        projectLogo: values[0].projectLogo,
                        periods:periods
                    }
                )
            });

            console.log(this.projects);

    }

    gotoPreviousMonthPLs() {
        if (this.monthlyPLs > 1)
            this.monthlyPLs--;
        else {
            this.monthlyPLs = 12;        // Reset to December
            this.yearlyPLs--;            // Decrement the year
        }
        this.selectedMonth = FORMAT_DATE(new Date(this.yearlyPLs, this.monthlyPLs - 1, 1));
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonthPLs(this.yearlyPLs, this.monthlyPLs);
        this.getEmployeeDataBasedOnId();
        this.initGetLeavesForMonth();
    }

    gotoNextMonthPLs() {
        if (this.monthlyPLs < 12)
            this.monthlyPLs++;
        else {
            this.monthlyPLs = 1; // Reset to January
            this.yearlyPLs++;    // Increment the year
        }
        this.selectedMonth = FORMAT_DATE(new Date(this.yearlyPLs, this.monthlyPLs - 1, 1));
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonthPLs(this.yearlyPLs, this.monthlyPLs);
        this.getEmployeeDataBasedOnId();
        this.initGetLeavesForMonth();
    }

    getDaysInMonthPLs(year: number, month: number) {
        const date = new Date(year, month - 1, 1);
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);
        let day = date.getDate();
        this.days = [];
        for (let i = 1; i <= day; i++)
            this.days.push(i);
    }

    onMonthSelectPLs(event) {
        this.monthlyPLs = this.selectedMonth.getMonth() + 1; // Month is zero-indexed
        this.yearlyPLs = this.selectedMonth.getFullYear();
        this.getDaysInMonthPLs(this.yearlyPLs, this.monthlyPLs);
        this.getEmployeeDataBasedOnId();
    }

    gotoPreviousMonthCLs() {
        if (this.monthlyCLs > 1)
            this.monthlyCLs--;
        else {
            this.monthlyCLs = 12;        // Reset to December
            this.yearlyCLs--;            // Decrement the year
        }
        this.selectedMonth = FORMAT_DATE(new Date(this.yearlyCLs, this.monthlyCLs - 1, 1));
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonthCLs(this.yearlyCLs, this.monthlyCLs);
        this.getEmployeeDataBasedOnId();
        this.initGetLeavesForMonth();
    }

    gotoNextMonthCLs() {
        if (this.monthlyCLs < 12)
            this.monthlyCLs++;
        else {
            this.monthlyCLs = 1; // Reset to January
            this.yearlyCLs++;    // Increment the year
        }
        this.selectedMonth = FORMAT_DATE(new Date(this.yearlyCLs, this.monthlyCLs - 1, 1));
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonthCLs(this.yearlyCLs, this.monthlyCLs);
        this.getEmployeeDataBasedOnId();
        this.initGetLeavesForMonth();
    }

    getDaysInMonthCLs(year: number, month: number) {
        const date = new Date(year, month - 1, 1);
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);
        let day = date.getDate();
        this.days = [];
        for (let i = 1; i <= day; i++)
            this.days.push(i);
    }

    onMonthSelectCLs(event) {
        this.monthlyCLs = this.selectedMonth.getMonth() + 1; // Month is zero-indexed
        this.yearlyCLs = this.selectedMonth.getFullYear();
        this.getDaysInMonthCLs(this.yearlyCLs, this.monthlyCLs);
        this.getEmployeeDataBasedOnId();
    }

    gotoPreviousMonthLWP() {
        if (this.monthlyLWP> 1)
            this.monthlyLWP--;
        else {
            this.monthlyLWP = 12;        // Reset to December
            this.yearlyLWP--;            // Decrement the year
        }
        this.selectedMonth = FORMAT_DATE(new Date(this.yearlyLWP, this.monthlyLWP - 1, 1));
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonthLWP(this.yearlyLWP, this.monthlyLWP);
        this.getEmployeeDataBasedOnId();
        this.initGetLeavesForMonth();
    }

    gotoNextMonthLWP() {
        if (this.monthlyLWP < 12)
            this.monthlyLWP++;
        else {
            this.monthlyLWP = 1; // Reset to January
            this.yearlyLWP++;    // Increment the year
        }
        this.selectedMonth = FORMAT_DATE(new Date(this.yearlyLWP, this.monthlyLWP - 1, 1));
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonthLWP(this.yearlyLWP, this.monthlyLWP);
        this.getEmployeeDataBasedOnId();
        this.initGetLeavesForMonth();
    }

    getDaysInMonthLWP(year: number, month: number) {
        const date = new Date(year, month - 1, 1);
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);
        let day = date.getDate();
        this.days = [];
        for (let i = 1; i <= day; i++)
            this.days.push(i);
    }

    onMonthSelectLWP(event) {
        this.monthlyLWP = this.selectedMonth.getMonth() + 1; // Month is zero-indexed
        this.yearlyLWP = this.selectedMonth.getFullYear();
        this.getDaysInMonthLWP(this.yearlyLWP, this.monthlyLWP);
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
// class Group<T> {
//     key:string;
//     members:T[] = [];
//     constructor(key:string) {
//         this.key = key;
//     }
// }


// function groupBy<T>(list:T[], func:(x:T)=>string): Group<T>[] {
//     let res:Group<T>[] = [];
//     let group:Group<T> = null;
//     list.forEach((o)=>{
//         let groupName = func(o);
//         if (group === null) {
//             group = new Group<T>(groupName);
//         }
//         if (groupName != group.key) {
//             res.push(group);
//             group = new Group<T>(groupName);
//         }
//         group.members.push(o)
//     });
//     if (group != null) {
//         res.push(group);
//     }
//     return res
// }
