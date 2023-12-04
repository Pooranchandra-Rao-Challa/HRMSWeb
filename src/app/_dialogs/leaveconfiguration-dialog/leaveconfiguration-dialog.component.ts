import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-leaveconfiguration-dialog',
  templateUrl: './leaveconfiguration-dialog.component.html',
  styles: [
  ]
})
export class LeaveconfigurationDialogComponent {
  fbLeaveConfiguration!: FormGroup

  constructor(
    private formbuilder: FormBuilder) { }

  ngOnInit() {
    this.leaveConfigForm()
  }

  leaveConfigForm() {
    this.fbLeaveConfiguration = this.formbuilder.group({
      minJOProcessTime: new FormControl('', Validators.required),
      maxTimesJOToBeProcessed: new FormControl('', Validators.required),
      casualLeaves: new FormControl('', Validators.required),
      sickLeaves: new FormControl('', Validators.required),
      earnedLeaves: new FormControl('', Validators.required),
      casualLeavesForTrainee: new FormControl('', Validators.required),
      sickLeavesForTrainee: new FormControl('', Validators.required)
    });
  }
}
