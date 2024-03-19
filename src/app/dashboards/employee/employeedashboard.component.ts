import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, map } from 'rxjs/operators';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { EmployeeLeaveDialogComponent } from 'src/app/_dialogs/employeeleave.dialog/employeeleave.dialog.component';
import { DATE_OF_JOINING, FORMAT_DATE, MEDIUM_DATE, ORIGINAL_DOB } from 'src/app/_helpers/date.formate.pipe';
import { HolidaysViewDto, ProjectDetailsDto } from 'src/app/_models/admin';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { NotificationsDto, NotificationsRepliesDto, SelfEmployeeDto, selfEmployeeMonthlyLeaves } from 'src/app/_models/dashboard';
import { AdminService } from 'src/app/_services/admin.service';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { Observable, of } from 'rxjs';
import { LOGIN_URI } from 'src/app/_services/api.uri.service';
//import { GroupByPipe } from 'src/app/_directives/groupby'
interface Year {
    year: string;
}

@Component({
    selector: 'app-employeedashboard',
    templateUrl: './employeedashboard.component.html',
})
export class EmployeeDashboardComponent implements OnInit {
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
    selectedMonthforPL: Date;
    selectedMonthforCL: Date;
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
    defaultPhotoforAssets: any;
    usedPLsInMonth: number;
    usedCLsInMonth: number;
    hasBirthdayWishes: any

    constructor(private dashBoardService: DashboardService,
        private adminService: AdminService,
        private jwtService: JwtService,
        private alertMessage: AlertmessageService,
        private dialogService: DialogService,
        public ref: DynamicDialogRef,
        private formbuilder: FormBuilder,
    ) {
        this.employeeId = this.jwtService.EmployeeId;
        this.selectedMonthforPL = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
        this.selectedMonthforPL.setHours(0, 0, 0, 0);
        this.selectedMonthforCL = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
        this.selectedMonthforCL.setHours(0, 0, 0, 0);
    }


    headers: ITableHeader[] = [
        { field: 'title', header: 'title', label: 'Holiday Title' },
        { field: 'fromDate', header: 'fromDate', label: 'From Date' },
        { field: 'toDate', header: 'toDate', label: 'To Date' }
    ];

    ngOnInit() {

        this.permissions = this.jwtService.Permissions;
        this.wishesDialog = false;
        this.getEmployeeDataBasedOnId();
        this.defaultPhotoforAssets = './assets/layout/images/projectsDefault.jpg';
        this.initializeYears();
        this.getHoliday()
        this.initGetLeavesForMonthPL();
        this.initGetLeavesForMonthCL();
        this.initNotifications();
        this.initNotificationsBasedOnId();
        this.initWishesForm();
    }

