import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { ClientDeatilsDto, ProjectViewDto } from 'src/app/_models/admin';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MAX_LENGTH_256, MAX_LENGTH_50, MIN_LENGTH_2, MIN_LENGTH_4 } from 'src/app/_shared/regex';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styles: ['']
})
export class ProjectComponent implements OnInit {
  employees: Employee[] = [];
  projects: ProjectViewDto[] = [];
  clients:ClientDeatilsDto[]=[];
  visible: boolean = false;
  filteredClients:any;
  fbproject!: FormGroup;
  userForm!: FormGroup;
  permission: any;
  dialog: boolean;
  submitLabel!: string;
  minDateVal=new Date();
  projectDetails:any={};
  constructor(private projectService: SecurityService, private formbuilder: FormBuilder,private adminService: AdminService, private alertMessage: AlertmessageService,
    private jwtService:JwtService) { }

  ngOnInit() {
    this.permission = this.jwtService.Permissions;
    this.initProjects();
    this.initClientNames();
    this.initEmployees();
    this.fbproject = this.formbuilder.group({
      code: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_4),Validators.minLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required,Validators.minLength(MIN_LENGTH_2),Validators.minLength(MAX_LENGTH_50)]),
      startDate: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required,Validators.minLength(MIN_LENGTH_2),Validators.minLength(MAX_LENGTH_256)]),
      isActive: [false, [Validators.required]],
      companyName: new FormControl('', [Validators.required,Validators.minLength(MIN_LENGTH_2),Validators.minLength(MAX_LENGTH_50)]),
      clientName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      cinno: new FormControl('', [Validators.required]),
      pocName: new FormControl('', [Validators.required]),
      pocMobileNumber: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      teamMembers: new FormControl([], [Validators.required]),
    });
  }

  showProjectDetailsDialog(projectDetails) {
    this.visible = true;
    this.projectDetails=projectDetails;
    console.log(this.projectDetails)
  }
  onSubmit() {
    if (this.fbproject.valid) {
      // this.saveRole().subscribe(resp => {
      //   if (resp) {
      //     this.fbproject.reset();
      //     this.dialog = false;
      //     this.initProjects();
      //     this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "PAS001" : "PAS002"]);
      //   }
      // })
    }
    else {
      this.fbproject.markAllAsTouched();
    }
  }

  initProjects() {
    this.adminService.GetProjects().subscribe(resp => {
      this.projects= resp as unknown as ProjectViewDto[];
      console.log(resp);
      
    });
  }
  initClientNames(){
    this.adminService.GetClientDetails().subscribe(resp=>{
      this.clients=resp as unknown as ClientDeatilsDto[];
    });
  }
  initEmployees() {
    this.projectService.getEmployees().then((data: Employee[]) => (this.employees = data,console.log(data)));
  }
  filterClients(event: AutoCompleteCompleteEvent) {
    this.filteredClients=this.clients;
    let filtered: any[] = [];
    let query = event.query;
    console.log(query)
    for (let i = 0; i < (this.clients as any[]).length; i++) {
        let client = (this.clients as any[])[i];
        if (client.companyName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(client);
        }
    }
    this.filteredClients = filtered;
}
showDialog() {
  this.fbproject.reset();
  this.dialog = true;
}
initProject(project ) {
  this.showDialog();
  // if (role.roleId != null) {    
  //   this.addFlag = false;
  //   this.submitLabel = "Update Role";
  //   this.securityService.GetRoleWithPermissions(role.roleId).subscribe(resp => {
  //   this.role.roleId = role.roleId
  //   this.role.name = role.name;
  //   this.role.isActive = role.isActive;
  //   this.role.permissions = (resp as unknown as RoleDto).permissions;
  //   this.fbrole.setValue(this.role);
  //   this.screensInPermissions()
  //   })
  // } else {
  //   this.submitLabel = "Add Role";
  //   this.addFlag = true;
  //   this.role = {};
  //   this.role.roleId = "";
  //   this.role.name = "";
  //   this.role.isActive = true;
  //   this.initPermissoins();
  // }
}
  editProjectDialog() {
    this.dialog = true;
    this.submitLabel = "Edit Project";
  }

}
