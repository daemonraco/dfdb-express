/**
 * @file method.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';

import { Response } from "./response";

export abstract class Method {
    //
    // Protected properties.
    protected _connection: any = null;
    protected _hiddenCollections: string[] = [];
    //
    // Constructor
    constructor(conn: any, hiddenCollections: string[] = []) {
        this._connection = conn;
        this._hiddenCollections = hiddenCollections;
    }
    //
    // Public methods.
    public abstract process(params: { [name: string]: any }): Promise<Response>;
    //
    // Protected methods.
    protected rejectWithCode(code: number, err: string, reject: (err: Response) => void): void {
        const result: Response = new Response();

        result.status = 403;
        result.errorBody = { message: err };

        reject(result);
    }
    protected rejectWithCode403(err: string, reject: (err: Response) => void): void {
        this.rejectWithCode(403, err, reject);
    }
    protected rejectWithCode404(err: string, reject: (err: Response) => void): void {
        this.rejectWithCode(404, err, reject);
    }
    protected rejectWithCode500(err: string, reject: (err: Response) => void): void {
        this.rejectWithCode(500, err, reject);
    }
    protected skipResponse(): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            let result: Response = new Response();
            result.skip = true;
            reject(result);
        });
    }
}