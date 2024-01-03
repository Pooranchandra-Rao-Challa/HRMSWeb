import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { GET_ASSETS_REPORT, GET_MONTHLY_ATTENDANCE_REPORT } from './api.uri.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService  extends ApiHttpService{

  DownloadMonthlyAttendanceReport(month: number,year:number){
   return this.downloadExcel(GET_MONTHLY_ATTENDANCE_REPORT,[month,year])
  }

  DownloadAssets(assetsStatus:number){
    return this.downloadExcel(GET_ASSETS_REPORT,[assetsStatus])
  }
}
