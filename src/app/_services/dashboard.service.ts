import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { SelfEmployeeDto, selfEmployeeMonthlyLeaves } from '../_models/dashboard';
import { GET_SELF_EMPLOYEE, GET_SELF_EMPLOYEE_MONTH_LEAVES } from './api.uri.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends ApiHttpService { 

    public GetEmployeeDetails(employeeId: number) {
        return this.get<SelfEmployeeDto>(GET_SELF_EMPLOYEE+"/"+employeeId)
      }
    public GetEmployeeLeavesForMonth(month:number,empId:number)  {
        return this.get<selfEmployeeMonthlyLeaves>(GET_SELF_EMPLOYEE_MONTH_LEAVES+"/"+month+"/"+empId);
    }
}
