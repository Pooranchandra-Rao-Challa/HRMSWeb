import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { adminDashboardViewDto, NotificationsDto,AttendanceCountBasedOnTypeViewDto, SelfEmployeeDto, selfEmployeeMonthlyLeaves, EmployeesofAttendanceCountsViewDto, NotificationsRepliesDto, HrNotification } from '../_models/dashboard';
import { GET_ADMIN_DASHBOARD, GET_ALLOTED_LEAVES, GET_NOTIFICATIONS, GET_NOTIFICATION_REPLIES, GET_ATTENDANCE_COUNT_BASED_ON_TYPE, GET_SELF_EMPLOYEE, GET_SELF_EMPLOYEE_MONTH_LEAVES, GET_EMPLOYEES_OF_ATTENDANCE_COUNT, POST_BIRTHDAY_WISHES, POST_HR_NOTIFICATIONS, GET_ADMIN_SETTINGS, UPDATE_ADMIN_SETTINGS, DELETE_NOTIFICATION } from './api.uri.service';

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
    public GetNotifications(){
        return this.get<NotificationsDto>(GET_NOTIFICATIONS);
    }
    public GetNotificationsBasedOnId(employeeId:number){
        return this.getWithParams<NotificationsRepliesDto>(GET_NOTIFICATION_REPLIES,[employeeId]);
    }
    public sendBithdayWishes(wishes){
        return this.post<NotificationsRepliesDto>(POST_BIRTHDAY_WISHES,wishes);
    }
    public CreateHRNotification(data){
        return this.post<HrNotification>(POST_HR_NOTIFICATIONS,data);
    }
    public DeleteNotfication(id:number){
        return this.getWithId(DELETE_NOTIFICATION,id)
    }
    public GetAdminSettings(){
        return this.get(GET_ADMIN_SETTINGS);
    }
    public updateAdminSettings(body:any){
        return this.post(UPDATE_ADMIN_SETTINGS,body)
    }
    

}
