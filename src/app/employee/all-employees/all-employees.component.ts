import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { Table } from 'primeng/table';
import { EmployeeService } from '../../_services/employee.service';
import { EmployeesViewDto } from 'src/app/_models/employes';
import { ITableHeader } from 'src/app/_models/common';
import { Router } from '@angular/router';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { JwtService } from 'src/app/_services/jwt.service';
import { ReportService } from 'src/app/_services/report.service';
import * as FileSaver from "file-saver";
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'app-all-employees',
    templateUrl: './all-employees.component.html',
    styles: [
    ]
})
export class AllEmployeesComponent {
    selectedEmployeeStatus: { label: string; value: string } = { label: 'Active Employees', value: 'Active Employees' };
    employeeStatusOptions: { label: string; value: string }[] = [];
    color1: string = 'Bluegray';
    visible: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    globalFilterFields: string[] = ['employeeName', 'code', 'gender', 'employeeRoleName', 'officeEmailId', 'mobileNumber',];
    employees: EmployeesViewDto[] = [];
    sortOrder: number = 0;
    sortField: string = '';
    mediumDate: string = MEDIUM_DATE
    permissions: any;
    value: number;

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
        private router: Router, private jwtService: JwtService, private reportService: ReportService) { }

    ngOnInit() {

        this.permissions = this.jwtService.Permissions;
        this.initEmployees(this.selectedEmployeeStatus.value)
        this.employeeStatusOptions = [
            { label: 'Active Employees', value: 'Active Employees' },
            { label: 'InActive Employees', value: 'InActive Employees' },
            { label: 'All Employees', value: 'All Employees' },
        ];
    }

    initEmployees(selectedEmployeeStatus: string) {
        // Fetch only records where IsEnrolled is true
        const isEnrolled = true;
        this.EmployeeService.GetEmployeesBasedonstatus(isEnrolled, selectedEmployeeStatus).subscribe(resp => {
            this.employees = resp as unknown as EmployeesViewDto[];
            this.employees.forEach(employee => this.getEmployeePhoto(employee));
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
    clearcard(dv: DataView) {
        dv.filteredValue = null;
        this.filter.nativeElement.value = '';
    }
    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    viewEmployeeDtls(employeeId: number) {
        this.router.navigate(['employee/viewemployees'], { queryParams: { employeeId: employeeId } });
    }
    downloadEmployeesReport() {
        const employeeStatusValue = this.selectedEmployeeStatus?.value;
        this.reportService.DownloadEmployees(employeeStatusValue)
            .subscribe((resp) => {
                if (resp.type === HttpEventType.DownloadProgress) {
                    const percentDone = Math.round(100 * resp.loaded / resp.total);
                    this.value = percentDone;
                }
                if (resp.type === HttpEventType.Response) {
                    const file = new Blob([resp.body], { type: 'text/csv' });
                    const document = window.URL.createObjectURL(file);
                    FileSaver.saveAs(document, "EmployeeReport.csv");
                }
            })
    }

    getEmployeePhoto(employee:EmployeesViewDto){
        return this.EmployeeService.getEmployeePhoto(employee.employeeId).subscribe((resp)=> {
            employee.photo = (resp as any).ImageData;
        })
    }
}
