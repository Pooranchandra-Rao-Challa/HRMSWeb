import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-viewapplicant.dialog',
  templateUrl: './viewapplicant.dialog.component.html',
})
export class ViewapplicantDialogComponent {
  @Input() rowData: any;
  @Output() saveClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();
  fbeducationdetails!: FormGroup;
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
      console.log( this.rowData );
      
  }
  ngOnInit(): void {
    this.educationDetailsForm()
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
  
}
