"use strict";
/**
 * @file post.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const method_1 = require("./method");
const response_1 = require("./response");
class Post extends method_1.Method {
    process(params) {
        let results = null;
        if (params.collection) {
            if (!params.id) {
                results = this.insert(params.collection, params.body);
            }
            else {
                results = this.skipResponse();
            }
        }
        else {
            results = this.skipResponse();
        }
        return results;
    }
    insert(collectionName, document) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            const send500 = (err) => {
                result.status = 500;
                result.errorBody = { message: err };
                reject(result);
            };
            this._connection.collection(collectionName)
                .then((col) => {
                col.insert(document)
                    .then((insertedDocument) => {
                    result.body = insertedDocument;
                    resolve(result);
                })
                    .catch(send500);
            })
                .catch(send500);
        });
    }
}
exports.Post = Post;
