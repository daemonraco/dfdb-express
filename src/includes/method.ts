/**
 * @file method.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';

import { Response } from "./response";

export abstract class Method {
    protected _connection: any = null;

    constructor(conn: any) {
        this._connection = conn;
    }

    public abstract process(params: { [name: string]: any }): Promise<Response>;

    protected skipResponse(): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            let result: Response = new Response();
            result.skip = true;
            reject(result);
        });
    }
}