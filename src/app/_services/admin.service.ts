import { Injectable } from '@angular/core';
import { AssetsDto, AssetsViewDto, HolidayDto, HolidaysViewDto, LookupDetailViewDto, LookUpHeaderDto, LookupViewDto } from '../_models/admin';
import { ApiHttpService } from './api.http.service';
import { CREATE_ASSESTS_URI, CREATE_HOLIDAY_URI, CREATE_LOOKUP_URI, GET_ASSETS_URI, GET_HOLIDAY_URI, GET_LOOKUP_DETAILS_URI, GET_LOOKUP_URI, UPDATE_ASSESTS_URI, UPDATE_LOOKUP_URI } from './api.uri.service';
// import { CREATE_LOOKUP_URI } from './api.uri.service';
@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiHttpService {
  // lookup
  public GetLookUp(isbool) {
    return this.get<LookupViewDto[]>(GET_LOOKUP_URI+'/' + isbool);
  }
  public CreateLookUp(lookup: LookUpHeaderDto) {
    return this.post<LookUpHeaderDto>(CREATE_LOOKUP_URI, lookup );
  }
  public UpdateLookUp(lookup: LookUpHeaderDto) {
    return this.post<LookUpHeaderDto>(UPDATE_LOOKUP_URI, lookup);
  }
  public GetlookupDetails(lookupId: number) {
    return this.getWithId<LookupDetailViewDto[]>(GET_LOOKUP_DETAILS_URI,lookupId);
  }

  public GetHolidays(year: string) {
    const url = `${GET_HOLIDAY_URI}${year}`;
    return this.get<HolidaysViewDto[]>(url);
  }

  public CreateHoliday(holidayDto:HolidayDto[]) {
    return this.post<HolidayDto>(CREATE_HOLIDAY_URI, holidayDto);
  }
  public UpdateHoliday(holiday:any) { //HolidayDto 
   // return this.post<HolidayDto>(UPDATE_Holiday_URI, holiday);

  }

  public GetAssets(){
    return this.get<AssetsViewDto[]>(GET_ASSETS_URI);
}

public CreateAssets(assets: AssetsDto) {
  return this.post<AssetsDto>(CREATE_ASSESTS_URI, assets);
}

public UpdateAssets(assets: AssetsDto) {
  return this.post<AssetsDto>(UPDATE_ASSESTS_URI, assets);
}
 
}
