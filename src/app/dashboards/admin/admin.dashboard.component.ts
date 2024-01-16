import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FORMAT_DATE, FORMAT_MONTH, MEDIUM_DATE, MONTH, ORIGINAL_DOB } from 'src/app/_helpers/date.formate.pipe';
import { adminDashboardViewDto } from 'src/app/_models/dashboard';
import { DashboardService } from 'src/app/_services/dashboard.service';


@Component({
    templateUrl: './admin.dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
    admindashboardDtls: adminDashboardViewDto;
    pieDataforAttendance: any;
    pieOptions: any;
    pieDataforProjects: any;
    chartFilled: boolean;
    chart: string = 'Day'; // Set the default value to 'Day'
    empRadio: string = 'Day';
    year: number = new Date().getFullYear();
    month: number = new Date().getMonth() + 1;
    selectedMonth: any;
    selectedDate: Date;
    days: number[] = [];
    monthFormat: string = MONTH;
    dateFormat: string = MEDIUM_DATE;

    constructor(private dashboardService: DashboardService,
        private router: Router, private datePipe: DatePipe) {
        this.selectedDate = new Date();
    }

    ngOnInit() {
        this.inItAdminDashboard();
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
        if (this.month > 1)
            this.month--;
        else {
            this.month = 12;        // Reset to December
            this.year--;            // Decrement the year
        }
        this.selectedMonth = FORMAT_DATE(new Date(this.year, this.month - 1, 1));
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonth(this.year, this.month);
    }

    onMonthSelect(event) {
        this.month = this.selectedMonth.getMonth() + 1; // Month is zero-indexed
        this.year = this.selectedMonth.getFullYear();
        this.getDaysInMonth(this.year, this.month);
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

    gotoNextMonth() {
        if (this.month < 12)
            this.month++;
        else {
            this.month = 1; // Reset to January
            this.year++;    // Increment the year
        }
        this.selectedMonth = this.formatMonth(this.month);
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonth(this.year, this.month);
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
        const absent = this.admindashboardDtls?.savedabsentEmployees.find(each => each.employeeStatus === 'AT')?.employeesCount;
        const CasualLeaves = this.admindashboardDtls?.savedemployeeLeaveCounts.find(each => each.leaveType === 'CL')?.leaveTypeCount;
        const PrevlageLeaves = this.admindashboardDtls?.savedemployeeLeaveCounts.find(each => each.leaveType === 'PL')?.leaveTypeCount;
        const present = this.admindashboardDtls?.savedActiveEmployeesInOffice.find(each => each.employeeStatus === 'PT')?.employeesCount;
        const WrokFromHome = this.admindashboardDtls?.savedActiveEmployeesInOffice.find(each => each.employeeStatus === 'WFH')?.employeesCount;
        const leaveWithoutPay = this.admindashboardDtls?.savedemployeeLeaveCounts.find(each => each.leaveType === 'LWP')?.leaveTypeCount;

        this.pieDataforAttendance = {
            labels: ['In Office', 'Absent', 'PL', 'CL', 'WFH', 'LWP'],
            datasets: [
                {
                    data: [present, absent, PrevlageLeaves, CasualLeaves, WrokFromHome, leaveWithoutPay],
                    backgroundColor: [documentStyle.getPropertyValue('--inofc-b'), documentStyle.getPropertyValue('--abst-b'), documentStyle.getPropertyValue('--pl-b'), documentStyle.getPropertyValue('--cl-b'), documentStyle.getPropertyValue('--wfh-b'), documentStyle.getPropertyValue('--lwp-b')],
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

}


