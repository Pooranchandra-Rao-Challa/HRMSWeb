import { OnInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

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



  constructor(private formbuilder: FormBuilder, private securityService: SecurityService, private jwtService: JwtService) { }

  ngOnInit(): void {
    this.permission = this.jwtService.Permissions;
    this.roleForm = this.formbuilder.group({
      roleId: [''],
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
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

  headers: ITableHeader[] = [
    { field: 'roleName', header: 'roleName', label: 'Name' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
  ];

  showDialog() {
    this.roleForm.reset();
    this.dialog = true;
  }
  editRole() {
    this.showDialog();
    this.screens = [];
    this.submitLabel = "Update Role";
  }
  initRole(role: RoleViewDto) {
    this.showDialog();
    this.screens = [];
    this.submitLabel = "Add Role";
  }


  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }


  showRoles() {
    this.dialog = true;
  }

  onSubmit() {

  }

}
