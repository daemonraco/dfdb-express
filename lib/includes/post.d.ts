/**
 * @file post.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary } from "dfdb";
import { Promise } from 'es6-promise';
import { Method } from "./method";
import { Response } from "./response";
export declare class Post extends Method {
    process(params: BasicDictionary): Promise<Response>;
    protected createFieldIndex(collectionName: string, params: BasicDictionary): Promise<Response>;
    protected insert(collectionName: string, document: BasicDictionary): Promise<Response>;
    protected reinitialize(): Promise<Response>;
    protected setInitializer(data: any): Promise<Response>;
    protected setKnownEndpoints(): void;
    protected truncate(collectionName: string): Promise<Response>;
}
