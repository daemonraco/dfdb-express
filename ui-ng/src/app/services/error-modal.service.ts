import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class ErrorModalData {
    active: boolean = false;
    message: string[] = [];
    title: string = '';
}

@Injectable()
export class ErrorModalService {
    protected _dataSource: BehaviorSubject<ErrorModalData> = new BehaviorSubject<ErrorModalData>(new ErrorModalData());
    protected _currentData: any = this._dataSource.asObservable();

    constructor() {
    }

    public currentData(): any {
        return this._currentData;
    }
    public hide() {
        const data: ErrorModalData = new ErrorModalData();

        data.active = false;
        data.title = null;
        data.message = null;

        this._dataSource.next(data);
    }
    public show(message: string | string[], title: string = null) {
        const data: ErrorModalData = new ErrorModalData();

        data.active = true;
        data.title = title;
        data.message = Array.isArray(message) ? message : [message];

        this._dataSource.next(data);
    }
}