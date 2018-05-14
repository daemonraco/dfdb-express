/**
 * @file put.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary, DBDocumentID } from "dfdb";
import { Promise } from 'es6-promise';
import { Method } from "./method";
import { Response } from "./response";
export declare class Put extends Method {
    process(params: BasicDictionary): Promise<Response>;
    protected setSchema(collectionName: string, data: BasicDictionary): Promise<Response>;
    protected update(collectionName: string, documentId: DBDocumentID, document: BasicDictionary, partial: boolean): Promise<Response>;
    protected updateMany(collectionName: string, query: BasicDictionary, document: BasicDictionary): Promise<Response>;
    protected setKnownEndpoints(): void;
}
