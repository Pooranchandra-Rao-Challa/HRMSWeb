import { HttpEvent } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';

import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { RoleDto, RolePermissionDto, RoleViewDto } from 'src/app/_models/security';
import { JwtService } from 'src/app/_services/jwt.service';
import { SecurityService } from 'src/app/_services/security.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  globalFilterFields: string[] = ['name', 'isActive', 'createdAt'];
  dialog: boolean = false;
  @ViewChild('filter') filter!: ElementRef;
  roleForm!: FormGroup;
  submitLabel!: string;
  screens: string[] = [];
  roles: RoleViewDto[] = [];
  role: RoleDto = {}
  permission: any;
  permissions: RolePermissionDto[] = [];
  addFlag: boolean = true;
  maxLength: MaxLength = new MaxLength();


  constructor(private formbuilder: FormBuilder,
    private alertMessage: AlertmessageService, private securityService: SecurityService) { }

  ngOnInit(): void {
    this.roleForm = this.formbuilder.group({
      roleId: [''],
      roleName: new FormControl('', [Validators.required]),
      isActive: [true],
    });
    this.intiRoles();
  }

  get roleFormControls() {
    return this.roleForm.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  intiRoles() {
    this.securityService.GetRoles().subscribe(resp => {
      this.roles = resp as unknown as RoleViewDto[];
      console.log(this.roles);
    });
  }
  headers: ITableHeader[] = [
    { field: 'roleName', header: 'roleName', label: 'Name' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
  ];
  initRole(role: RoleViewDto) {
    this.showDialog();
    this.screens = [];
    if (role.roleId != null) {
      this.addFlag = false;
      this.submitLabel = "Update Role";
      this.role.roleId = role.roleId
      this.role.roleName = role.roleName;
      this.role.isActive = role.isActive;
      this.roleForm.setValue(this.role);
    } else {
      this.submitLabel = "Add Role";
      this.addFlag = false;
      this.role = {};
      this.role.roleId = "";
      this.role.roleName = "";
      this.role.isActive = false;

    }
  }
  saveRole(): Observable<HttpEvent<RoleDto>> {
    if (!this.role.roleId) return this.securityService.CreateRole(this.roleForm.value)
    else return this.securityService.UpdateRole(this.roleForm.value)
  }
  showDialog() {
    this.roleForm.reset();
    this.dialog = true;
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  onSubmit() {
    if (this.roleForm.valid) {
      console.log(this.roleForm.value);
      this.saveRole().subscribe(resp => {
        if (resp) {
          this.roleForm.reset();
          this.dialog = false;
          this.intiRoles();
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMR001" : "SMR002"]);
        }
      })
    }
    else {
      this.roleForm.markAllAsTouched();
    }
  }

}
