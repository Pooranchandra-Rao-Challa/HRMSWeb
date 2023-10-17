import { Injectable } from '@angular/core';
import { LookupDetailsDto, LookupViewDto } from '../_models/admin';
import { ApiHttpService } from './api.http.service';
import { LOOKUP_DAYWORKSTATUS_URI, LOOKUP_DETAILS_URI, LOOKUP_NAMES_CONFIGURE_URI, LOOKUP_NAMES_NOT_CONFIGURE_URI, LOOKUP_NAMES_URI } from './api.uri.service';

@Injectable({
    providedIn: 'root'
})
export class LookupService extends ApiHttpService {
    public LookupNames() {
        return this.get<string[]>(LOOKUP_NAMES_URI);
    }
    public LookupNamesNotConfigured(lookupId?: number){
        return this.getWithParams<string[]>(LOOKUP_NAMES_NOT_CONFIGURE_URI,[lookupId]);
    }
    public LookupNamesConfigured(){
        return this.get<string[]>(LOOKUP_NAMES_CONFIGURE_URI);
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
    public DayWorkStatus(){
        console.log('DayWorkStatus');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI,[this.LookupKeys.DayWorkStatus]);
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
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Streams,lookupDetailId]);
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
    public isCountries(lookupId: number): boolean{
        return this.LookupKeys.Countries == lookupId;
    }

    public isCurriculums(lookupId: number): boolean{
        return this.LookupKeys.Curriculums == lookupId;
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
