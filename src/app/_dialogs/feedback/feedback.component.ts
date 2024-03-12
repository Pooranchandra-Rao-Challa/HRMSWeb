import { formatDate } from '@angular/common';
import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AlertmessageService } from 'src/app/_alerts/alertmessage.service';
import { FeedbackDto } from 'src/app/_models/admin';
import { AdminService } from 'src/app/_services/admin.service';
import { JwtService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
})
export class FeedbackComponent {
  EmployeeId: number;
  permissions: any;
  // feedBack: boolean = false;
  fbFeedBackForm!: FormGroup;

  constructor(
    private jwtService: JwtService, 
    private formbuilder: FormBuilder,
    private adminService:AdminService,
    private alertMessage:AlertmessageService,
    public ref: DynamicDialogRef,
    ) {
    this.EmployeeId = this.jwtService.EmployeeId;
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initFeedBack();
  }

  initFeedBack() {
    this.fbFeedBackForm = this.formbuilder.group({
      feedbackId:[null],
      employeeId: new FormControl(''),
      rating: new FormControl('', [Validators.required]),
      comments: new FormControl('', [Validators.required]),
      updatedBy: new FormControl('web'),
      updatedAt: new FormControl(null)
    });
  }
  get FormControls() { return this.fbFeedBackForm.controls; }

  // feedBackDialog() {
  //   this.feedBack = true;
  //   this.fbFeedBackForm.reset();
  //   this.fbFeedBackForm.get('employeeId').setValue(this.jwtService.EmployeeId);
  //   this.fbFeedBackForm.get('updatedThrough').setValue("web");
  // }
  
  save(): Observable<HttpEvent<FeedbackDto[]>> {
    return this.adminService.UpdateFeedback(this.fbFeedBackForm.value);
  }

  onSubmit(){
    this.fbFeedBackForm.get('employeeId').setValue(this.jwtService.EmployeeId);
    this.save().subscribe((resp:any)=>{
      let result = resp as unknown as any;
      if (result.isSuccess == true) {
        this.alertMessage.displayAlertMessage(result.message);
      }
      else if(result.isSuccess == false){
        this.alertMessage.displayErrorMessage(result.message);
      }
      this.ref.close(true);
    });
  }

  getRating(): FormControl {
    return this.fbFeedBackForm.get('rating') as FormControl;
  }
}
