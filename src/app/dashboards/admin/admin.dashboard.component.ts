import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { adminDashboardViewDto } from 'src/app/_models/dashboard';
import { DashboardService } from 'src/app/_services/dashboard.service';


@Component({
    templateUrl: './admin.dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
    admindashboardDtls: adminDashboardViewDto;
    //pie data for sales
    pieData: any;
    pieOptions: any;

    // popup menu items for waiting actions
    // items: MenuItem[] = [
    //     {
    //         icon: 'pi pi-check',
    //         label: 'Complete'
    //     },

    //     {
    //         icon: 'pi pi-times',
    //         label: 'Cancel'
    //     },
    //     {
    //         icon: 'pi pi-external-link',
    //         label: 'Details'
    //     }
    // ];



    //config subscription
    subscription: Subscription;

    constructor(private layoutService: LayoutService,
        private dashboardService: DashboardService) {    }

    ngOnInit() {
        this.inItAdminDashboard();
    }


    inItAdminDashboard() {
        this.dashboardService.getAdminDashboard().subscribe((resp) => {
            this.admindashboardDtls = resp[0] as unknown as adminDashboardViewDto;
            this.admindashboardDtls.savedactiveProjects = JSON.parse(this.admindashboardDtls.activeProjects);
            this.admindashboardDtls.savedsupsendedProjects = JSON.parse(this.admindashboardDtls.supsendedProjects);
            this.admindashboardDtls.savedemployeeBirthdays = JSON.parse(this.admindashboardDtls.employeeBirthdays);
            this.admindashboardDtls.savedemployeeLeaveCounts = JSON.parse(this.admindashboardDtls.employeeLeaveCounts);
            this.admindashboardDtls.savedemployeesOnLeave = JSON.parse(this.admindashboardDtls.employeesOnLeave);
            this.admindashboardDtls.savedabsentEmployees = JSON.parse(this.admindashboardDtls.absentEmployees);
            this.admindashboardDtls.savedActiveEmployeesInOffice=JSON.parse(this.admindashboardDtls.activeEmployeesInOffice);
            this.initChart();
        })
    }
    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const absent = this.admindashboardDtls?.savedabsentEmployees.find(each => each.employeeStatus === 'AT')?.employeesCount;
        const CasualLeaves = this.admindashboardDtls?.savedemployeeLeaveCounts.find(each => each.leaveType === 'CL')?.leaveTypeCount;
        const PersonalLeaves = this.admindashboardDtls?.savedemployeeLeaveCounts.find(each => each.leaveType === 'PL')?.leaveTypeCount;
        const present = this.admindashboardDtls?.savedActiveEmployeesInOffice.find(each => each.employeeStatus === 'PT')?.employeesCount;
        
        //sales by category pie chart
        this.pieData = {
            labels: ['in Office', 'Absent','PL', 'CL',],
            datasets: [
                {
                    data: [present,absent,PersonalLeaves,CasualLeaves, ],
                    backgroundColor: [documentStyle.getPropertyValue('--primary-300'), documentStyle.getPropertyValue('--red-300'), documentStyle.getPropertyValue('--green-300'),documentStyle.getPropertyValue('--blue-300')],
                    borderColor: surfaceBorder
                }
            ]
        };
        this.pieOptions = {
            animation: {
                duration: 0
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
    }


    //     this.chartData = newBarData;
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }


    // sum function for main chart data
    // sumOf(array: any[]) {
    //     let sum: number = 0;
    //     array.forEach((a) => (sum += a));
    //     return sum;
    // }

    // onGlobalFilter(table: Table, event: Event) {
    //     table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    // }

}


