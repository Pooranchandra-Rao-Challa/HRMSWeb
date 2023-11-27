import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MaxLength } from 'src/app/_models/common';

@Component({
  selector: 'app-viewapplicant.dialog',
  templateUrl: './viewapplicant.dialog.component.html',
})
export class ViewapplicantDialogComponent {
  rowData: any;
  header:any
  @Output() saveClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();
  fbeducationdetails!: FormGroup;
  fbcertificatedetails!: FormGroup;
  fbexperience!: FormGroup;
  maxLength: MaxLength = new MaxLength();
  onSave() {
    this.saveClicked.emit(this.rowData);
    this.ref.close();
  }

  onCancel() {
    this.cancelClicked.emit();
    this.ref.close();
  }

  constructor(private formbuilder: FormBuilder,public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,) {
      this.rowData = this.config.data;
      this.header=this.config.header;
      // console.log( this.rowData,this.header );
  }

  ngOnInit(): void {
    this.educationDetailsForm();
    this.certificateDetailsForm();
    this.experienceForm();
  }

  educationDetailsForm(){
    this.fbeducationdetails = this.formbuilder.group({
      CurriculumId:new FormControl(''),
      StreamId:new FormControl(''),
      countryId:new FormControl(''),
      stateId:new FormControl(''),
      collegeName: new FormControl(''),
      institution:new FormControl(''),
      yearOfCompletion:new FormControl(''),
      gradingSystem:new FormControl(''),
      percentageSystem:new FormControl(''),
    })
  }
  
  experienceForm(){
    this.fbexperience = this.formbuilder.group({
      ApplicantId: [],
      companyName: new FormControl(''),
      companyLocation: new FormControl(''),
      countryId: new FormControl(null),
      stateId: new FormControl(null),
      natureOfWork: new FormControl(null),
      workedOnProjects: new FormControl(null),
      companyEmployeeId: new FormControl(null),
      designationId: new FormControl(null),
      dateOfJoining: new FormControl(null),
      dateOfReliving: new FormControl(null),
    });
  }

  certificateDetailsForm(){
    this.fbcertificatedetails = this.formbuilder.group({
      CertificationName:new FormControl(''),
      franchiseName:new FormControl(''),
      yearOfCompletion:new FormControl(''),
      result:new FormControl(''),
    })
  }
 

  get FormControls() {
    return this.fbexperience.controls;
  }

  restrictSpaces(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    // Prevent the first key from being a space
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0)
        event.preventDefault();
    // Restrict multiple spaces
    if (event.key === ' ' && target.selectionStart > 0 && target.value.charAt(target.selectionStart - 1) === ' ') {
        event.preventDefault();
    }
}
}
