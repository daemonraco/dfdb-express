"use strict";
/**
 * @file put.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const method_1 = require("./method");
const response_1 = require("./response");
class Put extends method_1.Method {
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
                case '$schema':
                    let schema = params.body;
                    schema = Object.keys(params.body).length === 0 ? null : schema;
                    results = this.setSchema(params.collection, schema);
                    break;
                case '$many':
                    results = this.updateMany(params.collection, query, params.body);
                    break;
                default:
                    const partial = typeof params.queryParams.partial !== 'undefined';
                    results = this.update(params.collection, params.id, params.body, partial);
                    break;
            }
        }
        else {
            results = this.skipResponse();
        }
        return results;
    }
    //
    // Protected methods.
    setSchema(collectionName, data) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    if (data === null) {
                        col.removeSchema()
                            .then(() => {
                            result.body = { message: `Schema removed` };
                            resolve(result);
                        }).catch((err) => this.rejectWithCode500(err, reject));
                    }
                    else {
                        col.setSchema(data)
                            .then(() => {
                            result.body = { message: `Schema updated` };
                            resolve(result);
                        }).catch((err) => this.rejectWithCode500(err, reject));
                    }
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    update(collectionName, documentId, document, partial) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    const func = partial ? 'partialUpdate' : 'update';
                    col[func](documentId, document)
                        .then((updatedDocument) => {
                        result.body = updatedDocument;
                        resolve(result);
                    }).catch((err) => this.rejectWithCode500(err, reject));
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    updateMany(collectionName, query, document) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (query) {
                if (this._hiddenCollections.indexOf(collectionName) < 0) {
                    this._connection.collection(collectionName)
                        .then((col) => {
                        col.updateMany(query, document)
                            .then((updatedDocuments) => {
                            result.body = updatedDocuments;
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
    setKnownEndpoints() {
        this.setKnownEndpointsFromFile('put');
    }
}
exports.Put = Put;
