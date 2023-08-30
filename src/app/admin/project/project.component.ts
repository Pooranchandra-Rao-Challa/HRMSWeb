import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import {  ClientDetailsDto, ClientNamesDto, ProjectViewDto } from 'src/app/_models/admin';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MAX_LENGTH_256, MAX_LENGTH_50, MIN_LENGTH_2, MIN_LENGTH_20, MIN_LENGTH_4, RG_PHONE_NO } from 'src/app/_shared/regex';

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
  clientsNames: ClientNamesDto[] = [];
  clientDetails:ClientDetailsDto;
  visible: boolean = false;
  filteredClients: any;
  fbproject!: FormGroup;
  projectId: number;
  userForm!: FormGroup;
  permission: any;
  addFlag: boolean = true;
  dialog: boolean;
  submitLabel!: string;
  minDateVal = new Date();
  projectDetails: any = {};
  constructor(private projectService: SecurityService, private formbuilder: FormBuilder, private adminService: AdminService, private alertMessage: AlertmessageService,
    private jwtService: JwtService) { }

  ngOnInit() {
    this.permission = this.jwtService.Permissions;
    this.initProjects();
    this.initClientNames();
    this.initEmployees();
    this.fbproject = this.formbuilder.group({
      code: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_4), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      startDate: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      clients: this.formbuilder.group({
        isActive: [false, [Validators.required]],
        companyName: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
        clientName: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
        email: new FormControl('', [Validators.required]),
        mobileNumber: new FormControl('', [Validators.required]),
        cinno: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_20), Validators.maxLength(MAX_LENGTH_50)]),
        pocName: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
        pocMobileNumber: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      })
      // teamMembers: new FormControl([], [Validators.required]),

    });
  }

  showProjectDetailsDialog(projectDetails: any) {
    this.visible = true;
    this.projectDetails = projectDetails;
    console.log(this.projectDetails)
  }
  initProject(project: ProjectViewDto) {
    console.log(project)
    this.showDialog();
    if (project != null) {
      this.projectId = project.projectId;
      this.addFlag = false;
      this.submitLabel = "Update Project";
      // this.fbproject.setValue({
      //   code: project.code,
      //   name: project.name,
      //   startDate: project.startDate,
      //   description: project.description,
      //   isActive: project.isActive,
      //   companyName: project.companyName,
      //   clientName: project.clientName,
      //   email: project.email,
      //   mobileNumber: project.mobileNumber,
      //   cinno: project.cinno,
      //   pocName: project.pocName,
      //   pocMobileNumber: project.pocMobileNumber,
      //   address: project.address,
      //   teamMembers: project.teamMembers,
      // });
    } else {
      this.projectId = null;
      this.dialog = true;
      this.addFlag = false;
      this.submitLabel = "Add Project";
      this.fbproject.reset();
    }
  }
  async onAutocompleteSelect(selectedOption: ClientNamesDto) {
    console.log(selectedOption.companyName)
    await this.adminService.GetClientDetails(selectedOption.clientId).subscribe(resp=>{
      this.clientDetails=resp[0];
      console.log(resp[0])
       this.fcClientDetails.get('companyName')?.setValue(this.clientDetails.companyName);
       this.fcClientDetails.get('clientName')?.setValue(this.clientDetails.clientName);
       this.fcClientDetails.get('email')?.setValue(this.clientDetails.email);
       this.fcClientDetails.get('mobileNumber')?.setValue(this.clientDetails.mobileNumber);
       this.fcClientDetails.get('cinno')?.setValue(this.clientDetails.cinno);
       this.fcClientDetails.get('pocName')?.setValue(this.clientDetails.pocname);
       this.fcClientDetails.get('pocMobileNumber')?.setValue(this.clientDetails.pocMobileNumber);
       this.fcClientDetails.get('address')?.setValue(this.clientDetails.address);
    })
   
  }
  saveProject() {
    debugger
    if (!this.projectId) return this.adminService.CreateProject(this.fbproject.value);
    else return this.adminService.UpdateProject(this.fbproject.value)
  }
  onSubmit() {
    console.log(this.fbproject.value)
    if (this.fbproject.valid) {
      this.saveProject().subscribe(resp => {
        console.log(resp);
        debugger
        if (resp) {
          this.fbproject.reset();
          this.dialog = false;
          this.initProjects();
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "PAS001" : "PAS002"]);
        }
      })
    }
    else {
      this.fbproject.markAllAsTouched();
    }
  }

 
  get projectFormControls() {
    return this.fbproject.controls;
  }
  get fcClientDetails() {
    return this.fbproject.get('clients') as FormGroup;
  }

  initProjects() {
    this.adminService.GetProjects().subscribe(resp => {
      this.projects = resp as unknown as ProjectViewDto[];
    });
  }
  initClientNames() {
    this.adminService.GetClientNames().subscribe(resp => {
      this.clientsNames = resp as unknown as ClientNamesDto[];
    });
  }
  initEmployees() {
    this.projectService.getEmployees().then((data: Employee[]) => (this.employees = data, console.log(data)));
  }
  filterClients(event: AutoCompleteCompleteEvent) {
    this.filteredClients = this.clientsNames;
    let filtered: any[] = [];
    let query = event.query;
    console.log(query)
    for (let i = 0; i < (this.clientsNames as any[]).length; i++) {
      let client = (this.clientsNames as any[])[i];
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
}
