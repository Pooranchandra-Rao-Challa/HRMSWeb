import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Employee } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
export interface ITableHeader {
  field: string;
  header: string;
  label: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [
  ]
})
export class UserComponent implements OnInit {
  constructor(private securityService: SecurityService, private formbuilder: FormBuilder) {

  }
  employees: Employee[] = [];
  globalFilterFields: string[] = ['empname', 'empcode', 'dob', 'designation', 'gender', 'doj', 'email', 'phoneno'];
  userForm!: FormGroup;
  dialog: boolean = false;
  submitLabel!: string;
  trueValue: any;
  falseValue: any
  clear(table: Table) {
    table.clear();
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnInit() {
    this.securityService.getEmployees().then(
      (data: Employee[]) =>
      (this.employees = data,
        console.log(data))
    );
    this.userForm = this.formbuilder.group({
      id: [''],
      empname: new FormControl('', [Validators.required]),
      empcode: new FormControl('', [Validators.required]),
      dob: ['', (Validators.required)],
      designation: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      doj: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phoneno: ['', (Validators.required)]
    });
  }
  customSort(event: SortEvent) {
    event.data.sort((data1: { [x: string]: any; }, data2: { [x: string]: any; }) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  headers: ITableHeader[] = [
    { field: 'empname', header: 'empname', label: 'Name' },
    { field: 'empcode', header: 'empcode', label: 'Code' },
    { field: 'dob', header: 'dob', label: 'Dob' },
    { field: 'designation', header: 'designation', label: 'Designation' },
    { field: 'gender', header: 'gender', label: 'Gender' },
    { field: 'doj', header: 'doj', label: 'DOJ' },
    { field: 'email', header: 'email', label: 'Email' },
    { field: 'phoneno', header: 'phoneno', label: 'Mobile Number' }
  ];
  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.dialog = false;
      this.userForm.reset();
    }
  }
  get userFormControls() {
    return this.userForm.controls;
  }
  showUser(employee: Employee) {
    this.dialog = true;
  }
}
