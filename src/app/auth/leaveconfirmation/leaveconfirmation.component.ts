import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeeLeaveDetailsViewDto } from 'src/app/_models/employes';
import { LeaveConfirmationService } from 'src/app/_services/leaveconfirmation.service';


@Component({
  selector: 'app-leaveconfirmation',
  templateUrl: './leaveconfirmation.component.html',
})
export class LeaveconfirmationComponent {
  employeeleavedetails: EmployeeLeaveDetailsViewDto;
  mediumDate: string = MEDIUM_DATE;
  encrypteddata: string;
  random8digitKey: string;
  constructor(private leaveConfirmationService: LeaveConfirmationService,
    private activatedRoute: ActivatedRoute,) {
    this.encrypteddata = this.activatedRoute.snapshot.queryParams['encrypteddata'];
  }

  ngOnInit(): void {

    this.inItEmployeeLeaveDetails();
  }

  inItEmployeeLeaveDetails() {
    this.leaveConfirmationService.getEmployeeLeaveDetails(this.encrypteddata).subscribe((resp) => {
      this.employeeleavedetails = resp as unknown as EmployeeLeaveDetailsViewDto;
      console.log(this.employeeleavedetails);
    })
  }

  openSweetAlert(title: string) {
    this.leaveConfirmationService.openDialogWithInput(title).subscribe((result) => {
      if (result) {
        // Handle the leave reason here (e.g., send it to the server)
        console.log('Leave reason:', result);
      }
    });
  }

}


