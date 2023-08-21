import { Injectable } from '@angular/core';
import { LookUpHeaderDto, LookupViewDto } from '../_models/admin';
import { ApiHttpService } from './api.http.service';
import { CREATE_LOOKUP_URI, GET_LOOKUP_URI, UPDATE_LOOKUP_URI } from './api.uri.service';
// import { CREATE_LOOKUP_URI } from './api.uri.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiHttpService {
  // lookup
  public GetLookUp(isbool) {
    return this.get<LookupViewDto[]>(GET_LOOKUP_URI + isbool);
  }
  public CreateLookUp(lookup: LookUpHeaderDto) {
    return this.post<LookUpHeaderDto[]>(CREATE_LOOKUP_URI, lookup);
  }
  public UpdateLookUp(lookup: LookUpHeaderDto) {
    return this.post<LookUpHeaderDto[]>(UPDATE_LOOKUP_URI, lookup);
  }

  public getHolidays() {
    //return this.get<HglViewDto[]>(GET_Holiday_URI);
  }

   public CreateHoliday(holiday:any) { //HolidayDto 
    //return this.post<HolidayDto>(CREATE_Holiday_URI, holiday);
  }

  public UpdateHoliday(holiday:any) { //HolidayDto 
   // return this.post<HolidayDto>(UPDATE_Holiday_URI, holiday);

  }
}
