import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { GET_ACTIVE_EMPLOYEES_REPORT, GET_ASSETS_REPORT, GET_MONTHLY_ATTENDANCE_REPORT, GET_PROJECTS_REPORT } from './api.uri.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends ApiHttpService {

  DownloadMonthlyAttendanceReport(month: number, year: number) {
    return this.downloadExcel(GET_MONTHLY_ATTENDANCE_REPORT, [month, year])
  }
  DownloadProjects() {
   return this.downloadExcel(GET_PROJECTS_REPORT,[0])
  }

  DownloadAssets(assetsStatus:number){
    return this.downloadExcel(GET_ASSETS_REPORT,[assetsStatus])
  }
  DownloadEmployees(employeeStatus:boolean){
    return this.downloadExcel(GET_ACTIVE_EMPLOYEES_REPORT,[employeeStatus])
  }
}
