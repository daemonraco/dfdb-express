import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
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
    //
    // Public methods.
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
    public info(options: { [name: string]: any } = {}): Observable<any> {
        let params = new URLSearchParams();
        for (let key in options) {
            params.set(key, options[key]);
        }

        const url: string = `${DFDBConfig.restUri}/\$info?${params.toString()}`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url, this.headers()).map(data => data.json());
    }
    public reinitialize(): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/$reinitialize`;
        this.luSrv.setUrl(url, 'post');
        return this.http.post(url, {}, this.headers()).map(data => data.json());
    }
    public setInitializer(data: any): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/$initializer`;
        this.luSrv.setUrl(url, 'post');
        return this.http.post(url, data, this.headers()).map(data => data.json());
    }
    public truncateCollection(name: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${name}/\$truncate`;
        this.luSrv.setUrl(url, 'post');
        return this.http.post(url, this.headers()).map(data => data.json());
    }
    //
    // Protected methods.
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
