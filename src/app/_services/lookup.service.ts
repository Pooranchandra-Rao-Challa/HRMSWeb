import { Injectable } from '@angular/core';
import { LookupViewDto } from '../_models/admin';
import { ApiHttpService } from './api.http.service';
import { LOOKUP_DETAILS_URI, LOOKUP_NAMES_URI } from './api.uri.service';

@Injectable({
    providedIn: 'root'
})
export class LookupService extends ApiHttpService {
    public LookupNames() {
        return this.get<string[]>(LOOKUP_NAMES_URI);
    }
    public AssetTypes() {
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.AssetTypes]);
    }

    public AssetCategories() {
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.AssetCategories]);
    }

    public AssetStatus() {
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Status]);
    }

    public getStates(countryId?: number) {
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.States, countryId]);
    }

    public getCountries() {
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Countries]);
    }
    public BloodGroups() {
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.BloodGroups]);
    }
    public Relationships() {
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Relations]);
    }
}
