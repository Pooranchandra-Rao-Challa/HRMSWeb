import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { JobOpeningsDialogComponent } from 'src/app/_dialogs/jobopenings.dialog/jobopenings.dialog.component';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { JobOpeningsDetailsViewDto } from 'src/app/_models/admin';
import { Actions, DialogRequest } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';
import { DataView } from 'primeng/dataview';
import { RecruitmentService } from 'src/app/_services/recruitment.service';
import { JobOpeningsListDto } from 'src/app/_models/recruitment';
import { RecruitmentAttributesDTO } from 'src/app/demo/api/security';

@Component({
  selector: 'app-jobopenings',
  templateUrl: './jobopenings.component.html',
  styles: [
  ]
})
export class JobOpeningsComponent {
  @ViewChild('filter') filter!: ElementRef;
  @Input() isReadOnly: boolean = false
  JobOpeningsList: JobOpeningsListDto[] = [];
  ActionTypes = Actions;
  dialogRequest: DialogRequest = new DialogRequest();
  jobOpeningDialogComponent = JobOpeningsDialogComponent;
  jobOpening: JobOpeningsDetailsViewDto[] = [];
  jobOpeningDetails: JobOpeningsDetailsViewDto;
  mediumDate: string = MEDIUM_DATE;
  permissions: any;
  viewJobDesign: boolean = false;
  attributeDialog: boolean = false;
  processButtonDisabled = false;
  selectedJob: JobOpeningsDetailsViewDto;
  recruitmentAttributes: RecruitmentAttributesDTO[] = [];

  constructor(
    private adminService: AdminService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,
    private jwtService: JwtService,
    private router: Router,
    private RecruitmentService: RecruitmentService
  ) { }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.getJobDetails();
    this.initProcessedJobOpening();
    this.getAttributes()
  }


  getJobDetails() {
    this.adminService.GetJobDetails().subscribe((resp) => {
      this.jobOpening = resp as unknown as JobOpeningsDetailsViewDto[];
    })
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  openJobDialog(job: JobOpeningsDetailsViewDto) {
    this.selectedJob = job;
    this.viewJobDesign = true;
  }
  showAttributeDialog(jobOpeningDetails) {
    this.attributeDialog = true;
    this.jobOpeningDetails = jobOpeningDetails;
  }
  restrictSpaces(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    // Prevent the first key from being a space
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0)
      event.preventDefault();
    // Restrict multiple spaces
    if (event.key === ' ' && target.selectionStart > 0 && target.value.charAt(target.selectionStart - 1) === ' ')
      event.preventDefault();
  }
  processJobOpening(jobOpeningDetails) {
    this.RecruitmentService.getApplicantsForInitialRound(jobOpeningDetails.id).subscribe(resp => {
      if (resp) {
        this.router.navigate(['admin/recruitmentprocess', jobOpeningDetails.id]);
        this.processButtonDisabled = true;
      }
    })
  }
  initProcessedJobOpening() {
    this.RecruitmentService.getJobOpeningDropdown().subscribe(resp => {
      this.JobOpeningsList = resp as unknown as JobOpeningsListDto[];
    });
  }
  isButtonDisabled(jobId: number): boolean {
    if (!this.JobOpeningsList) {
      return false; // or handle this case accordingly
    }
    const foundJob = this.JobOpeningsList.find(job => job.jobId === jobId);
    return foundJob ? true : false;
  }
  getAttributes() {
    this.adminService.GetRecruitmentDetails(false).subscribe((resp) => {
      this.recruitmentAttributes = resp as unknown as RecruitmentAttributesDTO[];
      this.recruitmentAttributes.forEach(element => {
        element.RecruitmentStageDetails = JSON.parse(element.strRecruitmentStages);
      });
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
