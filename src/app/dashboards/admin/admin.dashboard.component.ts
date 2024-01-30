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
    projectsbarDataforAttendance: any;
    projectsbarOptionsforAttendance: any;
    pieOptionsforProjects: any;
    pieDataforProjects: any;
    chartFilled: boolean;
    chart: string;
    year: number = new Date().getFullYear();
    month: number = new Date().getMonth() + 1;
    selectedMonth: any;
    selectedDate: any;
    days: number[] = [];
    monthFormat: string = MONTH;
    attendanceCount: AttendanceCountBasedOnTypeViewDto[] = [];
    attendanceCountByProject: AttendanceCountBasedOnTypeViewDto[] = [];
    notifications: NotificationsDto[] = [];
    notificationReplies: NotificationsRepliesDto[] = []
    wishesDialog: boolean = false;
    employeeCount: EmployeesofAttendanceCountsViewDto[] = [];
    isCheckboxSelected: boolean = false;
    leaveType: LookupDetailsDto[] = [];
    EmployeeId: any;
    fbWishes!: FormGroup;
    permissions: any;
    shouldDisplayMessage: boolean = false;
    hasBirthdayNotifications: any;
    hasHRNotifications: any;
    fieldset1Open = true;
    fieldset2Open = false;
    fieldset3Open = false;
    selectedProjects: any[];
    projectName: any;
    employeeslist: boolean = false;
    OnLeaveEmployeeList: any;
    fillterdProjects: any[] = [];
    selectedFillterdProjects: any[] = [];

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

    gotoPreviousDay() {
        const previousDay = new Date(this.selectedDate);
        previousDay.setDate(previousDay.getDate() - 1);
        this.selectedDate = previousDay;
        if (this.isCheckboxSelected === false) {
            this.getAttendanceCountsBasedOnType();
        }
        else {
            this.getAttendanceCountsBasedOnProject();
        }
    }

    onDaySelect(event) {
        this.selectedDate = DATE_FORMAT(new Date(event));
        if (this.isCheckboxSelected === false) {
            this.getAttendanceCountsBasedOnType();
        }
        else {
            this.getAttendanceCountsBasedOnProject();
        }
    }

    gotoNextDay() {
        const nextDay = new Date(this.selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        this.selectedDate = nextDay;
        if (this.isCheckboxSelected === false) {
            this.getAttendanceCountsBasedOnType();
        }
        else {
            this.getAttendanceCountsBasedOnProject();
        }
    }

    gotoPreviousMonth() {
        if (this.month > 1) {
            this.month--;
        } else {
            this.month = 12; // Reset to December
            this.year--;     // Decrement the year
        }
        this.updateSelectedMonth();
        if (this.isCheckboxSelected === false) {
            this.getAttendanceCountsBasedOnType();
        }
        else {
            this.getAttendanceCountsBasedOnProject();
        }
    }

    onMonthSelect(event) {
        this.selectedMonth = event;
        this.month = this.selectedMonth.getMonth() + 1;
        this.year = this.selectedMonth.getFullYear();
        this.updateSelectedMonth();
        if (this.isCheckboxSelected === false) {
            this.getAttendanceCountsBasedOnType();
        }
        else {
            this.getAttendanceCountsBasedOnProject();
        }
    }

    gotoNextMonth() {
        if (this.month < 12) {
            this.month++;
        } else {
            this.month = 1; // Reset to January
            this.year++;    // Increment the year
        }
        this.updateSelectedMonth();
        if (this.isCheckboxSelected === false) {
            this.getAttendanceCountsBasedOnType();
        }
        else {
            this.getAttendanceCountsBasedOnProject();
        }
    }

    gotoPreviousYear() {
        this.year--;
        if (this.isCheckboxSelected === false) {
            this.getAttendanceCountsBasedOnType();
        }
        else {
            this.getAttendanceCountsBasedOnProject();
        }
    }

    onYearSelect(event) {
        const date = new Date(event);
        const yearNumber = date.getFullYear();
        this.year = yearNumber;
        if (this.isCheckboxSelected === false) {
            this.getAttendanceCountsBasedOnType();
        }
        else {
            this.getAttendanceCountsBasedOnProject();
        }
    }

    gotoNextYear() {
        this.year++;
        if (this.isCheckboxSelected === false) {
            this.getAttendanceCountsBasedOnType();
        }
        else {
            this.getAttendanceCountsBasedOnProject();
        }
    }

    updateSelectedMonth() {
        this.selectedMonth = new Date(this.year, this.month - 1, 1);
        this.selectedMonth.setHours(0, 0, 0, 0);
        this.getDaysInMonth(this.year, this.month);
    }

    transformDateIntoTime(createdAt: any): string {
        const currentDate = new Date();
        const createdDate = new Date(createdAt);
        const timeDifference = currentDate.getTime() - createdDate.getTime();
        const hours: number = Math.floor(timeDifference / (1000 * 60 * 60));
        const daysDifference = Math.floor(hours / 24);
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

    getAttendanceProjectChart() {
        if (this.isCheckboxSelected === true) {
            this.getAttendanceCountsBasedOnProject();
        }
        else {
            this.getAttendanceCountsBasedOnType();
        }
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

    getAttendanceCountsBasedOnProject() {
        this.attendanceCountByProject = [];
        this.employeeCount = [];
        this.shouldDisplayMessage = false;
        if (this.chart === 'Date') {
            this.selectedDate = DATE_FORMAT(new Date(this.selectedDate));
            this.dashboardService.GetAttendanceCountBasedOnProjects(this.chart, this.selectedDate, this.isCheckboxSelected).subscribe((resp) => {
                this.attendanceCountByProject = resp as unknown as AttendanceCountBasedOnTypeViewDto[];
                this.selectedProjects = this.attendanceCountByProject;
                this.projectsChart();
            })
        }
        else if (this.chart === 'Month') {
            this.selectedMonth = DATE_FORMAT_MONTH(new Date(this.selectedMonth));
            this.dashboardService.GetAttendanceCountBasedOnProjects(this.chart, this.selectedMonth, this.isCheckboxSelected).subscribe((resp) => {
                this.attendanceCountByProject = resp as unknown as AttendanceCountBasedOnTypeViewDto[];
                this.selectedProjects = this.attendanceCountByProject;
                this.projectsChart();
            })
        }
        else if (this.chart === 'Year') {
            this.dashboardService.GetAttendanceCountBasedOnProjects(this.chart, this.year, this.isCheckboxSelected).subscribe((resp) => {
                this.attendanceCountByProject = resp as unknown as AttendanceCountBasedOnTypeViewDto[];
                this.fillterdProjects = this.attendanceCountByProject;
                this.updateUniqueProjects();
                this.selectedFillterdProjects = this.fillterdProjects.slice(0, 2);
                this.yearlyProjectsChart();
            })
        }
    }
    updateUniqueProjects() {
        const uniqueProjectsData = {};
        this.attendanceCountByProject.forEach(project => {
            const projectName = project.projectName;
            if (!uniqueProjectsData[projectName]) {
                uniqueProjectsData[projectName] = {
                    projectName: projectName,
                    data: []
                };
            }
            uniqueProjectsData[projectName].data.push(project);
        });
        const uniqueProjectsArray = Object.values(uniqueProjectsData);
        this.fillterdProjects = uniqueProjectsArray;
    }

    onCheckboxClick() {
        this.employeeCount = [];
        if (this.isCheckboxSelected) {
            this.getAttendanceCountsBasedOnProject();
        }
    }

    projectsChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const projectNames = this.selectedProjects.map(project => project.projectName);
        const labels = ['PT', 'WFH', 'PL', 'CL', 'LWP'];
        const datasets = projectNames.map((projectName, index) => {
            const projectData = this.selectedProjects.find(project => project.projectName === projectName);
            return {
                type: 'bar',
                label: projectName,
                projectId: projectData?.projectId,
                backgroundColor: this.getColorByIndex(index),
                data: [
                    projectData?.pt || 0,
                    projectData?.wfh || 0,
                    projectData?.pl || 0,
                    projectData?.cl || 0,
                    projectData?.lwp || 0
                ]
            };
        });

        this.projectsbarDataforAttendance = {
            labels: labels,
            datasets: datasets
        };

        this.projectsbarOptionsforAttendance = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        color: textColor,
                    },
                    onClick: (e) => {
                        return false;
                    },
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    yearlyProjectsChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const labels = ['PT', 'WFH', 'PL', 'CL', 'LWP'];
        const datasets = [];
        this.selectedFillterdProjects.forEach((project, index) => {
            const projectName = project.projectName;
            const flattenedData = project.data.map(projectData => ({
                cl: projectData.cl,
                lwp: projectData.lwp,
                pl: projectData.pl,
                projectId: projectData.projectId,
                projectName: projectData.projectName,
                pt: projectData.pt,
                value: projectData.value,
                wfh: projectData.wfh
            }));

            // Iterate through each flattened data entry
            flattenedData.forEach((projectData) => {
                datasets.push({
                    type: 'bar',
                    label: `${projectName} - ${this.getMonthName(projectData.value)}`,
                    projectId: projectData.projectId,
                    backgroundColor: this.getColorByIndex(index),
                    data: [
                        projectData.pt || 0,
                        projectData.wfh || 0,
                        projectData.pl || 0,
                        projectData.cl || 0,
                        projectData.lwp || 0
                    ]
                });
            });
        });
        this.projectsbarDataforAttendance = {
            labels: labels,
            datasets: datasets
        };

        this.projectsbarOptionsforAttendance = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    stacked: false,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
    }


    getMonthName(monthValue: number): string {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (monthValue >= 1 && monthValue <= 12) {
            return monthNames[monthValue - 1];
        }
        return '';
    }

    getColorByIndex(index: number): string {
        const getRandomComponent = () => Math.floor(Math.random() * 256);
        const red = getRandomComponent();
        const green = getRandomComponent();
        const blue = getRandomComponent();
        const variation = 120; // Adjust this value for more or less variation
        const randomizeComponent = (component: number) => {
            const min = Math.max(0, component - variation);
            const max = Math.min(255, component + variation);
            return Math.floor(Math.random() * (max - min + 1) + min);
        };

        const finalRed = randomizeComponent(red);
        const finalGreen = randomizeComponent(green);
        const finalBlue = randomizeComponent(blue);

        return `rgb(${finalRed}, ${finalGreen}, ${finalBlue})`;

    }

    onProjectChartClick(event: any): void {
        const clickedIndex = event?.element?.index;
        const clickedDatasetIndex = event?.element?.datasetIndex;
        if (clickedIndex !== undefined) {
            const clickedLabel = this.projectsbarDataforAttendance.labels[clickedIndex];
            const clickedProject = this.projectsbarDataforAttendance.datasets[clickedDatasetIndex];
            if (clickedProject) {
                const projectId = clickedProject.projectId;
                this.handleprojectChartClick(clickedLabel, projectId)
            }
        }
    }

    handleprojectChartClick(clickedLabel: string, projectId: number): void {
        this.lookupService.DayWorkStatus().subscribe(resp => {
            this.leaveType = resp as unknown as LookupViewDto[];
            const leaveType = this.leaveType.find(type => type.name === clickedLabel);
            if (leaveType) {
                const lookupDetailId = leaveType.lookupDetailId;
                if (this.chart === 'Date') {
                    this.selectedDate = DATE_FORMAT(new Date(this.selectedDate));
                    this.dashboardService.GetEmployeeAttendanceCountByProject(this.chart, this.selectedDate, this.isCheckboxSelected, lookupDetailId, projectId)
                        .subscribe((resp) => {
                            this.employeeCount = resp as unknown as EmployeesofAttendanceCountsViewDto[];
                        });
                } else if (this.chart === 'Month') {
                    this.selectedMonth = DATE_FORMAT_MONTH(new Date(this.selectedMonth));
                    this.dashboardService.GetEmployeeAttendanceCountByProject(this.chart, this.selectedMonth, this.isCheckboxSelected, lookupDetailId, projectId)
                        .subscribe((resp) => {
                            this.employeeCount = resp as unknown as EmployeesofAttendanceCountsViewDto[];
                        });
                } else if (this.chart === 'Year') {
                    this.dashboardService.GetEmployeeAttendanceCountByProject(this.chart, this.year, this.isCheckboxSelected, lookupDetailId, projectId)
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
            }
        })
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
        const CasualLeaves = this.attendanceCount?.find(each => each.cl);
        const PrevlageLeaves = this.attendanceCount?.find(each => each.pl);
        const present = this.attendanceCount?.find(each => each.pt);
        const leaveWithoutPay = this.attendanceCount?.find(each => each.lwp);
        const workFromHome = this.attendanceCount?.find(each => each.wfh);

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
                    display: true,
                    position: 'bottom',
                    labels: {
                        display: true,
                        usePointStyle: true,
                        generateLabels: function (chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.reduce(function (labels, label, i) {
                                    const dataset = data.datasets[0];
                                    const value = dataset.data[i];
                                    if (!isNaN(value)) {
                                        labels.push({
                                            text: label,
                                            fillStyle: dataset.backgroundColor[i],
                                            hidden: isNaN(value),
                                            lineCap: dataset.borderCapStyle,
                                            lineDash: dataset.borderDash,
                                            lineDashOffset: dataset.borderDashOffset,
                                            lineJoin: dataset.borderJoinStyle,
                                            lineWidth: dataset.borderWidth,
                                            strokeStyle: dataset.borderColor[i],
                                            pointStyle: dataset.pointStyle,
                                        });
                                    }
                                    return labels;
                                }, []);
                            }
                            return [];
                        },
                    },
                    onClick: (e) => {
                        return false;
                    },
                },
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
    showEmployeeslist() {
        this.employeeslist = true;
        this.OnLeaveEmployeeList = this.admindashboardDtls?.savedemployeesOnLeave;
    }
    navigateProjects() {
        this.router.navigate(['admin/project'])
    }
    navigatesuspendedProjects() {
        this.router.navigate(['admin/project'], { queryParams: { showSuspendedProjects: true } });
    }
    initNotifications() {
        this.dashboardService.GetNotifications().subscribe(resp => {
            this.notifications = resp as unknown as NotificationsDto[];
            this.hasBirthdayNotifications = this.notifications?.some(employee => employee.messageType === 'Birthday');
            this.hasHRNotifications = this.notifications?.some(employee => employee.messageType !== 'Birthday');
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
        this.fbWishes.reset();
        if (this.jwtService.EmployeeId) {
            this.wishesDialog = true;
            this.fbWishes.get('notificationId').setValue(data.notificationId);
            this.fbWishes.get('employeeId').setValue(this.jwtService.EmployeeId);
            this.fbWishes.get('isActive').setValue(true);
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


