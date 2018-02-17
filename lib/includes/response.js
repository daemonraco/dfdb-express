"use strict";
/**
 * @file response.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor() {
        this.body = {};
        this.errorBody = null;
        this.skip = false;
        this.status = 200;
    }
}
exports.Response = Response;
