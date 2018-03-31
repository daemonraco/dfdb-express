/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { Promise } from 'es6-promise';
import { AuthTokenList } from './auth-token';
import { Method } from './method';
import { MethodEndpoint } from "./method-endpoint";
import { Response } from './response';
export declare type ValuesList = {
    [name: string]: any;
};
export declare class Manager {
    protected static _ExpireSessionsInterval: any;
    protected static _ManagerAuthTokens: AuthTokenList;
    protected _auth: (req: ValuesList) => boolean;
    protected _catchToken: (token: string) => void;
    protected _authType: string;
    protected _authUrlPattern: RegExp;
    protected _connection: any;
    protected _dbname: string;
    protected _dbpath: string;
    protected _endpointsCache: any[];
    protected _endpointsCacheFull: any[];
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
    endpoints(full: boolean): any[];
    process(req: ValuesList, res: ValuesList): Promise<Response>;
    restPath(): string;
    protected buildEndpoints(): void;
    protected getEndpoints(): MethodEndpoint[];
    /**
     * This method parse given parameters on instantiation.
     *
     * @protected
     * @method parseOptions
     */
    protected parseOptions(): void;
    protected postEndpoints(): MethodEndpoint[];
    protected static ExpireSessions(): void;
}
