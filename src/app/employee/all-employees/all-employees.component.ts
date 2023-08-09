import { Component, ElementRef, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/demo/api/product';
import { Employee } from 'src/app/demo/api/security';
import { ProductService } from 'src/app/demo/service/product.service';
import { SecurityService } from 'src/app/demo/service/security.service';
import { Table } from 'primeng/table';

export interface ITableHeader {
    field: string;
    header: string;
    label: string;
  }

@Component({
    selector: 'app-all-employees',
    templateUrl: './all-employees.component.html',
    styles: [
    ]
})
export class AllEmployeesComponent {
    globalFilterFields: string[] = ['empname', 'empcode', 'designation','email','phoneno'];
    color1: string = 'Bluegray';
    visible: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    

    showDialog() {
        this.visible = true;
    }
    
    isFirstItem(employee: any): boolean {
        return this.employees.indexOf(employee) === 0;
    }

    employees: Employee[] = [];


    sortOrder: number = 0;

    sortField: string = '';

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }

    headers: ITableHeader[] = [
        { field: 'empname', header: 'empname', label: 'EmpName' },
        { field: 'empcode', header: 'empcode', label: 'EmpCode ' },
        { field: 'designation', header: 'designation', label: 'Designation ' },
        { field: 'email', header: 'email', label: 'Email' },
        { field: 'phoneno', header: 'phoneno', label: 'PhoneNo ' }
      ];

    constructor(private securityService: SecurityService) { }


    ngOnInit() {
        this.securityService.getEmployees().then((data) => (this.employees = data));
        
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }
    
    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
      }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }
   

}
