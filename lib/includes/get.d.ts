/**
 * @file get.ts
 * @author Alejandro D. Simi
 */
import { Promise } from 'es6-promise';
import { Method } from "./method";
import { Response } from "./response";
export declare class Get extends Method {
    process(params: {
        [name: string]: any;
    }): Promise<Response>;
    protected createCollection(collectionName: string): Promise<Response>;
    protected collection(collectionName: string, simple: boolean, conditionSets: {
        [name: string]: any;
    }): Promise<Response>;
    protected connectionInfo(): Promise<Response>;
    protected document(collectionName: string, documentId: string): Promise<Response>;
    protected listCollections(simple?: boolean): Promise<Response>;
    protected schema(collectionName: string): Promise<Response>;
}
