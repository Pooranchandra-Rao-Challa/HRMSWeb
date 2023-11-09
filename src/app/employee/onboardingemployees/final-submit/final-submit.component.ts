import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertmessageService, ALERT_CODES } from 'src/app/_alerts/alertmessage.service';
import { AddressDialogComponent } from 'src/app/_dialogs/address.dialog/address.dialog.component';
import { BankdetailsDialogComponent } from 'src/app/_dialogs/bankDetails.Dialog/bankdetails.dialog.component';
import { EducationdetailsDialogComponent } from 'src/app/_dialogs/educationdetails.dialog/educationdetails.dialog.component';
import { ExperiencedetailsDialogComponent } from 'src/app/_dialogs/experiencedetails.dialog/experiencedetails.dialog.component';
import { FamilydetailsDialogComponent } from 'src/app/_dialogs/familydetails.dailog/familydetails.dialog.component';
import { UploadDocumentsDialogComponent } from 'src/app/_dialogs/uploadDocuments.dialog/uploadDocuments.dialog.component';
import { Actions, DialogRequest } from 'src/app/_models/common';
import { BankDetailViewDto, EmployeAdressViewDto, Employee, EmployeesViewDto, FamilyDetailsViewDto, employeeEducDtlsViewDto, employeeExperienceDtlsViewDto } from 'src/app/_models/employes';
import { RoleViewDto } from 'src/app/_models/security';
import { EmployeeService } from 'src/app/_services/employee.service';
import { SecurityService } from 'src/app/_services/security.service';
@Component({
  selector: 'app-final-submit',
  templateUrl: './final-submit.component.html',
})
export class FinalSubmitComponent {
  employeeId: any;
  fbEnroll!: FormGroup;
  message: any;
  dialog: boolean = false;
  displayDialog: boolean = false;
  employees: any;
  employeeObj: any = {};
  userData: any;
  errorMessage: string;
  roles: RoleViewDto[] = [];
  educationDetails: employeeEducDtlsViewDto[] = [];
  workExperience: employeeExperienceDtlsViewDto[] = [];
  bankDetails: BankDetailViewDto[];
  UploadedDocuments: any[] = [];
  familyDetails: FamilyDetailsViewDto[];
  address: EmployeAdressViewDto[] = [];
  isAddressChecked: boolean;
  hasPermanentAddress: boolean = false;
  hasCurrentAddress: boolean = false;
  hasTemporaryAddres: boolean = false;
  ActionTypes = Actions;
  educationdetailsDialogComponent = EducationdetailsDialogComponent;
  experiencedetailsDialogComponent = ExperiencedetailsDialogComponent;
  AddressDialogComponent = AddressDialogComponent;
  uploadDocumentsDialogComponent = UploadDocumentsDialogComponent;
  FamilydetailsDialogComponent = FamilydetailsDialogComponent;
  BankdetailsDialogComponent = BankdetailsDialogComponent;
  dialogRequest: DialogRequest = new DialogRequest();
  constructor(private router: Router, private employeeService: EmployeeService,
    private formbuilder: FormBuilder, private alertMessage: AlertmessageService,
    private activatedRoute: ActivatedRoute,
    private securityService: SecurityService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,) {
    this.employeeId = this.activatedRoute.snapshot.params['employeeId'] || this.activatedRoute.snapshot.queryParams['employeeId'];
  }

  ngOnInit() {
    this.fbEnroll = this.formbuilder.group({
      employeeId: [this.employeeId],
      roleId: new FormControl(null, [Validators.required])
    })
    this.getRoles();
    this.getEducationDetails();
    this.getWorkExperience();
    const isEnrolled = false;
    this.employeeService.GetEmployees(isEnrolled).subscribe(resp => {
      this.employees = resp;
      this.employeeObj = this.employees.find(x => x.employeeId == this.employeeId);
      if (this.employeeObj?.pendingDetails == "No Pending Details" || this.employeeObj?.pendingDetails == "BankDetails, FamilyInformation" || this.employeeObj?.pendingDetails == "BankDetails" || this.employeeObj?.pendingDetails == "FamilyInformation") {
        this.displayDialog = true;
      }
      console.log(this.employeeObj);
      
    });
  }

  getEmployees() {
    const isEnrolled = false;
    this.employeeService.GetEmployees(isEnrolled).subscribe(resp => {
      this.employees = resp
    });
  }

  getRoles() {
    this.securityService.GetRoles().subscribe(resp => {
      this.roles = resp as unknown as RoleViewDto[];
    });
  }

  get FormControls() {
    return this.fbEnroll.controls;
  }

  shouldHighlight(detail: string): boolean {
    return detail === 'BankDetails' || detail === 'FamilyInformation';
  }

  confirmationDialog() {
    if (this.fbEnroll.valid) {
      this.dialog = true;
      this.onSubmit();
    }
  }

