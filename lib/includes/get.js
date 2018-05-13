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
    //
    // Public methods.
    process(params) {
        let results = null;
        const simple = typeof params.queryParams.simple !== 'undefined';
        let filter = typeof params.queryParams.filter === 'undefined' ? null : params.queryParams.filter;
        let query = typeof params.queryParams.query === 'undefined' ? null : params.queryParams.query;
        try {
            filter = JSON.parse(filter);
        }
        catch (e) {
            filter = null;
        }
        try {
            query = JSON.parse(query);
        }
        catch (e) {
            query = null;
        }
        if (params.collection) {
            switch (params.collection) {
                case '$info':
                    results = this.connectionInfo(params);
                    break;
                default:
                    if (params.id) {
                        switch (params.id) {
                            case '$schema':
                                results = this.schema(params.collection);
                                break;
                            case '$indexes':
                                results = this.indexes(params.collection);
                                break;
                            case '$create':
                                results = this.createCollection(params.collection);
                                break;
                            default:
                                results = this.document(params.collection, params.id);
                                break;
                        }
                    }
                    else {
                        results = this.collection(params.collection, simple, { filter, query });
                    }
                    break;
            }
        }
        else {
            results = this.listCollections(simple);
        }
        return results;
    }
    //
    // Protected methods.
    createCollection(collectionName) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            const collections = this._connection.collections();
            if (typeof collections[collectionName] === 'undefined') {
                this._connection.collection(collectionName)
                    .then((col) => {
                    result.body = { created: true };
                    resolve(result);
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                this.rejectWithCode500(`Collection '${collectionName}' already exits`, reject);
            }
        });
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
            if (!conditions) {
                conditions = {};
            }
            const buildBody = (data) => {
                return simple ? data.docs : data;
            };
            if (typeof collections[collectionName] !== 'undefined' && this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col[searchMechanism](conditions)
                        .then((docs) => {
                        result.body = buildBody({ searchMechanism, conditions, docs });
                        resolve(result);
                    }).catch((err) => this.rejectWithCode500(err, reject));
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                result.body = buildBody({ searchMechanism, conditions, docs: [] });
                resolve(result);
            }
        });
    }
    connectionInfo(params) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            let fullDocs = typeof params.queryParams.fullDocs !== 'undefined';
            result.body = {
                endpoints: this._manager.endpoints(fullDocs),
                collections: this._connection.collections(),
                initializer: this._connection.hasInitializer() ? this._connection.initializer().toJSON() : null
            };
            resolve(result);
        });
    }
    document(collectionName, documentId) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            const collections = this._connection.collections();
            if (typeof collections[collectionName] !== 'undefined' && this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col.searchOne({ _id: documentId })
                        .then((data) => {
                        if (data) {
                            result.body = data;
                            resolve(result);
                        }
                        else {
                            this.rejectWithCode404(`Document with id '${documentId}' not found`, reject);
                        }
                    }).catch((err) => this.rejectWithCode500(err, reject));
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                this.rejectWithCode404(`Document with id '${documentId}' not found`, reject);
            }
        });
    }
    indexes(collectionName) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            const collections = this._connection.collections();
            if (typeof collections[collectionName] !== 'undefined' && this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    result.body = col.indexes();
                    resolve(result);
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                this.rejectWithCode404(`Collection not found`, reject);
            }
        });
    }
    listCollections(simple = false) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            const tempResult = this._connection.collections();
            result.body = {};
            Object.keys(tempResult).forEach((name) => {
                if (this._hiddenCollections.indexOf(name) < 0) {
                    result.body[name] = tempResult[name];
                }
            });
            if (simple) {
                result.body = Object.keys(result.body);
            }
            resolve(result);
        });
    }
    schema(collectionName) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            const collections = this._connection.collections();
            if (typeof collections[collectionName] !== 'undefined' && this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    if (col.hasSchema()) {
                        result.body = col.schema();
                        resolve(result);
                    }
                    else {
                        result.body = null;
                        resolve(result);
                    }
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                this.rejectWithCode404(`Collection not found`, reject);
            }
        });
    }
    setKnownEndpoints() {
        this.setKnownEndpointsFromFile('get');
    }
}
exports.Get = Get;
