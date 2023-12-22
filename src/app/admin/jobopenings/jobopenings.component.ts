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
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


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
  fbdoProcess: FormGroup;
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
  selectedAttributes: any[] = [];

  constructor(
    private adminService: AdminService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,
    private jwtService: JwtService,
    private router: Router,
    private formbuilder: FormBuilder,
    private RecruitmentService: RecruitmentService
  ) { }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.getJobDetails();
    this.initProcessedJobOpening();
    this.getAttributes()
    this.doProcessForm();
  }

  doProcessForm() {
    this.fbdoProcess = this.formbuilder.group({
      jobOpeninginProcessId: new FormControl(null),
      jobOpeningId: new FormControl(''),
      maxExpertise: new FormControl('', [Validators.required,this.notEqualToZeroValidator.bind(this)]),
      minExpertise: new FormControl('', [Validators.required,this.notEqualToZeroValidator.bind(this)]),
      jobOpeningRas: new FormControl('', [Validators.required]),
    });

  }

  get FormControls() {
    return this.fbdoProcess.controls;
  }

  getMinExpertiseControl(): FormControl {
    return this.fbdoProcess.get('minExpertise') as FormControl;
     
  }

  getMaxExpertiseControl(): FormControl {
    return this.fbdoProcess.get('maxExpertise') as FormControl;
  }

  getJobDetails() {
    this.adminService.GetJobDetails().subscribe((resp) => {
      this.jobOpening = resp as unknown as JobOpeningsDetailsViewDto[];
    })
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  clearcard(dv: DataView) {
    dv.filteredValue = null;
    this.filter.nativeElement.value = '';
  }
  openJobDialog(job: JobOpeningsDetailsViewDto) {
    this.selectedJob = job;
    this.viewJobDesign = true;
  }
  showAttributeDialog(jobOpeningDetails) {
    this.attributeDialog = true;
    this.jobOpeningDetails = (jobOpeningDetails);
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

  onChange(event, item) {
    const { checked } = event;
    if (checked)
      this.selectedAttributes.push({
        jobOpeningRaId: 0,
        jobOpeningInProcessId: 0,
        recruitmentAttributeId: item
      });
    else
      this.selectedAttributes = this.selectedAttributes.filter(attr => attr.recruitmentAttributeId !== item);
    this.fbdoProcess.get('jobOpeningRas')?.setValue(this.selectedAttributes);
  }

  processJobOpening() {
    this.fbdoProcess.patchValue({
      jobOpeningId: this.jobOpeningDetails.id,
    });
    if (this.fbdoProcess.valid)
      this.RecruitmentService.jobDoProcess(this.fbdoProcess.value).subscribe(resp => {

        if (resp) {
          this.router.navigate(['admin/recruitmentprocess', resp[0]?.jobOpeningInProcessId]);
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
  notEqualToZeroValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;

    // Check if the value is not equal to 0
    if (value !== null && value !== undefined && value === 0) {
      return { notEqualToZero: true };
    }

    return null; // Validation passed
  }
}
