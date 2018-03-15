import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class LastUrlData {
    public method: string = null;
    public url: string = null;
}

@Injectable()
export class LastUrlService {
    protected _urlSource: BehaviorSubject<LastUrlData> = new BehaviorSubject<LastUrlData>(new LastUrlData());
    protected _currentUrl: any = this._urlSource.asObservable();

    constructor() {
    }

    public currentUrl(): any {
        return this._currentUrl;
    }
    public setUrl(url: string, method: string = null) {
        const aux: LastUrlData = new LastUrlData();
        aux.url = url;
        aux.method = method.toLowerCase();

        this._urlSource.next(aux);
    }
}