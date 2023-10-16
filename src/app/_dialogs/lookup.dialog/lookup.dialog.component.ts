import { HttpEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { LookupDetailsDto, LookupViewDto } from 'src/app/_models/admin';
import { MaxLength } from 'src/app/_models/common';
import { AdminService } from 'src/app/_services/admin.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { FormArrayValidationForDuplication } from 'src/app/_validators/unique-branch-validators';

@Component({
  selector: 'app-lookup.dialog',
  templateUrl: './lookup.dialog.component.html'
})
export class LookupDialogComponent {
  fblookup!: FormGroup;
  addfields: any;
  dependentDropdown: boolean = false;
  dependentLookupData: LookupViewDto[] = [];
  ShowlookupDetails: boolean = false;
  falookUpDetails!: FormArray;
  addFlag: boolean = true;
  lookups: LookupViewDto[] = [];
  isLookupChecked: boolean = false;
  maxLength: MaxLength = new MaxLength();
  lookupNames: string[] = [];
  lookupNamesNotConfigured: string[] = [];
  DependentDropdown = false;

  constructor(private formbuilder: FormBuilder,
    private adminService: AdminService,
    private alertMessage: AlertmessageService,
    private lookupService: LookupService,
    private config: DynamicDialogConfig,
    public ref: DynamicDialogRef) { }

  ngOnInit(): void {
    this.initDependentLookups();
    this.initNotConfiguredLookups();
    this.lookupForm();
    if (this.config.data) this.editLookUp(this.config.data);
    else this.addLookupDetails();
  }

  initDependentLookups() {
    this.lookupService.LookupNames().subscribe((resp) => {
      this.lookupNames = resp as unknown as string[];
      console.log(resp);
    });
  }

  initNotConfiguredLookups() {
    this.lookupService.LookupNamesNotConfigured().subscribe((resp) => {
      this.lookupNamesNotConfigured = resp as unknown as string[];
    })
  }

  initAssetsType() {
    this.lookupService.AssetTypes().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }
  initAssetsCategories() {
    debugger
    this.lookupService.AssetCategories().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
      console.log(resp);
    })
  }
  initAssetStatus() {
    this.lookupService.AssetStatus().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }
  initRelationships() {
    this.lookupService.Relationships().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }
  initGradingMethods() {
    this.lookupService.GradingMethods().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }
  initDesignations() {
    this.lookupService.Designations().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }
  initSkillAreas() {
    this.lookupService.SkillAreas().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }
  initBloodGroups() {
    this.lookupService.BloodGroups().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }
  initCountries() {
    this.lookupService.Countries().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }
  initCurriculums() {
    this.lookupService.Curriculums().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }

  lookupForm() {
    this.addfields = [];
    this.fblookup = this.formbuilder.group({
      lookupId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      fkeySelfId: [null],
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: new FormControl(true, [Validators.required]),
      lookUpDetails: this.formbuilder.array([], FormArrayValidationForDuplication())
    });
  }

  get FormControls() {
    return this.fblookup.controls;
  }

  falookupDetails(): FormArray {
    return this.fblookup.get("lookUpDetails") as FormArray
  }

  formArrayControls(i: number, formControlName: string) {
    return this.falookupDetails().controls[i].get(formControlName);
  }

  generaterow(lookupDetail: LookupDetailsDto = new LookupDetailsDto()): FormGroup {
    return this.formbuilder.group({
      lookupId: [lookupDetail.lookupId],
      lookupDetailId: [lookupDetail.lookupDetailId],
      fkeySelfId: [lookupDetail.lookupDetailId],
      code: new FormControl(lookupDetail.code, [Validators.required, Validators.minLength(2)]),
      name: new FormControl(lookupDetail.name, [Validators.required, Validators.minLength(2)]),
      description: new FormControl(lookupDetail.description),
      isActive: new FormControl(lookupDetail.isActive, [Validators.required])
    })
  }

  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }

  onLookupChange(event) {
    const selectedValue = event.value; // Get the selected value
    if (selectedValue) {
      this.getDependentLookupData(selectedValue);
      this.dependentDropdown = true;
    } else {
      this.dependentDropdown = false;
    }
  }

  getCountries() {
    this.lookupService.Countries().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }

  getCurriculums() {
    this.lookupService.Curriculums().subscribe((resp) => {
      this.dependentLookupData = resp as unknown as LookupViewDto[];
    })
  }

  getDependentLookupData(value) {
    if (value ==" Asset Types") {
      this.initAssetsType()
    } else if (value == "Asset Categories") {
      this.initAssetsCategories()
    } else if (value =="Status") {
      this.initAssetStatus()
    } else if (value == "Countries") {
      this.initCountries()
    } else if (value =="Relations" ) {
      this.initRelationships()
    } else if (value ==  "Blood Groups") {
      this.initBloodGroups()
    } else if (value == "Designations") {
      this.initDesignations()
    } else if (value == "Skill Areas" ) {
      this.initSkillAreas()
    } else if (value =="Curriculums") {
      this.initCurriculums()
    } else if (value == "Grading Methods") {
      this.initGradingMethods()
    }
  }

  // getDependentLookupData(value) {
  //   if (value == 5) this.getCountries();
  //   else if (value == 10) this.getCurriculums();
  // }

  addLookupDetails() {
    this.ShowlookupDetails = true;
    this.falookUpDetails = this.fblookup.get("lookUpDetails") as FormArray
    this.falookUpDetails.push(this.generaterow())
    this.setDefaultIsActiveForAllRows();
  }

  setDefaultIsActiveForAllRows() {
    this.falookUpDetails = this.fblookup.get("lookUpDetails") as FormArray;
    for (let i = 0; i < this.falookUpDetails.length; i++) {
      const subLookupGroup = this.falookUpDetails.at(i);
      const isActiveControl = subLookupGroup.get('isActive');
      if (isActiveControl.value !== false) {
        isActiveControl.setValue(true);
      }
    }
  }

  isUniqueLookupCode() {
    const existingLookupCodes = this.lookups.filter(lookup =>
      lookup.code === this.fblookup.value.code &&
      lookup.lookupId !== this.fblookup.value.lookupId
    )
    return existingLookupCodes.length > 0;
  }

  isUniqueLookupName() {
    const existingLookupNames = this.lookups.filter(lookup =>
      lookup.name === this.fblookup.value.name &&
      lookup.lookupId !== this.fblookup.value.lookupId
    )
    return existingLookupNames.length > 0;
  }

  editLookUp(lookup: LookupViewDto) {
    lookup.expandLookupDetails.forEach((lookupDetails: LookupDetailsDto) => {
      lookupDetails.lookupId = lookup.lookupId;
      this.falookupDetails().push(this.generaterow(lookupDetails));
    })
    this.fblookup.patchValue(lookup);
    this.addFlag = false;
    this.ShowlookupDetails = true;
  }

  onSubmit() {
    if (this.fblookup.valid) {
      if (this.addFlag) {
        if (this.isUniqueLookupCode()) {
          this.alertMessage.displayErrorMessage(
            `Lookup Code :"${this.fblookup.value.code}" Already Exists.`
          );
        } else if (this.isUniqueLookupName()) {
          this.alertMessage.displayErrorMessage(
            `Lookup Name :"${this.fblookup.value.name}" Already Exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save();
      }
    } else {
      this.fblookup.markAllAsTouched();
    }

  }

  save() {
    if (this.fblookup.valid) {
      this.savelookup().subscribe(resp => {
        if (resp) {
          this.isLookupChecked = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SML001" : "SML002"]);
          this.ref.close(true);
        }
      })
    }
    else {
      this.fblookup.markAllAsTouched();
    }
    console.log(this.fblookup.value);

  }
  savelookup(): Observable<HttpEvent<LookupViewDto>> {
    if (this.addFlag) {
      return this.adminService.CreateLookUp(this.fblookup.value)
    }
    else return this.adminService.UpdateLookUp(this.fblookup.value)
  }

}
