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
  UPDATE_EXPERIENCE_DETAILS,
  GET_ATTENDENCE,
  GET_NOTUPDATED_EMPLOYEES,
  POST_LISTOF_ATTENDANCES,


  CREATE_EMPLOYEE_LEAVE_DETAILS,
  GET_EMPLOYEE_LEAVE_DETAILS,
  GET_COMPANY_HIERARCHY,
  DELETE_DOCUMENT,
  GET_PATH,
  UPDATE_EMPLOYEE_LEAVE_DETAILS,
  GET_EMPLOYEE_PROFILE_PIC,

} from './api.uri.service';
import { ExperienceDetailsDto, SkillArea, AddressDetailsDto, BankDetailsDto, Countries, EducationDetailsDto, EmployeAdressViewDto, EmployeeBasicDetailDto, EmployeeBasicDetailViewDto, EmployeeOfficedetailsDto, EmployeeOfficedetailsviewDto, EmployeesViewDto, FamilyDetailsDto, States, UploadDocuments, employeeExperienceDtlsViewDto, FamilyDetailsViewDto, employeeAttendanceDto, EmployeeLeaveDto, EmployeeAttendanceList, CompanyHierarchyViewDto, EmployeeProfilePicViewDto } from '../_models/employes';

import { ApiHttpService } from './api.http.service';
import { LookupViewDto } from '../_models/admin';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as FileSaver from "file-saver";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends ApiHttpService {
  baseUrl: string = environment.ApiUrl;

  public GetAttendance(month: number, year: number) {
    return this.getWithId<employeeAttendanceDto>(GET_ATTENDENCE, [month + '/' + year]);
  }
  public DeleteDocument(documentId: number) {
    return this.post(DELETE_DOCUMENT + '/' + documentId, null);
  }
  

  public downloadAttachment<T>(module: string, documentId: number) {
    const endpointUrl = GET_PATH + '/' + module + '/' + documentId;
    return this.get(endpointUrl, { observe: "response", responseType: "arraybuffer" })
      .subscribe(
        (resp: HttpResponse<Blob>) => {
          const blob = new Blob([resp.body], {
            type: resp.headers.get("content-type"),
          });
          const document = window.URL.createObjectURL(blob);
          FileSaver.saveAs(document);
        },
        (error) => {
        }
      );
  }
  public ViewAttachment(module: string, documentId: number) {
    const endpointUrl =  GET_PATH + '/' + module + '/' + documentId;
    return this.get(endpointUrl, { observe: "response", responseType: "arraybuffer" })
      .subscribe(
        (resp: HttpResponse<Blob>) => {
          const blob = new Blob([resp.body], {
            type: resp.headers.get("content-type"),
          });

          // Other Browsers
          const url = (window.URL || window.webkitURL).createObjectURL(blob);
          window.open(url, '_blank');

          // rewoke URL after 15 minutes
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 15 * 60 * 1000);
        },
        (error) => {
        }
      );
  }
  public AddAttendance(data: EmployeeAttendanceList[]) {
    return this.post<EmployeeAttendanceList[]>(POST_LISTOF_ATTENDANCES, data);
  }
  public CreateAttendance(data: EmployeeLeaveDto) {
    return this.post<EmployeeAttendanceList>(UPDATE_EMPLOYEE_LEAVE_DETAILS, data);
  }
  //Search Employee
  public GetEmployees(IsEnrolled: boolean) {
    const url = `${GET_EMPLOYEES_URI}/${IsEnrolled}`;
    return this.get<EmployeesViewDto[]>(url);
  }
  //personal Details of Employee
  public CreateBasicDetails(basicdetails: EmployeeBasicDetailDto) {
    return this.post<EmployeeBasicDetailDto>(CREATE_BASIC_DETAILS_URI, basicdetails);

  }
  public GetNotUpdatedEmployees(date, previousDay: boolean) {
    return this.get<any>(GET_NOTUPDATED_EMPLOYEES + '/' + `${date}` + '/' + `${previousDay}`);
  }
  //Education Details of Employee
  public CreateEducationDetails(educationdetails: EducationDetailsDto[]) {
    return this.post<EducationDetailsDto[]>(CREATE_EDUCATION_DETAILS_URI, educationdetails);
  }
  public CreateAddress(addressDetails: AddressDetailsDto[]) {
    return this.post<AddressDetailsDto>(CREATE_ADDRESS_URI, addressDetails)
  }
  public CreateExperience(experienceDetails: ExperienceDetailsDto[]) {
    return this.post<ExperienceDetailsDto>(CREATE_EXPERIENCE_URI, experienceDetails)
  }
  public EnrollUser(employeeId: number) {
    return this.post(ENROLL_URI, employeeId)
  }
  //Bank Details of Employee
  public CreateBankDetails(bankdetails: BankDetailsDto) {
    return this.post<BankDetailsDto>(CREATE_BANK_DETAILS_URI, bankdetails);
  }
  public UploadDocuments(documents: FormData, params?: HttpParams) {
    let header = new HttpHeaders()
    header = header.set('Content-Type', 'multipart/form-data')
    return this.upload(CREATE_DOCUMENTS_URI,
      documents,
      header, params);
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
  public GetAddresses(employeeId: number, isbool: boolean) {
    return this.getWithId<EmployeAdressViewDto[]>(GET_ADDRESS_BASED_ON_ID_URI, [employeeId + '/' + isbool])
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

  // public GetAddress(employeeId: number) {
  //         return this.getWithId<EmployeAdressViewDto[]>(GET_ADDRESS_BASED_ON_ID_URI, [employeeId])
  //     }
  //     public GetEducationDetails(employeeId: number) {
  //         return this.getWithId<EducationDetailsDto[]>(GET_EDUCATION_DETAILS_URI, [employeeId])
  //     }
  //     public GetWorkExperience(employeeId: number) {
  //         return this.getWithId<employeeExperienceDtlsViewDto[]>(GET_WORKEXPERIENCE_URI, [employeeId])
  //     }
  //     public getFamilyDetails(employeeId: number) {
  //         return this.getWithId<FamilyDetailsDto[]>(GET_GETFAMILYDETAILS_URI, [employeeId])
  //     }
  //     public GetUploadedDocuments(employeeId: number) {
  //         return this.getWithId<any[]>(GET_GETUPLOADEDDOCUMENTS_URI, [employeeId])

  //     }


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

  public updateViewEmpExperienceDtls(empExpDtls: ExperienceDetailsDto[]) {
    return this.post<ExperienceDetailsDto>(UPDATE_EXPERIENCE_DETAILS, empExpDtls);
  }

  public getEmployeeLeaveDetails() {
    return this.get<EmployeeLeaveDto[]>(GET_EMPLOYEE_LEAVE_DETAILS)
  }

  public CreateEmployeeLeaveDetails(leaveDetails: EmployeeLeaveDto[]) {
    return this.post<EmployeeLeaveDto[]>(CREATE_EMPLOYEE_LEAVE_DETAILS, leaveDetails)
  }

  public UpdateEmployeeLeaveDetails(leaveDetails: EmployeeLeaveDto[]) {
    return this.post<EmployeeLeaveDto[]>(UPDATE_EMPLOYEE_LEAVE_DETAILS, leaveDetails)
  }

  public getCompanyHierarchy() {
    return this.get<CompanyHierarchyViewDto[]>(GET_COMPANY_HIERARCHY)
  }
  public getEmployeeProfileInfo(employeeId: number) {
    return this.getWithId<EmployeeProfilePicViewDto[]>(GET_EMPLOYEE_PROFILE_PIC, [employeeId])
  }
}
