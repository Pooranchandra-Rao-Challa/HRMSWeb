import { Injectable } from '@angular/core';
import { LookupViewDto } from '../_models/admin';
import { ApiHttpService } from './api.http.service';
import { LOOKUP_DETAILS_URI, LOOKUP_NAMES_CONFIGURE_URI, LOOKUP_NAMES_NOT_CONFIGURE_URI, LOOKUP_NAMES_URI } from './api.uri.service';

@Injectable({
    providedIn: 'root'
})
export class LookupService extends ApiHttpService {
    public LookupNames() {
        return this.get<string[]>(LOOKUP_NAMES_URI);
    }
    public LookupNamesNotConfigured(lookupId?: number) {
        return this.getWithParams<string[]>(LOOKUP_NAMES_NOT_CONFIGURE_URI, [lookupId]);
    }
    public LookupNamesConfigured() {
        return this.get<string[]>(LOOKUP_NAMES_CONFIGURE_URI);
    }
    public AssetTypes(assetCategoriesId: number) {
        console.log('AssetTypes');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.AssetTypes, assetCategoriesId]);
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
    public DayWorkStatus() {
        console.log('DayWorkStatus');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.DayWorkStatus]);
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
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Streams, lookupDetailId]);
    }
    public GradingMethods() {
        console.log('GradingMethods');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.GradingMethods]);
    }

    public Designations() {
        console.log('Designations');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.Designations]);
    }
    public SkillAreas() {
        console.log('SkillAreas');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.SkillAreas]);
    }
    public SoftSkills() {
        console.log('SoftSkills');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.SoftSkills]);
    }
    public NatureOfJobs() {
        console.log('NatureOfJobs');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [this.LookupKeys.NatureOfJob])
    }

    public LookupDetailsForSelectedDependent(dependentId: number) {
        console.log('Dependents');
        return this.getWithParams<LookupViewDto[]>(LOOKUP_DETAILS_URI, [dependentId])
    }
}
