import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dE } from '@fullcalendar/core/internal-common';
import { MessageService } from 'primeng/api';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { DATE_FORMAT, DATE_FORMAT_MONTH, FORMAT_DATE, FORMAT_MONTH, MEDIUM_DATE, MONTH, ORIGINAL_DOB } from 'src/app/_helpers/date.formate.pipe';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { AttendanceCountBasedOnTypeViewDto, EmployeesofAttendanceCountsViewDto, adminDashboardViewDto, NotificationsRepliesDto, NotificationsDto } from 'src/app/_models/dashboard';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';


@Component({
    templateUrl: './admin.dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
    admindashboardDtls: adminDashboardViewDto;
    barDataforAttendance: any;
    barOptionsforAttendance: any;
    pieOptionsforProjects: any;
    pieDataforProjects: any;
    chartFilled: boolean;
    chart: string;
    empRadio: string;
    year: number = new Date().getFullYear();
    month: number = new Date().getMonth() + 1;
    selectedMonth: any;
    selectedDate: any;
    days: number[] = [];
    monthFormat: string = MONTH;
    dateFormat: string = MEDIUM_DATE;
    attendanceCount: AttendanceCountBasedOnTypeViewDto[] = [];
    notifications: NotificationsDto[] = [];
    notificationReplies: NotificationsRepliesDto[] = []
    wishesDialog: boolean = false;
    employeeCount: EmployeesofAttendanceCountsViewDto[] = [];
    hideElements: boolean = true;
    leaveType: LookupDetailsDto[] = [];
    filteredEmployeeCount: any;
    EmployeeId: any;
    fbWishes!: FormGroup;
    permissions: any;
    shouldDisplayMessage: boolean = false;
    hasBirthdayNotifications: any;

    constructor(private dashboardService: DashboardService,
        private router: Router,
        private jwtService: JwtService, private lookupService: LookupService,
        private formbuilder: FormBuilder,
        private alertMessage: AlertmessageService,) {
        this.selectedDate = new Date();
        this.EmployeeId = this.jwtService.EmployeeId;
    }

    ngOnInit() {
        this.permissions = this.jwtService.Permissions;
        this.initWishesForm();
        this.inItAdminDashboard();
        this.chart = 'Date';
        const currentDate = new Date();
        this.month = currentDate.getMonth() + 1;
        this.year = currentDate.getFullYear();

        this.selectedMonth = new Date(this.year, this.month - 1, 1);
        this.selectedMonth.setHours(0, 0, 0, 0);

        this.updateSelectedMonth();
        this.initNotifications();
        if (this.jwtService.EmployeeId) {
            this.initNotificationsBasedOnId()
        }

    }

    gotoPreviousDay() {
        const previousDay = new Date(this.selectedDate);
        previousDay.setDate(previousDay.getDate() - 1);
        this.selectedDate = previousDay;
        this.getAttendanceCountsBasedOnType();
    }

    onDaySelect(event) {
        this.selectedDate = DATE_FORMAT(new Date(event));
        this.getAttendanceCountsBasedOnType();
    }

    gotoNextDay() {
        const nextDay = new Date(this.selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        this.selectedDate = nextDay;
        this.getAttendanceCountsBasedOnType();
    }

    gotoPreviousMonth() {
        if (this.month > 1) {
            this.month--;
        } else {
            this.month = 12; // Reset to December
            this.year--;     // Decrement the year
        }
        this.updateSelectedMonth();
    }

    gotoNextMonth() {
        if (this.month < 12) {
            this.month++;
        } else {
            this.month = 1; // Reset to January
            this.year++;    // Increment the year
        }
        this.updateSelectedMonth();
        this.getAttendanceCountsBasedOnType();
    }

    updateSelectedMonth() {
        this.selectedMonth = new Date(this.year, this.month - 1, 1);
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonth(this.year, this.month);
    }

    onMonthSelect(event) {
        this.selectedMonth = event;
        this.month = this.selectedMonth.getMonth() + 1;
        this.year = this.selectedMonth.getFullYear();
        this.updateSelectedMonth();
        this.getAttendanceCountsBasedOnType();
    }

    getDaysInMonth(year: number, month: number) {
        const date = new Date(year, month - 1, 1);
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);
        let day = date.getDate();
        this.days = [];
        for (let i = 1; i <= day; i++) {
            this.days.push(i);
        }
        this.getAttendanceCountsBasedOnType();
    }

    formatMonth(month: number): string {
        const date = new Date(2000, month - 1, 1);
        return FORMAT_MONTH(date, this.monthFormat);
    }

    onYearSelect(event) {
        const date = new Date(event);
        const yearNumber = date.getFullYear();
        this.year = yearNumber;
        this.getAttendanceCountsBasedOnType();
    }

    gotoPreviousYear() {
        this.year--;
        this.getAttendanceCountsBasedOnType();
    }

    gotoNextYear() {
        this.year++;
        this.getAttendanceCountsBasedOnType();
    }

    getAttendanceCountsBasedOnType() {
        this.attendanceCount = [];
        this.employeeCount = [];
        this.shouldDisplayMessage = false;
        if (this.chart === 'Date') {
            this.selectedDate = DATE_FORMAT(new Date(this.selectedDate));
            this.dashboardService.GetAttendanceCountBasedOnType(this.chart, this.selectedDate).subscribe((resp) => {
                this.attendanceCount = resp as unknown as AttendanceCountBasedOnTypeViewDto[];
                this.attendanceChart();
            })
        }
        else if (this.chart === 'Month') {
            this.selectedMonth = DATE_FORMAT_MONTH(new Date(this.selectedMonth));
            this.dashboardService.GetAttendanceCountBasedOnType(this.chart, this.selectedMonth).subscribe((resp) => {
                this.attendanceCount = resp as unknown as AttendanceCountBasedOnTypeViewDto[];
                this.attendanceChart();
            })
        }
        else if (this.chart === 'Year') {
            this.dashboardService.GetAttendanceCountBasedOnType(this.chart, this.year).subscribe((resp) => {
                this.attendanceCount = resp as unknown as AttendanceCountBasedOnTypeViewDto[];
                this.attendanceChart();
            })
        }
    }

    inItAdminDashboard() {
        this.dashboardService.getAdminDashboard().subscribe((resp) => {
            this.admindashboardDtls = resp[0] as unknown as adminDashboardViewDto;
            // Parse and check if leave counts are available
            if (this.admindashboardDtls?.employeeLeaveCounts) {
                this.admindashboardDtls.savedemployeeLeaveCounts = JSON.parse(this.admindashboardDtls.employeeLeaveCounts) || [];
            } else {
                this.admindashboardDtls.savedemployeeLeaveCounts = [];
            }
            const leaveTypeCountsSum = this.admindashboardDtls.savedemployeeLeaveCounts.reduce((sum, leaveTypeData) => {
                return sum + leaveTypeData.leaveTypeCount;
            }, 0);
            this.admindashboardDtls.calculatedLeaveCount = leaveTypeCountsSum;

            // Parse and check if active projects are available
            this.admindashboardDtls.savedactiveProjects = JSON.parse(this.admindashboardDtls?.activeProjects) || [];
            const activeProjectssum = this.admindashboardDtls?.savedactiveProjects.reduce((sum, activeProjectsData) => {
                return sum + activeProjectsData.projectStatusCount;
            }, 0);
            this.admindashboardDtls.totalprojectsCount = activeProjectssum;

            // Parse and check if suspended projects are available
            this.admindashboardDtls.savedsupsendedProjects = JSON.parse(this.admindashboardDtls?.supsendedProjects) || [];
            this.admindashboardDtls.savedemployeeBirthdays = JSON.parse(this.admindashboardDtls?.employeeBirthdays) || [];
            this.admindashboardDtls.savedemployeesOnLeave = JSON.parse(this.admindashboardDtls?.employeesOnLeave) || [];
            this.admindashboardDtls.savedabsentEmployees = JSON.parse(this.admindashboardDtls?.absentEmployees) || [];
            this.admindashboardDtls.savedActiveEmployeesInOffice = JSON.parse(this.admindashboardDtls?.activeEmployeesInOffice) || [];
            this.chartFilled = this.admindashboardDtls.savedActiveEmployeesInOffice.length > 0;
            this.initChart();
        });
    }

    attendanceChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const CasualLeaves = this.attendanceCount.find(each => each.cl);
        const PrevlageLeaves = this.attendanceCount.find(each => each.pl);
        const present = this.attendanceCount.find(each => each.pt);
        const leaveWithoutPay = this.attendanceCount.find(each => each.lwp);
        const workFromHome = this.attendanceCount.find(each => each.wfh);

        this.barDataforAttendance = {
            labels: ['PT', 'WFH', 'PL', 'CL', 'LWP'],
            datasets: [
                {
                    data: [present?.pt, workFromHome?.wfh, PrevlageLeaves?.pl, CasualLeaves?.cl, leaveWithoutPay?.lwp],
                    backgroundColor: [documentStyle.getPropertyValue('--inofc-b'), documentStyle.getPropertyValue('--wfh-b'), documentStyle.getPropertyValue('--pl-b'), documentStyle.getPropertyValue('--cl-b'), documentStyle.getPropertyValue('--lwp-b')],
                    borderColor: surfaceBorder,
                }
            ]
        };
        this.barOptionsforAttendance = {
            animation: {
                duration: 500
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        display: true,
                        usePointStyle: true,
                    },
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    },
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    onChartClick(event: any): void {
        const clickedIndex = event?.element?.index;
        if (clickedIndex !== undefined) {
            const clickedLabel = this.barDataforAttendance.labels[clickedIndex];
            this.handleChartClick(clickedLabel);
        }
    }

    handleChartClick(clickedLabel: string): void {
        this.lookupService.DayWorkStatus().subscribe(resp => {
            this.leaveType = resp as unknown as LookupViewDto[];
            const leaveType = this.leaveType.find(type => type.name === clickedLabel);
            if (leaveType) {
                const lookupDetailId = leaveType.lookupDetailId;
                switch (clickedLabel) {
                    case 'PL':
                    case 'CL':
                    case 'PT':
                    case 'LWP':
                    case 'WFH':
                        if (this.chart === 'Date') {
                            this.selectedDate = DATE_FORMAT(new Date(this.selectedDate));
                            this.dashboardService.GetEmployeeAttendanceCount(this.chart, this.selectedDate, lookupDetailId)
                                .subscribe((resp) => {
                                    this.employeeCount = resp as unknown as EmployeesofAttendanceCountsViewDto[];
                                });
                        } else if (this.chart === 'Month') {
                            this.selectedMonth = DATE_FORMAT_MONTH(new Date(this.selectedMonth));
                            this.dashboardService.GetEmployeeAttendanceCount(this.chart, this.selectedMonth, lookupDetailId)
                                .subscribe((resp) => {
                                    this.employeeCount = resp as unknown as EmployeesofAttendanceCountsViewDto[];
                                });
                        } else if (this.chart === 'Year') {
                            this.dashboardService.GetEmployeeAttendanceCount(this.chart, this.year, lookupDetailId)
                                .subscribe((resp) => {
                                    this.employeeCount = resp as unknown as EmployeesofAttendanceCountsViewDto[];
                                    this.employeeCount.forEach(emp => {
                                        const date = new Date(emp.value);
                                        if (isNaN(date.getTime())) {
                                            emp.monthNames = 'Invalid Date';
                                        } else {
                                            emp.monthNames = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
                                        }
                                    });
                                    this.displayHugeDataMessage();
                                });
                        }
                        break;
                    default:
                        console.log('Unhandled click');
                        break;
                }
            }
        })
    }

    displayHugeDataMessage(): void {
        this.shouldDisplayMessage = this.chart === 'Year' && (!this.employeeCount || this.employeeCount.length === 0);
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const initial = this.admindashboardDtls?.savedactiveProjects.find(each => each.projectStatus == 'Initial')?.projectStatusCount;
        const development = this.admindashboardDtls?.savedactiveProjects.find(each => each.projectStatus == 'Working')?.projectStatusCount;
        const completed = this.admindashboardDtls?.savedactiveProjects.find(each => each.projectStatus == 'Completed')?.projectStatusCount;
        const amc = this.admindashboardDtls?.savedactiveProjects.find(each => each.projectStatus == 'AMC')?.projectStatusCount;

        this.pieDataforProjects = {
            labels: ['Initial', 'Development', 'Completed', 'AMC'],
            datasets: [
                {
                    data: [initial, development, completed, amc],
                    backgroundColor: [documentStyle.getPropertyValue('--primary-300'), documentStyle.getPropertyValue('--red-300'), documentStyle.getPropertyValue('--green-300'), documentStyle.getPropertyValue('--blue-300')],
                    borderColor: surfaceBorder
                }
            ]
        };
        this.pieOptionsforProjects = {
            animation: {
                duration: 500
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        display: true,
                        usePointStyle: true
                    },
                    position: 'bottom'
                }
            }
        };
    }

    navigateEmpDtls() {
        this.router.navigate(['employee/all-employees'])
    }
    navigateAttendence() {
        this.router.navigate(['employee/attendance'])
    }
    navigateProjects() {
        this.router.navigate(['admin/project'])
    }

    initNotifications() {
        this.dashboardService.GetNotifications().subscribe(resp => {
            this.notifications = resp as unknown as NotificationsDto[];
            this.hasBirthdayNotifications = !!this.notifications.find(employee => employee.messageType === 'Birthday');
        })
    }

    initNotificationsBasedOnId() {
        this.dashboardService.GetNotificationsBasedOnId(this.EmployeeId).subscribe(resp => {
            this.notificationReplies = resp as unknown as NotificationsRepliesDto[];
        })
    }

    initWishesForm() {
        this.fbWishes = this.formbuilder.group({
            message: new FormControl('', [Validators.required]),
            notificationId: new FormControl('', [Validators.required]),
            employeeId: new FormControl('', [Validators.required]),
            isActive: new FormControl(true),
        })
    }
    showBirthdayDialog(data: any) {
        if (this.jwtService.EmployeeId) {
            this.wishesDialog = true;
            this.fbWishes.get('notificationId').setValue(data.notificationId);
            this.fbWishes.get('employeeId').setValue(this.jwtService.EmployeeId);
        } else {
            this.wishesDialog = false;
        }
    }

    onSubmit() {
        this.dashboardService.sendBithdayWishes(this.fbWishes.value).subscribe(resp => {
            let rdata = resp as unknown as any;
            if (rdata.isSuccess) {
                this.alertMessage.displayAlertMessage(ALERT_CODES["ADW001"])
            }
            else if (!rdata.isSuccess) {
                this.alertMessage.displayErrorMessage(rdata.message);
            }
            this.wishesDialog = false;
            this.initWishesForm();
        })
    }

    onClose() {
        this.wishesDialog = false;
    }

}


