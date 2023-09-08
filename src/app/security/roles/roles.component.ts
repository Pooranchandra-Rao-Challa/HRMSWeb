import { HttpEvent } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { RoleDto, RolePermissionDto, RoleViewDto } from 'src/app/_models/security';
import { JwtService } from 'src/app/_services/jwt.service';
import { SecurityService } from 'src/app/_services/security.service';
import { MAX_LENGTH_50, MIN_LENGTH_2, RG_ALPHA_ONLY } from 'src/app/_shared/regex';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  globalFilterFields: string[] = ['name', 'isActive', 'createdAt', "createdBy", "updatedAt", "updatedBy"];
  dialog: boolean = false;
  @ViewChild('filter') filter!: ElementRef;
  fbrole!: FormGroup;
  submitLabel!: string;
  screens: string[] = [];
  roles: RoleViewDto[] = [];
  role: RoleDto = {}
  permission: any;
  permissions: RolePermissionDto[] = [];
  addFlag: boolean = true;
  maxLength: MaxLength = new MaxLength();
  mediumDate: string = MEDIUM_DATE;
  user: any

  constructor(private formbuilder: FormBuilder,private jwtService:JwtService,
    private alertMessage: AlertmessageService, private securityService: SecurityService) { }

  ngOnInit(): void {
    this.permission = this.jwtService.Permissions;
    this.fbrole = this.formbuilder.group({
      roleId: [''],
      name: new FormControl('', [Validators.required,Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2),Validators.maxLength(MAX_LENGTH_50)]),
      isActive: [true],
      permissions: []
    });
    this.intiRoles();
  }

  get roleFormControls() {
    return this.fbrole.controls;
  }
  
  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }
  
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  intiRoles() {
    this.securityService.GetRoles().subscribe(resp => {
      this.roles = resp as unknown as RoleViewDto[];
    });
  }

  headers: ITableHeader[] = [
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: ' Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' }
  ];

  initRole(role: RoleViewDto) {
    this.showDialog();
    this.screens = [];
    if (role.roleId != null) {    
      this.addFlag = false;
      this.submitLabel = "Update Role";
      this.securityService.GetRoleWithPermissions(role.roleId).subscribe(resp => {
      this.role.roleId = role.roleId
      this.role.name = role.name;
      this.role.isActive = role.isActive;
      this.role.permissions = (resp as unknown as RoleDto).permissions;
      this.fbrole.setValue(this.role);
      this.screensInPermissions()
      })
    } else {
      this.submitLabel = "Add Role";
      this.addFlag = true;
      this.role = {};
      this.role.roleId = "";
      this.role.name = "";
      this.role.isActive = true;
      this.initPermissoins();
    }
  }
  saveRole(): Observable<HttpEvent<RoleDto>> {
    if (!this.role.roleId) return this.securityService.CreateRole(this.fbrole.value)
    else return this.securityService.UpdateRole(this.fbrole.value)
  }
 
  showDialog() {
    this.fbrole.reset();
    this.dialog = true;
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  initPermissoins() {
    this.securityService.GetPermissions().subscribe(resp => {
      this.permissions = resp as unknown as RolePermissionDto[];
      this.role.permissions = this.permissions;
      this.fbrole.setValue(this.role);
      this.role.permissions?.forEach(p => p.assigned = false);
      this.screensInPermissions();
    });
  }
  screensInPermissions() {
    this.screens = getDistinct(this.role?.permissions || [], "screenName") as string[];
    this.screens.sort((a, b) => (a || "").localeCompare(b || ""))
  }
  onSubmit() {
    if (this.fbrole.valid) {
      this.saveRole().subscribe(resp => {
        if (resp) {
          this.fbrole.reset();
          this.dialog = false;
          this.intiRoles();
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMR001" : "SMR002"]);
        }
      })
    }
    else {
      this.fbrole.markAllAsTouched();
    }
  }
  
  getPermissions(screen: string) {
    return this.role?.permissions?.filter(fn => fn.screenName == screen)
  }

}

function getDistinct<T, K extends keyof T>(data: T[], property: K): T[K][] {
  const allValues = data.reduce((values: T[K][], current) => {
    if (current[property]) {
      values.push(current[property]);
    }
    return values;
  }, []);

  return [...new Set(allValues)];
}


