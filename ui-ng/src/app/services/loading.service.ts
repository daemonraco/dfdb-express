import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class LoadingData {
    public active: boolean = false;
    public message: string = null;
}

@Injectable()
export class LoadingService {
    protected _data: BehaviorSubject<LoadingData> = new BehaviorSubject<LoadingData>(new LoadingData());

    constructor() {
    }

    public data(): BehaviorSubject<LoadingData> {
        return this._data;
    }
    public hide(): void {
        const aux: LoadingData = new LoadingData();
        aux.active = false;
        aux.message = null;

        this._data.next(aux);
    }
    public show(message: string = 'Loading...'): void {
        const aux: LoadingData = new LoadingData();
        aux.active = true;
        aux.message = message;

        this._data.next(aux);
    }
}