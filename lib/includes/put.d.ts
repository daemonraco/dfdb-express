/**
 * @file put.ts
 * @author Alejandro D. Simi
 */
import { Promise } from 'es6-promise';
import { Method } from "./method";
import { Response } from "./response";
export declare class Put extends Method {
    process(params: {
        [name: string]: any;
    }): Promise<Response>;
    protected setSchema(collectionName: string, data: {
        [name: string]: any;
    }): Promise<Response>;
    protected update(collectionName: string, documentId: string, document: {
        [name: string]: any;
    }, partial: boolean): Promise<Response>;
}
