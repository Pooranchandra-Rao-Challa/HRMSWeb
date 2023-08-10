import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Employee, Leave } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';

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
  employees!: Employee[];
  globalFilterFields: string[] = ['empname'];
  selectedMonths: Month | undefined;
  Months: Month[] | undefined;
  dialog: boolean = false;
  fbleave!: FormGroup;
  leaves: Leave[];

  showDialog() {
    this.dialog = true;
    this.fbleave.reset();
  }
  constructor(private securityService: SecurityService, private formbuilder: FormBuilder) { }
  ngOnInit() {
    this.initEmployee();
    this.initLeave();
    this.Months = [
      { Monthname: '-' },
      { Monthname: 'Jan' },
      { Monthname: 'Feb' },
      { Monthname: 'Mar' },
      { Monthname: 'Apr' },
      { Monthname: 'May' },
      { Monthname: 'Jun' },
      { Monthname: 'Jul' },
      { Monthname: 'Aug' },
      { Monthname: 'Sep' },
      { Monthname: 'Oct' },
      { Monthname: 'Nov' },
      { Monthname: 'Dec' }
    ];
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
  initLeave() {
    this.securityService.getleaves().then((data) => {
      this.leaves = data
    })
  }
  initEmployee() {
    this.securityService.getEmployees().then((data) => {
      this.employees = data;
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
