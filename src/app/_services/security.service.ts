import { Injectable } from '@angular/core';
import { UserViewDto } from '../_models/security';
import { ApiHttpService } from "./api.http.service";
import { GET_USERS_URI } from './api.uri.service';


@Injectable({
  providedIn: 'root'
})
export class SecurityService extends ApiHttpService {
 
  public GetUsers() {
    return this.get<UserViewDto[]>(GET_USERS_URI);
  }
}
