import { Component } from '@angular/core';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LeaveConfirmationService } from 'src/app/_services/leaveconfirmation.service';

@Component({
  selector: 'app-leaveconfirmation',
  templateUrl: './leaveconfirmation.component.html',
})
export class LeaveconfirmationComponent {
  leaves: any[];
  mediumDate: string = MEDIUM_DATE;

  constructor(private leaveConfirmationService: LeaveConfirmationService,) { }

  ngOnInit(): void {
   
  }


  openSweetAlert(title:string) {
    this.leaveConfirmationService.openDialogWithInput(title).subscribe((result) => {
      if (result) {
        // Handle the leave reason here (e.g., send it to the server)
        console.log('Leave reason:', result);
      } 
    });
  }

}
