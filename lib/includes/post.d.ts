/**
 * @file post.ts
 * @author Alejandro D. Simi
 */
import { Promise } from 'es6-promise';
import { Method } from "./method";
import { Response } from "./response";
export declare class Post extends Method {
    process(params: {
        [name: string]: any;
    }): Promise<Response>;
    protected createFieldIndex(collectionName: string, params: {
        [name: string]: any;
    }): Promise<Response>;
    protected insert(collectionName: string, document: {
        [name: string]: any;
    }): Promise<Response>;
    protected reinitialize(): Promise<Response>;
    protected setInitializer(data: any): Promise<Response>;
    protected setKnownEndpoints(): void;
    protected truncate(collectionName: string): Promise<Response>;
}
