import { Injectable } from '@angular/core';
import { LookUpHeaderDto } from '../_models/admin';
import { ApiHttpService } from './api.http.service';
// import { CREATE_LOOKUP_URI } from './api.uri.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiHttpService {
  GetlookupDetails(lookupId: number) {
    throw new Error('Method not implemented.');
  }
  Updatelookup(value: any): import("rxjs").Observable<import("@angular/common/http").HttpEvent<LookUpHeaderDto>> {
    throw new Error('Method not implemented.');
  }
  public Createlookup() {
    // return this.get<LookUpHeaderDto[]>(CREATE_LOOKUP_URI);
  }
}
