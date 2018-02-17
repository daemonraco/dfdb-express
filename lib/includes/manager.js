"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const dfdb_1 = require("dfdb");
const delete_1 = require("./delete");
const get_1 = require("./get");
const post_1 = require("./post");
const put_1 = require("./put");
const response_1 = require("./response");
class Manager {
    constructor(options) {
        this._connection = null;
        this._fullUrlPattern = null;
        this._processors = {};
        this._options = {};
        this._subUrlPattern = /^\/(.+)(\/.*|)/;
        this._options = options;
        const { dbname, dbpath, restPath } = this._options;
        if (dbname === undefined) {
            throw `Required option 'dbname' was not given`;
        }
        if (dbpath === undefined) {
            throw `Required option 'dbpath' was not given`;
        }
        if (restPath === undefined) {
            throw `Required option 'restPath' was not given`;
        }
        dfdb_1.DocsOnFileDB.connect(dbname, dbpath)
            .then(conn => {
            this._connection = conn;
            this._processors['GET'] = new get_1.Get(this._connection);
            this._processors['POST'] = new post_1.Post(this._connection);
            this._processors['PUT'] = new put_1.Put(this._connection);
            this._processors['PATCH'] = this._processors['PUT'];
            this._processors['DELETE'] = new delete_1.Delete(this._connection);
        })
            .catch(err => { throw err; });
        this._fullUrlPattern = RegExp(`^${restPath}(.*)`);
    }
    process(req, res) {
        //
        // Building promise to return.
        return new es6_promise_1.Promise((resolve, reject) => {
            let results = new response_1.Response();
            const fullUrlMatches = req.url.split('?').shift().match(this._fullUrlPattern);
            if (fullUrlMatches) {
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
            else {
                results.skip = true;
                reject(results);
            }
        });
    }
}
exports.Manager = Manager;
;
