import { Injectable } from '@angular/core';
import { ApiHttpService } from './api.http.service';
import { SelfEmployeeDto } from '../_models/dashboard';
import { GET_SELF_EMPLOYEE } from './api.uri.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends ApiHttpService { 

    public GetEmployeeDetails(employeeId: number) {
        console.log(employeeId);
        
        return this.get<SelfEmployeeDto>(GET_SELF_EMPLOYEE+"/"+employeeId)
      }
}
