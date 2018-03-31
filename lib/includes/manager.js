"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const dfdb_1 = require("dfdb");
const auth_token_1 = require("./auth-token");
const delete_1 = require("./delete");
const get_1 = require("./get");
const method_endpoint_1 = require("./method-endpoint");
const post_1 = require("./post");
const put_1 = require("./put");
const response_1 = require("./response");
class Manager {
    constructor(options) {
        //
        // Protected proterties.
        this._auth = null;
        this._catchToken = null;
        this._authType = null;
        this._authUrlPattern = null;
        this._connection = null;
        this._dbname = null;
        this._dbpath = null;
        this._endpointsCache = null;
        this._endpointsCacheFull = null;
        this._fullUiUrlPattern = null;
        this._fullUrlPattern = null;
        this._hiddenCollections = [];
        this._processors = {};
        this._options = {};
        this._restPath = null;
        this._subUrlPattern = /^\/(.+)(\/.*|)/;
        this._uiPath = null;
        this._options = options;
        this.parseOptions();
        dfdb_1.DocsOnFileDB.connect(this._dbname, this._dbpath)
            .then((conn) => {
            this._connection = conn;
            this._processors['GET'] = new get_1.Get(this, this._connection, this._hiddenCollections);
            this._processors['POST'] = new post_1.Post(this, this._connection, this._hiddenCollections);
            this._processors['PUT'] = new put_1.Put(this, this._connection, this._hiddenCollections);
            this._processors['PATCH'] = this._processors['PUT'];
            this._processors['DELETE'] = new delete_1.Delete(this, this._connection, this._hiddenCollections);
        })
            .catch((err) => {
            throw `${err}`;
        });
        this._fullUrlPattern = RegExp(`^${this._restPath}(.*)`);
        this._fullUiUrlPattern = this._uiPath ? RegExp(`^${this._uiPath}(.*)`) : null;
        this._authUrlPattern = RegExp(`^${this._restPath}-auth/(login|logout)`);
        if (this._auth) {
            Manager.ExpireSessions();
        }
    }
    endpoints(full) {
        this.buildEndpoints();
        return full ? this._endpointsCacheFull : this._endpointsCache;
    }
    process(req, res) {
        //
        // Building promise to return.
        return new es6_promise_1.Promise((resolve, reject) => {
            let results = new response_1.Response();
            const fullUrlMatches = req.url.split('?').shift().match(this._fullUrlPattern);
            const authUrlMatches = this._authUrlPattern ? req.url.split('?').shift().match(this._authUrlPattern) : null;
            const fullUiUrlMatches = this._fullUiUrlPattern ? req.url.split('?').shift().match(this._fullUiUrlPattern) : null;
            let headerAuthorized = this._auth ? false : true;
            if (!headerAuthorized && typeof req.headers['authorization'] !== 'undefined') {
                if (typeof Manager._ManagerAuthTokens[req.headers['authorization']] !== 'undefined') {
                    if (Manager._ManagerAuthTokens[req.headers['authorization']].expired()) {
                        delete Manager._ManagerAuthTokens[req.headers['authorization']];
                    }
                    else {
                        Manager._ManagerAuthTokens[req.headers['authorization']].refresh();
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
                    }
                    else if (this._auth(req)) {
                        const aux = new auth_token_1.AuthToken();
                        Manager._ManagerAuthTokens[aux.code()] = aux;
                        this._catchToken(aux.code());
                        results.body = {
                            authorized: true,
                            token: aux.code()
                        };
                        resolve(results);
                    }
                    else {
                        results.status = 403;
                        results.errorBody = {
                            message: `You are not authorized`
                        };
                        reject(results);
                    }
                }
                else {
                    results.status = 401;
                    results.errorBody = `This API does not require authorization.`;
                    reject(results);
                }
            }
            else if (fullUiUrlMatches) {
                results.ui = new response_1.UIData();
                results.ui.restUri = this._restPath;
                results.ui.uri = this._uiPath;
                results.ui.subUri = fullUiUrlMatches[1];
                results.ui.authType = this._authType;
                resolve(results);
            }
            else if (fullUrlMatches) {
                if (!headerAuthorized) {
                    results.status = 403;
                    results.errorBody = {
                        message: `You are not authorized`
                    };
                    reject(results);
                }
                else {
                    let subUrl = fullUrlMatches[1];
                    let subUrlPieces = subUrl.split('/').filter(x => x);
                    let method = req.method;
                    let collection = typeof subUrlPieces[0] !== 'undefined' ? subUrlPieces[0] : null;
                    let id = typeof subUrlPieces[1] !== 'undefined' ? subUrlPieces[1] : null;
                    let queryParams = req.query;
                    let body = req.body;
                    if (typeof req.body !== 'object' && typeof req.headers['content-type'] !== 'undefined' && req.headers['content-type'] === 'application/json') {
                        try {
                            body = JSON.parse(req.body);
                        }
                        catch (e) {
                            body = {};
                        }
                    }
                    if (typeof this._processors[method] !== 'undefined') {
                        this._processors[method].process({ collection, id, queryParams, body })
                            .then(resolve)
                            .catch(reject);
                    }
                    else {
                        results.skip = true;
                        reject(results);
                    }
                }
            }
            else {
                results.skip = true;
                reject(results);
            }
        });
    }
    restPath() {
        return this._restPath;
    }
    //
    // Protected metods.
    buildEndpoints() {
        if (this._endpointsCache === null) {
            this._endpointsCache = [];
            this._endpointsCacheFull = [];
            const endpointPath = (endpoint) => {
                return `${endpoint.absolute ? '' : this._restPath}${endpoint.path}`;
            };
            const explodedExample = (endpoint) => {
                if (endpoint.examples) {
                    endpoint.examples = endpoint.examples.replace(/%path%/g, endpointPath(endpoint));
                }
                return endpoint.examples;
            };
            const parseList = (list, method) => {
                list.forEach((endpoint) => {
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
            Object.keys(this._processors).forEach((method) => {
                parseList(this._processors[method].endpoints(), method);
            });
            parseList(this.getEndpoints(), 'GET');
            parseList(this.postEndpoints(), 'POST');
            const sortIt = (a, b) => {
                let result = 0;
                if (a.path === b.path) {
                    if (a.method < b.method)
                        result = -1;
                    if (a.method > b.method)
                        result = 1;
                }
                else {
                    if (a.path < b.path)
                        result = -1;
                    if (a.path > b.path)
                        result = 1;
                }
                return result;
            };
            this._endpointsCache = this._endpointsCache.sort(sortIt);
        }
    }
    getEndpoints() {
        let out = [];
        let aux = null;
        if (this._uiPath) {
            aux = new method_endpoint_1.MethodEndpoint({
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
    parseOptions() {
        const { dbname, dbpath, restPath, uiPath, hide, auth, catchToken, password } = this._options;
        //
        // Mandatory options.
        if (dbname === undefined) {
            throw `Required option 'dbname' was not given`;
        }
        else {
            this._dbname = dbname;
        }
        if (dbpath === undefined) {
            throw `Required option 'dbpath' was not given`;
        }
        else {
            this._dbpath = dbpath;
        }
        if (restPath === undefined) {
            throw `Required option 'restPath' was not given`;
        }
        else {
            this._restPath = restPath;
        }
        if (uiPath) {
            this._uiPath = uiPath;
        }
        else {
            this._uiPath = null;
        }
        if (auth) {
            this._authType = 'custom';
            this._auth = auth;
        }
        else if (password) {
            this._authType = 'basic';
            this._auth = (req) => {
                return req.body.password == password;
            };
        }
        else {
            this._authType = 'none';
            this._auth = null;
        }
        if (typeof catchToken === 'function') {
            this._catchToken = catchToken;
        }
        else {
            this._catchToken = (token) => { };
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
    postEndpoints() {
        let out = [];
        let aux = null;
        if (this._auth) {
            aux = new method_endpoint_1.MethodEndpoint({
                path: `${this._restPath}-auth/login`,
                brief: `This endpoint takes and validate login credentials.`,
                absolute: true
            });
            out.push(aux);
            aux = new method_endpoint_1.MethodEndpoint({
                path: `${this._restPath}-auth/logout`,
                brief: `This endpoint sets current session as not logged it.`,
                absolute: true
            });
            out.push(aux);
        }
        return out;
    }
    //
    // Protected class metods.
    static ExpireSessions() {
        if (Manager._ExpireSessionsInterval === null) {
            Manager._ExpireSessionsInterval = setInterval(() => {
                Object.keys(Manager._ManagerAuthTokens).forEach((sessionId) => {
                    if (Manager._ManagerAuthTokens[sessionId].expired()) {
                        delete Manager._ManagerAuthTokens[sessionId];
                    }
                });
            }, 1000);
        }
    }
}
//
// Protected class proterties.
Manager._ExpireSessionsInterval = null;
Manager._ManagerAuthTokens = {};
exports.Manager = Manager;
;
