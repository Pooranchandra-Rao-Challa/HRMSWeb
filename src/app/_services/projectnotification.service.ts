import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectNotification {
  private subject = new Subject<number>();

  sendSelectedProjectId(projectId: number){
    this.subject.next(projectId);
  }

  getSelectedProjectId(): Observable<number>  {
    return this.subject.asObservable();
  }}
