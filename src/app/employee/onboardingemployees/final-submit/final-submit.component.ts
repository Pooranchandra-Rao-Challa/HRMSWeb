import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { EmployeeService } from 'src/app/_services/employee.service';

@Component({
  selector: 'app-final-submit',
  templateUrl: './final-submit.component.html',
  // styleUrls: ['./final-submit.component.scss']
})
export class FinalSubmitComponent {
  employeeId:any;
  fbEnroll!:FormGroup;
  constructor(private router: Router, private route: ActivatedRoute, private employeeService: EmployeeService,
    private formbuilder: FormBuilder,private alertMessage: AlertmessageService) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
    this.fbEnroll=this.formbuilder.group({
      employeeId:new FormControl(22)
    })
  }
  save(){
    return this.employeeService.EnrollUser(this.fbEnroll.value);
  }
  onSubmit(){
    this.save().subscribe(res => {
      if (res) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SEE001"]);
        this.router.navigate(['employee/all-employees']);
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["SEE002"]);
      }
    });
  }

}
