import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { LastUrlService } from './last-url.service';

declare var DFDBConfig;

@Injectable()
export class ConnectionService {
    constructor(
        private authSrv: AuthService,
        private luSrv: LastUrlService,
        private http: Http) {
    }

    public createCollection(name: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${name}/\$create`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url, this.headers()).map(data => data.json());
    }
    public dropCollection(name: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${name}/\$drop`;
        this.luSrv.setUrl(url, 'delete');
        return this.http.delete(url, this.headers()).map(data => data.json());
    }
    public info(): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/\$info`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url, this.headers()).map(data => data.json());
    }

    protected headers(): RequestOptions {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const token = this.authSrv.token();
        if (token) {
            headers['Authorization'] = token;
        }

        return new RequestOptions({
            headers: new Headers(headers)
        });
    }
}
