import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeeLeaveDialogComponent } from 'src/app/_dialogs/employeeleave.dialog/employeeleave.dialog.component';
import { MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { Actions, DialogRequest } from 'src/app/_models/common';
import { SelfEmployeeDto } from 'src/app/_models/dashboard';
import { DashboardService } from 'src/app/_services/dashboard.service';
import { JwtService } from 'src/app/_services/jwt.service';

@Component({
    selector: 'app-employeedashboard',
    templateUrl: './employeedashboard.component.html',
})
export class EmployeeDashboardComponent {
    empDetails: SelfEmployeeDto;
    defaultPhoto: string;
    mediumDate: string = MEDIUM_DATE
    ActionTypes = Actions;
    employeeleaveDialogComponent = EmployeeLeaveDialogComponent;
    dialogRequest: DialogRequest = new DialogRequest();

    constructor(private dashBoardService: DashboardService,
        private jwtService: JwtService,
        private dialogService: DialogService,
        public ref: DynamicDialogRef,
    ) { }

    ngOnInit() {
        this.getEmployeeDataBasedOnId()

    }

    getEmployeeDataBasedOnId() {
        this.dashBoardService.GetEmployeeDetails(this.jwtService.EmployeeId).subscribe((resp) => {
            this.empDetails = resp as unknown as SelfEmployeeDto;
            this.empDetails.projects = JSON.parse(this.empDetails.workingProjects);
            /^male$/gi.test(this.empDetails.gender)
                ? this.defaultPhoto = './assets/layout/images/men-emp.jpg'
                : this.defaultPhoto = './assets/layout/images/women-emp.jpg'
        })
    }

    openComponentDialog(content: any,
        dialogData, action: Actions = this.ActionTypes.add) {
        if (action == Actions.save && content === this.employeeleaveDialogComponent) {
          this.dialogRequest.dialogData = dialogData;
          this.dialogRequest.header = "Leave";
          this.dialogRequest.width = "60%";
        }
        this.ref = this.dialogService.open(content, {
          data: this.dialogRequest.dialogData,
          header: this.dialogRequest.header,
          width: this.dialogRequest.width
        });
        this.ref.onClose.subscribe((res: any) => {
          if (res) this.getEmployeeDataBasedOnId();
          event.preventDefault(); // Prevent the default form submission
        });
      }
}
