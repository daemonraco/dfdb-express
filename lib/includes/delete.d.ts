/**
 * @file delete.ts
 * @author Alejandro D. Simi
 */
import { Promise } from 'es6-promise';
import { Method } from "./method";
import { Response } from "./response";
export declare class Delete extends Method {
    process(params: {
        [name: string]: any;
    }): Promise<Response>;
    protected dropFieldIndex(collectionName: string, params: {
        [name: string]: any;
    }): Promise<Response>;
    protected delete(collectionName: string, documentId: string): Promise<Response>;
    protected drop(collectionName: string): Promise<Response>;
    protected setKnownEndpoints(): void;
}
