/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';
import { Connection, DocsOnFileDB } from 'dfdb';

import { Delete } from './delete';
import { Get } from './get';
import { Method } from './method';
import { Post } from './post';
import { Put } from './put';
import { Response, UIData } from './response';

export class AuthToken {
    protected _code: string = null;
    protected _expirationDate: Date = null;

    constructor() {
        this._code = `${Math.random().toString(36).substring(7)}${Math.random().toString(36).substring(7)}`;
        this.refresh();
    }

    public code(): string {
        return this._code;
    }
    public expired(): boolean {
        const now = new Date();
        return this._expirationDate < now;
    }
    public refresh(): void {
        this._expirationDate = new Date();
        this._expirationDate.setHours(this._expirationDate.getHours() + 1);
    }
}
export type AuthTokenList = { [name: string]: AuthToken };
export type ValuesList = { [name: string]: any };

const ManagerAuthTokens: AuthTokenList = {};

export class Manager {
    protected _auth: (req: ValuesList) => boolean = null;
    protected _authType: string = null;
    protected _authUrlPattern: RegExp = null;
    protected _connection: any = null;
    protected _dbname: string = null;
    protected _dbpath: string = null;
    protected _fullUiUrlPattern: RegExp = null;
    protected _fullUrlPattern: RegExp = null;
    protected _hiddenCollections: string[] = [];
    protected _processors: { [name: string]: Method } = {};
    protected _options: any = {};
    protected _restPath: string = null;
    protected _subUrlPattern: RegExp = /^\/(.+)(\/.*|)/;
    protected _uiPath: string = null;

    constructor(options: ValuesList) {
        this._options = options;
        this.parseOptions();

        DocsOnFileDB.connect(this._dbname, this._dbpath)
            .then((conn: Connection) => {
                this._connection = conn;

                this._processors['GET'] = new Get(this._connection, this._hiddenCollections);
                this._processors['POST'] = new Post(this._connection, this._hiddenCollections);
                this._processors['PUT'] = new Put(this._connection, this._hiddenCollections);
                this._processors['PATCH'] = this._processors['PUT'];
                this._processors['DELETE'] = new Delete(this._connection, this._hiddenCollections);
            })
            .catch((err: any) => {
                throw `${err}`;
            });

        this._fullUrlPattern = RegExp(`^${this._restPath}(.*)`);
        this._fullUiUrlPattern = this._uiPath ? RegExp(`^${this._uiPath}(.*)`) : null;
        this._authUrlPattern = RegExp(`^${this._restPath}-auth/(login|logout)`);
    }

    public process(req: ValuesList, res: ValuesList): Promise<Response> {
        //
        // Building promise to return.
        return new Promise<Response>((resolve: (result: Response) => void, reject: (err: Response) => void) => {
            let results: Response = new Response();
            const fullUrlMatches = req.url.split('?').shift().match(this._fullUrlPattern);
            const authUrlMatches = this._authUrlPattern ? req.url.split('?').shift().match(this._authUrlPattern) : null;
            const fullUiUrlMatches = this._fullUiUrlPattern ? req.url.split('?').shift().match(this._fullUiUrlPattern) : null;

            let headerAuthorized: boolean = this._auth ? false : true;
            if (!headerAuthorized && typeof req.headers['authorization'] !== 'undefined') {
                if (typeof ManagerAuthTokens[req.headers['authorization']] !== 'undefined') {
                    if (ManagerAuthTokens[req.headers['authorization']].expired()) {
                        delete ManagerAuthTokens[req.headers['authorization']];
                    } else {
                        ManagerAuthTokens[req.headers['authorization']].refresh();
                        headerAuthorized = true;
                    }
                }
            }

            if (authUrlMatches) {
                if (this._auth) {
                    if (headerAuthorized) {
                        results.errorBody = {
                            authorized: true
                        };
                        resolve(results);
                    } else if (this._auth(req)) {
                        const aux = new AuthToken();
                        ManagerAuthTokens[aux.code()] = aux;
                        results.body = {
                            authorized: true,
                            token: aux.code()
                        };
                        resolve(results);
                    } else {
                        results.status = 403;
                        results.errorBody = {
                            message: `You are not authorized`
                        };
                        reject(results);
                    }
                } else {
                    results.status = 401;
                    results.errorBody = `This API does not require authorization.`;
                    reject(results);
                }
            } else if (fullUrlMatches) {

                if (!headerAuthorized) {
                    results.status = 403;
                    results.errorBody = {
                        message: `You are not authorized`
                    };
                    reject(results);
                } else {
                    let subUrl: string = fullUrlMatches[1];
                    let subUrlPieces: string[] = subUrl.split('/').filter(x => x);

                    let method: string = req.method;
                    let collection: string = typeof subUrlPieces[0] !== 'undefined' ? subUrlPieces[0] : null;
                    let id: string = typeof subUrlPieces[1] !== 'undefined' ? subUrlPieces[1] : null;
                    let queryParams: { [name: string]: string } = req.query;
                    let body: { [name: string]: string } = req.body;

                    if (typeof req.body !== 'object' && typeof req.headers['content-type'] !== 'undefined' && req.headers['content-type'] === 'application/json') {
                        try {
                            body = JSON.parse(req.body);
                        } catch (e) {
                            body = {};
                        }
                    }

                    if (typeof this._processors[method] !== 'undefined') {
                        this._processors[method].process({ collection, id, queryParams, body })
                            .then(resolve)
                            .catch(reject);
                    } else {
                        results.skip = true;
                        reject(results);
                    }
                }
            } else if (fullUiUrlMatches) {
                results.ui = new UIData();

                results.ui.restUri = this._restPath;
                results.ui.uri = this._uiPath;
                results.ui.subUri = fullUiUrlMatches[1];
                results.ui.authType = this._authType;

                resolve(results);
            } else {
                results.skip = true;
                reject(results);
            }
        });
    }
    //
    // Protected metods.
    /**
     * This method parse given parameters on instantiation.
     *
     * @protected
     * @method parseOptions
     */
    protected parseOptions(): void {
        const { dbname, dbpath, restPath, uiPath, hide, auth, /*authType,*/ password } = this._options;
        //
        // Mandatory options.
        if (dbname === undefined) {
            throw `Required option 'dbname' was not given`;
        } else {
            this._dbname = dbname;
        }
        if (dbpath === undefined) {
            throw `Required option 'dbpath' was not given`;
        } else {
            this._dbpath = dbpath;
        }
        if (restPath === undefined) {
            throw `Required option 'restPath' was not given`;
        } else {
            this._restPath = restPath;
        }
        if (uiPath) {
            this._uiPath = uiPath;
        } else {
            this._uiPath = null;
        }
        if (auth) {
            this._authType = 'custom';
            this._auth = auth;
        } else if (password) {
            this._authType = 'basic';
            this._auth = (req: ValuesList) => {
                return req.body.password == password;
            };
        } else {
            this._authType = 'noen';
            this._auth = null;
        }


        // if (auth) {
        //     this._auth = auth;
        // } else {
        //     this._auth = null;
        // }
        // if (authType) {
        //     this._authType = authType;
        // } else {
        //     this._authType = null;
        // }
        // if (this._auth && !this._authType) {
        //     this._authType = 'basic';
        // }
        //
        // Optional options.
        if (hide !== undefined && Array.isArray(hide)) {
            this._hiddenCollections = hide;
            for (let i = this._hiddenCollections.length - 1; i >= 0; i--) {
                if (typeof this._hiddenCollections[i] !== 'string') {
                    delete this._hiddenCollections[i];
                }
            }
        }
    }
};