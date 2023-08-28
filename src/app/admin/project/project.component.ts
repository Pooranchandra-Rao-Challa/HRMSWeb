import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee, ProjectDetailsDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styles: ['']
})
export class ProjectComponent implements OnInit {
  employees: Employee[] = [];
  projects: ProjectDetailsDto[] = [];
  visible: boolean = false;
  fbproject!: FormGroup;
  userForm!: FormGroup;
  dialog: boolean;
  submitLabel!: string;
  constructor(private projectService: SecurityService, private formbuilder: FormBuilder) { }

  ngOnInit() {
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
  showDialog() {
    this.visible = true;
  }
  onSubmit() {

  }

  initProjects() {
    this.projectService.getprojects().then((data: ProjectDetailsDto[]) => (this.projects = data));
  }
  initEmployees() {
    this.projectService.getEmployees().then((data: Employee[]) => (this.employees = data));
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
