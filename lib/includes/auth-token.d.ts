/**
 * @file auth-token.ts
 * @author Alejandro D. Simi
 */
export declare class AuthToken {
    protected _code: string;
    protected _expirationDate: Date;
    constructor();
    code(): string;
    expired(): boolean;
    refresh(): void;
}
export declare type AuthTokenList = {
    [name: string]: AuthToken;
};
