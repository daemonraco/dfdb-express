/**
 * @file delete.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';

import { Method } from "./method";
import { Response } from "./response";

export class Delete extends Method {
    public process(params: { [name: string]: any }): Promise<Response> {
        let results: Promise<Response> = null;

        if (params.collection && params.id) {
            results = this.delete(params.collection, params.id);
        } else {
            results = this.skipResponse();
        }

        return results;
    }

    protected delete(collectionName: string, documentId: string): Promise<Response> {
        return new Promise<Response>((resolve: (res: Response) => void, reject: (err: Response) => void) => {
            const result: Response = new Response();

            const send500: any = (err: string) => {
                result.status = 500;
                result.errorBody = { message: err };

                reject(result);
            }

            this._connection.collection(collectionName)
                .then((col: any) => {
                    col.remove(documentId)
                        .then(() => {
                            result.body = {};
                            resolve(result);
                        })
                        .catch(send500);
                })
                .catch(send500);
        });
    }
}