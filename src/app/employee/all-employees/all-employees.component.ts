import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { SecurityService } from 'src/app/demo/service/security.service';
import { Table } from 'primeng/table';
import { EmployeeService } from '../../_services/employee.service';
import { EmployeesViewDto } from 'src/app/_models/employes';
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
    employees: EmployeesViewDto[] = [];
    sortOrder: number = 0;
    sortField: string = '';
    mediumDate: string = MEDIUM_DATE

    constructor(private securityService: SecurityService,
        private EmployeeService: EmployeeService) { }

    ngOnInit() {
        this.initEmployees()
    }
    
    initEmployees() {
        // Fetch only records where IsEnrolled is true
        const isEnrolled = true;
        this.EmployeeService.GetEmployees(isEnrolled).subscribe(resp => {
            this.employees = resp as unknown as EmployeesViewDto[];
            console.log(this.employees)
        });
    }

    showDialog() {
        this.visible = true;
    }


    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }


}
