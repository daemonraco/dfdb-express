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
    protected insert(collectionName: string, document: {
        [name: string]: any;
    }): Promise<Response>;
    protected setKnownEndpoints(): void;
}
