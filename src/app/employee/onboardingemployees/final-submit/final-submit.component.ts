import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { EmployeeService } from 'src/app/_services/employee.service';
@Component({
  selector: 'app-final-submit',
  templateUrl: './final-submit.component.html',
})
export class FinalSubmitComponent {
  employeeId: string;
  fbEnroll!: FormGroup;
  dialog: boolean
  userData: any;

  constructor(private router: Router, private employeeService: EmployeeService,
    private formbuilder: FormBuilder, private alertMessage: AlertmessageService,
    private activatedRoute: ActivatedRoute,) {
    this.employeeId = this.activatedRoute.snapshot.params['employeeId'] || this.activatedRoute.snapshot.queryParams['employeeId'];
  }

  ngOnInit() {
    this.fbEnroll = this.formbuilder.group({
      employeeId: [this.employeeId]
    })
  }

  onSubmit() {
    this.employeeService.EnrollUser(this.fbEnroll.value).subscribe((resp) => {
      this.userData = resp;
      if (this.userData) {
        this.dialog = true;
        this.alertMessage.displayAlertMessage(ALERT_CODES["SEE001"]);
      } else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["SEE002"]);
      }
    });
  }

  closeDialogAndNavigate() {
    this.dialog = false; 
    this.router.navigate(['employee/all-employees']); 
  }

}
