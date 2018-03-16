"use strict";
/**
 * @file auth-token.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
class AuthToken {
    constructor() {
        this._code = null;
        this._expirationDate = null;
        this._code = `${Math.random().toString(36).substring(7)}${Math.random().toString(36).substring(7)}`;
        this.refresh();
    }
    code() {
        return this._code;
    }
    expired() {
        const now = new Date();
        return this._expirationDate < now;
    }
    refresh() {
        this._expirationDate = new Date();
        this._expirationDate.setHours(this._expirationDate.getHours() + 1);
    }
}
exports.AuthToken = AuthToken;
