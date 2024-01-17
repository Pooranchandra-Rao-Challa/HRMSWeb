import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { adminDashboardViewDto, NotificationsDto,AttendanceCountBasedOnTypeViewDto, SelfEmployeeDto, selfEmployeeMonthlyLeaves, EmployeesofAttendanceCountsViewDto } from '../_models/dashboard';
import { GET_ADMIN_DASHBOARD, GET_ALLOTED_LEAVES, GET_NOTIFICATIONS, GET_NOTIFICATION_REPLIES, GET_ATTENDANCE_COUNT_BASED_ON_TYPE, GET_SELF_EMPLOYEE, GET_SELF_EMPLOYEE_MONTH_LEAVES, GET_EMPLOYEES_OF_ATTENDANCE_COUNT } from './api.uri.service';

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
    public GetAttendanceCountBasedOnType(datatype:string,value:any){
        return this.getWithParams<AttendanceCountBasedOnTypeViewDto>(GET_ATTENDANCE_COUNT_BASED_ON_TYPE,[datatype,value])
    }
    public GetEmployeeAttendanceCount(datatype:string,value:any,dayworkstatus:number){
        return this.getWithParams<EmployeesofAttendanceCountsViewDto>(GET_EMPLOYEES_OF_ATTENDANCE_COUNT,[datatype,value,dayworkstatus])
    }
    public GetNotifications(isactive:boolean){
        return this.getWithParams<NotificationsDto>(GET_NOTIFICATIONS,[isactive]);
    }
    public GetNotificationsBasedOnId(isActive:boolean,employeeId:number){
        return this.getWithParams(GET_NOTIFICATION_REPLIES,[isActive,employeeId]);
    }

}
