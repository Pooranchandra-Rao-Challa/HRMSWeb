import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeeLeaveDetailsDto, EmployeeLeaveDetailsViewDto } from 'src/app/_models/employes';
import { LeaveConfirmationService } from 'src/app/_services/leaveconfirmation.service';

@Component({
  selector: 'app-leaveconfirmation',
  templateUrl: './leaveconfirmation.component.html',
})

export class LeaveconfirmationComponent {
  employeeleavedetails: EmployeeLeaveDetailsViewDto;
  mediumDate: string = MEDIUM_DATE;
  protectedData: string;
  protectedWith: string;
  showConfirmationMessage: boolean = false;

  constructor(private leaveConfirmationService: LeaveConfirmationService,
    private activatedRoute: ActivatedRoute,
    public alertMessage: AlertmessageService) {
    this.protectedData = this.activatedRoute.snapshot.queryParams['key'];
    this.protectedWith = this.activatedRoute.snapshot.queryParams['key2'];
  }

  ngOnInit(): void {
    this.inItEmployeeLeaveDetails();
  }

  inItEmployeeLeaveDetails() {
    this.leaveConfirmationService.getEmployeeLeaveDetails(this.protectedData, this.protectedWith).subscribe((resp) => {
      this.employeeleavedetails = resp as unknown as EmployeeLeaveDetailsViewDto;
    })
  }

  openConfirmationAlert(title: string) {
    const buttonLabel = title === 'Reason For Approve' ? 'Approve' : 'Reject';
    this.leaveConfirmationService.openDialogWithInput(title, buttonLabel).subscribe((result) => {
      if (result && result.description !== undefined) {
        const employeeLeaveDetails: EmployeeLeaveDetailsDto = {
          employeeId: this.employeeleavedetails.leaveDto.employeeId,
          leaveId: this.employeeleavedetails.leaveDto.leaveTypeId,
          action: this.employeeleavedetails.action,
          protectedData: this.protectedData,
          protectedWith: this.protectedWith,
          comments: result.description,
        };
        this.leaveConfirmationService.UpdateEmployeeLeaveDetails(employeeLeaveDetails).subscribe((resp) => {
          let rdata = resp as unknown as any;
          if (rdata.isSuccess) {
            this.showConfirmationMessage = true;
            const leaveType = this.employeeleavedetails?.leaveDto?.getLeaveType;
            const action = this.employeeleavedetails.action;
            if (action === 'Reject') {
              if (leaveType === 'PL') {
                this.alertMessage.displayErrorMessage(ALERT_CODES["ALC004_PL"]);
              } else if (leaveType === 'CL') {
                this.alertMessage.displayErrorMessage(ALERT_CODES["ALC005_CL"]);
              } else if (leaveType === 'WFH') {
                this.alertMessage.displayErrorMessage(ALERT_CODES["ALC006_WFH"]);
              }
            } else {
              if (leaveType === 'PL') {
                this.alertMessage.displayAlertMessage(ALERT_CODES["ALC001_PL"]);
              } else if (leaveType === 'CL') {
                this.alertMessage.displayAlertMessage(ALERT_CODES["ALC002_CL"]);
              } else if (leaveType === 'WFH') {
                this.alertMessage.displayAlertMessage(ALERT_CODES["ALC003_WFH"]);
              }
            }
          } else if (!rdata.isSuccess) {
            this.alertMessage.displayErrorMessage(rdata.message);
          }
        });
      }
    });
  }

  getConfirmationMessage(leaveType: string): string {
    switch (leaveType) {
      case 'CL':
        return 'CL is Updated Successfully';
      case 'PL':
        return 'PL is Updated Successfully';
      case 'WFH':
        return 'WFH is Updated Successfully';
      default:
        return 'Confirmation Updated Successfully';
    }
  }
}


