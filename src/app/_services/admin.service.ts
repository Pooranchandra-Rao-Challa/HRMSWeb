import { Injectable } from '@angular/core';
import { AssetsDto, AssetsViewDto, HolidayDto, HolidaysViewDto, LookupViewDto, ProjectViewDto } from '../_models/admin';
import { AssetAllotmentDto, AssetAllotmentViewDto, AssetsByAssetTypeIdViewDto, RevokeAssetRequest } from '../_models/admin/assetsallotment';
import { ApiHttpService } from './api.http.service';
import {
    CREATE_ASSETS_URI, CREATE_HOLIDAY_URI, CREATE_LOOKUP_URI, GET_ASSETS_BY_ASSETTYPE_URI, GET_ASSETS_URI, GET_HOLIDAY_URI,
    GET_LOOKUP_URI, UPDATE_ASSETS_URI, UPDATE_LOOKUP_URI, CREATE_ASSET_ALLOTMENT_URI, GET_PROJECTS_URI, GET_ASSET_ALLOTMENTS_URI, UNASSIGNED_ASSET_ALLOTMENT_URI
} from './api.uri.service';
// import { CREATE_LOOKUP_URI } from './api.uri.service';
@Injectable({
    providedIn: 'root'
})
export class AdminService extends ApiHttpService {
    // lookup
    public GetLookUp(isbool) {
        return this.get<LookupViewDto[]>(GET_LOOKUP_URI + '/' + isbool);
    }
    public CreateLookUp(lookup: LookupViewDto) {
        return this.post<LookupViewDto>(CREATE_LOOKUP_URI, lookup);
    }
    public UpdateLookUp(lookup: LookupViewDto) {
        return this.post<LookupViewDto>(UPDATE_LOOKUP_URI, lookup);
    }
    // public GetlookupDetails(lookupId: number) {
    //     return this.getWithId<LookupViewDto[]>(GET_LOOKUP_DETAILS_URI, lookupId);
    // }

    public GetHolidays(year: string) {
        const url = `${GET_HOLIDAY_URI}${year}`;
        return this.get<HolidaysViewDto[]>(url);
    }

    public CreateHoliday(holidayDto: HolidayDto[]) {
        return this.post<HolidayDto>(CREATE_HOLIDAY_URI, holidayDto);
    }
    public UpdateHoliday(holiday: any) { //HolidayDto
        // return this.post<HolidayDto>(UPDATE_Holiday_URI, holiday);

    }

    public GetAssets() {
        return this.get<AssetsViewDto[]>(GET_ASSETS_URI);
    }

    public CreateAssets(assets: AssetsDto) {
        return this.post<AssetsDto>(CREATE_ASSETS_URI, assets);
    }

    public UpdateAssets(assets: AssetsDto) {
        return this.post<AssetsDto>(UPDATE_ASSETS_URI, assets);
    }

    // Assest Allotment

    public GetAssetsByAssetType(assetTypeId: number) {
        return this.getWithId<AssetsByAssetTypeIdViewDto[]>(GET_ASSETS_BY_ASSETTYPE_URI, assetTypeId);
    }

    public CreateAssetAllotment(assetAllotment: AssetAllotmentDto) {
        return this.post<AssetAllotmentDto>(CREATE_ASSET_ALLOTMENT_URI, assetAllotment);
    }
    public GetProjects() {
        return this.get<ProjectViewDto[]>(GET_PROJECTS_URI);
    }

    public GetAssetAllotments(employeeId: number) {
        return this.getWithId<AssetAllotmentViewDto[]>(GET_ASSET_ALLOTMENTS_URI, employeeId);
    }

    public UnassignAssetAllotment(revokeRequest: RevokeAssetRequest) {
        return this.post<RevokeAssetRequest>(UNASSIGNED_ASSET_ALLOTMENT_URI, revokeRequest);
    }

}
