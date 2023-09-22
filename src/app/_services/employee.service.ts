import { Injectable } from '@angular/core';

import {
   CREATE_EXPERIENCE_URI, ENROLL_URI,
  CREATE_ADDRESS_URI, CREATE_BANK_DETAILS_URI, CREATE_BASIC_DETAILS_URI, CREATE_DOCUMENTS_URI, CREATE_EDUCATION_DETAILS_URI, CREATE_FAMILY_DETAILS_URI, GET_ADDRESS_BASED_ON_ID_URI, GET_BANKDETAILS_URI,
  GET_COUNTRIES_URI,
  GET_DESIGNATION_URI,
  GET_EDUCATION_DETAILS_URI, GET_EMPLOYEES_URI, GET_EMPLOYEE_BASED_ON_ID_URI, GET_GETFAMILYDETAILS_URI, GET_GETUPLOADEDDOCUMENTS_URI, GET_OFFICE_DETAILS_URI,
  GET_SKILL_AREA_URI,

  GET_STATES_URI,

  GET_WORKEXPERIENCE_URI,
  UPDATE_EDUCATION_DETAILS,
  UPDATE_EMPLOYEE_BASED_ON_ID_URI,
  UPDATE_OFFICE_DETAILS_URI,
  UPDATE_EXPERIENCE_DETAILS
} from './api.uri.service';
import {ExperienceDetailsDto,SkillArea,AddressDetailsDto, BankDetailsDto, Countries, EducationDetailsDto, EmployeAdressViewDto, EmployeeBasicDetailDto, EmployeeBasicDetailViewDto, EmployeeOfficedetailsDto, EmployeeOfficedetailsviewDto, EmployeesViewDto, FamilyDetailsDto, States, UploadDocuments, employeeExperienceDtlsViewDto } from '../_models/employes';

import { ApiHttpService } from './api.http.service';
import { LookupViewDto } from '../_models/admin';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends ApiHttpService {


  //Search Employee
  public GetEmployees(IsEnrolled: boolean) {
    const url = `${GET_EMPLOYEES_URI}/${IsEnrolled}`;
    return this.get<EmployeesViewDto[]>(url);
  }

  //personal Details of Employee
  public CreateBasicDetails(basicdetails: EmployeeBasicDetailDto) {
    return this.post<EmployeeBasicDetailDto>(CREATE_BASIC_DETAILS_URI, basicdetails);

  }
  //Education Details of Employee
  public CreateEducationDetails(educationdetails: EducationDetailsDto[]){
    return this.post<EducationDetailsDto[]>(CREATE_EDUCATION_DETAILS_URI,educationdetails);
  }
  public CreateAddress(addressDetails: AddressDetailsDto[]) {
    return this.post<AddressDetailsDto>(CREATE_ADDRESS_URI, addressDetails)
  }
  public CreateExperience(experienceDetails: ExperienceDetailsDto[]) {
    return this.post<AddressDetailsDto>(CREATE_EXPERIENCE_URI, experienceDetails)
  }
  public EnrollUser(employeeId:number){
    return this.post(ENROLL_URI,employeeId)
  }
  //Bank Details of Employee
  public CreateBankDetails(bankdetails: BankDetailsDto) {
    return this.post<BankDetailsDto>(CREATE_BANK_DETAILS_URI, bankdetails);
  }
  public UploadDocuments(documents) {
    console.log(documents)
    return this.post(CREATE_DOCUMENTS_URI, documents)
  }
  //Familly Details of Employee
  public CreateFamilyDetails(family: FamilyDetailsDto[]) {
    return this.post<FamilyDetailsDto[]>(CREATE_FAMILY_DETAILS_URI, family)
  }
//   public Getstates() {
//     return this.get<States>(GET_STATES_URI);
//   }
//   public Designation() {
//     return this.get<LookupViewDto[]>(GET_DESIGNATION_URI);
//   }
//   public GetSkillArea() {
//     return this.get<SkillArea>(GET_SKILL_AREA_URI);
//   }
//   public GetCountries() {
//     return this.get<Countries>(GET_COUNTRIES_URI);
//   }
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
    return this.getWithId<EducationDetailsDto[]>(GET_EDUCATION_DETAILS_URI, [employeeId])
  }
  public GetWorkExperience(employeeId: number) {
    return this.getWithId<employeeExperienceDtlsViewDto[]>(GET_WORKEXPERIENCE_URI, [employeeId])
  }
  public getFamilyDetails(employeeId: number) {
    return this.getWithId<FamilyDetailsDto[]>(GET_GETFAMILYDETAILS_URI, [employeeId])
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
    return this.post<EmployeeOfficedetailsDto>(UPDATE_OFFICE_DETAILS_URI, empOfficDtls);
  }

  public updateViewEmpEduDtls(empEduDtls: EducationDetailsDto[]) {
    return this.post<EducationDetailsDto[]>(UPDATE_EDUCATION_DETAILS, empEduDtls);
  }

  public updateViewEmpExperienceDtls(empExpDtls: ExperienceDetailsDto ) {
    return this.post<ExperienceDetailsDto>(UPDATE_EXPERIENCE_DETAILS, empExpDtls);
  }
}
