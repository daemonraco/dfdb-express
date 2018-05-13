import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { AuthService, LastUrlService } from '../services';

declare var DFDBConfig;

@Injectable()
export class CollectionService {
    constructor(
        private authSrv: AuthService,
        private luSrv: LastUrlService,
        private http: Http) {
    }

    public createFieldIndex(collectionName: string, field: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/$createIndex?field=${field}`;
        this.luSrv.setUrl(url, 'post');
        return this.http.post(url, {}, this.headers()).map(data => data.json());
    }
    public delete(collectionName: string, id: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/${id}`;
        this.luSrv.setUrl(url, 'delete');
        return this.http.delete(url, this.headers()).map(data => data.json());
    }
    public deleteMany(collectionName: string, filter: any): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/$many?query=${encodeURI(JSON.stringify(filter))}`;
        this.luSrv.setUrl(url, 'delete');
        return this.http.delete(url, this.headers()).map(data => data.json());
    }
    public dropFieldIndex(collectionName: string, field: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/$dropIndex?field=${field}`;
        this.luSrv.setUrl(url, 'delete');
        return this.http.delete(url, this.headers()).map(data => data.json());
    }
    public get(collectionName: string, filter: any, simple: boolean = false): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}?query=${encodeURI(JSON.stringify(filter))}${simple ? '&simple' : ''}`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url, this.headers()).map(data => data.json());
    }
    public getById(collectionName: string, id: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/${id}`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url, this.headers()).map(data => data.json());
    }
    public indexes(collectionName: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/$indexes`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url, this.headers()).map(data => data.json());
    }
    public postData(collectionName: string, data: any): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}`;
        this.luSrv.setUrl(url, 'post');
        return this.http.post(url, data, this.headers()).map(data => data.json());
    }
    public putData(collectionName: string, id: string, data: any, partial: boolean = true): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/${id}${partial ? '?partial' : ''}`;
        this.luSrv.setUrl(url, 'put');
        return this.http.put(url, data, this.headers()).map(data => data.json());
    }
    public schema(collectionName: string): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/\$schema`;
        this.luSrv.setUrl(url, 'get');
        return this.http.get(url, this.headers()).map(data => data.json());
    }
    public setSchema(collectionName: string, schema: any): Observable<any> {
        const url: string = `${DFDBConfig.restUri}/${collectionName}/\$schema`;
        this.luSrv.setUrl(url, 'put');
        return this.http.put(url, schema, this.headers()).map(data => data.json());
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
