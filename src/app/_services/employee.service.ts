import { Injectable } from '@angular/core';
import { CREATE_BANK_DETAILS_URI, CREATE_BASIC_DETAILS_URI, GET_ADDRESS_BASED_ON_ID_URI, GET_BANKDETAILS_URI, GET_EDUCATION_DETAILS_URI, GET_EMPLOYEES_URI, GET_EMPLOYEE_BASED_ON_ID_URI, GET_GETFAMILYDETAILS_URI, GET_GETUPLOADEDDOCUMENTS_URI, GET_OFFICE_DETAILS_URI, GET_WORKEXPERIENCE_URI, UPDATE_EMPLOYEE_BASED_ON_ID_URI } from './api.uri.service';
import { BankDetailDto, EmployeAdressViewDto, EmployeeBasicDetailDto, EmployeeBasicDetailViewDto,EmployeeOfficedetailsviewDto,EmployeesViewDto } from '../_models/employes';

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

  //Bank Details of Employee
  public CreateBankDetails(bankdetails:BankDetailDto){
    return this.post<BankDetailDto>(CREATE_BANK_DETAILS_URI,bankdetails);
  }

  public GetViewEmpPersDtls(employeeId:number){
    return this.getWithId<EmployeeBasicDetailViewDto[]>(GET_EMPLOYEE_BASED_ON_ID_URI,[employeeId])
}
public EmployeeOfficedetailsviewDto(employeeId:number){
  return this.getWithId<EmployeeOfficedetailsviewDto[]>(GET_OFFICE_DETAILS_URI,[employeeId])
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
    debugger
    return this.post<EmployeeBasicDetailDto>(UPDATE_EMPLOYEE_BASED_ON_ID_URI, empBasicDtls);
}

}
