import { Injectable } from '@angular/core';
import { Http, /*Headers, RequestOptions, */Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';

import { LastUrlService } from './last-url.service';

declare var DFDBConfig;

@Injectable()
export class CollectionService {
    constructor(
        private luSrv: LastUrlService,
        private http: Http) {
    }

    public delete(collectionName: string, id: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/${id}`;
        this.luSrv.setUrl(url, 'delete');
        return this.http.delete(url).map(data => data.json());
    }
    public get(collectionName: string, filter: any, simple: boolean = false): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}?query=${encodeURI(JSON.stringify(filter))}${simple ? '&simple' : ''}`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url).map(data => data.json());
    }
    public getByIt(collectionName: string, id: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/${id}`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url).map(data => data.json());
    }
    public postData(collectionName: string, data: any): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}`;
        this.luSrv.setUrl(url, 'post');
        return this.http.post(url, data).map(data => data.json());
    }
    public putData(collectionName: string, id: string, data: any, partial: boolean = true): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/${id}${partial ? '?partial' : ''}`;
        this.luSrv.setUrl(url, 'put');
        return this.http.put(url, data).map(data => data.json());
    }
    public schema(collectionName: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/\$schema`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url).map(data => data.json());
    }
    public setSchema(collectionName: string, schema: any): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/\$schema`;
        this.luSrv.setUrl(url, 'put');
        return this.http.put(url, schema).map(data => data.json());
    }
}
