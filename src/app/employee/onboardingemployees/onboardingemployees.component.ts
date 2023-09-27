import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Table } from 'primeng/table/public_api';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { OnboardEmployeeService } from 'src/app/_helpers/view.notificaton.services';
import { ITableHeader } from 'src/app/_models/common';
import { BankDetailViewDto, Employee, EmployeesViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { SecurityService } from 'src/app/_services/security.service';


@Component({
  selector: 'app-onboardingemployees',
  templateUrl: './onboardingemployees.component.html',
  styles: [
  ]
})
export class OnboardingemployeesComponent {
  @ViewChild('filter') filter!: ElementRef;
  @Input() isReadOnly: boolean =false

  globalFilterFields: string[] = ['employeeName', 'code', 'gender', 'employeeRoleName', 'officeEmailId', 'mobileNumber',];
  color1: string = 'Bluegray';
  visible: boolean = false;
  newEmployeeSteps: MenuItem[];
  mediumDate: string = MEDIUM_DATE
  employeeId: number;
  employees: Employee[] = [];
  sortOrder: number = 0;
  sortField: string = '';


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
    this.router.navigate(['basicdetails'], { queryParams: {'employeeId':119}, relativeTo: this.route })
    this.visible = true;
  }


  constructor(private securityService: SecurityService,
    private router: Router,
    private route: ActivatedRoute,
    private EmployeeService:EmployeeService,
    private onboardEmployeeService: OnboardEmployeeService
   ) { }

  cancelModel() {
    this.router.navigate(['employee/onboardingemployee'])
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.queryParams['employeeId'];
    console.log(this.employeeId);
    this.updateMenuItems();
    this.onboardEmployeeService.getData().subscribe(employeeId => {
        this.employeeId = employeeId;
        this.updateMenuItems();
    });

    this.initEmployees()

    console.log(this.newEmployeeSteps);

  }
  updateMenuItems(){
    this.newEmployeeSteps = [
        {
          label: 'Personal Details',
          routerLink: 'basicdetails',
          disabled: false
        },
        {
          label: 'Education Details',
          routerLink: `educationdetails/${this.employeeId}`,
          disabled: this.employeeId === undefined,
        },
        {
          label: 'Experience Details',
          routerLink: `experiencedetails/${this.employeeId}`,
          disabled: this.employeeId === undefined
        },
        {
          label: 'Address Details',
          routerLink:`addressdetails/${this.employeeId}`,
          disabled: this.employeeId === undefined
        },
        {
          label: 'Upload Documents',
          routerLink: `uploadfiles/${this.employeeId}`,
          disabled: this.employeeId === undefined
        },
        {
          label: 'Family Details',
          routerLink: `familydetails/${this.employeeId}`,
          disabled: this.employeeId === undefined
        },
        {
          label:'Bank Details',
          routerLink:`bankdetails/${this.employeeId}`,
          disabled: this.employeeId === undefined
        },
        {
          label: 'Final Submission',
          routerLink: `finalsubmit/${this.employeeId}`,
          disabled: this.employeeId === undefined
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

  viewEmployeeDtls(employeeId: number) {
    this.router.navigate(['employee/viewemployees'], { queryParams: { employeeId: employeeId }});
  }
}
