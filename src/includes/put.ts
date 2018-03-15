/**
 * @file put.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';

import { Method } from "./method";
import { Response } from "./response";

export class Put extends Method {
    //
    // Public methods.
    public process(params: { [name: string]: any }): Promise<Response> {
        let results: Promise<Response> = null;

        if (params.collection && params.id) {
            switch (params.id) {
                case '$schema':
                    let schema: any = params.body;
                    schema = Object.keys(params.body).length === 0 ? null : schema;
                    results = this.setSchema(params.collection, schema);
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
    protected setSchema(collectionName: string, data: { [name: string]: any }): Promise<Response> {
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
    protected update(collectionName: string, documentId: string, document: { [name: string]: any }, partial: boolean): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        const func: string = partial ? 'partialUpdate' : 'update';
                        col[func](documentId, document)
                            .then((updatedDocument: any) => {
                                result.body = updatedDocument;
                                resolve(result);
                            }).catch((err: string) => this.rejectWithCode500(err, reject));
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode403(`Forbidden access to collection '${collectionName}'`, reject);
            }
        });
    }
}