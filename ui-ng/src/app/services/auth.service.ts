import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';

declare var DFDBConfig;

@Injectable()
export class AuthService {
    protected _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    constructor(private http: Http) {
        this.broadcastStatus();
    }
    //
    // Public methods.
    public hasLogin(): boolean {
        return DFDBConfig.authType !== 'none';
    }
    public isLoggedIn(): boolean {
        return this.token() !== null;
    }
    public loggedIn(): BehaviorSubject<boolean> {
        return this._loggedIn;
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
                    this.broadcastStatus();

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
    //
    // Protected methods.
    protected broadcastStatus(): void {
        this._loggedIn.next(this.isLoggedIn());
    }
    protected setToken(token: string | null): void {
        localStorage.setItem('token', token);
        this.broadcastStatus();
    }
}
