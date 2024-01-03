import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { GET_HOLIDAYS_REPORT, GET_LEAVES_REPORT, GET_ASSETS_REPORT,GET_MONTHLY_ATTENDANCE_REPORT, GET_PROJECTS_REPORT } from './api.uri.service';

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
  DownloadHolidays(year:number){
    return this.downloadExcel(GET_HOLIDAYS_REPORT,[year])
  }
  DownloadLeaves(year:number){
    return this.downloadExcel(GET_LEAVES_REPORT,[year])
  }

  DownloadAssets(assetsStatus:number){
    return this.downloadExcel(GET_ASSETS_REPORT,[assetsStatus])
  }
}
