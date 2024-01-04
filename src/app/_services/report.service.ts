import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { GET_HOLIDAYS_REPORT, GET_LEAVES_REPORT, GET_ASSETS_REPORT,GET_MONTHLY_ATTENDANCE_REPORT, GET_PROJECTS_REPORT, GET_ACTIVE_EMPLOYEES_REPORT, GET_PROJECT_ALLOTMENTS_REPORT, GET_EMPLOYEE_LEAVES_REPORT,GET_ALL_EMPLOYEES_REPORT } from './api.uri.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends ApiHttpService {

  DownloadMonthlyAttendanceReport(month: number, year: number) {
    return this.downloadExcel(GET_MONTHLY_ATTENDANCE_REPORT, [month, year])
  }
  DownloadProjects() {
    return this.downloadExcel(GET_PROJECTS_REPORT, [0])
  }
  DownloadProjectsAllotments(id:number){
    return this.downloadExcel(GET_PROJECT_ALLOTMENTS_REPORT,[id])
  }
  DownloadHolidays(year:number){
    return this.downloadExcel(GET_HOLIDAYS_REPORT,[year])
  }
  DownloadEmployeeLeaves(month:number,year:number){
    return this.downloadExcel(GET_EMPLOYEE_LEAVES_REPORT,[month,year])
  }
  DownloadLeaves(year:number){
    return this.downloadExcel(GET_LEAVES_REPORT,[year])
  }

  DownloadAssets(assetsStatus: number) {
    return this.downloadExcel(GET_ASSETS_REPORT, [assetsStatus])
  }
  DownloadEmployees(employeeStatus: boolean) {
    if (employeeStatus == null) {
      return this.downloadExcel(GET_ALL_EMPLOYEES_REPORT, [])
    }
    return this.downloadExcel(GET_ACTIVE_EMPLOYEES_REPORT, [employeeStatus])
  }
}
