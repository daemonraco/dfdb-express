/**
 * @file delete.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary, DBDocumentID } from "dfdb";
import { Promise } from 'es6-promise';
import { Method } from "./method";
import { Response } from "./response";
export declare class Delete extends Method {
    process(params: BasicDictionary): Promise<Response>;
    protected dropFieldIndex(collectionName: string, params: BasicDictionary): Promise<Response>;
    protected delete(collectionName: string, documentId: DBDocumentID): Promise<Response>;
    protected deleteMany(collectionName: string, query: BasicDictionary): Promise<Response>;
    protected drop(collectionName: string): Promise<Response>;
    protected setKnownEndpoints(): void;
}
