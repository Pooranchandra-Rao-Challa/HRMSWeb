import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { MaxLength } from 'src/app/_models/common';
import { LeaveConfigurationDto } from 'src/app/_models/security';
import { SecurityService } from 'src/app/_services/security.service';

@Component({
  selector: 'app-leaveconfiguration-dialog',
  templateUrl: './leaveconfiguration-dialog.component.html',
  styles: [
  ]
})
export class LeaveconfigurationDialogComponent {
  fbLeaveConfiguration!: FormGroup
  faleaveDetails!: FormArray;
  maxLength: MaxLength = new MaxLength();
  submitlabel: string;
  addLeaveLabel: string;
  addFlag: any = false
  leaveConfiguration: LeaveConfigurationDto[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private securityService: SecurityService,
    public ref: DynamicDialogRef,
    public alertMessage: AlertmessageService
  ) { }

  ngOnInit() {
    this.leaveConfigForm()
    this.getLeaveConfiguration()
  }

  getLeaveConfiguration() {
    this.securityService.GetLeaveConfiguration().subscribe((data) => {
      this.leaveConfiguration = data as unknown as LeaveConfigurationDto[];
    })
  }

  leaveConfigForm() {
    this.addFlag = true
    this.submitlabel = 'Add Leave'
    this.addLeaveLabel = 'Add Leave Details'
    this.fbLeaveConfiguration = this.formbuilder.group({
      leaveConfigurationId: [null],
      maxExpInMonths: new FormControl('', Validators.required),
      cl: new FormControl('', Validators.required),
      pl: new FormControl('', Validators.required),
      sl: new FormControl(null),
      accumulationPeriod: new FormControl(null),
    });
  }

  get FormControls() {
    return this.fbLeaveConfiguration.controls;
  }

  generaterow(leaveConfigurationDetails: LeaveConfigurationDto = new LeaveConfigurationDto()): FormGroup {
    return this.formbuilder.group({
      leaveConfigurationId: leaveConfigurationDetails.leaveConfigurationId,
      maxExpInMonths: leaveConfigurationDetails.maxExpInMonths,
      cl: leaveConfigurationDetails.cl,
      pl: leaveConfigurationDetails.pl,
      sl: leaveConfigurationDetails.sl,
      accumulationPeriod: leaveConfigurationDetails.accumulationPeriod
    });
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

  removeRow(index: number): void {
    if (index >= 0 && index < this.leaveConfiguration.length) {
      this.leaveConfiguration.splice(index, 1); // Remove 1 item at the specified index
    }
  }

  addLeaveDetails() {
    let leaveId = this.fbLeaveConfiguration.get('leaveConfigurationId').value
    if (leaveId == null) {
      this.leaveConfiguration.push(this.fbLeaveConfiguration.value)
    }
    this.fbLeaveConfiguration.reset();
  }

  editLeaveDetails(leaveConfigurationDetails) {
    this.addFlag = false;
    this.submitlabel = 'Update Leave'
    this.addLeaveLabel = 'Update Leave Details'
    this.fbLeaveConfiguration.patchValue({
      leaveConfigurationId: leaveConfigurationDetails.leaveConfigurationId,
      maxExpInMonths: leaveConfigurationDetails.maxExpInMonths,
      cl: leaveConfigurationDetails.cl,
      pl: leaveConfigurationDetails.pl,
      sl: leaveConfigurationDetails.sl,
      accumulationPeriod: leaveConfigurationDetails.accumulationPeriod,
    });
  }

  save(): Observable<HttpEvent<LeaveConfigurationDto[]>> {
    debugger
    if (this.addFlag) {
      return this.securityService.CreateLeaveConfiguration(this.leaveConfiguration)
    } else
      return this.securityService.CreateLeaveConfiguration([this.fbLeaveConfiguration.value])
  }

  onSubmit() {
    this.save().subscribe(resp => {
      if (resp) {
        this.ref.close(true);
        this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "LC001" : "LC002"]);
      }
    });
  }
}
