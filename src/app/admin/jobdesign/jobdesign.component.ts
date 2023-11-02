import { Component, ElementRef, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { JobdesignDialogComponent } from 'src/app/_dialogs/jobdesign.dialog/jobdesign.dialog.component';
import { Actions, DialogRequest, ITableHeader } from 'src/app/_models/common';
import { GlobalFilterService } from 'src/app/_services/global.filter.service';
import { JobDesign } from 'src/app/demo/api/security';
import { SecurityService } from 'src/app/demo/service/security.service';

@Component({
  selector: 'app-jobdesign',
  templateUrl: './jobdesign.component.html',
  styles: [
  ]
})
export class JobdesignComponent {
  globalFilterFields: string[] = ['jobDescription', 'projeectName', 'position', 'technicalSkills', 'softSkills', 'description', 'natureOfJobs','compensationPackage'];
  @ViewChild('filter') filter!: ElementRef;
  ActionTypes = Actions;
  dialogRequest: DialogRequest = new DialogRequest();
  jobDesignDialogComponent = JobdesignDialogComponent;

  headers: ITableHeader[] = [
    { field: 'jobDescription', header: 'jobDescription', label: 'Job Description' },
    { field: 'projectName', header: 'projectName', label: 'Project Name' },
    { field: 'position', header: 'position', label: 'Position' },
    { field: 'technicalSkills', header: 'technicalSkills', label: 'Techincal Skills' },
    { field: 'softSkills', header: 'softSkills', label: 'Soft Skills' },
    { field: 'description', header: 'description', label: 'Description' },
    { field: 'natureOfJobs', header: 'natureOfJobs', label: 'Nature of Jobs' },
    { field: 'compensationPackage', header: 'compensationPackage', label: 'Compensation Package' }
  ];
  jobDesign: JobDesign[] = [];
  constructor(
    private globalFilterService: GlobalFilterService,
    private securityService: SecurityService,
    public ref: DynamicDialogRef,
    private dialogService:DialogService   ) { }
  ngOnInit() {
    this.getJobDesignDetails();
  }

  getJobDesignDetails(){
    this.securityService.getjobDesigns().then((resp) => {
      this.jobDesign = resp as unknown as JobDesign[];
      console.log(this.jobDesign);

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
      if (res) this.getJobDesignDetails();
      event.preventDefault(); // Prevent the default form submission
    });
  }

}
