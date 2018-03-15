/**
 * @file delete.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';

import { Method } from "./method";
import { Response } from "./response";

export class Delete extends Method {
    //
    // Public methods.
    public process(params: { [name: string]: any }): Promise<Response> {
        let results: Promise<Response> = null;

        if (params.collection && params.id) {
            switch (params.id) {
                case '$drop':
                    results = this.drop(params.collection);
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
}