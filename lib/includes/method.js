"use strict";
/**
 * @file method.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const response_1 = require("./response");
class Method {
    constructor(conn) {
        this._connection = null;
        this._connection = conn;
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
