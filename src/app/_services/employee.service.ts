import { Injectable } from '@angular/core';
import { CREATE_BASIC_DETAILS_URI, GET_EMPLOYEES_URI, GET_EMPLOYEE_BASED_ON_ID_URI, GET_OFFICE_DETAILS_URI } from './api.uri.service';
import { EmployeeBasicDetailDto, EmployeeBasicDetailViewDto, EmployeeOfficedetailsviewDto, EmployeesViewDto } from '../_models/employes';
import { HttpClient } from '@angular/common/http';
import { ApiHttpService } from './api.http.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends ApiHttpService{

  
  //Search Employee
  public GetEmployees(IsEnrolled: boolean) {
    const url = `${GET_EMPLOYEES_URI}/${IsEnrolled}`;
    return this.get<EmployeesViewDto[]>(url);
  }

  //Persnal Details of Employee
  public CreateBasicDetails(basicdetails: EmployeeBasicDetailDto){
    return this.post<EmployeeBasicDetailDto>(CREATE_BASIC_DETAILS_URI, basicdetails);

  }

  public GetViewEmpPersDtls(employeeId:number){
    return this.getWithId<EmployeeBasicDetailViewDto[]>(GET_EMPLOYEE_BASED_ON_ID_URI,[employeeId])
}
public EmployeeOfficedetailsviewDto(employeeId:number){
  return this.getWithId<EmployeeOfficedetailsviewDto[]>(GET_OFFICE_DETAILS_URI,[employeeId])
}


}
