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
        if (params.collection && params.id) {
            switch (params.id) {
                case '$drop':
                    results = this.drop(params.collection);
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
