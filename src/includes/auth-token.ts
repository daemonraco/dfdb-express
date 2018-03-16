/**
 * @file auth-token.ts
 * @author Alejandro D. Simi
 */

export class AuthToken {
    protected _code: string = null;
    protected _expirationDate: Date = null;

    constructor() {
        this._code = `${Math.random().toString(36).substring(7)}${Math.random().toString(36).substring(7)}`;
        this.refresh();
    }

    public code(): string {
        return this._code;
    }
    public expired(): boolean {
        const now = new Date();
        return this._expirationDate < now;
    }
    public refresh(): void {
        this._expirationDate = new Date();
        this._expirationDate.setHours(this._expirationDate.getHours() + 1);
    }
}

export type AuthTokenList = { [name: string]: AuthToken };
