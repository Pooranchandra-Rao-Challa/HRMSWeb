import { HttpEvent } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';

import { ITableHeader } from 'src/app/_models/common';
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



  constructor(private formbuilder: FormBuilder, private securityService: SecurityService, private jwtService: JwtService) { }

  ngOnInit(): void {
    this.permission = this.jwtService.Permissions;
    this.roleForm = this.formbuilder.group({
      roleId: [''],
      Name: new FormControl('', [Validators.required]),
      isActive: [true, (Validators.requiredTrue)],
      permissions: []
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

  initPermissoins() {
    // this.securityService.GetPermissions().subscribe(resp => {
    //   this.permissions = resp as unknown as RolePermissionDto[];
    //   this.role.permissions = this.permissions;
    //   this.roleForm.setValue(this.role);
    //   this.role.permissions?.forEach(p => p.assigned = false);
    //   this.screensInPermissions();
    // });
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
      // this.securityService.GetRoleWithPermissions(role.roleId).subscribe(resp => {
      //   this.role.roleId = role.roleId
      //   this.role.code = role.code
      //   this.role.name = role.name;
      //   this.role.isActive = role.isActive;
      //   this.role.permissions = (resp as unknown as RoleDto).permissions;
      //   this.roleForm.setValue(this.role);
      //   this.screensInPermissions()
      // })
    } else {
      this.submitLabel = "Add Role";
      this.addFlag = false;
      this.role = {};
      this.role.roleId = "";
      this.role.Name = "";
      this.role.isActive = false;
      this.initPermissoins();

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
  editRole() {
    this.showDialog();
    this.screens = [];
    this.submitLabel = "Update Role";
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  showRoles() {
    this.dialog = true;
  }
  onSubmit() {
    if (this.roleForm.valid) {
      console.log(this.roleForm.value);
      this.saveRole().subscribe(resp => {
        if (resp) {
          this.roleForm.reset();
          this.dialog = false;
          this.intiRoles();
        }
      })
    }
    else {
      this.roleForm.markAllAsTouched();
    }
  }

}
