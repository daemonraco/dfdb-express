/**
 * @file get.ts
 * @author Alejandro D. Simi
 */

import { BasicDictionary, DBDocument, DBDocumentID } from "dfdb";
import { Promise } from 'es6-promise';

import { Method } from "./method";
import { MethodEndpoint } from "./method-endpoint";
import { Response } from "./response";

export class Get extends Method {
    //
    // Public methods.
    public process(params: BasicDictionary): Promise<Response> {
        let results: Promise<Response> = null;

        const simple = typeof params.queryParams.simple !== 'undefined';
        let filter = typeof params.queryParams.filter === 'undefined' ? null : params.queryParams.filter;
        let query = typeof params.queryParams.query === 'undefined' ? null : params.queryParams.query;

        try { filter = JSON.parse(filter); } catch (e) { filter = null; }
        try { query = JSON.parse(query); } catch (e) { query = null; }

        if (params.collection) {
            switch (params.collection) {
                case '$info':
                    results = this.connectionInfo(params);
                    break;
                default:
                    if (params.id) {
                        switch (params.id) {
                            case '$schema':
                                results = this.schema(params.collection);
                                break;
                            case '$indexes':
                                results = this.indexes(params.collection);
                                break;
                            case '$create':
                                results = this.createCollection(params.collection);
                                break;
                            default:
                                results = this.document(params.collection, params.id);
                                break;
                        }
                    } else {
                        results = this.collection(params.collection, simple, { filter, query });
                    }
                    break;
            }
        } else {
            results = this.listCollections(simple);
        }

        return results;
    }
    //
    // Protected methods.
    protected createCollection(collectionName: string): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const collections = this._connection.collections();

            if (typeof collections[collectionName] === 'undefined') {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        result.body = { created: true };
                        resolve(result);
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode500(`Collection '${collectionName}' already exits`, reject)
            }
        });
    }
    protected collection(collectionName: string, simple: boolean = false, conditionSets: BasicDictionary): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const collections = this._connection.collections();
            const { filter, query } = conditionSets;

            let searchMechanism: string = 'search';
            let conditions: BasicDictionary = null;
            if (filter !== null) {
                searchMechanism = 'find';
                conditions = filter;
            } else {
                conditions = query;
            }
            if (!conditions) {
                conditions = {};
            }

            const buildBody: any = (data: any) => {
                return simple ? data.docs : data;
            }

            if (typeof collections[collectionName] !== 'undefined' && this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col[searchMechanism](conditions)
                            .then((docs: DBDocument[]) => {
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
    protected connectionInfo(params: BasicDictionary): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();
            let fullDocs: boolean = typeof params.queryParams.fullDocs !== 'undefined';

            result.body = {
                endpoints: this._manager.endpoints(fullDocs),
                collections: this._connection.collections(),
                initializer: this._connection.hasInitializer() ? this._connection.initializer().toJSON() : null
            };

            resolve(result);
        });
    }
    protected document(collectionName: string, documentId: DBDocumentID): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const collections = this._connection.collections();

            if (typeof collections[collectionName] !== 'undefined' && this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        col.searchOne({ _id: documentId })
                            .then((data: DBDocument) => {
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
    protected indexes(collectionName: string): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const collections: any = this._connection.collections();

            if (typeof collections[collectionName] !== 'undefined' && this._hiddenCollections.indexOf(collectionName) < 0) {
                this._connection.collection(collectionName)
                    .then((col: any) => {
                        result.body = col.indexes();
                        resolve(result);
                    }).catch((err: string) => this.rejectWithCode500(err, reject));
            } else {
                this.rejectWithCode404(`Collection not found`, reject);
            }
        });
    }
    protected listCollections(simple: boolean = false): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const tempResult: any = this._connection.collections();
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

            const collections: any = this._connection.collections();

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
    protected setKnownEndpoints(): void {
        this.setKnownEndpointsFromFile('get');
    }
}