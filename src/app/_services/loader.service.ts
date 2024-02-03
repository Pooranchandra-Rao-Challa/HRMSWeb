import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    private loading = new Subject<boolean>();

    constructor() { }
    public InitiateLoading(){
        console.log('loading started');

        this.loading.next(true);
    }

    public StopLoading(){

        console.log('loading stopped');
        this.loading.next(false);
    }

    public BroadcastLoading(): Observable<boolean> {
        return this.loading.asObservable();
    }
}
