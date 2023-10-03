import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Leave } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { Employee, employeeAttendenceDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
// import { Employee, Leave } from 'src/app/demo/api/security';
// import { SecurityService } from 'src/app/demo/service/security.service';

interface Month {
  Monthname: string;
}
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styles: [
  ]
})
export class AttendanceComponent {
  month: number = 1;
  days: number[]=[];
  year: number = 2023;
  employees!: Employee[];
  employeeAttendenceList: employeeAttendenceDto[];
  globalFilterFields: string[] = ['empname'];
  selectedMonths: Month | undefined;
  Months: Month[] | undefined;
  dialog: boolean = false;
  fbleave!: FormGroup;
  leaves: Leave[];

  showDialog() {
    this.dialog = true;
    this.fbleave.reset();

    console.log(this.employeeAttendenceList)
  }


  constructor(private securityService: SecurityService, private formbuilder: FormBuilder, private alertMessage: AlertmessageService, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.initLeaveForm();
    this.initAtendence();
    this.getDaysInMonth(this.year, this.month);
   

  }

  initLeaveForm() {
    this.fbleave = this.formbuilder.group({
      empId: new FormControl('', [Validators.required]),
      leaveTitle: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      leaveDescription: new FormControl('', [Validators.required]),
      numberOfDays: new FormControl('', [Validators.required]),
      leaveDetails: this.formbuilder.array([])
    });

  }

  getDaysInMonth(year: number, month: number) { const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() - 1);
    console.log(date.getMonth()+1)
    let day=date.getDate();
    for (let i = 1; i <= day; i++) {
      this.days.push(i);
    }
  }
  initAtendence() {
    this.employeeService.GetAttendence(this.month).subscribe((resp) => {
      this.employeeAttendenceList = resp as unknown as employeeAttendenceDto[];
      console.log(resp);
    });
  }


  
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
