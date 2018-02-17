"use strict";
/**
 * @file get.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const method_1 = require("./method");
const response_1 = require("./response");
class Get extends method_1.Method {
    process(params) {
        let results = null;
        const simple = typeof params.queryParams.simple !== 'undefined';
        const filter = typeof params.queryParams.filter === 'undefined' ? null : params.queryParams.filter;
        const query = typeof params.queryParams.query === 'undefined' ? null : params.queryParams.query;
        if (params.collection) {
            if (params.id) {
                results = this.document(params.collection, params.id);
            }
            else {
                results = this.collection(params.collection, simple, { filter, query });
            }
        }
        else {
            results = this.listCollections(simple);
        }
        return results;
    }
    collection(collectionName, simple = false, conditionSets) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            const collections = this._connection.collections();
            const { filter, query } = conditionSets;
            let searchMechanism = 'search';
            let conditions = null;
            if (filter !== null) {
                searchMechanism = 'find';
                conditions = filter;
            }
            else {
                conditions = query;
            }
            if (conditions) {
                try {
                    conditions = JSON.parse(conditions);
                }
                catch (e) {
                    conditions = {};
                }
                ;
            }
            else {
                conditions = {};
            }
            const send500 = (err) => {
                result.status = 500;
                result.errorBody = { message: err };
                reject(result);
            };
            const buildBody = (data) => {
                return simple ? data.docs : data;
            };
            if (typeof collections[collectionName] !== 'undefined') {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col[searchMechanism](conditions)
                        .then((docs) => {
                        result.body = buildBody({ searchMechanism, conditions, docs });
                        resolve(result);
                    })
                        .catch(send500);
                })
                    .catch((err) => {
                    send500(err);
                });
            }
            else {
                result.body = buildBody({ searchMechanism, conditions, docs: [] });
                resolve(result);
            }
        });
    }
    document(collectionName, documentId) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            const send404 = () => {
                result.status = 404;
                result.errorBody = { message: `Document with id '${documentId}' not found` };
                reject(result);
            };
            const send500 = (err) => {
                result.status = 500;
                result.errorBody = { message: err };
                reject(result);
            };
            const collections = this._connection.collections();
            if (typeof collections[collectionName] !== 'undefined') {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col.searchOne({ _id: documentId })
                        .then((data) => {
                        if (data) {
                            result.body = data;
                            resolve(result);
                        }
                        else {
                            send404();
                        }
                    })
                        .catch(send500);
                })
                    .catch(send500);
            }
            else {
                send404();
            }
        });
    }
    listCollections(simple = false) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (simple) {
                result.body = Object.keys(this._connection.collections());
            }
            else {
                result.body = this._connection.collections();
            }
            resolve(result);
        });
    }
}
exports.Get = Get;
