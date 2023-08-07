import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectDetailsDto } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styles: ['']
})
export class ProjectComponent implements OnInit{

projects: ProjectDetailsDto[] = [];
visible: boolean=false;
fbproject!: FormGroup;
dialog: boolean;
submitLabel!: string;
constructor(private projectService:SecurityService,private formbuilder:FormBuilder){}

ngOnInit(){
 this.initProjects();
 this.fbproject = this.formbuilder.group({
  code: new FormControl('', [Validators.required]),
  name: new FormControl('', [Validators.required]),
  startDate:new FormControl('',[Validators.required]),
  description:new FormControl('',[Validators.required]),
  managerName:new FormControl('',[Validators.required]),
  isActive: [null],
  companyFullName:new FormControl('',[Validators.required]),
  gstNo:new FormControl('',[Validators.required]),
  clientPocName:new FormControl('',[Validators.required]),
  clientPocNo:new FormControl('',[Validators.required]),
  address:new FormControl('',[Validators.required])
 });
}

showDialog() {
  this.visible = true;
}
onSubmit(){

}

initProjects(){
  this.projectService.getprojects().then((data: ProjectDetailsDto[]) => (this.projects = data));
}

addProjectDialog(){
  this.dialog = true;
  this.submitLabel = "Add Project";
}
editProjectDialog(){
  this.dialog = true;
  this.submitLabel = "Edit Project";
}
  
}
