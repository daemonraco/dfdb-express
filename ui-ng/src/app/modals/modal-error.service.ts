import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class ModalErrorData {
    active: boolean = false;
    message: string[] = [];
    title: string = '';
}

@Injectable()
export class ModalErrorService {
    protected _dataSource: BehaviorSubject<ModalErrorData> = new BehaviorSubject<ModalErrorData>(new ModalErrorData());

    constructor() {
    }

    public currentData(): BehaviorSubject<ModalErrorData> {
        return this._dataSource;
    }
    public hide() {
        const data: ModalErrorData = new ModalErrorData();

        data.active = false;
        data.title = null;
        data.message = null;

        this._dataSource.next(data);
    }
    public show(message: string | string[], title: string = null) {
        const data: ModalErrorData = new ModalErrorData();

        data.active = true;
        data.title = title;
        data.message = Array.isArray(message) ? message : [message];

        this._dataSource.next(data);
    }
}