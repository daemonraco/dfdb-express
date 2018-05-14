/**
 * @file method.ts
 * @author Alejandro D. Simi
 */

import { BasicDictionary } from "dfdb";
import { Promise } from 'es6-promise';
import * as fs from 'fs';
import * as path from 'path';

import { Manager } from "./manager";
import { MethodEndpoint } from "./method-endpoint";
import { Response } from "./response";

export abstract class Method {
    //
    // Protected properties.
    protected _connection: any = null;
    protected _endpoints: MethodEndpoint[] = [];
    protected _hiddenCollections: string[] = [];
    protected _manager: Manager = null;
    //
    // Constructor
    constructor(manager: Manager, conn: any, hiddenCollections: string[] = []) {
        this._manager = manager;
        this._connection = conn;
        this._hiddenCollections = hiddenCollections;

        this.setKnownEndpoints();
    }
    //
    // Public methods.
    public endpoints(): MethodEndpoint[] {
        return this._endpoints;
    }
    public abstract process(params: BasicDictionary): Promise<Response>;
    //
    // Protected methods.
    protected rejectWithCode(code: number, err: string, reject: (err: Response) => void): void {
        const result: Response = new Response();

        result.status = code;
        result.errorBody = { message: err };

        reject(result);
    }
    protected rejectWithCode400(err: string, reject: (err: Response) => void): void {
        this.rejectWithCode(400, err, reject);
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
    protected abstract setKnownEndpoints(): void;
    protected setKnownEndpointsFromFile(name: string): void {
        try {
            const data = require(path.join(__dirname, `../../endpoint-docs/${name}.json`));
            data.forEach((item: any) => {
                this._endpoints.push(new MethodEndpoint(item));
            });
        } catch (e) { }
    }
    protected skipResponse(): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            let result: Response = new Response();
            result.skip = true;
            reject(result);
        });
    }
}