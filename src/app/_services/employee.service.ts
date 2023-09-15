import { Injectable } from '@angular/core';

import {
  CREATE_ADDRESS_URI, CREATE_BANK_DETAILS_URI, CREATE_BASIC_DETAILS_URI, CREATE_DOCUMENTS_URI , CREATE_FAMILY_DETAILS_URI, GET_ADDRESS_BASED_ON_ID_URI, GET_BANKDETAILS_URI,
  GET_COUNTRIES_URI,
  GET_EDUCATION_DETAILS_URI, GET_EMPLOYEES_URI, GET_EMPLOYEE_BASED_ON_ID_URI, GET_GETFAMILYDETAILS_URI, GET_GETUPLOADEDDOCUMENTS_URI, GET_OFFICE_DETAILS_URI,

  GET_STATES_URI,

  GET_WORKEXPERIENCE_URI,
  UPDATE_EMPLOYEE_BASED_ON_ID_URI,
  UPDATE_OFFICE_DETAILS_URI
} from './api.uri.service';
import { AddressDetailsDto, BankDetailsDto, Countries, EmployeAdressViewDto, EmployeeBasicDetailDto, EmployeeBasicDetailViewDto, EmployeeOfficedetailsDto, EmployeeOfficedetailsviewDto, EmployeesViewDto, FamilyDetailsDto, States, UploadDocuments } from '../_models/employes';

import { ApiHttpService } from './api.http.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends ApiHttpService {


  //Search Employee
  public GetEmployees(IsEnrolled: boolean) {
    const url = `${GET_EMPLOYEES_URI}/${IsEnrolled}`;
    return this.get<EmployeesViewDto[]>(url);
  }

  //Persnal Details of Employee
  public CreateBasicDetails(basicdetails: EmployeeBasicDetailDto) {
    return this.post<EmployeeBasicDetailDto>(CREATE_BASIC_DETAILS_URI, basicdetails);

  }
  public CreateAddress(addressDetails: AddressDetailsDto[]) {
    return this.post<AddressDetailsDto>(CREATE_ADDRESS_URI, addressDetails)
  }
  //Bank Details of Employee
  public CreateBankDetails(bankdetails: BankDetailsDto) {
    return this.post<BankDetailsDto>(CREATE_BANK_DETAILS_URI, bankdetails);
  }
  public CreateUploadDocuments(documents: UploadDocuments[]) {
    return this.post<UploadDocuments[]>(CREATE_DOCUMENTS_URI, documents)
  }
  //Familly Details of Employee
  public CreateFamilyDetails(family: FamilyDetailsDto[]) {
    return this.post<FamilyDetailsDto[]>(CREATE_FAMILY_DETAILS_URI, family)
  }

  public Getstates() {
    return this.get<States>(GET_STATES_URI);
  }
  public GetCountries() {
    return this.get<Countries>(GET_COUNTRIES_URI);
  }
  public GetViewEmpPersDtls(employeeId: number) {
    return this.getWithId<EmployeeBasicDetailViewDto[]>(GET_EMPLOYEE_BASED_ON_ID_URI, [employeeId])
  }
  public EmployeeOfficedetailsviewDto(employeeId: number) {
    return this.getWithId<EmployeeOfficedetailsviewDto[]>(GET_OFFICE_DETAILS_URI, [employeeId])
  }

  public GetAddress(employeeId: number) {
    return this.getWithId<EmployeAdressViewDto[]>(GET_ADDRESS_BASED_ON_ID_URI, [employeeId])
  }
  public GetEducationDetails(employeeId: number) {
    return this.getWithId<any[]>(GET_EDUCATION_DETAILS_URI, [employeeId])
  }
  public GetWorkExperience(employeeId: number) {
    return this.getWithId<any[]>(GET_WORKEXPERIENCE_URI, [employeeId])
  }
  public getFamilyDetails(employeeId: number) {
    return this.getWithId<any[]>(GET_GETFAMILYDETAILS_URI, [employeeId])
  }
  public GetUploadedDocuments(employeeId: number) {
    return this.getWithId<any[]>(GET_GETUPLOADEDDOCUMENTS_URI, [employeeId])

  }


  public GetBankDetails(employeeId: number) {
    return this.getWithId<any[]>(GET_BANKDETAILS_URI, [employeeId])

  }


  public updateViewEmpPersDtls(empBasicDtls: EmployeeBasicDetailDto) {
    return this.post<EmployeeBasicDetailDto>(UPDATE_EMPLOYEE_BASED_ON_ID_URI, empBasicDtls);
  }

  public updateViewEmpOfficDtls(empOfficDtls: EmployeeOfficedetailsDto) {
    debugger
    return this.post<EmployeeOfficedetailsDto>(UPDATE_OFFICE_DETAILS_URI, empOfficDtls);
  }
}
