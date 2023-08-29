import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { ProjectViewDto } from 'src/app/_models/admin';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styles: ['']
})
export class ProjectComponent implements OnInit {
  employees: Employee[] = [];
  projects: ProjectViewDto[] = [];
  visible: boolean = false;
  fbproject!: FormGroup;
  userForm!: FormGroup;
  permission: any;
  dialog: boolean;
  submitLabel!: string;
  projectDetails:any={};
  constructor(private projectService: SecurityService, private formbuilder: FormBuilder,private adminService: AdminService, private alertMessage: AlertmessageService,
    private jwtService:JwtService) { }

  ngOnInit() {
    this.permission = this.jwtService.Permissions;
    this.initProjects();
    this.initEmployees();
    this.fbproject = this.formbuilder.group({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      managerName: new FormControl('', [Validators.required]),
      isActive: [null],
      companyFullName: new FormControl('', [Validators.required]),
      gstNo: new FormControl('', [Validators.required]),
      clientPocName: new FormControl('', [Validators.required]),
      clientPocNo: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      id: new FormControl([], [Validators.required]),
    });
  }

  items: any[] | undefined;

  selectedItem: any;

  suggestions: any[] | undefined;

  search(event) {
      this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
  }
  showDialog(projectDetails) {
    this.visible = true;
    debugger
    this.projectDetails=projectDetails;
    console.log(this.projectDetails)
  }
  onSubmit() {

  }

  initProjects() {
    this.adminService.GetProjects().subscribe(resp => {
      this.projects= resp as unknown as ProjectViewDto[];
      console.log(resp);
    });
  }

  initEmployees() {
    this.projectService.getEmployees().then((data: Employee[]) => (this.employees = data,console.log(data)));
  }

  addProjectDialog() {
    this.dialog = true;
  
    this.submitLabel = "Add Project";
    this.fbproject.reset();
  }
  editProjectDialog() {
    this.dialog = true;
    this.submitLabel = "Edit Project";
  }

}
