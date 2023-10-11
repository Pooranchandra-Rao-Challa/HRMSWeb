import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { Employee, EmployeesViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';

@Component({
  selector: 'app-final-submit',
  templateUrl: './final-submit.component.html',
})
export class FinalSubmitComponent {
  employeeId: string;
  fbEnroll!: FormGroup;
  employees: Employee[] = [];
  constructor(private router: Router, private employeeService: EmployeeService,
    private formbuilder: FormBuilder, private alertMessage: AlertmessageService,
    private activatedRoute: ActivatedRoute,
    private EmployeeService:EmployeeService) {
    this.employeeId = this.activatedRoute.snapshot.params['employeeId'] || this.activatedRoute.snapshot.queryParams['employeeId'];
  }

  ngOnInit() {
    this.fbEnroll = this.formbuilder.group({
      employeeId: [this.employeeId]
    })
    this.initEmployees();
  }
  initEmployees() {
    // Fetch only records where IsEnrolled is true
    const isEnrolled = false;
    this.EmployeeService.GetEmployees(isEnrolled).subscribe(resp => {
      this.employees = resp as unknown as EmployeesViewDto[];
    });
  }

  onSubmit() {
    this.employeeService.EnrollUser(this.fbEnroll.value).subscribe(res => {
      if (res) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SEE001"]);
        this.initEmployees()
        this.router.navigate(['employee/all-employees']);
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["SEE002"]);
      }
    });
  }

}
