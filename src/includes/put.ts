/**
 * @file put.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';

import { Method } from "./method";
import { Response } from "./response";

export class Put extends Method {
    public process(params: { [name: string]: any }): Promise<Response> {
        let results: Promise<Response> = null;

        if (params.collection && params.id) {
            results = this.update(params.collection, params.id, params.body);
        } else {
            results = this.skipResponse();
        }

        return results;
    }

    protected update(collectionName: string, documentId: string, document: { [name: string]: any }): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const send500: any = (err: string) => {
                result.status = 500;
                result.errorBody = { message: err };

                reject(result);
            }

            this._connection.collection(collectionName)
                .then((col: any) => {
                    col.update(documentId, document)
                        .then((updatedDocument: any) => {
                            result.body = updatedDocument;
                            resolve(result);
                        })
                        .catch(send500);
                })
                .catch(send500);
        });
    }
}