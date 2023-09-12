import { Injectable } from '@angular/core';
import { GET_EMPLOYEES_URI } from './api.uri.service';
import { EmployeesViewDto } from '../_models/employes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }
  
//Search Employee
  public GetEmployees(IsEnrolled: boolean) {
    let url = `${GET_EMPLOYEES_URI}`;
    if (IsEnrolled) {
      url += "?IsEnrolled=true";
    }
    return this.http.get<EmployeesViewDto[]>(url);
  }
  
}
