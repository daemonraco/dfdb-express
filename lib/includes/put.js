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
    update(collectionName, documentId, document) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            const send500 = (err) => {
                result.status = 500;
                result.errorBody = { message: err };
                reject(result);
            };
            this._connection.collection(collectionName)
                .then((col) => {
                col.update(documentId, document)
                    .then((updatedDocument) => {
                    result.body = updatedDocument;
                    resolve(result);
                })
                    .catch(send500);
            })
                .catch(send500);
        });
    }
}
exports.Put = Put;
