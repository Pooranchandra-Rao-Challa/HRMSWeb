import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { adminDashboardViewDto, SelfEmployeeDto, selfEmployeeMonthlyLeaves } from '../_models/dashboard';
import { GET_ADMIN_DASHBOARD, GET_ALLOTED_LEAVES, GET_SELF_EMPLOYEE, GET_SELF_EMPLOYEE_MONTH_LEAVES } from './api.uri.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends ApiHttpService {

    public GetEmployeeDetails(employeeId: number) {
        return this.getWithId<SelfEmployeeDto>(GET_SELF_EMPLOYEE, [employeeId])
    }
    public GetAllottedLeavesBasedOnEId(employeeId:number,month:number,year:number){
        return this.getWithParams<SelfEmployeeDto>(GET_ALLOTED_LEAVES,[employeeId,month,year]);
    }
    public GetEmployeeLeavesForMonth(month: number, empId: number,year:number) {
        return this.getWithParams<selfEmployeeMonthlyLeaves>(GET_SELF_EMPLOYEE_MONTH_LEAVES ,[month ,empId,year]);
    }
    public getAdminDashboard() {
        return this.get<adminDashboardViewDto>(GET_ADMIN_DASHBOARD);
    }
}
