import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class ModalConfirmData {
    active: boolean = false;
    callback: (decision: boolean) => void = null;
    message: string[] = [];
    title: string = '';
}

@Injectable()
export class ModalConfirmService {
    protected _dataSource: BehaviorSubject<ModalConfirmData> = new BehaviorSubject<ModalConfirmData>(new ModalConfirmData());
    protected _currentData: any = this._dataSource.asObservable();

    constructor() {
    }

    public confirm(message: string | string[], callback: (decision: boolean) => void, title: string = null) {
        const data: ModalConfirmData = new ModalConfirmData();

        data.active = true;
        data.title = title;
        data.callback = callback;
        data.message = Array.isArray(message) ? message : [message];

        this._dataSource.next(data);
    }
    public currentData(): any {
        return this._currentData;
    }
    public hide() {
        const data: ModalConfirmData = new ModalConfirmData();

        data.active = false;
        data.title = null;
        data.message = null;
        data.callback = null;

        this._dataSource.next(data);
    }
}