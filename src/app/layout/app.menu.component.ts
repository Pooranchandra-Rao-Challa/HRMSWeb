import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    ngOnInit() {
        this.model = [
            {
                label: '',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['dashboard/admin']
                    },
                    // {
                    //     label: 'Student',
                    //     icon: 'pi pi-fw pi-image',
                    //     routerLink: ['/dashboard-employee']
                    // }
                ]
            },
            {
                label: 'Security',
                icon: 'pi pi-user',
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['security/users']
                    },
                    {
                        label: 'Roles',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['security/roles']
                    },

                ]
            },
            {
                label: 'Admin',
                icon: 'pi pi-user',
                items: [
                    {
                        label: 'Lookups',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['admin/lookups']
                    },
                    {
                        label: 'Holiday Configuration',
                        icon: 'pi pi-fw pi-calendar-plus',
                        routerLink: ['admin/holidayconfiguration']
                    },
                    {
                        label: 'Assets',
                        icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Assets',
                                icon: 'pi pi-fw pi-align-left',
                                routerLink: ['admin/assets'],

                            },
                            {
                                label: 'Assets Allotment ',
                                icon: 'pi pi-fw pi-align-left',
                                routerLink: ['admin/assetsallotment'],

                            }
                        ]

                    },
                    {
                        label: 'Projects',
                        icon: 'pi pi-fw pi-search-plus',
                        routerLink: ['admin/project']
                    },
                    {
                        label: 'Recruitment',
                        icon: 'pi pi-fw pi-search-plus',
                        routerLink: ['admin/recruitment']
                    },
                    {
                        label: 'Job Design',
                        icon: 'pi pi-fw pi-calendar-plus',
                        routerLink: ['admin/jobdesign']
                    },
                ]
            },
            {
                label: 'Employee',
                icon: 'pi pi-user',
                items: [
                    {
                        label: 'Search Employees',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['employee/all-employees']
                    },
                    {
                        label: 'On Boarding Employee',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['employee/onboardingemployee']
                    },
                    {
                        label: 'Attendance',
                        icon: 'pi pi-fw pi-calendar-times',
                        routerLink: ['employee/attendance']
                    },
                    {
                        label: 'Notifications',
                        icon: 'pi pi-fw pi-clone',
                        routerLink: ['employee/notifications']
                    },
                   
                ]
            },

            // {
            //     label: 'Hierarchy',
            //     icon: 'pi pi-fw pi-align-left',
            //     items: [
            //         {
            //             label: 'Submenu 1',
            //             icon: 'pi pi-fw pi-align-left',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1',
            //                     icon: 'pi pi-fw pi-align-left',
            //                     items: [
            //                         {
            //                             label: 'Submenu 1.1.1',
            //                             icon: 'pi pi-fw pi-align-left'
            //                         },
            //                         {
            //                             label: 'Submenu 1.1.2',
            //                             icon: 'pi pi-fw pi-align-left'
            //                         },
            //                         {
            //                             label: 'Submenu 1.1.3',
            //                             icon: 'pi pi-fw pi-align-left'
            //                         }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2',
            //                     icon: 'pi pi-fw pi-align-left',
            //                     items: [
            //                         {
            //                             label: 'Submenu 1.2.1',
            //                             icon: 'pi pi-fw pi-align-left'
            //                         }
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2',
            //             icon: 'pi pi-fw pi-align-left',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1',
            //                     icon: 'pi pi-fw pi-align-left',
            //                     items: [
            //                         {
            //                             label: 'Submenu 2.1.1',
            //                             icon: 'pi pi-fw pi-align-left'
            //                         },
            //                         {
            //                             label: 'Submenu 2.1.2',
            //                             icon: 'pi pi-fw pi-align-left'
            //                         }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2',
            //                     icon: 'pi pi-fw pi-align-left',
            //                     items: [
            //                         {
            //                             label: 'Submenu 2.2.1',
            //                             icon: 'pi pi-fw pi-align-left'
            //                         }
            //                     ]
            //                 }
            //             ]
            //         }
            //     ]
            // },

        ];
    }
}
