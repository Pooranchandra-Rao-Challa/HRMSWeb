import { Component, ElementRef, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { JobdesignDialogComponent } from 'src/app/_dialogs/jobdesign.dialog/jobdesign.dialog.component';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { JobDesignDetailsViewDto } from 'src/app/_models/admin';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { JwtService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-jobdesign',
  templateUrl: './jobdesign.component.html',
  styles: [
  ]
})
export class JobdesignComponent {
  globalFilterFields: string[] = ['designation', 'projectName', 'technicalSkills', 'softSkills', 'description', 'natureOfJobs', 'compensationPackage', 'toBeFilled', 'isActive'];
  @ViewChild('filter') filter!: ElementRef;
  ActionTypes = Actions;
  dialogRequest: DialogRequest = new DialogRequest();
  jobDesignDialogComponent = JobdesignDialogComponent;
  jobDesign: JobDesignDetailsViewDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  permissions: any;

  headers: ITableHeader[] = [
    { field: 'projectName', header: 'projectName', label: 'Project Name' },
    { field: 'designation', header: 'designation', label: 'Designation' },
    { field: 'technicalSkills', header: 'technicalSkills', label: 'Techincal Skills' },
    { field: 'softSkills', header: 'softSkills', label: 'Soft Skills' },
    { field: 'description', header: 'description', label: 'Description' },
    { field: 'natureOfJob', header: 'natureOfJob', label: 'Nature of Job' },
    { field: 'compensationPackage', header: 'compensationPackage', label: 'Compensation Package' },
    { field: 'toBeFilled', header: 'toBeFilled', label: 'To Be Filled' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(
    private globalFilterService: GlobalFilterService,
    private adminService: AdminService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,
    private jwtService: JwtService,
    ) { }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.getJobDetails();
  }


  getJobDetails() {
    this.adminService.GetJobDetails().subscribe((resp) => {
      this.jobDesign = resp as unknown as JobDesignDetailsViewDto[];
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
    if (action == Actions.save && content === this.jobDesignDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Job Design";
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
