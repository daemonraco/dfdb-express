/**
 * @file get.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';

import { Method } from "./method";
import { Response } from "./response";

export class Get extends Method {
    //
    // Public methods.
    public process(params: { [name: string]: any }): Promise<Response> {
        let results: Promise<Response> = null;

        const simple = typeof params.queryParams.simple !== 'undefined';
        const filter = typeof params.queryParams.filter === 'undefined' ? null : params.queryParams.filter;
        const query = typeof params.queryParams.query === 'undefined' ? null : params.queryParams.query;

        if (params.collection) {
            if (params.id) {
                switch (params.id) {
                    case '$schema':
                        results = this.schema(params.collection);
                        break;
                    default:
                        results = this.document(params.collection, params.id);
                        break;
                }
            } else {
                results = this.collection(params.collection, simple, { filter, query });
            }
        } else {
            results = this.listCollections(simple);
        }

        return results;
    }
    //
    // Protected methods.
    protected collection(collectionName: string, simple: boolean = false, conditionSets: { [name: string]: any }): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const collections = this._connection.collections();
            const { filter, query } = conditionSets;

            let searchMechanism: string = 'search';
            let conditions: any = null;
            if (filter !== null) {
                searchMechanism = 'find';
                conditions = filter;
            } else {
                conditions = query;
            }
            if (conditions) {
                try { conditions = JSON.parse(conditions) } catch (e) {
                    conditions = {};
                };
            } else {
                conditions = {};
            }

            const buildBody: any = (data: any) => {
                return simple ? data.docs : data;
            }

            if (typeof collections[collectionName] !== 'undefined' && this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col[searchMechanism](conditions)
                            .then((docs: any[]) => {
                                result.body = buildBody({ searchMechanism, conditions, docs });
                                resolve(result);
                            }).catch((err: string) => this.rejectWithCode500(err, reject));
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                result.body = buildBody({ searchMechanism, conditions, docs: [] });
                resolve(result);
            }
        });
    }
    protected document(collectionName: string, documentId: string): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const collections = this._connection.collections();

            if (typeof collections[collectionName] !== 'undefined' && this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col.searchOne({ _id: documentId })
                            .then((data: any) => {
                                if (data) {
                                    result.body = data;
                                    resolve(result);
                                } else {
                                    this.rejectWithCode404(`Document with id '${documentId}' not found`, reject);
                                }
                            }).catch((err: string) => this.rejectWithCode500(err, reject));
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode404(`Document with id '${documentId}' not found`, reject);
            }
        });
    }
    protected listCollections(simple: boolean = false): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const tempResult = this._connection.collections();
            result.body = {};
            Object.keys(tempResult).forEach((name: string) => {
                if (this._hiddenCollections.indexOf(name) < 0) {
                    result.body[name] = tempResult[name];
                }
            });

            if (simple) {
                result.body = Object.keys(result.body);
            }

            resolve(result);
        });
    }
    protected schema(collectionName: string): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const collections = this._connection.collections();

            if (typeof collections[collectionName] !== 'undefined' && this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        if (col.hasSchema()) {
                            result.body = col.schema();
                            resolve(result);
                        } else {
                            result.body = null;
                            resolve(result);
                        }
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode404(`Collection not found`, reject);
            }
        });
    }
}