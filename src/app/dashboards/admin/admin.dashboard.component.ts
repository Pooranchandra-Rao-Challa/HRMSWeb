import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { adminDashboardViewDto } from 'src/app/_models/dashboard';
import { DashboardService } from 'src/app/_services/dashboard.service';


@Component({
    templateUrl: './admin.dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
    admindashboardDtls: adminDashboardViewDto;
    pieData: any;
    pieOptions: any;
    pieDataforProjects: any;
    constructor(private dashboardService: DashboardService,
        private router: Router) { }

    ngOnInit() {
        this.inItAdminDashboard();
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
            this.initChart();
        });
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const absent = this.admindashboardDtls?.savedabsentEmployees.find(each => each.employeeStatus === 'AT')?.employeesCount;
        const CasualLeaves = this.admindashboardDtls?.savedemployeeLeaveCounts.find(each => each.leaveType === 'CL')?.leaveTypeCount;
        const PersonalLeaves = this.admindashboardDtls?.savedemployeeLeaveCounts.find(each => each.leaveType === 'PL')?.leaveTypeCount;
        const present = this.admindashboardDtls?.savedActiveEmployeesInOffice.find(each => each.employeeStatus === 'PT')?.employeesCount;

        this.pieData = {
            labels: ['In Office', 'Absent', 'PL', 'CL',],
            datasets: [
                {
                    data: [present, absent, PersonalLeaves, CasualLeaves,],
                    backgroundColor: [documentStyle.getPropertyValue('--primary-300'), documentStyle.getPropertyValue('--red-300'), documentStyle.getPropertyValue('--green-300'), documentStyle.getPropertyValue('--blue-300')],
                    borderColor: surfaceBorder
                }
            ]
        };
        this.pieOptions = {
            animation: {
                duration: 5     
            },
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        display: false
                    },
                    position: 'bottom'
                }
            }
        };

        // Data for the second pie chart (projects)
        const initial = this.admindashboardDtls?.savedactiveProjects.find(each => each.projectStatus == 'Initial')?.projectStatusCount;
        const development = this.admindashboardDtls?.savedactiveProjects.find(each => each.projectStatus == 'Working')?.projectStatusCount;
        const completed = this.admindashboardDtls?.savedactiveProjects.find(each => each.projectStatus == 'Completed')?.projectStatusCount;
        const amc = this.admindashboardDtls?.savedactiveProjects.find(each => each.projectStatus == 'AMC')?.projectStatusCount;

        this.pieDataforProjects = {
            labels: ['Initial', 'Dev', 'Com', 'amc'],
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

    getProjectCountByStatus(status: string): number {
        const project = this.admindashboardDtls?.savedactiveProjects?.find(p => p.projectStatus === status);
        return project ? project.projectStatusCount : 0;
    }

}


