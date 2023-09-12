import { Injectable } from '@angular/core';
import { CREATE_BASIC_DETAILS_URI, GET_EMPLOYEES_URI } from './api.uri.service';
import { EmployeeBasicDetailDto, EmployeesViewDto } from '../_models/employes';
import { HttpClient } from '@angular/common/http';
import { ApiHttpService } from './api.http.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends ApiHttpService{

  
//Search Employee
  public GetEmployees(IsEnrolled: boolean) {
    let url = `${GET_EMPLOYEES_URI}`;
    if (IsEnrolled) {
      url += "?IsEnrolled=true";
    }
    return this.get<EmployeesViewDto[]>(url);
  }
  //Persnal Details of Employee
  public CreateBasicDetails(basicdetails: EmployeeBasicDetailDto){
    return this.post<EmployeeBasicDetailDto>(CREATE_BASIC_DETAILS_URI, basicdetails);

  }
}
