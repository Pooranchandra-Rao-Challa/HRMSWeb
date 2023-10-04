import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export abstract class Unsubscribe {
    unsubscribe$ = new Subject<void>();

    ngOnDestroy() {
        debugger
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
