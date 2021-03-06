"use strict";
/**
 * @file delete.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const method_1 = require("./method");
const response_1 = require("./response");
class Delete extends method_1.Method {
    //
    // Public methods.
    process(params) {
        let results = null;
        let query = typeof params.queryParams.query === 'undefined' ? null : params.queryParams.query;
        try {
            query = JSON.parse(query);
        }
        catch (e) {
            query = null;
        }
        if (params.collection && params.id) {
            switch (params.id) {
                case '$drop':
                    results = this.drop(params.collection);
                    break;
                case '$dropIndex':
                    results = this.dropFieldIndex(params.collection, params);
                    break;
                case '$many':
                    results = this.deleteMany(params.collection, query);
                    break;
                default:
                    results = this.delete(params.collection, params.id);
            }
        }
        else {
            results = this.skipResponse();
        }
        return results;
    }
    //
    // Protected methods.
    dropFieldIndex(collectionName, params) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col.dropFieldIndex(params.queryParams.field)
                        .then(() => {
                        result.body = {};
                        resolve(result);
                    }).catch((err) => this.rejectWithCode500(err, reject));
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    delete(collectionName, documentId) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col.remove(documentId)
                        .then(() => {
                        result.body = {};
                        resolve(result);
                    }).catch((err) => this.rejectWithCode500(err, reject));
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    deleteMany(collectionName, query) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (query) {
                if (this._hiddenCollections.indexOf(collectionName) < 0) {
                    this._connection.collection(collectionName)
                        .then((col) => {
                        col.removeMany(query)
                            .then((rmResults) => {
                            result.body = rmResults;
                            resolve(result);
                        }).catch((err) => this.rejectWithCode500(err, reject));
                    }).catch((err) => this.rejectWithCode500(err, reject));
                }
                else {
                    this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
                }
            }
            else {
                this.rejectWithCode400(`Wrong query parameter. Query: ${JSON.stringify(query)}`, reject);
            }
        });
    }
    drop(collectionName) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col.drop()
                        .then(() => {
                        result.body = {};
                        resolve(result);
                    }).catch((err) => this.rejectWithCode500(err, reject));
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    setKnownEndpoints() {
        this.setKnownEndpointsFromFile('delete');
    }
}
exports.Delete = Delete;
