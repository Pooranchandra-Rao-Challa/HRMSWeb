import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Table } from 'primeng/table/public_api';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { ITableHeader } from 'src/app/_models/common';
import { EmployeesViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { Product } from 'src/app/demo/api/product';
import { Employee } from 'src/app/demo/api/security';
import { ProductService } from 'src/app/demo/service/product.service';
import { SecurityService } from 'src/app/demo/service/security.service';

@Component({
  selector: 'app-onboardingemployees',
  templateUrl: './onboardingemployees.component.html',
  styles: [
  ]
})
export class OnboardingemployeesComponent {
  @ViewChild('filter') filter!: ElementRef;
  globalFilterFields: string[] = ['employeeName', 'code', 'gender', 'employeeRoleName', 'officeEmailId', 'mobileNumber',];
  color1: string = 'Bluegray';
  visible: boolean = false;
  newEmployeeSteps: MenuItem[];
  mediumDate: string = MEDIUM_DATE


  headers: ITableHeader[] = [
    { field: 'employeeName', header: 'employeeName', label: 'Employee Name' },
    { field: 'gender', header: 'gender', label: 'Gender' },
    { field: 'code', header: 'code', label: 'Employee Code' },
    { field: 'employeeRoleName', header: 'employeeRoleName', label: 'Designation' },
    { field: 'officeEmailId', header: 'officeEmailId', label: 'Email' },
    { field: 'mobileNumber', header: 'mobileNumber', label: 'Phone No' },
    { field: 'dateofJoin', header: 'dateofJoin', label: 'Date of Join' },
  ]
  
  showDialog() {
    this.router.navigate(['basicdetails'], { relativeTo: this.route })
    this.visible = true;
  }
  employees: Employee[] = [];

  sortOrder: number = 0;

  sortField: string = '';


  constructor(private securityService: SecurityService,
    private router: Router,
    private route: ActivatedRoute,
    private EmployeeService:EmployeeService) { }

  cancelModel() {
    this.router.navigate(['employee/onboardingemployee'])
  }

  ngOnInit() {
    this.initEmployees()
    this.newEmployeeSteps = [
      {
        label: 'Personal Details',
        routerLink: 'basicdetails',
      },
      {
        label: 'Education Details',
        routerLink: 'educationdetails',
      },
      {
        label: 'Experience Details',
        routerLink: 'experiencedetails',
      },
      {
        label: 'Address Details',
        routerLink:'addressdetails',
      },
      {
        label: 'Upload Documents',
        routerLink: 'uploadfiles',
      },
      {
        label: 'Family Details',
        routerLink: 'familydetails',
      },
      {
        label:'Bank Details',
        routerLink:'bankdetails',
      },
      {
        label: 'Final Submission',
        routerLink: 'finalsubmit',
      },
    ];
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



  initEmployees() {
    // Fetch only records where IsEnrolled is true
    const isEnrolled = false;
    this.EmployeeService.GetEmployees(isEnrolled).subscribe(resp => {
      this.employees = resp as unknown as EmployeesViewDto[];
      console.log(this.employees)
    });
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

}
