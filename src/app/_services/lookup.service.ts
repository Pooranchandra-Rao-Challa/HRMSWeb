import { Injectable } from '@angular/core';
import { LookupDetailsDto, LookupViewDto } from '../_models/admin';
import { ApiHttpService } from './api.http.service';
import { GET_DESIGNATION_URI, GET_SKILL_AREA_URI, LOOKUP_ASSET_CATEGORIES_URI, LOOKUP_ASSET_STATUS_URI, LOOKUP_ASSET_TYPE_URI, LOOKUP_BLOOD_GROUPS_URI, LOOKUP_CIRCULUM_URI, LOOKUP_COUNTRY_URI, LOOKUP_GRADING_SYSTEM_URI, LOOKUP_RELATIONSHIP_URI, LOOKUP_STATES_URI, LOOKUP_STREAM_URI } from './api.uri.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService  extends ApiHttpService{

  public AssetTypes() {
    return this.get<LookupViewDto[]>(LOOKUP_ASSET_TYPE_URI);
  }

  public AssetCategories() {
    return this.get<LookupViewDto[]>(LOOKUP_ASSET_CATEGORIES_URI);
  }

  public AssetStatus() {
    return this.get<LookupViewDto[]>(LOOKUP_ASSET_STATUS_URI);
  }
  public Country(){
    return this.get<LookupViewDto[]>(LOOKUP_COUNTRY_URI);
  }
  public getStates(lookupDetailId:number) {
    debugger
    return this.getWithId<LookupViewDto[]>(LOOKUP_STATES_URI,lookupDetailId);
  }
   public GetDesignation() {
    return this.get<LookupViewDto[]>(GET_DESIGNATION_URI);
  }
  public GetSkillArea() {
    return this.get<LookupViewDto[]>(GET_SKILL_AREA_URI);
  }
  public Circulum(){
    return this.get<LookupViewDto[]>(LOOKUP_CIRCULUM_URI);
  }

  public Stream(lookupDetailId:number){
    return this.getWithId<LookupViewDto[]>(LOOKUP_STREAM_URI,lookupDetailId);
  }
  public GradingMethods(){
    return this.get<LookupViewDto[]>(LOOKUP_GRADING_SYSTEM_URI);
  }
  public BloodGroups(){
    return this.get<LookupViewDto[]>(LOOKUP_BLOOD_GROUPS_URI);
  }
  public Relationships(){
    return this.get<LookupViewDto[]>(LOOKUP_RELATIONSHIP_URI);
  }
}
