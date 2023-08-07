import { Component } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/demo/api/product';
import { Employee } from 'src/app/demo/api/security';
import { ProductService } from 'src/app/demo/service/product.service';
import { SecurityService } from 'src/app/demo/service/security.service';

@Component({
    selector: 'app-all-employees',
    templateUrl: './all-employees.component.html',
    styles: [
    ]
})
export class AllEmployeesComponent {
    color1: string = 'Bluegray';
    visible: boolean = false;
    showDialog() {
        this.visible = true;
    }


    employees: Employee[] = [];


    sortOrder: number = 0;

    sortField: string = '';




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

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }


}
