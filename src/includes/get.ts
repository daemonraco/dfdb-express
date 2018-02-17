/**
 * @file get.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';

import { Method } from "./method";
import { Response } from "./response";

export class Get extends Method {
    public process(params: { [name: string]: any }): Promise<Response> {
        let results: Promise<Response> = null;

        const simple = typeof params.queryParams.simple !== 'undefined';
        const filter = typeof params.queryParams.filter === 'undefined' ? null : params.queryParams.filter;
        const query = typeof params.queryParams.query === 'undefined' ? null : params.queryParams.query;

        if (params.collection) {
            if (params.id) {
                results = this.document(params.collection, params.id);
            } else {
                results = this.collection(params.collection, simple, { filter, query });
            }
        } else {
            results = this.listCollections(simple);
        }

        return results;
    }

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

            const send500: any = (err: string) => {
                result.status = 500;
                result.errorBody = { message: err };

                reject(result);
            }
            const buildBody: any = (data: any) => {
                return simple ? data.docs : data;
            }

            if (typeof collections[collectionName] !== 'undefined') {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col[searchMechanism](conditions)
                            .then((docs: any[]) => {
                                result.body = buildBody({ searchMechanism, conditions, docs });
                                resolve(result);
                            })
                            .catch(send500);
                    })
                    .catch((err: string) => {
                        send500(err);
                    });
            } else {
                result.body = buildBody({ searchMechanism, conditions, docs: [] });
                resolve(result);
            }
        });
    }
    protected document(collectionName: string, documentId: string): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const send404: any = () => {
                result.status = 404;
                result.errorBody = { message: `Document with id '${documentId}' not found` };

                reject(result);
            };
            const send500: any = (err: string) => {
                result.status = 500;
                result.errorBody = { message: err };

                reject(result);
            };

            const collections = this._connection.collections();

            if (typeof collections[collectionName] !== 'undefined') {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col.searchOne({ _id: documentId })
                            .then((data: any) => {
                                if (data) {
                                    result.body = data;
                                    resolve(result);
                                } else {
                                    send404();
                                }
                            })
                            .catch(send500);
                    })
                    .catch(send500);
            } else {
                send404();
            }
        });
    }
    protected listCollections(simple: boolean = false): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            if (simple) {
                result.body = Object.keys(this._connection.collections());
            } else {
                result.body = this._connection.collections();
            }

            resolve(result);
        });
    }
}