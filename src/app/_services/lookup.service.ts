import { Injectable } from '@angular/core';
import { LookupViewDto } from '../_models/admin';
import { ApiHttpService } from './api.http.service';
import { LOOKUP_ASSET_CATEGORIES_URI, LOOKUP_ASSET_STATUS_URI, LOOKUP_ASSET_TYPE_URI, LOOKUP_BLOOD_GROUPS_URI, LOOKUP_RELATIONSHIP_URI, LOOKUP_STATES_URI } from './api.uri.service';

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

  public getStates() {
    return this.get<LookupViewDto[]>(LOOKUP_STATES_URI);
  }
  public BloodGroups(){
    return this.get<LookupViewDto[]>(LOOKUP_BLOOD_GROUPS_URI);
  }
  public Relationships(){
    return this.get<LookupViewDto[]>(LOOKUP_RELATIONSHIP_URI);
  }
}
