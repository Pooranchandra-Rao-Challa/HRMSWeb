import { HttpEvent } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserViewDto } from 'src/app/_models/security';
import { Employee } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/_services/security.service';
import { JwtService } from 'src/app/_services/jwt.service';
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

  constructor(private securityService:SecurityService, 
    private formbuilder: FormBuilder,
    private jwtService:JwtService) {

  }
  users: UserViewDto[] = [];
  globalFilterFields: string[] = ['empname', 'empcode', 'dob', 'designation', 'gender', 'doj', 'email', 'phoneno'];
  userForm!: FormGroup;
permissions:any;
  dialog: boolean = false;
  submitLabel!: string;
  trueValue: any;
  falseValue: any;


  clear(table: Table) {
    table.clear();

  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions
   this.initUsers();
  
    this.userForm = this.formbuilder.group({
      userId: [''],
      userName: new FormControl(''),
      firstName: new FormControl(),
      email: [''],
      mobileNumber: new FormControl(''),
      roleName: new FormControl(''),
      isActive: new FormControl(''),
      createdAt: ['', (Validators.required)]
    });
  }


  initUsers() {
    this.securityService.GetUsers().subscribe(resp => {
      this.users = resp as unknown as UserViewDto[];
      console.log(this.users);
      
    // this.users.sort((a, b) => (a.userName || "").localeCompare(b.userName || ""))
      // console.log(this.users);
  
    })
 
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
    { field: 'Role Id', header: 'Role Id', label: 'Role Id' },
    { field: 'userName', header: 'userName', label: 'User Name' },
    { field: 'FirstName', header: 'First Name', label: 'First Name'},
    { field: 'LastName', header: 'Last Name', label: 'Last Name' },
    { field: 'Email', header: 'Email', label: 'Email' },
    { field: 'MobileNumber', header: 'Mobile Number', label: 'Mobile Number'},
    { field: 'Role Name', header: 'Role Name', label: 'Role Name' },
    { field: 'IsActive', header: 'IsActive', label: 'Is Active' },
    { field: 'CreatedAt', header: 'Created At', label: 'Created At' },

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
  showUser(user: UserViewDto) {
    this.dialog = true;
  }
}
