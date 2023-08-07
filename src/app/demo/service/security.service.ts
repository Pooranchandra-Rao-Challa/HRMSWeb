import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assets, Employee, Leave, LookUpHeaderDto, ProjectDetailsDto, RoleViewDto } from '../api/security';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {
    // getEmp= 'https://localhost:4200/assets/demo/data/security.json/';

    constructor(private http: HttpClient) { }
    getEmployees() {
        return this.http
            .get<any>('assets/demo/data/security.json')
            .toPromise()
            .then((res: { employee: Employee[]; }) => res.employee as Employee[])
            .then((data: any) => data);
    }
    getRoles() {
        return this.http.get<any>('assets/demo/data/security.json')
            .toPromise()
            .then((res: { roles: RoleViewDto[]; }) => res.roles as RoleViewDto[])
            .then((data: any) => data);
    }
    getlookup() {
        return this.http.get<any>('assets/demo/data/security.json').toPromise()
            .then((res: { lookup: LookUpHeaderDto[]; }) => res.lookup as LookUpHeaderDto[])
            .then((data: any) => data);
    }
    getleaves() {
        return this.http.get<any>('assets/demo/data/security.json')
            .toPromise()
            .then((res: { leave: Leave[]; }) => res.leave as Leave[])
            .then((data: any) => data);
    }
    getassets() {
        return this.http.get<any>('assets/demo/data/security.json')
            .toPromise()
            .then((res: { assets: Assets[]; }) => res.assets as Assets[])
            .then((data: any) => data);
    }

    getprojects(){
        return this.http.get<any>('assets/demo/data/security.json').toPromise()
        .then((res: { project: ProjectDetailsDto[];}) => res.project as ProjectDetailsDto[])
        .then((data: any) => data);
    
      }
}