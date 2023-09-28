import { Component} from '@angular/core';
 import { ActivatedRoute } from '@angular/router';
import { BankDetailViewDto,  EmployeAdressViewDto, EmployeeBasicDetailViewDto, employeeEducDtlsViewDto,
    employeeExperienceDtlsViewDto,  EmployeeOfficedetailsviewDto,FamilyDetailsViewDto } from 'src/app/_models/employes';
import { EmployeeService } from 'src/app/_services/employee.service';
import { AssetAllotmentViewDto } from 'src/app/_models/admin/assetsallotment';
import { AdminService } from 'src/app/_services/admin.service';
import {  MEDIUM_DATE } from 'src/app/_helpers/date.formate.pipe';
import { Actions, DialogRequest, ViewEmployeeScreen } from 'src/app/_models/common';
import { AddassetallotmentDialogComponent } from 'src/app/_dialogs/addassetallotment.dialog/addassetallotment.dialog.component';
import { UnassignassetDialogComponent } from 'src/app/_dialogs/unassignasset.dialog/unassignasset.dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MaxLength } from 'src/app/_models/common';
import { BankdetailsDialogComponent } from 'src/app/_dialogs/bankDetails.Dialog/bankdetails.dialog.component';
import { AddressDialogComponent } from 'src/app/_dialogs/address.dialog/address.dialog.component';
import { uploadDocumentsDialogComponent } from 'src/app/_dialogs/uploadDocuments.dialog/uploadDocuments.dialog.component';
import { FamilydetailsDialogComponent } from 'src/app/_dialogs/familydetails.dailog/familydetails.dialog.component';
import { BasicdetailsDialogComponent } from 'src/app/_dialogs/basicdetails.dialog/basicdetails.dialog.component';
import { OfficedetailsDialogComponent } from 'src/app/_dialogs/officedetails.dialog/officedetails.dialog.component';
import { EducationdetailsDialogComponent } from 'src/app/_dialogs/educationdetails.dialog/educationdetails.dialog.component';
import { ExperiencedetailsDialogComponent } from 'src/app/_dialogs/experiencedetails.dialog/experiencedetails.dialog.component';
import { ALERT_CODES, AlertmessageService } from 'src/app/_alerts/alertmessage.service';

@Component({
  selector: 'app-viewemployees',
  templateUrl: './viewemployees.component.html',
  styles: [],
})
export class ViewemployeesComponent {
  // employee basic details
  employeePrsDtls = new EmployeeBasicDetailViewDto();
  mediumDate: string = MEDIUM_DATE;
  // employee office details
  employeeofficeDtls = new EmployeeOfficedetailsviewDto();
  // employee education details
  educationDetails: employeeEducDtlsViewDto[] = [];
  // employee experience details
  workExperience: employeeExperienceDtlsViewDto[] = [];
  // Employee FamilyDetails
  familyDetails: FamilyDetailsViewDto[];
  selectedOption: string;
  // Employee AdressDetails
  address: EmployeAdressViewDto[] = [];
  isAddressChecked: boolean = true;
  // Employee  UploadedDocuments
  UploadedDocuments: any[] = [];
  // EmployeeBankDetails
  bankDetails: BankDetailViewDto[];
  // Employee Assets Details
  assetAllotments: AssetAllotmentViewDto[] = [];
  maxLength: MaxLength = new MaxLength();
  employeeId: any;
  ActionTypes = Actions;
  files = [];
  fileSize = 20;
  title: string;
  hasPermanentAddress: boolean = false;
  hasCurrentAddress: boolean = false;
  hasTemporaryAddres: boolean = false;
  addassetallotmentDialogComponent = AddassetallotmentDialogComponent;
  BankdetailsDialogComponent = BankdetailsDialogComponent;
  unassignassetDialogComponent = UnassignassetDialogComponent;
  AddressDialogComponent = AddressDialogComponent;
  uploadDocumentsDialogComponent = uploadDocumentsDialogComponent;
  FamilydetailsDialogComponent = FamilydetailsDialogComponent;
  basicdetailsDialogComponent = BasicdetailsDialogComponent;
  officedetailsDialogComponent = OfficedetailsDialogComponent;
  educationdetailsDialogComponent = EducationdetailsDialogComponent;
  experiencedetailsDialogComponent = ExperiencedetailsDialogComponent;
  dialogRequest: DialogRequest = new DialogRequest();
  enRollEmployee: boolean = false;
  showOfcAndAssetDetails: boolean = false;

