import { HttpEvent } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { RoleViewDto, UserUpdateDto, UserViewDto } from 'src/app/_models/security';
import { Employee } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/_services/security.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
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
  constructor(private securityService: SecurityService,
    private formbuilder: FormBuilder,
    private jwtService: JwtService) {
  }
  users: UserViewDto[] = [];
  user:UserUpdateDto[]=[];
  globalFilterFields: string[] = ['userId', 'userName', 'firstName', 'lastName', 'email', 'mobileNumber', 'roleName', 'email'];
  userForm!: FormGroup;
  roles: RoleViewDto[] = [];
  screens: string[] = [];
  permissions: any;
  selectedUser: UserViewDto = {
  };
  dialog: boolean = false;
  submitLabel!: string;
  trueValue: any;
  falseValue: any;
  mediumDate: string = MEDIUM_DATE;
  headers: ITableHeader[] = [
    { field: 'userId', header: 'userId', label: 'User Id' },
    { field: 'userName', header: 'userName', label: 'User Name' },
    { field: 'firstName', header: 'firstName', label: 'First Name' },
    { field: 'lastName', header: 'lastName', label: 'Last Name' },
    { field: 'email', header: 'email', label: 'Email' },
    { field: 'mobileNumber', header: 'mobileNumber', label: 'Mobile Number' },
    { field: 'roleName', header: 'roleName', label: 'Role Name' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created At' },
  ];
  ngOnInit() {
    this.permissions = this.jwtService.Permissions
    this.initUsers();
     this.intiRoles()
    this.userForm = this.formbuilder.group({
      userId: [''],
      userName: new FormControl(''),
      firstName: new FormControl(),
      email: [''],
      mobileNumber: new FormControl(''),
      roleName: new FormControl(''),
      roleId:new FormControl(''),
      isActive: new FormControl(''),
      createdAt: ['', (Validators.required)]
    });
   }
  initUsers() {
    this.securityService.GetUsers().subscribe(resp => {
      this.users = resp as unknown as UserViewDto[];
    })
  }
  intiRoles() {
    this.securityService.GetRoles().subscribe(resp => {
      this.roles = resp as unknown as RoleViewDto[];
      console.log(this.roles);
    });
  }

  editUser(user: UserViewDto) {
    this.userForm.patchValue({
      userId: user.userId,
      userName: user.userName,
      firstName: user.firstName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      roleName: user.roleName,
      roleId: user.roleId,
      isActive: user.isActive,
      createdAt: user.createdAt
    });
  }
  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      const updatedUser = { ...this.selectedUser, ...this.userForm.value };
      this.securityService.UpdateUser(updatedUser).subscribe(resp => {
        if (resp) {
          console.log(resp);
          this.dialog = false;
          this.userForm.reset();
          this.initUsers();
        }
      });
    }
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
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0
      return event.order * result;
    });
  }
  
  get userFormControls() {
    return this.userForm.controls;
  }
  showUser(user: UserViewDto) {
    this.selectedUser = user;
    this.editUser(user);
    this.dialog = true;
  }
  clear(table: Table) {
    table.clear();
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
