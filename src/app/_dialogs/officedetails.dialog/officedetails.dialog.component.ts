import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { FORMAT_DATE } from 'src/app/_helpers/date.formate.pipe';
import { EmployeesList, LookupViewDto } from 'src/app/_models/admin';
import { ViewEmployeeScreen } from 'src/app/_models/common';
import { EmployeeOfficedetailsDto, EmployeeOfficedetailsviewDto } from 'src/app/_models/employes';
import { AdminService } from 'src/app/_services/admin.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { RG_EMAIL } from 'src/app/_shared/regex';

@Component({
  selector: 'app-officedetails.dialog',
  templateUrl: './officedetails.dialog.component.html',
})
export class OfficedetailsDialogComponent {
  fbOfficDtls!: FormGroup;
  designation: LookupViewDto[] = [];
  employees: EmployeesList[] = [];
  employeeId: string;

  constructor(
    private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private adminService: AdminService,
    private alertMessage: AlertmessageService,
    private activatedRoute: ActivatedRoute,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,) {
    this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
  }

  ngOnInit(): void {
    this.initdesignation();
    this.OfficDtlsForm();
    this.initEmployees();
    if (this.config.data) this.showEmpOfficDtlsDialog(this.config.data);
  }

  OfficDtlsForm() {
    this.fbOfficDtls = this.formbuilder.group({
      employeeId: (this.employeeId),
      strTimeIn: new FormControl(null, [Validators.required]),
      strTimeOut: new FormControl(null, [Validators.required]),
      officeEmailId: new FormControl(null, [Validators.required, Validators.pattern(RG_EMAIL)]),
      dateofJoin: new FormControl(null, [Validators.required]),
      designationId: new FormControl(null, [Validators.required]),
      reportingToId: new FormControl(null, [Validators.required]),
      isPfeligible: new FormControl(true, [Validators.required]),
      isEsieligible: new FormControl(false, [Validators.required]),
      isActive: (true),
    });
  }

  get EmpOfficeFormControls() {
    return this.fbOfficDtls.controls;
  }

  initdesignation() {
    this.lookupService.Designations().subscribe((resp) => {
      this.designation = resp as unknown as LookupViewDto[];
    })
  }

  initEmployees() {
    this.adminService.getEmployeesList().subscribe(resp => {
      this.employees = resp as unknown as EmployeesList[];
    });
  }

  showEmpOfficDtlsDialog(employeeOfficeDtls: EmployeeOfficedetailsviewDto) {
    var employeeofficDtl = employeeofficDtl as unknown as EmployeeOfficedetailsDto;
    if (employeeOfficeDtls) {
      employeeofficDtl = employeeOfficeDtls;
      employeeofficDtl.strTimeIn = employeeOfficeDtls.timeIn?.substring(0, 5);
      employeeofficDtl.strTimeOut = employeeOfficeDtls.timeOut?.substring(0, 5);
      employeeofficDtl.dateofJoin = new Date(employeeOfficeDtls.dateofJoin);
      employeeofficDtl.isPfeligible = employeeOfficeDtls.isPFEligible;
      employeeofficDtl.isEsieligible = employeeOfficeDtls.isESIEligible;
      employeeofficDtl.isActive = true;
      this.fbOfficDtls.patchValue(employeeofficDtl);
    }
  }

  saveEmpOfficDtls() {
    this.fbOfficDtls.value.dateofJoin = FORMAT_DATE(this.fbOfficDtls.value.dateofJoin);
    this.employeeService.updateViewEmpOfficDtls(this.fbOfficDtls.value).subscribe((resp) => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["EVEOFF001"]);
        this.ref.close({
          "UpdatedModal": ViewEmployeeScreen.OfficDetails
        });
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["EVEOFF002"])
      }
    })
  }

}
