/**
 * @file method.ts
 * @author Alejandro D. Simi
 */
import { Promise } from 'es6-promise';
import { Response } from "./response";
export declare abstract class Method {
    protected _connection: any;
    protected _hiddenCollections: string[];
    constructor(conn: any, hiddenCollections?: string[]);
    abstract process(params: {
        [name: string]: any;
    }): Promise<Response>;
    protected rejectWithCode(code: number, err: string, reject: (err: Response) => void): void;
    protected rejectWithCode403(err: string, reject: (err: Response) => void): void;
    protected rejectWithCode404(err: string, reject: (err: Response) => void): void;
    protected rejectWithCode500(err: string, reject: (err: Response) => void): void;
    protected skipResponse(): Promise<Response>;
}