    initWishesForm() {
        this.fbWishes = this.formbuilder.group({
            message: new FormControl('', [Validators.required]),
            notificationId: new FormControl('', [Validators.required]),
            employeeId: new FormControl('', [Validators.required]),
            employeeName:new FormControl('', [Validators.required]),
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

    getProjectLogo(project: ProjectDetailsDto) {
        return this.adminService.GetProjectLogo(project.projectId).subscribe((resp) => {
            project.logo = (resp as any).ImageData;
        })
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

    restrictSpaces(event: KeyboardEvent) {
        const target = event.target as HTMLInputElement;
        // Prevent the first key from being a space
        if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0)
            event.preventDefault();

        // Restrict multiple spaces
        if (event.key === ' ' && target.selectionStart > 0 && target.value.charAt(target.selectionStart - 1) === ' ') {
            event.preventDefault();
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

    initGetLeavesForMonthPL() {
        this.dashBoardService.GetEmployeeLeavesForMonth(this.monthlyPLs, this.jwtService.EmployeeId, this.yearlyPLs).subscribe(resp => {
            this.monthlyLeaves = resp[0] as unknown as selfEmployeeMonthlyLeaves;
            this.usedPLsInMonth = this.monthlyLeaves?.usedPLsInMonth;
        });
    }

    initGetLeavesForMonthCL() {
        this.dashBoardService.GetEmployeeLeavesForMonth(this.monthlyCLs, this.jwtService.EmployeeId, this.yearlyCLs).subscribe(resp => {
            this.monthlyLeaves = resp[0] as unknown as selfEmployeeMonthlyLeaves;
            this.usedCLsInMonth = this.monthlyLeaves?.usedCLsInMonth;
        });
    }
    initNotifications() {
        this.dashBoardService.GetNotifications().subscribe(resp => {
            this.notifications = resp as unknown as NotificationsDto[];
            console.log(resp);

            if (Array.isArray(this.notifications)) {
                this.hasBirthdayNotifications = this.notifications?.some(employee => employee.messageType === 'Birthday');
                this.hasHRNotifications = this.notifications.some(employee => employee.messageType !== 'Birthday');
            }
        })
    }
    initNotificationsBasedOnId() {
        this.dashBoardService.GetNotificationsBasedOnId(this.jwtService.EmployeeId).subscribe(resp => {
            this.notificationReplies = resp as unknown as NotificationsRepliesDto[];
            console.log(resp);
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
        this.fbWishes.get('employeeName').setValue(data.employeeName);
        this.fbWishes.get('employeeId').setValue(this.jwtService.EmployeeId);
        this.fbWishes.get('isActive').setValue(true);
    }
    onSubmit() {
        this.dashBoardService.sendBithdayWishes(this.fbWishes.value).subscribe(resp => {
            let rdata = resp as unknown as any;
            if (rdata.isSuccess){
                this.alertMessage.displayAlertMessage(`Wishes Sent to ${this.fbWishes.get('employeeName').value} Successfully.`)
                this.initNotifications();
            }
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
        if (this.empDetails && this.empDetails.projects) {
            let projectNames = this.empDetails.projects
                .map((item) => item.projectName)
                .filter((value, index, self) => self.indexOf(value) === index);
            this.projects = [];
            projectNames.forEach(projectName => {
                let values = this.empDetails.projects.filter(fn => fn.projectName == projectName);

                if (values.length > 0) {
                    let periods: { sinceFrom: Date, endAt: Date }[] = [];
                    values.forEach(p => {
                        periods.push({ sinceFrom: p.sinceFrom, endAt: p.endAt });
                    });

                    this.projects.push({
                        projectId: values[0].projectId,
                        description: values[0].projectDescription,
                        name: projectName,
                        projectLogo: values[0].projectLogo,
                        periods: periods
                    });
                }
            });
        }
    }


    gotoPreviousMonthPLs() {
        if (this.monthlyPLs > 1)
            this.monthlyPLs--;
        else {
            this.monthlyPLs = 12;        // Reset to December
            this.yearlyPLs--;            // Decrement the year
        }
        this.selectedMonthforPL = FORMAT_DATE(new Date(this.yearlyPLs, this.monthlyPLs - 1, 1));
        this.selectedMonthforPL.setHours(0, 0, 0, 0);
        this.getDaysInMonthPLs(this.yearlyPLs, this.monthlyPLs);
        this.initGetLeavesForMonthPL();
    }

    gotoNextMonthPLs() {
        if (this.monthlyPLs < 12)
            this.monthlyPLs++;
        else {
            this.monthlyPLs = 1; // Reset to January
            this.yearlyPLs++;    // Increment the year
        }
        this.selectedMonthforPL = FORMAT_DATE(new Date(this.yearlyPLs, this.monthlyPLs - 1, 1));
        this.selectedMonthforPL.setHours(0, 0, 0, 0);
        this.getDaysInMonthPLs(this.yearlyPLs, this.monthlyPLs);
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
        this.monthlyPLs = this.selectedMonthforPL.getMonth() + 1; // Month is zero-indexed
        this.yearlyPLs = this.selectedMonthforPL.getFullYear();
        this.getDaysInMonthPLs(this.yearlyPLs, this.monthlyPLs);
        this.initGetLeavesForMonthPL();
    }

    gotoPreviousMonthCLs() {
        if (this.monthlyCLs > 1)
            this.monthlyCLs--;
        else {
            this.monthlyCLs = 12;        // Reset to December
            this.yearlyCLs--;            // Decrement the year
        }
        this.selectedMonthforCL = FORMAT_DATE(new Date(this.yearlyCLs, this.monthlyCLs - 1, 1));
        this.selectedMonthforCL.setHours(0, 0, 0, 0);
        this.getDaysInMonthCLs(this.yearlyCLs, this.monthlyCLs);
        this.initGetLeavesForMonthCL();
    }

    gotoNextMonthCLs() {
        if (this.monthlyCLs < 12)
            this.monthlyCLs++;
        else {
            this.monthlyCLs = 1; // Reset to January
            this.yearlyCLs++;    // Increment the year
        }
        this.selectedMonthforCL = FORMAT_DATE(new Date(this.yearlyCLs, this.monthlyCLs - 1, 1));
        this.selectedMonthforCL.setHours(0, 0, 0, 0);
        this.getDaysInMonthCLs(this.yearlyCLs, this.monthlyCLs);
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
        this.monthlyCLs = this.selectedMonthforCL.getMonth() + 1; // Month is zero-indexed
        this.yearlyCLs = this.selectedMonthforCL.getFullYear();
        this.getDaysInMonthCLs(this.yearlyCLs, this.monthlyCLs);
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
        });
    }
    
    private statusCache: { [key: string]: Observable<any[]> } = {};

    getStatus(employeeId): Observable<any[]> {
      if (this.statusCache[employeeId]) {
        return this.statusCache[employeeId];
      }
      
      const statusObservable = this.dashBoardService.GetNotificationsBasedOnId(employeeId).pipe(
        map((response: any) => {
          if (Array.isArray(response)) {
            return response.filter(notification => notification.employeeId ===  parseInt(this.employeeId, 10));
          } else {
            return [];
          }
        }),
        catchError(error => {
          console.error('Error fetching notifications:', error);
          return of([]); 
        })
      );
      
      this.statusCache[employeeId] = statusObservable;
      return statusObservable;
    }
      
}