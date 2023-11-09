import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { JobOpeningsDialogComponent } from 'src/app/_dialogs/jobopenings.dialog/jobopenings.dialog.component';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { JobOpeningsDetailsViewDto } from 'src/app/_models/admin';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { JwtService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-jobopenings',
  templateUrl: './jobopenings.component.html',
  styles: [
  ]
})
export class JobOpeningsComponent {
  globalFilterFields: string[] = ['designation', 'projectName', 'technicalSkills', 'softSkills', 'description', 'natureOfJobs', 'compensationPackage', 'toBeFilled', 'isActive'];
  @ViewChild('filter') filter!: ElementRef;
  ActionTypes = Actions;
  dialogRequest: DialogRequest = new DialogRequest();
  jobOpeningDialogComponent = JobOpeningsDialogComponent;
  jobOpening: JobOpeningsDetailsViewDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  permissions: any;
  selectedColumnHeader!: ITableHeader[];
  _selectedColumns!: ITableHeader[];


  headers: ITableHeader[] = [
    { field: 'projectName', header: 'projectName', label: 'Project Name' },
    { field: 'designation', header: 'designation', label: 'Designation' },
    { field: 'technicalSkills', header: 'technicalSkills', label: 'Techincal Skills' },
    { field: 'softSkills', header: 'softSkills', label: 'Soft Skills' },
    { field: 'description', header: 'description', label: 'Description' },
    { field: 'natureOfJob', header: 'natureOfJob', label: 'Nature of Job' },
    { field: 'compensationPackage', header: 'compensationPackage', label: 'Compensation Package' },
    { field: 'toBeFilled', header: 'toBeFilled', label: 'To Be Filled' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' }
  ];

  constructor(
    private globalFilterService: GlobalFilterService,
    private adminService: AdminService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,
    private jwtService: JwtService,
  ) { }


  // getter and setter for selecting particular columns to display
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.selectedColumnHeader.filter((col) => val.includes(col));
  }


  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.getJobDetails();

    //Column Header for selecting particular columns to display
    this._selectedColumns = this.selectedColumnHeader;
    this.selectedColumnHeader = [
      { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
      { field: 'createdBy', header: 'createdBy', label: 'Created By' },
      { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
      { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
    ];
  }


  getJobDetails() {
    this.adminService.GetJobDetails().subscribe((resp) => {
      this.jobOpening = resp as unknown as JobOpeningsDetailsViewDto[];
    })
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onGlobalFilter(table: Table, event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.globalFilterService.filterTableByDate(table, searchTerm);
  }


  openComponentDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.add) {
    if (action == Actions.save && content === this.jobOpeningDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Job Openings";
      this.dialogRequest.width = "60%";
    }
    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });
    this.ref.onClose.subscribe((res: any) => {
      if (res) this.getJobDetails();
      event.preventDefault(); // Prevent the default form submission
    });
  }

}
