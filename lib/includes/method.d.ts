/**
 * @file method.ts
 * @author Alejandro D. Simi
 */
import { Promise } from 'es6-promise';
import { Manager } from "./manager";
import { MethodEndpoint } from "./method-endpoint";
import { Response } from "./response";
export declare abstract class Method {
    protected _connection: any;
    protected _endpoints: MethodEndpoint[];
    protected _hiddenCollections: string[];
    protected _manager: Manager;
    constructor(manager: Manager, conn: any, hiddenCollections?: string[]);
    endpoints(): MethodEndpoint[];
    abstract process(params: {
        [name: string]: any;
    }): Promise<Response>;
    protected rejectWithCode(code: number, err: string, reject: (err: Response) => void): void;
    protected rejectWithCode403(err: string, reject: (err: Response) => void): void;
    protected rejectWithCode404(err: string, reject: (err: Response) => void): void;
    protected rejectWithCode500(err: string, reject: (err: Response) => void): void;
    protected abstract setKnownEndpoints(): void;
    protected setKnownEndpointsFromFile(name: string): void;
    protected skipResponse(): Promise<Response>;
}
