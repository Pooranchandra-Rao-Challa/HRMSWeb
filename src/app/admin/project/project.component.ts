import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { ClientDetailsDto, ClientNamesDto, ProjectViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MAX_LENGTH_256, MAX_LENGTH_50, MIN_LENGTH_2, MIN_LENGTH_20, MIN_LENGTH_4, RG_PHONE_NO } from 'src/app/_shared/regex';
import { TreeNode } from 'primeng/api';
import { dE } from '@fullcalendar/core/internal-common';
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
  clientDetails: ClientDetailsDto;
  visible: boolean = false;
  filteredClients: any;
  fbproject!: FormGroup;
  maxLength: MaxLength = new MaxLength();
  userForm!: FormGroup;
  imageSize: any;
  permission: any;
  addFlag: boolean = true;
  dialog: boolean;
  submitLabel!: string;
  selectedValue: string = '';
  minDateVal = new Date();
  projectDetails: any = {};
  projectTreeData: TreeNode[];
  selectedFileBase64: string | null = null; // To store the selected file as base64
  images = ['3F.jpg', 'fr.jpg', 'jiva.jpg', 'madhucon.jpg', 'nava.jpg', 'saloon.jpg'];
  selectedImageIndex: number = 0;
  rootProject: TreeNode = {
    type: 'person',
    styleClass: ' text-orange',
    expanded: true,
    data: {
      image: 'data:image/png;base64,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',
      name: 'Calibrage',

    },
  };

  constructor(private projectService: SecurityService, private formbuilder: FormBuilder, private adminService: AdminService, private alertMessage: AlertmessageService,
    private jwtService: JwtService) { }

  ngOnInit() {
    this.permission = this.jwtService.Permissions;
    this.initProjects();
    this.initClientNames();
    this.initEmployees();

    this.fbproject = this.formbuilder.group({
      clientId: [0],
      projectId: [0],
      isActive: ['', [Validators.required]],
      code: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_4), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      startDate: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      logo: [],
      clients: this.formbuilder.group({
        clientId: [],
        isActive: ['', [Validators.required]],
        companyName: new FormControl(null, [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
        Name: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
        email: new FormControl('', [Validators.required]),
        mobileNumber: new FormControl('', [Validators.required, Validators.pattern(RG_PHONE_NO)]),
        cinno: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_20), Validators.maxLength(MAX_LENGTH_50)]),
        pocName: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
        pocMobileNumber: new FormControl('', [Validators.required, Validators.pattern(RG_PHONE_NO)]),
        address: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
      }),
      teamMembers: []
    });

  }


  showProjectDetailsDialog(projectDetails: any) {
    this.visible = true;
    this.projectDetails = projectDetails;
  }
  hierarchialDialog(node){
   this.projects.filter(element=>{
     if(element.name==node.data.name){
       this.showProjectDetailsDialog(element);
     }
   })
  }

  initProject(project: ProjectViewDto) {
    this.showDialog();
    if (project != null) {
      console.log(project)
      this.addFlag = false;
      this.submitLabel = "Update Project";
      this.fbproject.patchValue({
        clientId: project.clientId,
        projectId: project.projectId,
        code: project.code,
        name: project.name,
        isActive: project.isActive,
        startDate: FORMAT_DATE(new Date(project.startDate)),
        logo: project.logo,
        description: project.description
      });
      this.fbproject.get('clients').patchValue({
        clientId: project.clientId,
        isActive: project.isActive,
        companyName: {
          companyName: project.companyName,
          clientId: project.clientId
        },
        Name: project.clientName,
        email: project.email,
        mobileNumber: project.mobileNumber,
        cinno: project.cinno,
        pocName: project.pocName,
        pocMobileNumber: project.pocMobileNumber,
        address: project.address,
      });
    } else {
      this.addFlag = true;
      this.submitLabel = "Add Project";
      this.fbproject.reset();
      this.fcClientDetails.get('isActive')?.setValue(true);
    }
  }
  onAutocompleteSelect(selectedOption: ClientNamesDto) {
    this.adminService.GetClientDetails(selectedOption.clientId).subscribe(resp => {
      this.clientDetails = resp[0];
      this.fcClientDetails.get('clientId')?.setValue(this.clientDetails.clientId);
      this.fcClientDetails.get('Name')?.setValue(this.clientDetails.clientName);
      this.fcClientDetails.get('email')?.setValue(this.clientDetails.email);
      this.fcClientDetails.get('mobileNumber')?.setValue(this.clientDetails.mobileNumber);
      this.fcClientDetails.get('cinno')?.setValue(this.clientDetails.cinno);
      this.fcClientDetails.get('pocName')?.setValue(this.clientDetails.pocName);
      this.fcClientDetails.get('pocMobileNumber')?.setValue(this.clientDetails.pocMobileNumber);
      this.fcClientDetails.get('address')?.setValue(this.clientDetails.address);
    })
  }

  saveProject() {
    if (this.addFlag) {
      if (this.clientDetails) {
        this.fcClientDetails.get('companyName')?.setValue(this.clientDetails.companyName);
      }
      return this.adminService.CreateProject(this.fbproject.value);
    }
    else {
      this.getSelectedItemName(this.fcClientDetails.controls['companyName'].value)
      return this.adminService.UpdateProject(this.fbproject.value)
    }
  }

  isUniqueProjectCode() {
    const existingLookupCodes = this.projects.filter(project =>
      project.code === this.fbproject.get('code').value &&
      project.projectId !== this.fbproject.get('projectId').value
    )
    return existingLookupCodes.length > 0;
  }

  isUniqueLookupName() {
    const existingLookupNames = this.projects.filter(project =>
      project.name === this.fbproject.get('name').value &&
      project.projectId !== this.fbproject.get('projectId').value
    )
    return existingLookupNames.length > 0;
  }

  onSubmit() {

    if (this.fbproject.valid) {
      if (this.addFlag) {
        if (this.isUniqueProjectCode()) {
          this.alertMessage.displayErrorMessage(
            `Lookup Code :"${this.fbproject.value.code}" Already Exists.`
          );
        } else if (this.isUniqueLookupName()) {
          this.alertMessage.displayErrorMessage(
            `Lookup Name :"${this.fbproject.value.name}" Already Exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save();
      }
    }
    else {
      this.fbproject.markAllAsTouched();
    }
  }

  getSelectedItemName(item: { clientId: number; companyName: string }) {
    this.fcClientDetails.get('companyName')?.setValue(item.companyName);
  }

  onFileSelect(event: any): void {
    const selectedFile = event.files[0];
    this.imageSize = selectedFile.size;
    console.log(this.imageSize);
    if (selectedFile) {
      this.convertFileToBase64(selectedFile, (base64String) => {
        this.selectedFileBase64 = base64String;
        this.fbproject.get('logo').setValue(this.selectedFileBase64);
      });
    } else {
      this.selectedFileBase64 = null;
    }
  }
  private convertFileToBase64(file: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      callback(base64String);
    };
  }
  save() {
    if (this.fbproject.valid) {
      this.saveProject().subscribe(resp => {
        if (resp) {
          this.fbproject.reset();
          this.dialog = false;
          this.initProjects();
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "PAS001" : "PAS002"]);
        }
      })
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
      this.rootProject.children = this.convertToTreeNode(resp as unknown as ProjectViewDto[]);
      this.projectTreeData = [this.rootProject];

    });

  }

  convertToTreeNode(projects: any[]): TreeNode[] {
    return projects.map((project) => ({
      type: 'person',
      styleClass: 'bg-orange-300 text-white',
      expanded: true,
      data: {
        image: project.logo,
        name: project.name,

      },
      children: [
        { label: 'Sadikh', styleClass: 'bg-green-300 text-white', },
        { label: 'Arun', styleClass: 'bg-green-300 text-white', },
      ], // Assuming 'name' is the project name property
    }));
  }
  initClientNames() {
    this.adminService.GetClientNames().subscribe(resp => {
      this.clientsNames = resp as unknown as ClientNamesDto[];
    });
  }
  initEmployees() {
    this.projectService.getEmployees().then((data: Employee[]) => (this.employees = data));
  }
  filterClients(event: AutoCompleteCompleteEvent) {
    this.filteredClients = this.clientsNames;
    let filtered: any[] = [];
    let query = event.query;
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


