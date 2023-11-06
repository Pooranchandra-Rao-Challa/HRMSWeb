import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { Table } from 'primeng/table';
import { EmployeeService } from '../../_services/employee.service';
import { EmployeesViewDto } from 'src/app/_models/employes';
import { ITableHeader } from 'src/app/_models/common';
import { Router } from '@angular/router';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';

@Component({ 
    selector: 'app-all-employees',
    templateUrl: './all-employees.component.html',
    styles: [
    ]
})
export class AllEmployeesComponent {
    color1: string = 'Bluegray';
    visible: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    globalFilterFields: string[] = ['employeeName', 'code', 'gender', 'employeeRoleName', 'officeEmailId', 'mobileNumber',];
    employees: EmployeesViewDto[] = [];
    sortOrder: number = 0;
    sortField: string = '';
    mediumDate: string = MEDIUM_DATE

    headers: ITableHeader[] = [
        { field: 'code', header: 'code', label: 'Employee Code' },
        { field: 'employeeName', header: 'employeeName', label: 'Employee Name' },
        { field: 'gender', header: 'gender', label: 'Gender' },
        { field: 'employeeRoleName', header: 'employeeRoleName', label: 'Employee Role Name' },
        { field: 'officeEmailId', header: 'officeEmailId', label: 'Email' },
        { field: 'mobileNumber', header: 'mobileNumber', label: 'Phone No' },
        { field: 'dateofJoin', header: 'dateofJoin', label: 'Date of Joining' },

    ];
    constructor(private EmployeeService: EmployeeService,
        private router: Router) { }

    ngOnInit() {
        this.initEmployees()
    }

    initEmployees() {
        // Fetch only records where IsEnrolled is true
        const isEnrolled = true;
        this.EmployeeService.GetEmployees(isEnrolled).subscribe(resp => {
            this.employees = resp as unknown as EmployeesViewDto[];
            console.log( this.employees);
            
        });
    }

    showDialog() {
        this.visible = true;
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    viewEmployeeDtls(employeeId: number) {
        this.router.navigate(['employee/viewemployees'], { queryParams: { employeeId: employeeId } });
    }

}
