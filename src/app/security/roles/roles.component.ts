import { OnInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { RoleViewDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';

export interface ITableHeader {
  field: string;
  header: string;
  label: string;
}

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
  // role: RoleDto = {}
  // permissions: RolePermissionDto[] = [];

  constructor(private formbuilder: FormBuilder, private securityService: SecurityService) { }

  ngOnInit(): void {
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

  intiRoles() {
    this.securityService.getRoles().then((data: RoleViewDto[]) => (this.roles = data));
  }

  headers: ITableHeader[] = [
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
  ];



  showDialog() {
    this.roleForm.reset();
    this.dialog = true;
  }
  editRole(){
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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  showRoles() {
    this.dialog = true;
  }

  onSubmit() {

  }

}
