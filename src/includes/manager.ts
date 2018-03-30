/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';
import { Connection, DocsOnFileDB } from 'dfdb';

import { AuthToken, AuthTokenList } from './auth-token';
import { Delete } from './delete';
import { Get } from './get';
import { Method } from './method';
import { MethodEndpoint } from "./method-endpoint";
import { Post } from './post';
import { Put } from './put';
import { Response, UIData } from './response';

export type ValuesList = { [name: string]: any };

const ManagerAuthTokens: AuthTokenList = {};

export class Manager {
    protected _auth: (req: ValuesList) => boolean = null;
    protected _catchToken: (token: string) => void = null;
    protected _authType: string = null;
    protected _authUrlPattern: RegExp = null;
    protected _connection: any = null;
    protected _dbname: string = null;
    protected _dbpath: string = null;
    protected _endpointsCache: any[] = null;
    protected _endpointsCacheFull: any[] = null;
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

                this._processors['GET'] = new Get(this, this._connection, this._hiddenCollections);
                this._processors['POST'] = new Post(this, this._connection, this._hiddenCollections);
                this._processors['PUT'] = new Put(this, this._connection, this._hiddenCollections);
                this._processors['PATCH'] = this._processors['PUT'];
                this._processors['DELETE'] = new Delete(this, this._connection, this._hiddenCollections);
            })
            .catch((err: any) => {
                throw `${err}`;
            });

        this._fullUrlPattern = RegExp(`^${this._restPath}(.*)`);
        this._fullUiUrlPattern = this._uiPath ? RegExp(`^${this._uiPath}(.*)`) : null;
        this._authUrlPattern = RegExp(`^${this._restPath}-auth/(login|logout)`);
    }

    public endpoints(full: boolean): any[] {
        this.buildEndpoints();
        return full ? this._endpointsCacheFull : this._endpointsCache;
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

            if (authUrlMatches && req.method === 'POST') {
                if (this._auth) {
                    if (headerAuthorized) {
                        results.errorBody = {
                            authorized: true
                        };
                        resolve(results);
                    } else if (this._auth(req)) {
                        const aux = new AuthToken();
                        ManagerAuthTokens[aux.code()] = aux;
                        this._catchToken(aux.code());

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
            } else if (fullUiUrlMatches) {
                results.ui = new UIData();

                results.ui.restUri = this._restPath;
                results.ui.uri = this._uiPath;
                results.ui.subUri = fullUiUrlMatches[1];
                results.ui.authType = this._authType;

                resolve(results);
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
            } else {
                results.skip = true;
                reject(results);
            }
        });
    }
    public restPath(): string {
        return this._restPath;
    }
    //
    // Protected metods.
    protected buildEndpoints(): void {
        if (this._endpointsCache === null) {
            this._endpointsCache = [];
            this._endpointsCacheFull = [];

            const endpointPath = (endpoint: MethodEndpoint) => {
                return `${endpoint.absolute ? '' : this._restPath}${endpoint.path}`;
            };
            const explodedExample = (endpoint: MethodEndpoint) => {
                if (endpoint.examples) {
                    endpoint.examples = endpoint.examples.replace(/%path%/g, endpointPath(endpoint));
                }

                return endpoint.examples;
            };
            const parseList = (list: MethodEndpoint[], method: string) => {
                list.forEach((endpoint: MethodEndpoint) => {
                    this._endpointsCache.push({
                        method: method.toUpperCase(),
                        path: `${endpoint.absolute ? '' : this._restPath}${endpoint.path}`,
                        brief: endpoint.brief
                    });
                    this._endpointsCacheFull.push({
                        method: method.toUpperCase(),
                        path: `${endpoint.absolute ? '' : this._restPath}${endpoint.path}`,
                        brief: endpoint.brief,
                        examples: explodedExample(endpoint)
                    });
                });
            };

            Object.keys(this._processors).forEach((method: string) => {
                parseList(this._processors[method].endpoints(), method);
            });
            parseList(this.getEndpoints(), 'GET');
            parseList(this.postEndpoints(), 'POST');

            const sortIt = (a: any, b: any) => {
                let result = 0;

                if (a.path === b.path) {
                    if (a.method < b.method) result = -1;
                    if (a.method > b.method) result = 1;
                } else {
                    if (a.path < b.path) result = -1;
                    if (a.path > b.path) result = 1;
                }

                return result;
            }
            this._endpointsCache = this._endpointsCache.sort(sortIt);
        }
    }
    protected getEndpoints(): MethodEndpoint[] {
        let out: MethodEndpoint[] = [];
        let aux: MethodEndpoint = null;

        if (this._uiPath) {
            aux = new MethodEndpoint({
                path: `${this._uiPath}`,
                brief: `This is a web UI that allows you to access your database using a web browser.`,
                absolute: true
            });
            out.push(aux);
        }

        return out;
    }
    /**
     * This method parse given parameters on instantiation.
     *
     * @protected
     * @method parseOptions
     */
    protected parseOptions(): void {
        const { dbname, dbpath, restPath, uiPath, hide, auth, catchToken, password } = this._options;
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
            this._authType = 'none';
            this._auth = null;
        }

        if (typeof catchToken === 'function') {
            this._catchToken = catchToken;
        } else {
            this._catchToken = (token: string) => { };
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
    protected postEndpoints(): MethodEndpoint[] {
        let out: MethodEndpoint[] = [];
        let aux: MethodEndpoint = null;

        if (this._auth) {
            aux = new MethodEndpoint({
                path: `${this._restPath}-auth/login`,
                brief: `This endpoint takes and validate login credentials.`,
                absolute: true
            });
            out.push(aux);

            aux = new MethodEndpoint({
                path: `${this._restPath}-auth/logout`,
                brief: `This endpoint sets current session as not logged it.`,
                absolute: true
            });
            out.push(aux);
        }

        return out;
    }
};