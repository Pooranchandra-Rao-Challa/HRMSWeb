import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { RoleViewDto, UserUpdateDto, UserViewDto } from 'src/app/_models/security';
import { SecurityService } from 'src/app/_services/security.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';

// Define the interface for the table header
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
  constructor(
    private securityService: SecurityService,
    private formbuilder: FormBuilder,
    private jwtService: JwtService,
    private alertMessage: AlertmessageService) {
  }
  // Declare class variables
  users: UserViewDto[] = [];
  user: UserUpdateDto[] = [];
  @ViewChild('filter') filter!: ElementRef;
  globalFilterFields: string[] = ['userId', 'userName', 'firstName', 'lastName', 'email', 'mobileNumber', 'roleName', 'email', 'createdAt'];
  userForm!: FormGroup;
  roles: RoleViewDto[] = [];
  permissions: any;
  selectedUser: UserViewDto = {};
  dialog: boolean = false;
  submitLabel!: string;
  loading: boolean = false;
  mediumDate: string = MEDIUM_DATE

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
    // Initialize the form group
    this.userForm = this.formbuilder.group({
      userId: [''],
      userName: new FormControl(null),
      firstName: new FormControl(null),
      email: [null],
      mobileNumber: new FormControl(null),
      roleName: new FormControl(null),
      roleId: new FormControl(''),
      isActive: [true],
      createdAt: [''],
    })
  }
  // Fetch users from the service
  initUsers() {
    this.loading = true;
    this.securityService.GetUsers().subscribe(resp => {
      this.users = resp as unknown as UserViewDto[];
      this.loading = false;
    }, error => {
      this.loading = false;
    })
    
  }
  // Fetch roles from the service
  intiRoles() {
    this.securityService.GetRoles().subscribe(resp => {
      this.roles = resp as unknown as RoleViewDto[];
      console.log('role list', this.roles);

    });
  }
  // Edit user by patching the form values
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
  // Submit form handler
  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser = { ...this.selectedUser, ...this.userForm.value };
      if (updatedUser.isActive == false) {
        // Call the DeleteUser method if the user is inactive
        this.securityService.DeleteUser(updatedUser).subscribe(resp => {
          if (resp) {
            this.dialog = false;
            this.userForm.reset();
            this.initUsers();
            this.alertMessage.displayAlertMessage(ALERT_CODES["SMU001"]);
          }
        });
      }
      else {
        // Call the UpdateUser method if the user is active
        this.securityService.UpdateUser(updatedUser).subscribe(resp => {
          if (resp) {
            this.dialog = false;
            this.userForm.reset();
            this.initUsers();
            this.alertMessage.displayAlertMessage(ALERT_CODES["SMU002"]);
          }
        });
      }
    }
  }
  get userFormControls() {
    return this.userForm.controls;
  }
  // Function to show user details
  showUser(user: UserViewDto) {
    this.selectedUser = user;
    this.editUser(user);
    this.dialog = true;

  }
  // Function to clear the table
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  // Function to filter the table globally
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
