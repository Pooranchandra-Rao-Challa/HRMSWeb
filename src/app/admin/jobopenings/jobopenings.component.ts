import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { JobOpeningsDialogComponent } from 'src/app/_dialogs/jobopenings.dialog/jobopenings.dialog.component';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { JobOpeningsDetailsViewDto } from 'src/app/_models/admin';
import { Actions, DialogRequest } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-jobopenings',
  templateUrl: './jobopenings.component.html',
  styles: [
  ]
})
export class JobOpeningsComponent {
  @ViewChild('filter') filter!: ElementRef;
  @Input() isReadOnly: boolean = false

  ActionTypes = Actions;
  dialogRequest: DialogRequest = new DialogRequest();
  jobOpeningDialogComponent = JobOpeningsDialogComponent;
  jobOpening: JobOpeningsDetailsViewDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  permissions: any;
  viewJobDesign: boolean = false;
  selectedJob: JobOpeningsDetailsViewDto;

  constructor(
    private adminService: AdminService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,
    private jwtService: JwtService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.getJobDetails();
  }


  getJobDetails() {
    this.adminService.GetJobDetails().subscribe((resp) => {
      this.jobOpening = resp as unknown as JobOpeningsDetailsViewDto[];
    })
  }

  openJobDialog(job: JobOpeningsDetailsViewDto) {
    this.selectedJob = job;
    this.viewJobDesign = true;
  }
  processJobOpening(jobOpeningDetails) { 
    const jobDetails = { ...jobOpeningDetails, InitiatedAt: new Date(), jobOpeningId: jobOpeningDetails.id }
     
    this.adminService.processJobOpening(jobDetails).subscribe(resp => {
      if (resp) {
        this.router.navigate(['admin/recruitmentprocess']);
        // this.router.navigate(['employee/onboardingemployee/uploadfiles', this.employeeId])
      }
    })
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
