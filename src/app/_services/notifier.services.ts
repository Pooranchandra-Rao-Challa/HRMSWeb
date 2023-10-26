import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class DownloadNotification {
  private subject = new Subject<boolean>();

  sendData(invokePrint: boolean) {
    this.subject.next(invokePrint);
  }

  clearData() {
    this.subject.next(false);
  }

  getData(): Observable<boolean> {
    return this.subject.asObservable();
  }
}
