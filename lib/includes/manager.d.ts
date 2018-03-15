/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { Promise } from 'es6-promise';
import { Method } from './method';
import { Response } from './response';
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
export declare type ValuesList = {
    [name: string]: any;
};
export declare class Manager {
    protected _auth: (req: ValuesList) => boolean;
    protected _catchToken: (token: string) => void;
    protected _authType: string;
    protected _authUrlPattern: RegExp;
    protected _connection: any;
    protected _dbname: string;
    protected _dbpath: string;
    protected _fullUiUrlPattern: RegExp;
    protected _fullUrlPattern: RegExp;
    protected _hiddenCollections: string[];
    protected _processors: {
        [name: string]: Method;
    };
    protected _options: any;
    protected _restPath: string;
    protected _subUrlPattern: RegExp;
    protected _uiPath: string;
    constructor(options: ValuesList);
    process(req: ValuesList, res: ValuesList): Promise<Response>;
    /**
     * This method parse given parameters on instantiation.
     *
     * @protected
     * @method parseOptions
     */
    protected parseOptions(): void;
}
