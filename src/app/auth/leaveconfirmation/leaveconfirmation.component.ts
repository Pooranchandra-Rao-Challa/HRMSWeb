import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private leaveConfirmationService: LeaveConfirmationService,
    private activatedRoute: ActivatedRoute,) {
    this.protectedData = this.activatedRoute.snapshot.queryParams['protectedData'];
    this.protectedWith = this.activatedRoute.snapshot.queryParams['protectedWith'];
  }

  ngOnInit(): void {
    this.inItEmployeeLeaveDetails();
  }

  inItEmployeeLeaveDetails() {
    this.leaveConfirmationService.getEmployeeLeaveDetails(this.protectedData, this.protectedWith).subscribe((resp) => {
      this.employeeleavedetails = resp as unknown as EmployeeLeaveDetailsViewDto;
      console.log(this.employeeleavedetails);
    })
  }

  openSweetAlert(title: string) {
    const buttonLabel = title === 'Reason For Accept' ? 'Accept' : 'Reject';
    this.leaveConfirmationService.openDialogWithInput(title,buttonLabel).subscribe((result) => {
      if (result && result.description) {
        const employeeLeaveDetails: EmployeeLeaveDetailsDto = {
          employeeId: this.employeeleavedetails.employeeId,
          leaveId: this.employeeleavedetails.leaveId,
          protectedData: this.protectedData,
          protectedWith: this.protectedWith,
          note: result.description,
        };
        this.leaveConfirmationService.UpdateEmployeeLeaveDetails(employeeLeaveDetails).subscribe((resp) => {
          if (resp) {

          } else {

          }

        })
        console.log(result.description);

      }
    });
  }

}


