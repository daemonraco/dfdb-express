/**
 * @file delete.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';

import { Method } from "./method";
import { MethodEndpoint } from "./method-endpoint";
import { Response } from "./response";

export class Delete extends Method {
    //
    // Public methods.
    public process(params: { [name: string]: any }): Promise<Response> {
        let results: Promise<Response> = null;

        let query = typeof params.queryParams.query === 'undefined' ? null : params.queryParams.query;

        try { query = JSON.parse(query); } catch (e) { query = null; }

        if (params.collection && params.id) {
            switch (params.id) {
                case '$drop':
                    results = this.drop(params.collection);
                    break;
                case '$dropIndex':
                    results = this.dropFieldIndex(params.collection, params);
                    break;
                case '$many':
                    results = this.deleteMany(params.collection, query);
                    break;
                default:
                    results = this.delete(params.collection, params.id);
            }
        } else {
            results = this.skipResponse();
        }

        return results;
    }
    //
    // Protected methods.
    protected dropFieldIndex(collectionName: string, params: { [name: string]: any }): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col.dropFieldIndex(params.queryParams.field)
                            .then(() => {
                                result.body = {};
                                resolve(result);
                            }).catch((err: string) => this.rejectWithCode500(err, reject));
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    protected delete(collectionName: string, documentId: string): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col.remove(documentId)
                            .then(() => {
                                result.body = {};
                                resolve(result);
                            }).catch((err: string) => this.rejectWithCode500(err, reject));
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    protected deleteMany(collectionName: string, query: any): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (query) {
                if (this._hiddenCollections.indexOf(collectionName) < 0) {
                    this._connection.collection(collectionName)
                        .then((col: any) => {
                            col.removeMany(query)
                                .then((rmResults: any) => {
                                    result.body = rmResults;
                                    resolve(result);
                                }).catch((err: string) => this.rejectWithCode500(err, reject));
                        }).catch((err: string) => this.rejectWithCode500(err, reject));
                } else {
                    this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
                }
            } else {
                this.rejectWithCode400(`Wrong query parameter. Query: ${JSON.stringify(query)}`, reject);
            }
        });
    }
    protected drop(collectionName: string): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col.drop()
                            .then(() => {
                                result.body = {};
                                resolve(result);
                            }).catch((err: string) => this.rejectWithCode500(err, reject));
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    protected setKnownEndpoints(): void {
        this.setKnownEndpointsFromFile('delete');
    }
}