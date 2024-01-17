import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DATE_FORMAT, DATE_FORMAT_MONTH, FORMAT_DATE, FORMAT_MONTH, MEDIUM_DATE, MONTH, ORIGINAL_DOB } from 'src/app/_helpers/date.formate.pipe';
import { AttendanceCountBasedOnTypeViewDto, adminDashboardViewDto, NotificationsRepliesDto, NotificationsDto } from 'src/app/_models/dashboard';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { JwtService } from 'src/app/_services/jwt.service';


@Component({
    templateUrl: './admin.dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
    admindashboardDtls: adminDashboardViewDto;
    pieDataforAttendance: any;
    pieOptions: any;
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
    constructor(private dashboardService: DashboardService,
        private router: Router, private datePipe: DatePipe,
        private jwtService: JwtService,) {
        this.selectedDate = new Date();
    }

    ngOnInit() {
        this.inItAdminDashboard();
        this.getAttendanceCountsBasedOnType();
        this.chart = 'Day';
        const currentDate = new Date();
        this.month = currentDate.getMonth() + 1;
        this.year = currentDate.getFullYear();

        // Set the selected month based on the default values
        this.selectedMonth = new Date(this.year, this.month - 1, 1);
        this.selectedMonth.setHours(0, 0, 0, 0);

        // Update the selected month
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
    }

    onDaySelect(event) {
        this.selectedDate = event.value;
    }

    gotoNextDay() {
        // Increment the current day by 1
        const nextDay = new Date(this.selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        this.selectedDate = nextDay;
    }

    getCurrentDay(): string {
        return this.formatDate(this.selectedDate, MEDIUM_DATE);
    }

    formatDate(date: Date, format: string): string {
        return this.datePipe.transform(date, format);
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
    }

    updateSelectedMonth() {
        this.selectedMonth = new Date(this.year, this.month - 1, 1);
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonth(this.year, this.month);
    }

    onMonthSelect(event) {
        this.selectedMonth = event;
        this.month = this.selectedMonth.getMonth() + 1; // Month is zero-indexed
        this.year = this.selectedMonth.getFullYear();
        this.updateSelectedMonth();
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
    }


    formatMonth(month: number): string {
        const date = new Date(2000, month - 1, 1); // Using a common year for simplicity
        return FORMAT_MONTH(date, this.monthFormat);
    }

    onYearSelect(event) {
        this.year = this.selectedMonth.getFullYear();
    }

    gotoPreviousYear() {
        this.year--;
    }

    gotoNextYear() {
        this.year++;
    }

    getAttendanceCountsBasedOnType() {
        if (this.chart === 'Day') {
            this.selectedDate = DATE_FORMAT(new Date(this.selectedDate));
            this.dashboardService.getAttendanceCountBasedOnType(this.chart, this.selectedDate).subscribe((resp) => {
                this.attendanceCount = resp as unknown as AttendanceCountBasedOnTypeViewDto[];
                this.initChart();
            })
        }
        else if (this.chart === 'Month') {
            this.selectedMonth = DATE_FORMAT_MONTH(new Date(this.selectedMonth));
            this.dashboardService.getAttendanceCountBasedOnType(this.chart, this.selectedMonth).subscribe((resp) => {
                this.attendanceCount = resp as unknown as AttendanceCountBasedOnTypeViewDto[];
                this.initChart();
            })
        }
        else if (this.chart === 'Year') {
            this.dashboardService.getAttendanceCountBasedOnType(this.chart, this.year).subscribe((resp) => {
                this.attendanceCount = resp as unknown as AttendanceCountBasedOnTypeViewDto[];
                this.initChart();
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

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const CasualLeaves = this.attendanceCount.find(each => each.cl);
        const PrevlageLeaves = this.attendanceCount.find(each => each.pl);
        const present = this.attendanceCount.find(each => each.pt);
        const leaveWithoutPay = this.attendanceCount.find(each => each.lwp);

        this.pieDataforAttendance = {
            labels: ['PT', 'PL', 'CL', 'WFH', 'LWP'],
            datasets: [
                {
                    data: [present?.pt || 0, PrevlageLeaves?.pl || 0, CasualLeaves?.cl || 0, leaveWithoutPay?.lwp || 0],
                    backgroundColor: [documentStyle.getPropertyValue('--inofc-b'), documentStyle.getPropertyValue('--pl-b'), documentStyle.getPropertyValue('--cl-b'), documentStyle.getPropertyValue('--lwp-b')],
                    borderColor: surfaceBorder,
                    pointStyle: 'circle',
                }
            ]
        };
        this.pieOptions = {
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
            console.log(resp);
        })
    }

    initNotificationsBasedOnId() {
        this.dashboardService.GetNotificationsBasedOnId(this.jwtService.EmployeeId).subscribe(resp => {
            this.notificationReplies = resp as unknown as NotificationsRepliesDto[];
            console.log(resp, this.jwtService.EmployeeId)
        })
    }
    showBirthdayDialog() {
        if (this.jwtService.EmployeeId) {
            this.wishesDialog = true;
        } else {
            this.wishesDialog = false;
        }
    }
    onClose() {
        this.wishesDialog = false;
    }
    onSubmit() {

    }

}