  constructor(
    private alertMessage:AlertmessageService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService) {
    this.employeeId = this.activatedRoute.snapshot.queryParams['employeeId'];
  }

  ngOnInit(): void {
    this.initViewEmpDtls();
    this.initofficeEmpDtls();
    this.initGetEducationDetails();
    this.initGetWorkExperience();
    this.initGetFamilyDetails();
    this.onChangeAddressChecked();
    this.initUploadedDocuments();
    this.initBankDetails();
    this.initviewAssets();
  }

  // EMPLOYEE Basic details
  initViewEmpDtls() {
    this.enRollEmployee = false;
    this.employeeService.GetViewEmpPersDtls(this.employeeId).subscribe((resp) => {
      this.employeePrsDtls = resp as unknown as EmployeeBasicDetailViewDto;
      if(!this.employeePrsDtls.signDate) this.enRollEmployee = true;
      else this.showOfcAndAssetDetails = true;
    });
  }

  // Employee OFFICE DETAils
  initofficeEmpDtls() {
    this.employeeService.EmployeeOfficedetailsviewDto(this.employeeId).subscribe((resp) => {
      this.employeeofficeDtls = resp as unknown as EmployeeOfficedetailsviewDto;
    });
  }

  // Employee Education details
  initGetEducationDetails() {
    this.employeeService.GetEducationDetails(this.employeeId).subscribe((resp) => {
      this.educationDetails = resp as unknown as employeeEducDtlsViewDto[];
    });
  }

  // Employee Work Experience
  initGetWorkExperience() {
    this.employeeService.GetWorkExperience(this.employeeId).subscribe((resp) => {
      this.workExperience = resp as unknown as employeeExperienceDtlsViewDto[];
    });
  }

  // Employee Assets
  initviewAssets() {
    this.adminService.GetAssetAllotments(this.employeeId).subscribe((resp) => {
      if (resp) {
        this.assetAllotments = resp as unknown as AssetAllotmentViewDto[];
      }
    });
  }

  //Upload Documents
  initUploadedDocuments() {
    this.employeeService.GetUploadedDocuments(this.employeeId).subscribe((resp) => {
      this.UploadedDocuments = resp as unknown as any[];
    });
  }

  // Employee BankDetails
  initBankDetails() {
    this.employeeService.GetBankDetails(this.employeeId).subscribe((resp) => {
      this.bankDetails = resp as unknown as BankDetailViewDto[];
    });
  }

  //Employee Address
  initGetAddress(isbool) {
    this.employeeService.GetAddresses(this.employeeId, isbool).subscribe((resp) => {
      this.address = resp as unknown as EmployeAdressViewDto[];
      // Check if the employee has Permanent Address
      this.hasPermanentAddress = this.address.some(addr => addr.addressType === 'Permanent Address');
      // Check if the employee has Current Address
      this.hasCurrentAddress = this.address.some(addr => addr.addressType === 'Current Address');
      // Check if the employee has Temporary Address
      this.hasTemporaryAddres = this.address.some(addr => addr.addressType === 'Temporary Address');
    });
  }
  onChangeAddressChecked() {
    this.initGetAddress(this.isAddressChecked)
  }

  //Employee FamilyDetails
  initGetFamilyDetails() {
    this.employeeService.getFamilyDetails(this.employeeId).subscribe((resp) => {
      this.familyDetails = resp as unknown as FamilyDetailsViewDto[];
    });
  }

  toggleInputField(option: string) {
    this.selectedOption = option;
  }

  restrictSpaces(event: KeyboardEvent) {
    if (event.key === ' ' && (<HTMLInputElement>event.target).selectionStart === 0) {
      event.preventDefault();
    }
  }

