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
        private dashboardService: DashboardService) {
        this.subscription = this.layoutService.configUpdate$.subscribe((config) => {
            // this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();
        this.inItAdminDashboard();
    }


    inItAdminDashboard() {
        this.dashboardService.getAdminDashboard().subscribe((resp) => {
            this.admindashboardDtls = resp[0] as unknown as adminDashboardViewDto;
            console.log(this.admindashboardDtls);
            this.admindashboardDtls.savedactiveProjects = JSON.parse(this.admindashboardDtls.activeProjects);
            this.admindashboardDtls.savedsupsendedProjects = JSON.parse(this.admindashboardDtls.supsendedProjects);
            this.admindashboardDtls.savedemployeeBirthdays = JSON.parse(this.admindashboardDtls.employeeBirthdays);
            this.admindashboardDtls.savedemployeeLeaveCounts = JSON.parse(this.admindashboardDtls.employeeLeaveCounts);
            this.admindashboardDtls.savedemployeesOnLeave = JSON.parse(this.admindashboardDtls.employeesOnLeave);
        })
    }
    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        //sales by category pie chart
        this.pieData = {
            labels: ['in Office', 'On Leave', 'WFH'],
            datasets: [
                {
                    data: [40, 8, 2],
                    backgroundColor: [documentStyle.getPropertyValue('--primary-300'), documentStyle.getPropertyValue('--red-300'), documentStyle.getPropertyValue('--green-300')],
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


