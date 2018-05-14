/**
 * @file post.ts
 * @author Alejandro D. Simi
 */

import { BasicDictionary } from "dfdb";
import { Promise } from 'es6-promise';

import { Method } from "./method";
import { MethodEndpoint } from "./method-endpoint";
import { Response } from "./response";

export class Post extends Method {
    //
    // Public methods.
    public process(params: BasicDictionary): Promise<Response> {
        let results: Promise<Response> = null;

        if (params.collection === '$initializer' && !params.id) {
            results = this.setInitializer(params.body);
        } else if (params.collection === '$reinitialize' && !params.id) {
            results = this.reinitialize();
        } else if (params.collection && params.id === '$truncate') {
            results = this.truncate(params.collection);
        } else if (params.collection && params.id === '$createIndex') {
            results = this.createFieldIndex(params.collection, params);
        } else if (params.collection && !params.id) {
            results = this.insert(params.collection, params.body);
        } else {
            results = this.skipResponse();
        }

        return results;
    }
    //
    // Protected methods.
    protected createFieldIndex(collectionName: string, params: BasicDictionary): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col.addFieldIndex(params.queryParams.field)
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
    protected insert(collectionName: string, document: BasicDictionary): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col.insert(document)
                            .then((insertedDocument: any) => {
                                result.body = insertedDocument;
                                resolve(result);
                            }).catch((err: string) => this.rejectWithCode500(err, reject));
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    protected reinitialize(): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            this._connection.reinitialize()
                .then(() => {
                    resolve(result);
                }).catch((err: string) => this.rejectWithCode500(err, reject));
        });
    }
    protected setInitializer(data: any): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            this._connection.setInitializerFromJSON(data)
                .then(() => {
                    resolve(result);
                }).catch((err: string) => this.rejectWithCode500(err, reject));
        });
    }
    protected setKnownEndpoints(): void {
        this.setKnownEndpointsFromFile('post');
    }
    protected truncate(collectionName: string): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col.truncate()
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
}