  openComponentDialog(content: any,
    dialogData, action: Actions = this.ActionTypes.add) {
    if (action == Actions.unassign && content === this.unassignassetDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Unassign Asset";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.add && content === this.addassetallotmentDialogComponent) {
      this.dialogRequest.dialogData = {
        employeeId: parseInt(this.employeeId)
      }
      this.dialogRequest.header = "Add Asset";
      this.dialogRequest.width = "50%";
    }
    //Bank Details
    else if (action == Actions.edit && content === this.BankdetailsDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = " Bank Details";
      this.dialogRequest.width = "40%";
    }
    else if (action == Actions.add && content === this.BankdetailsDialogComponent) {
      this.dialogRequest.dialogData = {}
      this.dialogRequest.header = "Add Bank Details";
      this.dialogRequest.width = "50%";
    }
    //Adress Details
    else if (action == Actions.edit && content === this.AddressDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Edit Address Details";
      this.dialogRequest.width = "70%";
    }
    else if (action == Actions.add && content === this.AddressDialogComponent) {
      if (this.hasPermanentAddress && this.hasCurrentAddress && this.hasTemporaryAddres) {
        return this.alertMessage.displayErrorMessage(ALERT_CODES["EMSEA001"]);
      }
      else {
        this.dialogRequest.dialogData = {
        }
        this.dialogRequest.header = "Add Address Details";
        this.dialogRequest.width = "70%";
      }
    }
    //uploadDocuments
    else if (action == Actions.add && content === this.uploadDocumentsDialogComponent) {
      this.dialogRequest.dialogData = {}
      this.dialogRequest.header = "Upload Documents";
      this.dialogRequest.width = "30%";
    }
    //Familydetails
    else if (action == Actions.edit && content === this.FamilydetailsDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = " Update Family Details";
      this.dialogRequest.width = "70%";
    }
    else if (action == Actions.add && content === this.FamilydetailsDialogComponent) {
      this.dialogRequest.dialogData = {}
      this.dialogRequest.header = "Add Family Details";
      this.dialogRequest.width = "70%";
    }
    // Basicdetails
    else if (action == Actions.save && content === this.basicdetailsDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Basic Details";
      this.dialogRequest.width = "70%";
    }
    // Officedetails
    else if (action == Actions.save && content === this.officedetailsDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Office Details";
      this.dialogRequest.width = "70%";
    }
    // Educationdetails
    else if (action == Actions.save && content === this.educationdetailsDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Education Details";
      this.dialogRequest.width = "70%";
    }
    // Experiencedetails
    else if (action == Actions.save && content === this.experiencedetailsDialogComponent) {
      this.dialogRequest.dialogData = dialogData;
      this.dialogRequest.header = "Experience Details";
      this.dialogRequest.width = "70%";
    }
    this.ref = this.dialogService.open(content, {
      data: this.dialogRequest.dialogData,
      header: this.dialogRequest.header,
      width: this.dialogRequest.width
    });

    this.ref.onClose.subscribe((res: any) => {
      if (res.UpdatedModal == ViewEmployeeScreen.AssetAllotments) {
        this.initviewAssets();
      } else if (res.UpdatedModal == ViewEmployeeScreen.BankDetails) {
        this.initBankDetails();
      } else if (res.UpdatedModal == ViewEmployeeScreen.Address) {
        this.onChangeAddressChecked();
      } else if (res.UpdatedModal == ViewEmployeeScreen.FamilyDetails) {
        this.initGetFamilyDetails();
        
      } else if (res.UpdatedModal == ViewEmployeeScreen.UploadDocuments) {
        this.initUploadedDocuments();
      } else if (res.UpdatedModal == ViewEmployeeScreen.BasicDetails) {
        this.initViewEmpDtls();
      }else if (res.UpdatedModal == ViewEmployeeScreen.OfficDetails) {
        this.initofficeEmpDtls();
      }else if (res.UpdatedModal == ViewEmployeeScreen.EducationDetails) {
        this.initGetEducationDetails();
      }
      else if (res.UpdatedModal == ViewEmployeeScreen.ExperienceDetails) {
        this.initGetWorkExperience();
      }
      event.preventDefault(); // Prevent the default form submission
    });
  }
}
