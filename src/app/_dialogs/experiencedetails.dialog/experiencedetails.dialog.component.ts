import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { LookupViewDto } from 'src/app/_models/admin';
import { MaxLength, ViewEmployeeScreen } from 'src/app/_models/common';
import { employeeExperienceDtlsViewDto, ExperienceDetailsDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MIN_LENGTH_2 } from 'src/app/_shared/regex';

@Component({
  selector: 'app-experiencedetails.dialog',
  templateUrl: './experiencedetails.dialog.component.html',
})
export class ExperiencedetailsDialogComponent {
  fbexperience!: FormGroup;
  fbfresher!: FormGroup
  faExperienceDetails!: FormArray;
  workExperience: employeeExperienceDtlsViewDto[];
  maxLength: MaxLength = new MaxLength();
  countries: LookupViewDto[] = [];
  selectedCountry: number[] = [];
  selectedCurriculumId: number[] = [];
  statesPerRow: LookupViewDto[][] = [];
  designation: LookupViewDto[] = [];
  skillarea: LookupViewDto[] = [];
  employeeId: any;
  maxDate: Date = new Date();
  constructor(
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private alertMessage: AlertmessageService,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private activatedRoute: ActivatedRoute,) {
    this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
  }

  ngOnInit(): void {
    this.initDesignation();
    this.initExperience();
    this.initCountries();
    this.initskillArea();
    if (this.config.data) this.showExperienceDetails(this.config.data);
    this.workExperience =this.config.data;
  }

  initExperience() {
    this.fbexperience = this.formbuilder.group({
      experienceDetails: this.formbuilder.array([])
    });
  }

  generateRow(experienceDetails: ExperienceDetailsDto = new ExperienceDetailsDto()): FormGroup {
    const skillAreaIdsArray = experienceDetails.skillAreaId ? experienceDetails.skillAreaId.split(',').map(Number) : [];
    const workExperienceXrefs = skillAreaIdsArray.length > 0 ?
      skillAreaIdsArray.map(skillAreaId => ({
        workExperienceXrefId: 0,
        workExperienceId: experienceDetails.workExperienceId,
        skillAreaId: skillAreaId
      })) : [];
    return this.formbuilder.group({
      employeeId: (this.employeeId),
      workExperienceId: new FormControl(experienceDetails.workExperienceId),
      isAfresher: new FormControl(false),
      companyName: new FormControl(experienceDetails.companyName, [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      companyLocation: new FormControl(experienceDetails.companyLocation, [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      companyEmployeeId: new FormControl(experienceDetails.companyEmployeeId, [Validators.minLength(MIN_LENGTH_2)]),
      countryId: new FormControl(experienceDetails.countryId),
      stateId: new FormControl(experienceDetails.stateId || null),
      designationId: new FormControl(experienceDetails.designationId, [Validators.required]),
      dateOfJoining: new FormControl(experienceDetails.dateOfJoining ? FORMAT_DATE(new Date(experienceDetails.dateOfJoining)) : null, [Validators.required]),
      dateOfReliving: new FormControl(experienceDetails.dateOfReliving ? FORMAT_DATE(new Date(experienceDetails.dateOfReliving)) : null),
      skillAreaIds: new FormControl(skillAreaIdsArray, [Validators.required]),
      workExperienceXrefs: new FormControl(workExperienceXrefs),
    });
  }

  addExperienceDetails() {
    this.faExperienceDetails = this.fbexperience.get('experienceDetails') as FormArray;
    this.faExperienceDetails.push(this.generateRow());
  }

  faExperienceDetail(): FormArray {
    return this.fbexperience.get('experienceDetails') as FormArray;
  }

  expDtlsformArrayControls(i: number, formControlName: string) {
    return this.faExperienceDetail().controls[i].get(formControlName);
  }

  initCountries() {
    this.lookupService.Countries().subscribe((resp) => {
      this.countries = resp as unknown as LookupViewDto[];
    })
  }

  onCountryChange(selectedCountryId: number, rowIndex: number) {
    this.selectedCountry[rowIndex] = selectedCountryId;
    this.lookupService.States(selectedCountryId).subscribe((resp) => {
      if (resp) {
        this.statesPerRow[rowIndex] = resp as unknown as LookupViewDto[];
      }
    });
  }

  initDesignation() {
    this.lookupService.Designations().subscribe((resp) => {
      this.designation = resp as unknown as LookupViewDto[];
    })
  }

  initskillArea() {
    this.lookupService.SkillAreas().subscribe((resp) => {
      this.skillarea = resp as unknown as LookupViewDto[];
    })
  }

  onSelectSkill(e, experienceDetailsIndex) {
    let CurrentArray = e.value;
    let updatedArray = [];
    const experienceDetailControl = this.fbexperience.get('experienceDetails') as FormArray;
    const workExperienceXrefsControl = experienceDetailControl.at(experienceDetailsIndex).get('workExperienceXrefs') as FormControl;

    if (workExperienceXrefsControl.value.length > 0) {
      let workExpId = workExperienceXrefsControl.value[0].workExperienceId;
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ workExperienceXrefId: 0, workExperienceId: workExpId, skillAreaId: CurrentArray[i] })
      }
    }
    else {
      for (let i = 0; i < CurrentArray.length; i++) {
        updatedArray.push({ workExperienceXrefId: 0, workExperienceId: 0, skillAreaId: CurrentArray[i] });
      }
    }
    workExperienceXrefsControl.patchValue(updatedArray);
  }

  showExperienceDetails(workExperience: employeeExperienceDtlsViewDto[]) {
    if (workExperience.length == 0) {
      this.faExperienceDetail().push(this.generateRow());
    } else {
      workExperience.forEach((experienceDetails: any, rowIndex) => {
        this.onCountryChange(experienceDetails.countryId, rowIndex);
        this.faExperienceDetail().push(this.generateRow(experienceDetails));
      })
    }
    this.fbexperience.patchValue(workExperience)
  }

  saveExperience(): Observable<HttpEvent<any>> {
    return this.employeeService.updateViewEmpExperienceDtls(this.fbexperience.get('experienceDetails').value);

  }

  saveEmpExperienceDetails() {
    for (const control of this.faExperienceDetail().controls) {
      control.get('dateOfJoining').setValue(FORMAT_DATE(control.get('dateOfJoining').value));
      if (control.get('dateOfReliving').value) {
        control.get('dateOfReliving').setValue(FORMAT_DATE(control.get('dateOfReliving').value));
      }
    }
    this.saveExperience().subscribe(resp => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["EVEEXP001"]);
        this.ref.close({
          "UpdatedModal": ViewEmployeeScreen.ExperienceDetails
        });
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["EVEEXP002"]);
      }
    });
  }

}



