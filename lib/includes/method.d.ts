/**
 * @file method.ts
 * @author Alejandro D. Simi
 */
import { Promise } from 'es6-promise';
import { Response } from "./response";
export declare abstract class Method {
    protected _connection: any;
    constructor(conn: any);
    abstract process(params: {
        [name: string]: any;
    }): Promise<Response>;
    protected skipResponse(): Promise<Response>;
}