  onSubmit() {
    this.employeeService.EnrollUser(this.fbEnroll.value).subscribe(res => {
      this.message = res;
    },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'Request failed: ', error
        if (error.status === 403) {
          this.errorMessage = 'Access Denied: ', error.message
        } else {
          this.errorMessage = 'Duplicate UserName ' + error.message
        }
      });
    this.dialog = true;
  }

  onClose() {
    if (this.errorMessage) {
      this.dialog = false;
    }
    else {
      if (this.employeeObj?.pendingDetails == "No Pending Changes" || this.employeeObj.pendingDetails == "BankDetails, FamilyInformation" || this.employeeObj.pendingDetails == "BankDetails" || this.employeeObj.pendingDetails == "FamilyInformation") {
        if (this.message !== null) {
          this.router.navigate(['employee/all-employees']);
          this.alertMessage.displayAlertMessage(ALERT_CODES["SEE001"]);
        }
      }
      else {
        this.dialog = false;
      }
    }
  }

  getEducationDetails() {
    this.employeeService.GetEducationDetails(this.employeeId).subscribe((resp) => {
      this.educationDetails = resp as unknown as employeeEducDtlsViewDto[];
    });
  }

  getWorkExperience() {
    this.employeeService.GetWorkExperience(this.employeeId).subscribe((resp) => {
      this.workExperience = resp as unknown as employeeExperienceDtlsViewDto[];
    });
  }

  // // Employee BankDetails
  // getBankDetails() {
  //   this.employeeService.GetBankDetails(this.employeeId).subscribe((resp) => {
  //     this.bankDetails = resp as unknown as BankDetailViewDto[];
  //   });
  // }

  // //Upload Documents
  // getUploadedDocuments() {
  //   this.employeeService.GetUploadedDocuments(this.employeeId).subscribe((resp) => {
  //     this.UploadedDocuments = resp as unknown as any[];
  //   });
  // }
  
  // getFamilyDetails() {
  //   this.employeeService.getFamilyDetails(this.employeeId).subscribe((resp) => {
  //     this.familyDetails = resp as unknown as FamilyDetailsViewDto[];
  //   });
  // }

  // getAddress() {
  //   const isbool = this.isAddressChecked ? true : false;
  //   this.employeeService.GetAddresses(this.employeeId, isbool).subscribe((resp) => {
  //     this.address = resp as unknown as EmployeAdressViewDto[];
  //     // Check if the employee has Permanent Address
  //     this.hasPermanentAddress = this.address.some(addr => addr.addressType === 'Permanent Address');
  //     // Check if the employee has Current Address
  //     this.hasCurrentAddress = this.address.some(addr => addr.addressType === 'Current Address');
  //     // Check if the employee has Temporary Address
  //     this.hasTemporaryAddres = this.address.some(addr => addr.addressType === 'Temporary Address');
  //   });
  // }

  openAppropriateDialog(detail: string) {
    if (detail === 'BankDetails') {
      this.openComponentDialog(this.BankdetailsDialogComponent, this.bankDetails, this.ActionTypes.save);
    } else if (detail === 'EducationDetails') {
      this.openComponentDialog(this.educationdetailsDialogComponent, this.educationDetails, this.ActionTypes.save);
    } else if (detail === 'WorkExperience') {
      this.openComponentDialog(this.experiencedetailsDialogComponent, this.workExperience, this.ActionTypes.save);
    }
    else if (detail === 'UploadedDocuments') {
      this.openComponentDialog(this.uploadDocumentsDialogComponent, this.UploadedDocuments, this.ActionTypes.save);
    }
    else if (detail === 'FamilyInformation') {
      this.openComponentDialog(this.FamilydetailsDialogComponent, this.familyDetails, this.ActionTypes.save);
    }
    else if (detail === 'Addresses') {
      this.openComponentDialog(this.AddressDialogComponent, this.address, this.ActionTypes.save);
    }
  }

  openComponentDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.add) {
      //EducationDetails
    if (action == Actions.save && content === this.educationdetailsDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Education Details";
      this.dialogRequest.width = "50%";
    }
    // ExperienceDetails
    else if (action == Actions.save && content === this.experiencedetailsDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Experience Details";
      this.dialogRequest.width = "50%";
    }
    //uploadDocuments
    else if (action == Actions.save && content === this.uploadDocumentsDialogComponent) {
      this.dialogRequest.dialogData = null;
      this.dialogRequest.header = "Upload Documents";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.save && content === this.FamilydetailsDialogComponent) {
      this.dialogRequest.dialogData = null
      this.dialogRequest.header = "Family Details";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.save && content === this.BankdetailsDialogComponent) {
      this.dialogRequest.dialogData = null
      this.dialogRequest.header = "Bank Details";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.save && content === this.AddressDialogComponent) {
      if (this.hasPermanentAddress && this.hasCurrentAddress && this.hasTemporaryAddres) {
        return this.alertMessage.displayErrorMessage(ALERT_CODES["EMAD001"]);
      }
      else {
        this.dialogRequest.dialogData = null
        this.dialogRequest.header = "Address Details";
        this.dialogRequest.width = "40%";
      }
    }
    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });
    this.ref.onClose.subscribe((res: any) => {
      const isEnrolled = false;
      this.employeeService.GetEmployees(isEnrolled).subscribe(resp => {
        this.employees = resp;
        this.employeeObj = this.employees.find(x => x.employeeId == this.employeeId);
        if (this.employeeObj?.pendingDetails == "No Pending Details" || this.employeeObj?.pendingDetails == "BankDetails, FamilyInformation" || this.employeeObj?.pendingDetails == "BankDetails" || this.employeeObj?.pendingDetails == "FamilyInformation") {
          this.displayDialog = true;
        }
      });
      event.preventDefault(); // Prevent the default form submission
    });
  }
}
