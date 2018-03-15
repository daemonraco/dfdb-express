import { Injectable } from '@angular/core';
import { Http, /*Headers, RequestOptions, */Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';

import { LastUrlService } from './last-url.service';

declare var DFDBConfig;

@Injectable()
export class ConnectionService {
    constructor(
        private luSrv: LastUrlService,
        private http: Http) {
    }

    public createCollection(name: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${name}/\$create`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url).map(data => data.json());
    }
    public info(): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/\$info`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url).map(data => data.json());
    }
}
