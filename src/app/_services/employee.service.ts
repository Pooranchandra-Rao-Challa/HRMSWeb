import { Injectable } from '@angular/core';
import { CREATE_BANK_DETAILS_URI, CREATE_BASIC_DETAILS_URI, GET_EMPLOYEES_URI, GET_EMPLOYEE_BASED_ON_ID_URI } from './api.uri.service';
import { BankDetailDto, EmployeeBasicDetailDto, EmployeeBasicDetailViewDto,EmployeesViewDto } from '../_models/employes';
import { HttpClient } from '@angular/common/http';
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
  public GetViewEmpPersDtls(employeeId: number) {
    return this.getWithId<EmployeeBasicDetailViewDto[]>(GET_EMPLOYEE_BASED_ON_ID_URI, [employeeId])
  }


}
