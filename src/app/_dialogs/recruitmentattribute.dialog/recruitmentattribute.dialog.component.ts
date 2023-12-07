import { getLocaleFirstDayOfWeek } from '@angular/common';
import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { RecruitmentAttributesDTO, RecruitmentStageDetailsDto } from 'src/app/demo/api/security';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { AdminService } from 'src/app/_services/admin.service';
import { LOGIN_URI } from 'src/app/_services/api.uri.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-recruitmentattribute.dialog',
  templateUrl: './recruitmentattribute.dialog.component.html',
  styles: [
  ]
})
export class RecruitmentattributeDialogComponent {

  fbrecurimentAttribute!: FormGroup;
  recruitmentAttributeId: number;
  attributeData: RecruitmentAttributesDTO;
  changeStages: boolean = false;
  stages: RecruitmentStageDetailsDto[];
  submitlabel:string="Add Attribute";

  constructor(
    private lookupService: LookupService, private adminService: AdminService, private config: DynamicDialogConfig,
    private formbuilder: FormBuilder, private alertMessage: AlertmessageService,  public ref: DynamicDialogRef,
  ) {
    console.log(this.config.data);
    
    this.attributeData = this.config.data;
    this.stages = this.attributeData.RecruitmentStageDetails;
  }

  ngOnInit() {
    this.recruitmentAttributeForm();
    if (this.attributeData.recruitmentAttributeId)
      this.editAttributeDetails(this.attributeData)
  }

  recruitmentAttributeForm() {
    this.fbrecurimentAttribute = this.formbuilder.group({
      recruitmentAttributeId: [null],
      assessmentTitle: new FormControl('', [Validators.required]),
      isActive: new FormControl('', [Validators.required]),
      recruitmentAttributeWithStageXrefs: new FormControl([]),
    });
  }

  editAttributeDetails(attributeData) {
    this.submitlabel="Update Attribute"
    const filteredArray = this.stages.filter(item => item.assigned);
    this.fbrecurimentAttribute.patchValue({
      recruitmentAttributeId: attributeData.recruitmentAttributeId,
      assessmentTitle: attributeData.assessmentTitle,
      isActive: attributeData.isActive,
      recruitmentAttributeWithStageXrefs: filteredArray
    });
  }

  get FormControls() {
    return this.fbrecurimentAttribute.controls;
  }

  restrictSpaces(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    // Prevent the first key from being a space
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0)
      event.preventDefault();
    // Restrict multiple spaces
    if (event.key === ' ' && target.selectionStart > 0 && target.value.charAt(target.selectionStart - 1) === ' ')
      event.preventDefault();
  }

  onSelectionChange(event: any) {
    this.changeStages = true;
   
     this.stages.forEach(stage => (stage.assigned = event.value.some(selectedStage => selectedStage.recruitmentStageId === stage.recruitmentStageId)));
     
      // this.stages.forEach(stage =>{ 
      //   console.log(stage.rAWSXrefId!==-1);
        
      //   if(stage.rAWSXrefId==-1&&event.value.some(selectedStage => selectedStage.recruitmentStageId === stage.recruitmentStageId)){
      //     stage.
      //   }
      // })
        
  }
  
  save() {
    this.adminService.CreateRecruitmentDetails(this.fbrecurimentAttribute.value).subscribe(resp => {
      if (resp) {
        this.ref.close(true);
        this.alertMessage.displayAlertMessage(ALERT_CODES["RAS001"]);
      } else
        this.alertMessage.displayErrorMessage(ALERT_CODES["RAS003"]);
    });
  }
  update() {
    this.adminService.UpdateRecruitmentDetails(this.fbrecurimentAttribute.value).subscribe(resp => {
      if (resp) {
        this.ref.close(true);
        this.alertMessage.displayAlertMessage(ALERT_CODES["RAS002"]);
      } else
        this.alertMessage.displayErrorMessage(ALERT_CODES["RAS004"]);
    });
  }
  onSubmit() {
    this.fbrecurimentAttribute.patchValue({
      recruitmentAttributeWithStageXrefs: this.changeStages ? this.stages : this.fbrecurimentAttribute.get('recruitmentAttributeWithStageXrefs').value
    })
    if (this.fbrecurimentAttribute.valid) {
      if (this.attributeData.recruitmentAttributeId === undefined)
        this.save();
      else
        this.update();
    }
    else
      this.fbrecurimentAttribute.markAllAsTouched();
  }



}
