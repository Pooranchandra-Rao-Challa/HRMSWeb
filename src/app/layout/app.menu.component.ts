import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { JwtService } from '../_services/jwt.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(public layoutService: LayoutService, private jwtService: JwtService) { }


    GroupPermission(groupName: string): boolean {
        switch (groupName) {
            case 'Security':
                return this.jwtService.Permissions.CanViewUsers || this.jwtService.Permissions.CanViewRoles
            case 'Admin':
                return this.jwtService.Permissions.CanViewLookups || this.jwtService.Permissions.CanViewHolidays ||
                 this.jwtService.Permissions.CanViewProjects ||this.GroupPermission('Assets')
            
            case 'Assets':
                return this.jwtService.Permissions.CanViewAssets || this.jwtService.Permissions.CanViewAssetsAllotments;
            case 'Employee':
                    return this.jwtService.Permissions.CanViewLookups || this.jwtService.Permissions.CanViewHolidays||this.jwtService.Permissions.CanViewAttendances  
            default:
                return false;
        }
    }
    ngOnInit() {
        console.log(this.jwtService.Permissions);
        this.model = [
            {
                label: '',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['dashboard/admin'], permission: true
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
                permission: this.GroupPermission('Security'),
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['security/users'],
                        permission: this.jwtService.Permissions.CanViewUsers
                    },
                    {
                        label: 'Roles',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['security/roles'],
                        permission: this.jwtService.Permissions.CanViewRoles

                    },

                ]
            },
            {
                label: 'Admin',
                icon: 'pi pi-user',
                permission: this.GroupPermission('Admin'),
                items: [
                    {
                        label: 'Lookups',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['/admin/lookups'],
                        permission: this.jwtService.Permissions.CanViewLookups
                    },
                    {
                        label: 'Holiday Configuration',
                        icon: 'pi pi-fw pi-calendar-plus',
                        routerLink: ['/admin/holidayconfiguration'],
                        permission: this.jwtService.Permissions.CanViewHolidays
                    },
                    {
                        label: 'Assets',
                        icon: 'pi pi-fw pi-align-left',
                        permission: this.GroupPermission('Assets'),
                        items: [
                            {
                                label: 'Assets',
                                icon: 'pi pi-fw pi-align-left',
                                routerLink: ['admin/assets'],
                                permission: this.jwtService.Permissions.CanViewAssets

                            },
                            {
                                label: 'Assets Allotment',
                                icon: 'pi pi-fw pi-align-left',
                                routerLink: ['admin/assetsallotment'],
                                permission: this.jwtService.Permissions.CanViewAssetsAllotments

                            }
                        ]

                    },
                    {
                        label: 'Projects',
                        icon: 'pi pi-fw pi-search-plus',
                        routerLink: ['admin/project'],
                        permission: this.jwtService.Permissions.CanViewProjects                       

                    },
                    {
                        label: 'Recruitment',
                        icon: 'pi pi-fw pi-search-plus',
                        routerLink: ['admin/recruitment'],
                        permission: this.jwtService.Permissions.CanViewAssetsAllotments
                       
                    },
                    {
                        label: 'Job Openings',
                        icon: 'pi pi-fw pi-calendar-plus',
                        routerLink: ['admin/jobopenings'],
                        permission: this.jwtService.Permissions.CanViewJobOpenings
                     
                    },
                ]
            },
            {
                label: 'Employee',
                icon: 'pi pi-user',
                permission: this.GroupPermission('Employee'),
                items: [
                    {
                        label: 'Enrolled Employees',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['employee/all-employees'],
                        permission: this.jwtService.Permissions.CanViewAssetsAllotments

                    },
                    {
                        label: 'On Boarding Employees',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['employee/onboardingemployee'],
                        permission: this.jwtService.Permissions.CanViewAssetsAllotments

                    },
                    {
                        label: 'Attendance',
                        icon: 'pi pi-fw pi-calendar-times',
                        routerLink: ['employee/attendance'],
                        permission: this.jwtService.Permissions.CanViewAttendances 
                    },
                    {
                        label: 'Leave Configuration',
                        icon: 'pi pi-fw pi-circle',
                        routerLink: ['employee/leaves'],
                        permission: this.jwtService.Permissions.CanViewAssetsAllotments
                    },
                    {
                        label: 'Notifications',
                        icon: 'pi pi-fw pi-clone',
                        routerLink: ['employee/notifications'],
                        permission: this.jwtService.Permissions.CanViewAssetsAllotments
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
