import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ChartParams, NodeDropParams } from 'src/app/_models/admin'

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

@Injectable({
    providedIn: 'root'
})
export class ProjectNotification {
    private subject = new Subject<number>();

    sendSelectedProjectId(projectId: number) {
        this.subject.next(projectId);
    }

    getSelectedProjectId(): Observable<number> {
        return this.subject.asObservable();
    }
}



@Injectable({
    providedIn: 'root'
})
export class OrgChartDataNotification {
    private subject = new Subject<ChartParams>();

    sendNodes(nodes: ChartParams) {
        this.subject.next(nodes);
    }

    getNodes(): Observable<ChartParams> {
        return this.subject.asObservable();
    }
}


@Injectable({
    providedIn: 'root'
})
export class NodeDropNotifier {
    private subject = new Subject<NodeDropParams>();

    sendDropNodes(nodes: NodeDropParams) {
        this.subject.next(nodes);
    }

    getDropNodes(): Observable<NodeDropParams> {
        return this.subject.asObservable();
    }
}
