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
        if (params.collection && params.id) {
            switch (params.id) {
                case '$schema':
                    let schema = params.body;
                    schema = Object.keys(params.body).length === 0 ? null : schema;
                    results = this.setSchema(params.collection, schema);
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
}
exports.Put = Put;
