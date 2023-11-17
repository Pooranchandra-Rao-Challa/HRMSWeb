import { AfterViewInit, ChangeDetectorRef, Component,  ComponentRef,  ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { ClientDetailsDto, ClientNamesDto, EmployeeHierarchyDto, EmployeesList, ProjectAllotments, projectStatus, projectStatuses, ProjectViewDto } from 'src/app/_models/admin';
import { MaxLength, PhotoFileProperties } from 'src/app/_models/common';
import { NodeProps,ChartParams } from 'src/app/_models/admin'
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MAX_LENGTH_21, MAX_LENGTH_256, MAX_LENGTH_50, MIN_LENGTH_2, MIN_LENGTH_20, MIN_LENGTH_21, MIN_LENGTH_4, RG_ALPHA_NUMERIC, RG_EMAIL, RG_PHONE_NO } from 'src/app/_shared/regex';
import { TreeNode } from 'primeng/api';
import * as go from 'gojs';
import { CompanyHierarchyViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { DownloadNotification, OrgChartDataNotification,NodeDropNotifier } from 'src/app/_services/notifier.services';
import { DatePipe } from '@angular/common';
import { ValidateFileThenUpload } from 'src/app/_validators/upload.validators';
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
    @ViewChild("fileUpload", { static: true }) fileUpload: ElementRef;
    private diagram: go.Diagram;
    projects: ProjectViewDto[] = [];
    clientsNames: ClientNamesDto[] = [];
    Employees: EmployeesList[] = [];
    projectStatues: projectStatus[];
    Roles: string[] = []
    clientDetails: ClientDetailsDto;
    projectDetailsDialog: boolean = false;
    filteredClients: any;
    fbUnAssignEmployee!: FormGroup;
    fbproject!: FormGroup;
    minDate1: Date;
    maxLength: MaxLength = new MaxLength();
    addEmployeeDialog: boolean;
    editProject: boolean;
    permission: any;
    addFlag: boolean = true;
    submitLabel!: string;
    projectDetails: any = {};
    companyHierarchy: CompanyHierarchyViewDto[] = [];
    selectedProjectId: number = -1;
    first: number = 0;
    rows: number = 10;
    projectStatues: projectStatus[];

    @ViewChild('orgProjectChart', { read: ViewContainerRef, static: true })
    private orgProjectChartref: ViewContainerRef;
    @ViewChild('allottEmployees', { read: ViewContainerRef, static: true })
    private allottEmployeesref: ViewContainerRef;

    public componentRefs: ComponentRef<D3OrgChartComponent>[] = []

    fileTypes: string = ".jpg, .jpeg, .gif,.png"
    @Output() ImageValidator = new EventEmitter<PhotoFileProperties>();
    defaultPhoto: string;


    //For paginator
    first: number = 0;
    rows: number = 12;
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

    emitEventToChild() {
        //this.eventsSubject.next();
        this.downloadNotifier.sendData(true);
    }

    preparOrgHierarchy() {
    }
    onProjectChange(event) {
        this.selectedProjectId = event;
        //this.projectNotifier.sendSelectedProjectId(this.selectedProjectId);
        if (this.selectedProjectId === -1) {
            this.organizationData();
        }
        else {
            this.employeeProjectData(this.selectedProjectId);
        }
    }
    constructor(private formbuilder: FormBuilder, private adminService: AdminService,
        private employeeService: EmployeeService, private alertMessage: AlertmessageService,
        private jwtService: JwtService, private downloadNotifier: DownloadNotification,
        private datePipe: DatePipe, private chartDataNotification: OrgChartDataNotification,
        private nodeDropNotifier: NodeDropNotifier, private viewContainerRef: ViewContainerRef,
        private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.permission = this.jwtService.Permissions;
        this.defaultPhoto = './assets/layout/images/projectsDefault.jpg';
        this.projectForm();
        this.initProjects();
        this.initClientNames();
        this.unAssignEmployeeForm();
        this.allottEmployeesToProject();
        //this.allottEmployeesToProject();
       //this.organizationData();
        this.initProjectStatuses();
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
        this.nodeDropNotifier.getDropNodes().subscribe(value =>{
            this.onEmployeeDrop(value);
        })
    }

    projectForm() {
        this.fbproject = this.formbuilder.group({
            clientId: [0],
            projectId: [null],
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

            projectStatuses: new FormControl([]),
            initialStatus: this.formbuilder.group({
                eProjectStatusesId: ['', [Validators.required]],
                Date: new FormControl('', [Validators.required]),
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


    initProjectStatuses() {
        this.adminService.projectStatuses().subscribe((resp) => {
            this.projectStatues = resp as unknown as projectStatus[];
        })
    }
    restrictSpaces(event: KeyboardEvent) {
        const target = event.target as HTMLInputElement;
        // Prevent the first key from being a space
        if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0)
            event.preventDefault();

        // Restrict multiple spaces
        if (event.key === ' ' && target.selectionStart > 0 && target.value.charAt(target.selectionStart - 1) === ' ') {
            event.preventDefault();
        }
    }

    unAssignedEmployee(employee: ProjectAllotments) {
        this.fcUnAssignAsset['projectAllotmentId']?.setValue(employee.projectAllotmentId);
        this.fcUnAssignAsset['projectId']?.setValue(employee.projectId);
        this.fcUnAssignAsset['employeeId']?.setValue(employee.employeeId);
        this.fcUnAssignAsset['isActive']?.setValue(false);
        this.adminService.UnassignEmployee(this.fbUnAssignEmployee.value).subscribe((resp) => {
            if (this.projectDetailsDialog) {
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
        this.projectDetailsDialog = true;
        this.getProjectWithId(projectId);
    }

    getProjectWithId(id: number) {
        this.adminService.getProjectWithId(id).subscribe(resp => {
            this.projectDetails = resp[0] as unknown as ProjectViewDto;
            this.projectDetails.expandEmployees = JSON.parse(this.projectDetails.teamMembers);
        });
    }

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
        this.projectDetailsDialog = true;
        this.projectDetails = projectDetails;
    }

    hierarchialDialog(node) {
        this.projects.filter(element => {
            if (element.name == node.data.name)
                this.showProjectDetailsDialog(element);
        })
    }
    shouldDisableRadioButton(item: any): boolean {

        const initialNotDefined = this.projectDetails['initial'] === undefined;
        const workingNotNull = this.projectDetails['working'] !== null;
        const completedNotNull = this.projectDetails['completed'] !== null;

        // If 'Initial' is not defined, enable 'Initial' and disable other options
        if (initialNotDefined)
            return item.name !== 'Initial';


        // If the radio button has a value in projectDetails, disable it
        if (this.projectDetails[item.name.toLowerCase()] !== null && this.projectDetails[item.name.toLowerCase()] !== undefined)
            return true;


        // If the radio button is in 'Completed' state, enable 'AMC'
        if (item.name === 'AMC' && completedNotNull)
            return false;


        // If the radio button is in 'Completed' state and the option is 'Suspended', disable it
        if (item.name === 'Suspended' && completedNotNull)
            return true;


        // If 'Initial' is defined and the radio button is 'Completed' disable if 'Working' is not defined
        if (this.projectDetails['initial'] !== null && item.name === 'Completed' && !workingNotNull)
            return true;


        // If 'Working' is defined, 'Completed' is not defined, and the radio button is 'AMC' or 'Initial', disable
        if (workingNotNull && !completedNotNull && (item.name === 'AMC' || item.name === 'Initial'))
            return true;

        // If none of the above conditions are met, enable the radio button
        return false;
    }

    onRadioButtonChange(item: any) {
        if (this.projectDetails[item.name.toLowerCase()] === null || this.projectDetails[item.name.toLowerCase()] === undefined)
            this.fcProjectStatus.get('Date').setValue('');
    }

    getProjectStatusBasedOnId(id?: number): any {
        if (id !== undefined && id >= 1 && this.projectStatues != undefined) {
            const status = this.projectStatues.find(each => each.eProjectStatusesId === id);
            return status ? status.name : "";
        }
    }

    getFormattedDate(date: Date) {
        return this.datePipe.transform(date, 'MM/dd/yyyy')
    }
    onEditProject(project: ProjectViewDto) {


        this.projectForm();
        this.projectDetails = '';
        this.editProject = true;
        this.fileUpload.nativeElement.value = '';
        if (project != null) {
            this.projectDetails = project;
            const status = this.projectStatues.find(each => each.eProjectStatusesId === this.projectDetails.activeStatusId);
            this.minDate1 = new Date(this.projectDetails[status.name.toLowerCase()]);
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
        this.projectDetails = project
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
        const date = this.projectStatues.filter(each => each.eProjectStatusesId === project.activeStatusId)
        this.fbproject.get('initialStatus').patchValue({
            eProjectStatusesId: project.activeStatusId,
            Date: FORMAT_DATE(new Date(project[date[0]?.name.toLowerCase()])),
        });
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

        this.organizationData();
    }

    addEmployees(projectDetails: ProjectViewDto) {
        this.editProject = true;
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
        this.fbproject.get('startDate').setValue(FORMAT_DATE(new Date(this.fbproject.get('startDate').value)));
        // this.fcProjectStatus.get('Date').setValue(FORMAT_DATE(new Date(this.fcProjectStatus.get('Date').value)));
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
        const existingProjectCodes = this.projects.filter(project =>
            project.code === this.fbproject.get('code').value &&
            project.projectId !== this.fbproject.get('projectId').value
        )
        return existingProjectCodes.length > 0;
    }

    isUniqueProjectName() {
        const existingProjectNames = this.projects.filter(project =>
            project.name === this.fbproject.get('name').value &&
            project.projectId !== this.fbproject.get('projectId').value
        )
        return existingProjectNames.length > 0;
    }

    onSubmit() {
        this.fbproject.get('projectStatuses').setValue([this.fbproject.get('initialStatus').value]);
        if (this.fbproject.valid) {
            if (this.addFlag) {
                if (this.isUniqueProjectCode()) {
                    this.alertMessage.displayErrorMessage(
                        `Project Code :"${this.fbproject.value.code}" Already Exists.`
                    );
                } else if (this.isUniqueProjectName()) {
                    this.alertMessage.displayErrorMessage(
                        `Project Name :"${this.fbproject.value.name}" Already Exists.`
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
                    this.addEmployeeDialog = false;
                    this.editProject = false;
                    this.initProjects();
                    this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "PAS001" : "PAS002"]);
                    if (this.projectDetailsDialog)
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
    get fcProjectStatus() {
        return this.fbproject.get('initialStatus') as FormGroup;
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
            this.Roles = this.Employees.map(fn => fn.eRoleName).filter((role,i,roles) => roles.indexOf(role) === i);
        });
    }

    getRoleEmployees(roleName: string): EmployeesList[] {
        return this.Employees.filter(value => value.eRoleName === roleName)
    }
    filterClients(event: AutoCompleteCompleteEvent) {
        this.filteredClients = this.clientsNames;
        let filtered: any[] = [];
        let query = event.query;
        for (let i = 0; i < (this.clientsNames as any[]).length; i++) {
            let client = (this.clientsNames as any[])[i];
            if (client.companyName.toLowerCase().indexOf(query.toLowerCase()) == 0)
                filtered.push(client);
        }
        this.filteredClients = filtered;
    }
    dragNode: EmployeesList
    onEmployeeDragEnd(){

    }
    onEmployeeDragStart(empoloyee){
        this.dragNode = Object.assign({}, empoloyee)
    }

    onEmployeeDrop(parentNode){
        console.log(parentNode);
        console.log(this.dragNode);
    }


    organizationData() {
        let nodes: NodeProps[] = [];
        let chartParams: ChartParams = {};
        this.employeeService.getCompanyHierarchy().subscribe((resp) => {
            let data = resp as unknown as CompanyHierarchyViewDto[];
            data.forEach(org => {
                let item: NodeProps = new NodeProps()
                item.id = `0-${org.chartId}`
                if (org.selfId)
                    item.parentId = `0-${org.selfId}`
                else item.parentId = null
                item.name = org.roleName;
                item.roleName = org.roleName;
                item.imageUrl = "assets/layout/images/default_icon_employee.jpg"
                item.office = `Office-${org.hierarchyLevel}`
                item.isLoggedUser = false;
                item.area = org.roleName;
                item.profileUrl = "assets/layout/images/default_icon_employee.jpg"
                item._upToTheRootHighlighted = true;
                const val = Math.round(org.roleName.length / 2);
                item.progress = [...new Array(val)].map((d) => Math.random() * 25 + 5);

                item._directSubordinates = data.filter(d => d.selfId == org.chartId).length
                item._totalSubordinates = data.filter(d => d.hierarchyLevel > org.hierarchyLevel).length


                nodes.push(item)
            });
            chartParams.nodes = nodes;
            this.chartDataNotification.sendNodes(chartParams);
            //this.updateChart(this.chart,this.data);
        });
    }


    employeeProjectData(projectId: number) {
        let nodes: NodeProps[] = []
        let chartParams: ChartParams = {};
        this.adminService.GetEmployeeHierarchy(projectId).subscribe((resp) => {
            let data = resp as unknown as EmployeeHierarchyDto[];
            data.forEach(empchart => {
                // let item: NodeProps = new NodeProps()

                // item.id = `1-${empchart.chartId}-${empchart.employeeId}`; // Use a unique prefix like "1-" for this project
                // if (empchart.selfId && empchart.reportingToId)
                //     item.parentId = `1-${empchart.selfId}-${empchart.reportingToId}`; // Make sure the parent ID is unique too
                // else item.parentId = null

                // item.name = empchart.employeeName;
                // item.roleName = empchart.employeeName;
                // item.designation = empchart.designation;
                // item.imageUrl = "assets/layout/images/default_icon_employee.jpg"
                // if (empchart.photo) item.imageUrl = empchart.photo
                // else item.imageUrl = 'data:image/jpeg;base64,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';
                // item.office = `Office-${empchart.hierarchyLevel}`
                // item.isLoggedUser = false;
                // item.area = empchart.employeeName;
                // item.profileUrl = "assets/layout/images/default_icon_employee.jpg";
                // item.projectDescription = empchart.projectDescription
                // item.projectName = empchart.projectName
                // item.clientName = empchart.clientName
                // item.clientCompanyName = empchart.clientCompanyName
                // item.noOfWorkingDays = empchart.noOfWorkingDays
                // item.noOfAbsents = empchart.noOfAbsents
                // item.noOfLeaves = empchart.noOfLeaves
                // item.assetCount = empchart.assetCount

                // // item.positionName = `Position-${empchart.roleId}`
                // // item.positionName = `Size-${empchart.selfId}`
                // item._upToTheRootHighlighted = true;

                // const val = Math.round(empchart.roleName.length / 2);
                // item.progress = [...new Array(val)].map((d) => Math.random() * 25 + 5);

                // item._directSubordinates = data.filter(d => d.selfId == empchart.chartId).length;
                // item._totalSubordinates = data.filter(d => d.hierarchyLevel > empchart.hierarchyLevel).length;

                nodes.push(this.cloneEmployeeHierarchyNodeProps(empchart,data));
            });
            chartParams.nodes = nodes;
            this.chartDataNotification.sendNodes(chartParams);
            console.log(nodes);
            //this.updateChart(this.chart,this.chart);
        });
    }

    allottEmployeesToProject(){
        let nodes: NodeProps[] = [];
        //let chartParams: ChartParams = {};
        this.employeeService.getCompanyHierarchy().subscribe((resp) => {
            let data = resp as unknown as CompanyHierarchyViewDto[];
            nodes.push(this.cloneFromCompanyHierarchyNodeProps(data[0],data));
            this.initAllotEmpCharts(nodes)
            //chartParams.nodes = nodes;
            //this.chartDataNotification.sendNodes(chartParams);
        });
    }

    cloneFromCompanyHierarchyNodeProps(org: CompanyHierarchyViewDto,data: CompanyHierarchyViewDto[]): NodeProps{
        let item: NodeProps = new NodeProps()
        item.id = `0-${org.chartId}`
        if (org.selfId)
            item.parentId = `0-${org.selfId}`
        else item.parentId = null
        item.name = org.roleName;
        item.roleName = org.roleName;
        item.imageUrl = "assets/layout/images/default_icon_employee.jpg"
        item.office = `Office-${org.hierarchyLevel}`
        item.isLoggedUser = false;
        item.area = org.roleName;
        item.profileUrl = "assets/layout/images/default_icon_employee.jpg"
        item._upToTheRootHighlighted = true;
        const val = Math.round(org.roleName.length / 2);
        item.progress = [...new Array(val)].map((d) => Math.random() * 25 + 5);

        item._directSubordinates = data.filter(d => d.selfId == org.chartId).length
        item._totalSubordinates = data.filter(d => d.hierarchyLevel > org.hierarchyLevel).length;
        return item;
    }

    cloneEmployeeHierarchyNodeProps(emp: EmployeeHierarchyDto,data: EmployeeHierarchyDto[]): NodeProps{
        let item: NodeProps = new NodeProps()

        item.id = `1-${emp.chartId}-${emp.employeeId}`; // Use a unique prefix like "1-" for this project
        if (emp.selfId && emp.reportingToId)
            item.parentId = `1-${emp.selfId}-${emp.reportingToId}`; // Make sure the parent ID is unique too
        else item.parentId = null

        item.name = emp.employeeName;
        item.roleName = emp.employeeName;
        item.designation = emp.designation;
        item.imageUrl = "assets/layout/images/default_icon_employee.jpg"
        if (emp.photo) item.imageUrl = emp.photo
        else item.imageUrl = 'data:image/jpeg;base64,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';
        item.office = `Office-${emp.hierarchyLevel}`
        item.isLoggedUser = false;
        item.area = emp.employeeName;
        item.profileUrl = "assets/layout/images/default_icon_employee.jpg";
        item.projectDescription = emp.projectDescription
        item.projectName = emp.projectName
        item.clientName = emp.clientName
        item.clientCompanyName = emp.clientCompanyName
        item.noOfWorkingDays = emp.noOfWorkingDays
        item.noOfAbsents = emp.noOfAbsents
        item.noOfLeaves = emp.noOfLeaves
        item.assetCount = emp.assetCount

        // item.positionName = `Position-${empchart.roleId}`
        // item.positionName = `Size-${empchart.selfId}`
        item._upToTheRootHighlighted = true;

        const val = Math.round(emp.roleName.length / 2);
        item.progress = [...new Array(val)].map((d) => Math.random() * 25 + 5);

        item._directSubordinates = data.filter(d => d.selfId == emp.chartId).length;
        item._totalSubordinates = data.filter(d => d.hierarchyLevel > emp.hierarchyLevel).length;

        return item;
    }

    copyToNode(){}

    async initOrgCharts(){
        const { D3OrgChartComponent } = await import('./d3-org-chart/d3-org-chart.component');
        const orgComponentRef = this.orgProjectChartref.createComponent(D3OrgChartComponent);
        orgComponentRef.instance.DisplayType = "1";
    }

    async initAllotEmpCharts(nodes: NodeProps[]){

        const { D3OrgChartComponent } = await import('./d3-org-chart/d3-org-chart.component');
        const allottEmpRef = this.allottEmployeesref.createComponent(D3OrgChartComponent);
        allottEmpRef.instance.DisplayType = "2";
        allottEmpRef.instance.Data = nodes;
        this.cdr.detectChanges();
        allottEmpRef.instance.UpdateChart();
    }
}


