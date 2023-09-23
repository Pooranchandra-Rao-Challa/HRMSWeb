import { Injectable } from '@angular/core';
import { LookupDetailsDto, LookupViewDto } from '../_models/admin';
import { ApiHttpService } from './api.http.service';
import { LOOKUP_DETAILS_URI, LOOKUP_NAMES_URI } from './api.uri.service';
import { LOOKUP_ASSET_STATUS_URI, LOOKUP_ASSET_TYPE_URI, LOOKUP_BLOOD_GROUPS_URI,LOOKUP_COUNTRY_URI, LOOKUP_CURRICULUM_URI, LOOKUP_GRADING_SYSTEM_URI, LOOKUP_RELATIONSHIP_URI, LOOKUP_STATES_URI, LOOKUP_STREAM_URI } from './api.uri.service';

@Injectable({
    providedIn: 'root'
})
export class LookupService extends ApiHttpService {
    public LookupNames() {
        return this.get<string[]>(LOOKUP_NAMES_URI);
    }
    public AssetTypes() {
        console.log('AssetTypes');

        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.AssetTypes]);
    }

    public AssetCategories() {
        console.log('AssetCategories');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.AssetCategories]);
    }

    public AssetStatus() {
        console.log('AssetStatus');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Status]);
    }

    public States(countryId?: number) {
        console.log('States');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.States, countryId]);
    }

    public Countries() {
        console.log('Countries');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Countries]);
    }
    public BloodGroups() {
        console.log('BloodGroups');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.BloodGroups]);
    }
    public Relationships() {
        console.log('Relationships');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Relations]);
    }
    public Curriculums() {
        console.log('Curriculums');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Curriculums]);
    }

    public Streams(lookupDetailId: number) {
        console.log('Streams');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Stream,lookupDetailId]);
        //return this.getWithId<LookupViewDto[]>(LOOKUP_STREAM_URI, lookupDetailId);
    }
    public GradingMethods() {
        console.log('GradingMethods');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.GradingMethods]);
        //return this.get<LookupViewDto[]>(LOOKUP_GRADING_SYSTEM_URI);
    }

    public Designations() {
        console.log('Designations');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Designations]);
        //return this.get<LookupViewDto[]>(GET_DESIGNATION_URI);
    }
    public SkillAreas() {
        console.log('SkillAreas');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.SkillAreas]);
        //return this.get<LookupViewDto[]>(GET_SKILL_AREA_URI);
    }

    // public AssetStatus() {
    //     return this.get<LookupViewDto[]>(LOOKUP_ASSET_STATUS_URI);
    // }
    // public Country() {
    //     return this.get<LookupViewDto[]>(LOOKUP_COUNTRY_URI);
    // }
    // public getStates(lookupDetailId: number) {
    //     return this.getWithId<LookupViewDto[]>(LOOKUP_STATES_URI, lookupDetailId);
    // }
    // public GetDesignation() {
    //     return this.get<LookupViewDto[]>(GET_DESIGNATION_URI);
    // }
    // public GetSkillArea() {
    //     return this.get<LookupViewDto[]>(GET_SKILL_AREA_URI);
    // }

    // public BloodGroups() {
    //     return this.get<LookupViewDto[]>(LOOKUP_BLOOD_GROUPS_URI);
    // }
    // public Relationships() {
    //     return this.get<LookupViewDto[]>(LOOKUP_RELATIONSHIP_URI);
    // }
}
