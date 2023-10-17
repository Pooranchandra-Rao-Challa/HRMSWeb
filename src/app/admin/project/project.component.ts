import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { ClientDetailsDto, ClientNamesDto, EmployeesList, ProjectAllotments, ProjectViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MAX_LENGTH_256, MAX_LENGTH_50, MIN_LENGTH_2, MIN_LENGTH_20, MIN_LENGTH_4, RG_PHONE_NO } from 'src/app/_shared/regex';
import { TreeNode } from 'primeng/api';
import { dE } from '@fullcalendar/core/internal-common';
import * as go from 'gojs';
import { OrgChart } from "d3-org-chart";
import * as d3 from 'd3';
import { EmployeeService } from 'src/app/_services/employee.service';
import { CompanyHierarchyViewDto } from 'src/app/_models/employes';
import { D3OrgChartComponent } from './d3-org-chart/d3-org-chart.component';
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
  data: null;
  private diagram: go.Diagram;
  employees: EmployeesList[] = [];
  projects: ProjectViewDto[] = [];
  clientsNames: ClientNamesDto[] = [];
  Employees: EmployeesList[] = [];
  clientDetails: ClientDetailsDto;
  visible: boolean = false;
  filteredClients: any;
  fbUnAssignEmployee!: FormGroup;
  fbproject!: FormGroup;
  maxLength: MaxLength = new MaxLength();
  imageSize: any;
  dialog1: boolean;
  dialog: boolean;
  permission: any;
  addFlag: boolean = true;
  submitLabel!: string;
  minDateVal = new Date();
  projectDetails: any = {};
  selectedFileBase64: string | null = null; // To store the selected file as base64
  companyHierarchy :CompanyHierarchyViewDto[]=[];
  
  projectTreeData: TreeNode[];
  rootProject: TreeNode = {
    type: 'person',
    styleClass: ' text-orange',
    expanded: true,
    data: {
      image: 'https://media.licdn.com/dms/image/C4D0BAQG7ReG72NaW1w/company-logo_200_200/0/1609833020211?e=2147483647&v=beta&t=s9wvhPXLVPXl7wY464a0BF69Qwpf3xqa2n4hf-GMRG0',
      name: 'Calibrage',
    },
  };
  constructor(private formbuilder: FormBuilder, private adminService: AdminService, private employeeService:EmployeeService, private alertMessage: AlertmessageService,
    private jwtService: JwtService) { }

  ngOnInit() {
    this.permission = this.jwtService.Permissions;
    this.projectForm();
    this.initProjects();
    this.initClientNames();
    this.initEmployees();
    this.unAssignEmployeeForm();

    

      this.employeeService.getCompanyHierarchy().subscribe((resp) => {
        this.companyHierarchy = resp as unknown as CompanyHierarchyViewDto[];
        console.log(this.companyHierarchy);
      });
    
    // d3.json(
    //   "https://gist.githubusercontent.com/bumbeishvili/dc0d47bc95ef359fdc75b63cd65edaf2/raw/c33a3a1ef4ba927e3e92b81600c8c6ada345c64b/orgChart.json"
    // ).then(resp => {
    //   console.log(resp);
    //   this.data = resp;
    // });
    

    // this.diagram = new go.Diagram('myDiagramDiv');

    // this.diagram.nodeTemplate =
    //   go.GraphObject.make(go.Node, 'Auto',
    //     go.GraphObject.make(go.Shape, 'Rectangle', { fill: 'white' }),
    //     go.GraphObject.make(go.TextBlock, { margin: 8 }, new go.Binding('text', 'name'))
    //   );

    // this.diagram.linkTemplate =
    //   go.GraphObject.make(go.Link,
    //     go.GraphObject.make(go.Shape)
    //   );

    // this.diagram.model = new go.GraphLinksModel([
    //   { key: '1', name: 'CEO' },
    //   { key: '2', name: 'Manager 1', parent: '1' },
    //   { key: '3', name: 'Manager 2', parent: '1' },
    //   { key: '4', name: 'Employee 1', parent: '2' },
    //   { key: '5', name: 'Employee 2', parent: '2' },
    // ]);

  }
  projectForm() {
    this.fbproject = this.formbuilder.group({
      clientId: [0],
      projectId: [0],
      isActive: ['', [Validators.required]],
      code: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_4), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
      InceptionAt: new FormControl('', [Validators.required]),
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
      ProjectAllotments: new FormControl()
    });
  }

  unAssignEmployeeForm() {
    this.fbUnAssignEmployee = this.formbuilder.group({
      projectAllotmentId: new FormControl('', [Validators.required]),
      projectId: new FormControl('', [Validators.required]),
      employeeId: new FormControl('', [Validators.required]),
      isActive: new FormControl('', [Validators.required]),
    });
  }

  unAssignedEmployee(employee: ProjectAllotments) {
    this.fcUnAssignAsset['projectAllotmentId']?.setValue(employee.projectAllotmentId);
    this.fcUnAssignAsset['projectId']?.setValue(employee.projectId);
    this.fcUnAssignAsset['employeeId']?.setValue(employee.employeeId);
    this.fcUnAssignAsset['isActive']?.setValue(false);
    this.adminService.UnassignEmployee(this.fbUnAssignEmployee.value).subscribe((resp) => {
      if (this.visible) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SMEUA001"]);
        this.ngOnInit();
        this.visible = false;
        this.fbUnAssignEmployee.reset();
      }
    });
  }

  get fcUnAssignAsset() {
    return this.fbUnAssignEmployee.controls;
  }

  showProjectDetailsDialog(projectDetails: ProjectViewDto) {
    this.visible = true;
    this.projectDetails = projectDetails;
  }

  hierarchialDialog(node) {
    this.projects.filter(element => {
      if (element.name == node.data.name) {
        this.showProjectDetailsDialog(element);
      }
    })
  }

  initProject(project: ProjectViewDto) {
    this.initEmployees();
    this.showDialog();
    if (project != null) {
      this.editEmployee(project);
      this.editEmployeesList(project.projectId)
    } else {
      this.addFlag = true;
      this.submitLabel = "Add Project";
      this.fbproject.reset();
      this.fcClientDetails.get('isActive')?.setValue(true);
    }
  }

  editEmployee(project) {
    this.addFlag = false;
    this.submitLabel = "Update Project Details";
    this.fbproject.patchValue({
      clientId: project.clientId,
      projectId: project.projectId,
      code: project.code,
      name: project.name,
      isActive: project.isActive,
      InceptionAt: FORMAT_DATE(new Date(project.startDate)),
      logo: project.logo,
      description: project.description
    })
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
  }

  addEmployees(projectDetails: ProjectViewDto) {
    this.dialog1 = true;
    this.editEmployeesList(projectDetails.projectId);
    this.editEmployee(projectDetails);
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
          if (this.dialog1) {
            this.dialog1 = false;
            this.visible = false;
          }
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
      this.projects.forEach(element => {
        element.expandEmployees = JSON.parse(element.teamMembers);
      });
      this.rootProject.children = this.convertToTreeNode(resp as unknown as ProjectViewDto[]);
      this.projectTreeData = [this.rootProject];
    });
  }

  convertToTreeNode(projects: any[]): TreeNode[] {
    return projects.map((project) => ({
      type: 'person',
      styleClass: 'hirarchi_parent text-white',
      expanded: false,
      data: {
        image: project.logo,
        name: project.name,

      },
      children: [
        { label: 'Sadikh', styleClass: 'bg-green-300 text-white', },
        { label: 'Arun', styleClass: 'bg-green-300 text-white', },
        { label: 'Arun', styleClass: 'bg-green-300 text-white', },
        { label: 'Arun', styleClass: 'bg-green-300 text-white', },
        { label: 'Arun', styleClass: 'bg-green-300 text-white', },
        { label: 'Arun', styleClass: 'bg-green-300 text-white', },
        { label: 'Arun', styleClass: 'bg-green-300 text-white', },
        { label: 'Arun', styleClass: 'bg-green-300 text-white', },
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
    this.adminService.getEmployeesList().subscribe(resp => {
      this.employees = resp as unknown as EmployeesList[];
    });
  }
  editEmployeesList(projectId: number) {
    this.adminService.getEmployees(projectId).subscribe(resp => {
      this.Employees = resp as unknown as EmployeesList[];
    });
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


