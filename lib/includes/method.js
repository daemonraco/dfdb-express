"use strict";
/**
 * @file method.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const response_1 = require("./response");
class Method {
    //
    // Constructor
    constructor(conn, hiddenCollections = []) {
        //
        // Protected properties.
        this._connection = null;
        this._hiddenCollections = [];
        this._connection = conn;
        this._hiddenCollections = hiddenCollections;
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
    skipResponse() {
        return new es6_promise_1.Promise((resolve, reject) => {
            let result = new response_1.Response();
            result.skip = true;
            reject(result);
        });
    }
}
exports.Method = Method;
