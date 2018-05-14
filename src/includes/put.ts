/**
 * @file put.ts
 * @author Alejandro D. Simi
 */

import { BasicDictionary, DBDocument, DBDocumentID } from "dfdb";
import { Promise } from 'es6-promise';

import { Method } from "./method";
import { MethodEndpoint } from "./method-endpoint";
import { Response } from "./response";

export class Put extends Method {
    //
    // Public methods.
    public process(params: BasicDictionary): Promise<Response> {
        let results: Promise<Response> = null;

        let query = typeof params.queryParams.query === 'undefined' ? null : params.queryParams.query;
        try { query = JSON.parse(query); } catch (e) { query = null; }

        if (params.collection && params.id) {
            switch (params.id) {
                case '$schema':
                    let schema: any = params.body;
                    schema = Object.keys(params.body).length === 0 ? null : schema;
                    results = this.setSchema(params.collection, schema);
                    break;
                case '$many':
                    results = this.updateMany(params.collection, query, params.body);
                    break;
                default:
                    const partial: boolean = typeof params.queryParams.partial !== 'undefined';
                    results = this.update(params.collection, params.id, params.body, partial);
                    break;
            }
        } else {
            results = this.skipResponse();
        }

        return results;
    }
    //
    // Protected methods.
    protected setSchema(collectionName: string, data: BasicDictionary): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        if (data === null) {
                            col.removeSchema()
                                .then(() => {
                                    result.body = { message: `Schema removed` };
                                    resolve(result);
                                }).catch((err: string) => this.rejectWithCode500(err, reject));
                        } else {
                            col.setSchema(data)
                                .then(() => {
                                    result.body = { message: `Schema updated` };
                                    resolve(result);
                                }).catch((err: string) => this.rejectWithCode500(err, reject));
                        }
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    protected update(collectionName: string, documentId: DBDocumentID, document: BasicDictionary, partial: boolean): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        const func: string = partial ? 'partialUpdate' : 'update';
                        col[func](documentId, document)
                            .then((updatedDocument: DBDocument) => {
                                result.body = updatedDocument;
                                resolve(result);
                            }).catch((err: string) => this.rejectWithCode500(err, reject));
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
    protected updateMany(collectionName: string, query: BasicDictionary, document: BasicDictionary): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (query) {
                if (this._hiddenCollections.indexOf(collectionName) < 0) {
                    this._connection.collection(collectionName)
                        .then((col: any) => {
                            col.updateMany(query, document)
                                .then((updatedDocuments: DBDocument[]) => {
                                    result.body = updatedDocuments;
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
    protected setKnownEndpoints(): void {
        this.setKnownEndpointsFromFile('put');
    }
}