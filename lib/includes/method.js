"use strict";
/**
 * @file method.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const path = require("path");
const method_endpoint_1 = require("./method-endpoint");
const response_1 = require("./response");
class Method {
    //
    // Constructor
    constructor(manager, conn, hiddenCollections = []) {
        //
        // Protected properties.
        this._connection = null;
        this._endpoints = [];
        this._hiddenCollections = [];
        this._manager = null;
        this._manager = manager;
        this._connection = conn;
        this._hiddenCollections = hiddenCollections;
        this.setKnownEndpoints();
    }
    //
    // Public methods.
    endpoints() {
        return this._endpoints;
    }
    //
    // Protected methods.
    rejectWithCode(code, err, reject) {
        const result = new response_1.Response();
        result.status = code;
        result.errorBody = { message: err };
        reject(result);
    }
    rejectWithCode403(err, reject) {
        this.rejectWithCode(403, err, reject);
    }
    rejectWithCode404(err, reject) {
        this.rejectWithCode(404, err, reject);
    }
    rejectWithCode500(err, reject) {
        this.rejectWithCode(500, err, reject);
    }
    setKnownEndpointsFromFile(name) {
        try {
            const data = require(path.join(__dirname, `../../endpoint-docs/${name}.json`));
            data.forEach((item) => {
                this._endpoints.push(new method_endpoint_1.MethodEndpoint(item));
            });
        }
        catch (e) { }
    }
    skipResponse() {
        return new es6_promise_1.Promise((resolve, reject) => {
            let result = new response_1.Response();
            result.skip = true;
            reject(result);
        });
    }
}
exports.Method = Method;
