import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { EmployeeLeaveDialogComponent } from 'src/app/_dialogs/employeeleave.dialog/employeeleave.dialog.component';
import { DATE_OF_JOINING, FORMAT_DATE, MEDIUM_DATE, ORIGINAL_DOB } from 'src/app/_helpers/date.formate.pipe';
import { HolidaysViewDto } from 'src/app/_models/admin';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { NotificationsDto, NotificationsRepliesDto, SelfEmployeeDto, selfEmployeeMonthlyLeaves, workingProjects } from 'src/app/_models/dashboard';
import { AdminService } from 'src/app/_services/admin.service';
import { LOGIN_URI } from 'src/app/_services/api.uri.service';
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
    selectedMonth: Date;
    days: number[] = [];
    monthlyLeaves: selfEmployeeMonthlyLeaves;
    selectedYear: any | undefined;
    holidays: HolidaysViewDto[] = [];
    isActiveNotifications: boolean = true;
    notifications: NotificationsDto[] = [];
    notificationReplies: NotificationsRepliesDto[] = []
    @ViewChild('Wishes') Wishes!: ElementRef;
    fbWishes!: FormGroup;
    employeeId: any;
    wishesDialog: boolean;
    years: any
    projects: { name: string, projectLogo: string, description: string, projectId: number, periods: { sinceFrom: Date, endAt: Date }[] }[] = [];
    fieldset1Open = true;
    fieldset2Open = false;
    fieldset3Open = false;
    hasBirthdayNotifications: any;
    hasHRNotifications: any;

    constructor(private dashBoardService: DashboardService,
        private adminService: AdminService,
        private jwtService: JwtService,
        private alertMessage: AlertmessageService,
        // private groupby:GroupByPipe,
        private dialogService: DialogService,
        public ref: DynamicDialogRef, private formbuilder: FormBuilder,
    ) {
        this.employeeId = this.jwtService.EmployeeId
    }

    headers: ITableHeader[] = [
        { field: 'title', header: 'title', label: 'Holiday Title' },
        { field: 'fromDate', header: 'fromDate', label: 'From Date' },
        { field: 'toDate', header: 'toDate', label: 'To Date' }
    ];

    ngOnInit() {
        this.permissions = this.jwtService.Permissions;
        this.wishesDialog = false;
        this.getEmployeeDataBasedOnId()
        this.initializeYears();
        this.getHoliday()
        this.initGetLeavesForMonth();
        this.initNotifications();
        this.initNotificationsBasedOnId();
        this.initWishesForm();
    }

    initWishesForm() {
        this.fbWishes = this.formbuilder.group({
            message: new FormControl('', [Validators.required]),
            notificationId: new FormControl('', [Validators.required]),
            employeeId: new FormControl('', [Validators.required]),
            isActive: new FormControl(true),
        })
    }

    getHoliday(): void {
        if (this.selectedYear) {
            const year = this.selectedYear.year;
            this.adminService.GetHolidays(year).subscribe((resp) => {
                this.holidays = resp as unknown as HolidaysViewDto[];
            });
        }
    }
    toggleFieldset(legend: string): void {
        const fieldsets = ['HR Notifications', 'Today Birthday', 'Greetings'];

        // Close all fieldsets
        this.fieldset1Open = false;
        this.fieldset2Open = false;
        this.fieldset3Open = false;

        // Open the selected fieldset
        const index = fieldsets.indexOf(legend);
        if (index !== -1) {
            this[`fieldset${index + 1}Open`] = true;
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
        this.dashBoardService.GetEmployeeLeavesForMonth(this.month, this.jwtService.EmployeeId, this.year).subscribe(resp => {
            this.monthlyLeaves = resp[0] as unknown as selfEmployeeMonthlyLeaves;
            console.log(this.monthlyLeaves);
            
        });
    }

    initGetLeavesForMonthPL() {
        this.dashBoardService.GetEmployeeLeavesForMonth(this.monthlyPLs, this.jwtService.EmployeeId, this.yearlyPLs).subscribe(resp => {
            this.monthlyLeaves = resp[0] as unknown as selfEmployeeMonthlyLeaves;
            console.log(this.monthlyLeaves);
            
        });
    }

    initGetLeavesForMonthCL() {
        this.dashBoardService.GetEmployeeLeavesForMonth(this.monthlyCLs, this.jwtService.EmployeeId, this.yearlyCLs).subscribe(resp => {
            this.monthlyLeaves = resp[0] as unknown as selfEmployeeMonthlyLeaves;
            console.log(this.monthlyLeaves);
            
        });
    }
    initNotifications() {
        this.dashBoardService.GetNotifications().subscribe(resp => {
            this.notifications = resp as unknown as NotificationsDto[];
            this.hasBirthdayNotifications = this.notifications?.some(employee => employee.messageType === 'Birthday');
            this.hasHRNotifications = this.notifications?.some(employee => employee.messageType !== 'Birthday');
        })
    }
    initNotificationsBasedOnId() {
        this.dashBoardService.GetNotificationsBasedOnId(this.jwtService.EmployeeId).subscribe(resp => {
            this.notificationReplies = resp as unknown as NotificationsRepliesDto[];
        })
    }
    transformDateIntoTime(createdAt: any): string {
        const currentDate = new Date();
        const createdDate = new Date(createdAt);

        const timeDifference = currentDate.getTime() - createdDate.getTime();
        const hours: number = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes: number = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        if (hours >= 24) {
            const formattedDate = this.formatDate(createdDate);
            return `${formattedDate}`;
        }
        else if (hours > 0)
            return `${hours} hr${hours > 1 ? 's' : ''} ago`;
        else if (minutes > 0)
            return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        else
            return 'Just now';

    }
    private formatDate(date: Date): string {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    }

    showBirthdayDialog(data: any) {
        this.fbWishes.reset();
        this.wishesDialog = true;
        this.fbWishes.get('notificationId').setValue(data.notificationId);
        this.fbWishes.get('employeeId').setValue(this.jwtService.EmployeeId);
        this.fbWishes.get('isActive').setValue(true);
    }
    onSubmit() {
        this.dashBoardService.sendBithdayWishes(this.fbWishes.value).subscribe(resp => {
            let rdata = resp as unknown as any;
            if (rdata.isSuccess)
                this.alertMessage.displayAlertMessage(ALERT_CODES["ADW001"])

            else if (!rdata.isSuccess)
                this.alertMessage.displayErrorMessage(rdata.message);

            this.wishesDialog = false;
            this.initWishesForm();
        })
    }
    onClose() {
        this.wishesDialog = false;
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

    updateProjects() {
        let projectNames = this.empDetails?.projects?.map((item) => item.projectName)
            .filter((value, index, self) => self.indexOf(value) === index);
        this.projects = [];
        projectNames.forEach(projectName => {
            let values = this.empDetails.projects.filter(fn => fn.projectName == projectName);
            let periods: { sinceFrom: Date, endAt: Date }[] = [];
            values.forEach(p => { periods.push({ sinceFrom: p.sinceFrom, endAt: p.endAt }) })
            this.projects.push(
                {
                    projectId: values[0].projectId,
                    description: values[0].projectDescription,
                    name: projectName,
                    projectLogo: values[0].projectLogo,
                    periods: periods
                }
            )
        });
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
        this.initGetLeavesForMonthPL();
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
        this.initGetLeavesForMonthPL();
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
        this.initGetLeavesForMonthPL();
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
        this.initGetLeavesForMonthCL();
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
        this.initGetLeavesForMonthCL();
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
        this.initGetLeavesForMonthCL();
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
