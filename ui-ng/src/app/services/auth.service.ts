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
    public logout(): void {
        this.setToken(null);
    }
    public token(): string {
        return localStorage.getItem('token');
    }

    protected setToken(token: string): void {
        localStorage.setItem('token', token);
    }
}
