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
    //
    // Public methods.
    process(params) {
        let results = null;
        if (params.collection === '$initializer' && !params.id) {
            results = this.setInitializer(params.body);
        }
        else if (params.collection === '$reinitialize' && !params.id) {
            results = this.reinitialize();
        }
        else if (params.collection && params.id === '$truncate') {
            results = this.truncate(params.collection);
        }
        else if (params.collection && params.id === '$createIndex') {
            results = this.createFieldIndex(params.collection, params);
        }
        else if (params.collection && !params.id) {
            results = this.insert(params.collection, params.body);
        }
        else {
            results = this.skipResponse();
        }
        return results;
    }
    //
    // Protected methods.
    createFieldIndex(collectionName, params) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col.addFieldIndex(params.queryParams.field)
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
    insert(collectionName, document) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col.insert(document)
                        .then((insertedDocument) => {
                        result.body = insertedDocument;
                        resolve(result);
                    }).catch((err) => this.rejectWithCode500(err, reject));
                }).catch((err) => this.rejectWithCode500(err, reject));
            }
            else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    reinitialize() {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            this._connection.reinitialize()
                .then(() => {
                resolve(result);
            }).catch((err) => this.rejectWithCode500(err, reject));
        });
    }
    setInitializer(data) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            this._connection.setInitializerFromJSON(data)
                .then(() => {
                resolve(result);
            }).catch((err) => this.rejectWithCode500(err, reject));
        });
    }
    setKnownEndpoints() {
        this.setKnownEndpointsFromFile('post');
    }
    truncate(collectionName) {
        return new es6_promise_1.Promise((resolve, reject) => {
            const result = new response_1.Response();
            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col) => {
                    col.truncate()
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
}
exports.Post = Post;
