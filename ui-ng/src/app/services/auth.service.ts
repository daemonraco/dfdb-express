import { Injectable } from '@angular/core';
import { Http, /*Headers, RequestOptions, */Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';

declare var DFDBConfig;

@Injectable()
export class AuthService {
    constructor(private http: Http) {
    }

    public loginBasic(password: string): Observable<boolean> {
        const url: string = `${DFDBConfig.restUri}-auth/login`;
        return new Observable<boolean>((observer: Observer<boolean>) => {
            this.http.post(url, { password })
                .map(data => data.json())
                .subscribe(data => {
                    this.setToken(data.token);

                    observer.next(true);
                    observer.complete();
                }, error => {
                    observer.next(false);
                    observer.complete();
                });
        });
    }
    public loginCustom(token: string): Observable<boolean> {
        return new Observable<boolean>((observer: Observer<boolean>) => {
            this.setToken(token);

            observer.next(true);
            observer.complete();
        });
    }
    public logout(): void {
        this.setToken(null);
    }
    public token(): string | null {
        let aux = localStorage.getItem('token');
        return aux == 'null' ? null : aux;
    }

    protected setToken(token: string | null): void {
        localStorage.setItem('token', token);
    }
}
