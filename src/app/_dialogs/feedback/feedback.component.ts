import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
})
export class FeedbackComponent {
  EmployeeId: number;
  permissions: any;
  feedBack: boolean = false;

  fbFeedBackForm!: FormGroup;
  constructor(
    private jwtService: JwtService, private formbuilder: FormBuilder,) {
    this.EmployeeId = this.jwtService.EmployeeId;
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initFeedBack();
  }
  initFeedBack() {
    this.fbFeedBackForm = this.formbuilder.group({
      employeeId: [],
      rating: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.required]),
      updatedThrough: new FormControl('', [Validators.required]),
    });
  }
  get FormControls() { return this.fbFeedBackForm.controls; }
  feedBackDialog() {
    this.feedBack = true;
    this.fbFeedBackForm.reset();
    this.fbFeedBackForm.get('employeeId').setValue(this.jwtService.EmployeeId);
    this.fbFeedBackForm.get('updatedThrough').setValue("web");

  }
  save(){

  }

  getRating(): FormControl {
    return this.fbFeedBackForm.get('rating') as FormControl;
  }
}
