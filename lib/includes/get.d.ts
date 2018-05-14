/**
 * @file get.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary, DBDocumentID } from "dfdb";
import { Promise } from 'es6-promise';
import { Method } from "./method";
import { Response } from "./response";
export declare class Get extends Method {
    process(params: BasicDictionary): Promise<Response>;
    protected createCollection(collectionName: string): Promise<Response>;
    protected collection(collectionName: string, simple: boolean, conditionSets: BasicDictionary): Promise<Response>;
    protected connectionInfo(params: BasicDictionary): Promise<Response>;
    protected document(collectionName: string, documentId: DBDocumentID): Promise<Response>;
    protected indexes(collectionName: string): Promise<Response>;
    protected listCollections(simple?: boolean): Promise<Response>;
    protected schema(collectionName: string): Promise<Response>;
    protected setKnownEndpoints(): void;
}
