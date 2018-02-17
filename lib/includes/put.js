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
            results = this.update(params.collection, params.id, params.body);
        }
        else {
            results = this.skipResponse();
        }
        return results;
    }
    //
    // Protected methods.
    update(collectionName, documentId, document) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col.update(documentId, document)
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
