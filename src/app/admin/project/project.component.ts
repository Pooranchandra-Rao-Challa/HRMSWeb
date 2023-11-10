import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { ClientDetailsDto, ClientNamesDto, EmployeesList, ProjectAllotments, ProjectViewDto } from 'src/app/_models/admin';
import { MaxLength, PhotoFileProperties } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MAX_LENGTH_21, MAX_LENGTH_256, MAX_LENGTH_50, MIN_LENGTH_2, MIN_LENGTH_20, MIN_LENGTH_21, MIN_LENGTH_4, RG_ALPHA_NUMERIC, RG_EMAIL, RG_PHONE_NO } from 'src/app/_shared/regex';
import { TreeNode } from 'primeng/api';
import * as go from 'gojs';
import { CompanyHierarchyViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { DownloadNotification } from 'src/app/_services/notifier.services';
import { ProjectNotification } from 'src/app/_services/projectnotification.service';
import { DatePipe } from '@angular/common';
import { ValidateFileThenUpload } from 'src/app/_validators/upload.validators';
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
    @ViewChild("fileUpload", { static: true }) fileUpload: ElementRef;
    data: null;
    private diagram: go.Diagram;
    projects: ProjectViewDto[] = [];
    clientsNames: ClientNamesDto[] = [];
    Employees: EmployeesList[] = [];
    Roles: string[] = []
    clientDetails: ClientDetailsDto;
    visible: boolean = false;
    filteredClients: any;
    fbUnAssignEmployee!: FormGroup;
    fbproject!: FormGroup;
    maxLength: MaxLength = new MaxLength();
    imageSize: any;
    dialog1: boolean;
    editProject: boolean;
    permission: any;
    addFlag: boolean = true;
    submitLabel!: string;
    minDateVal = new Date();
    projectDetails: any = {};
    companyHierarchy: CompanyHierarchyViewDto[] = [];
    selectedProjectId: number = -1;
    first: number = 0;
    rows: number = 10;

    fileTypes: string = ".jpg, .jpeg, .gif,.png"
    @Output() ImageValidator = new EventEmitter<PhotoFileProperties>();
    defaultPhoto: string;

    //For paginator
    onPageChange(event) {
        this.first = event.first;
        this.rows = event.rows;
    }
    get visibleProjects(): any[] {
        return this.projects.slice(this.first, this.first + this.rows);
    }

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

    //eventsSubject: Subject<void> = new Subject<void>();

    emitEventToChild() {
        //this.eventsSubject.next();
        this.downloadNotifier.sendData(true);
    }
    preparOrgHierarchy() {
    }
    onProjectChange(event) {
        this.selectedProjectId = event;
        this.projectNotifier.sendSelectedProjectId(this.selectedProjectId);
    }
    constructor(private formbuilder: FormBuilder, private adminService: AdminService,
        private employeeService: EmployeeService, private alertMessage: AlertmessageService,
        private jwtService: JwtService, private downloadNotifier: DownloadNotification,
        private projectNotifier: ProjectNotification, private datePipe: DatePipe) { }

    ngOnInit() {
        this.permission = this.jwtService.Permissions;
        this.projectForm();
        this.initProjects();
        this.initClientNames();
        this.unAssignEmployeeForm();
        this.ImageValidator.subscribe((p: PhotoFileProperties) => {
            if (this.fileTypes.indexOf(p.FileExtension) > 0 && p.Resize || (p.Size / 1024 / 1024 < 1
                && (p.isPdf || (!p.isPdf && p.Width <= 400 && p.Height <= 500)))) {
                this.fbproject.get('logo').setValue(p.File);
            } else {
                this.alertMessage.displayErrorMessage(p.Message);
            }
        })
        this.fileUpload.nativeElement.onchange = (source) => {
            for (let index = 0; index < this.fileUpload.nativeElement.files.length; index++) {
                const file = this.fileUpload.nativeElement.files[index];
                ValidateFileThenUpload(file, this.ImageValidator, 1024 * 1024, '300 x 300 pixels', true);
            }
        }

    }
    projectForm() {
        this.fbproject = this.formbuilder.group({
            clientId: [0],
            projectId: [null],
            isActive: [true, [Validators.required]],
            code: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_4), Validators.maxLength(MAX_LENGTH_20)]),
            name: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
            startDate: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
            logo: [],
            clients: this.formbuilder.group({
                clientId: [],
                isActive: [true, [Validators.required]],
                companyName: new FormControl(null, [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
                Name: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
                email: new FormControl('', [Validators.required]),
                mobileNumber: new FormControl('', [Validators.required, Validators.pattern(RG_PHONE_NO)]),
                cinno: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_20), Validators.maxLength(MAX_LENGTH_50)]),
                pocName: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_50)]),
                pocMobileNumber: new FormControl('', [Validators.required, Validators.pattern(RG_PHONE_NO)]),
                address: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_256)]),
            }),
            projectAllotments: new FormControl([])
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

    restrictSpaces(event: KeyboardEvent) {
        if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
            event.preventDefault();
        }
    }

    unAssignedEmployee(employee: ProjectAllotments) {
        this.fcUnAssignAsset['projectAllotmentId']?.setValue(employee.projectAllotmentId);
        this.fcUnAssignAsset['projectId']?.setValue(employee.projectId);
        this.fcUnAssignAsset['employeeId']?.setValue(employee.employeeId);
        this.fcUnAssignAsset['isActive']?.setValue(false);
        this.adminService.UnassignEmployee(this.fbUnAssignEmployee.value).subscribe((resp) => {
            if (this.visible) {
                this.alertMessage.displayAlertMessage(ALERT_CODES["SMEUA001"]);
                this.showProjectDetails(employee.projectId)
                this.fbUnAssignEmployee.reset();
            }
        });
    }

    get fcUnAssignAsset() {
        return this.fbUnAssignEmployee.controls;
    }

    showProjectDetails(projectId: number) {
        this.visible = true;
        this.getProjectWithId(projectId);
    }

    getProjectWithId(id: number) {
        this.adminService.getProjectWithId(id).subscribe(resp => {
            this.projectDetails = resp[0] as unknown as ProjectViewDto;
            this.projectDetails.expandEmployees = JSON.parse(this.projectDetails.teamMembers);
        });
    }

    // initProjects() {
    //   this.adminService.GetProjects().subscribe(resp => {
    //     this.projects = resp as unknown as ProjectViewDto[];
    //     console.log(this.projects);

    //     // this.projects.forEach(element => {
    //     //   element.expandEmployees = JSON.parse(element.teamMembers);
    //     // });
    //     // this.rootProject.children = this.convertToTreeNode(resp as unknown as ProjectViewDto[]);
    //     // this.projectTreeData = [this.rootProject];
    //   });
    // }
    initProjects() {
        this.adminService.GetProjects().subscribe(resp => {
            this.projects = resp as unknown as ProjectViewDto[];
            let projectDTO: ProjectViewDto = new ProjectViewDto
            projectDTO.projectId = -1;
            projectDTO.name = "Org Chart"
            this.projects.push(projectDTO)
            this.projects = this.projects.reverse();
        });
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

    onEditProject(project: ProjectViewDto) {
        this.projectForm();
        this.editProject = true;
        this.fileUpload.nativeElement.value = '';
        if (project != null) {
            this.editEmployee(project);
            this.getEmployeesListBasedOnProject(project.projectId);
        } else {
            this.addFlag = true;
            this.submitLabel = "Add Project";
            this.getEmployeesListBasedOnProject(0);
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
            startDate: FORMAT_DATE(new Date(project.startDate)),
            logo: project.logo,
            description: project.description
        })
        this.fbproject.get('clients').patchValue({
            clientId: project.clientId,
            isActive: project.clientIsActive,
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
        this.projectForm();
        this.getEmployeesListBasedOnProject(projectDetails.projectId);
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
        this.fbproject.get('startDate').setValue(FORMAT_DATE(new Date(this.fbproject.get('startDate').value)))
        if (this.addFlag) {
            if (this.clientDetails)
                this.fcClientDetails.get('companyName')?.setValue(this.clientDetails.companyName);
            return this.adminService.CreateProject(this.fbproject.value);
        }
        else {
            this.getSelectedItemName(this.fcClientDetails.controls['companyName'].value);
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

    save() {
        if (this.fbproject.valid) {
            this.saveProject().subscribe(resp => {
                if (resp) {
                    this.editProject = false;
                    this.initProjects();
                    this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "PAS001" : "PAS002"]);
                    this.dialog1 = false;
                    if (this.visible)
                        this.showProjectDetails(this.projectDetails.projectId);
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

    getEmployeesListBasedOnProject(projectId: number) {
        this.adminService.getEmployees(projectId).subscribe(resp => {
            this.Employees = resp as unknown as EmployeesList[];
            console.log(this.Employees);

            this.Roles = this.Employees.map(fn => fn.eRoleName).filter((role,i,roles) => roles.indexOf(role) === i);
            console.log(this.Employees.map(fn => fn.eRoleName));

            console.log(this.Roles);

        });
    }

    getRoleEmployees(roleName:string):EmployeesList[]{
        return this.Employees.filter(value => value.eRoleName === roleName)
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

    onEmployeeDragEnd(){

    }
    onEmployeeDragStart(empoloyee){}

    onEmployeeDrop(){}
}


