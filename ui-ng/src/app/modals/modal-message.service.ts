import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class ModalMessageData {
    active: boolean = false;
    large: boolean = false;
    message: string[] = [];
    title: string = '';
}

@Injectable()
export class ModalMessageService {
    protected _dataSource: BehaviorSubject<ModalMessageData> = new BehaviorSubject<ModalMessageData>(new ModalMessageData());

    constructor() {
    }

    public currentData(): BehaviorSubject<ModalMessageData> {
        return this._dataSource;
    }
    public hide() {
        const data: ModalMessageData = new ModalMessageData();

        data.active = false;
        data.title = null;
        data.message = null;
        data.large = false;

        this._dataSource.next(data);
    }
    public show(message: string | string[], title: string = null, large: boolean = false) {
        const data: ModalMessageData = new ModalMessageData();

        data.active = true;
        data.title = title;
        data.message = Array.isArray(message) ? message : [message];
        data.large = large;

        this._dataSource.next(data);
    }
}