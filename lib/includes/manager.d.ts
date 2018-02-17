/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
import { Promise } from 'es6-promise';
import { Method } from './method';
import { Response } from './response';
export declare class Manager {
    protected _connection: any;
    protected _fullUrlPattern: RegExp;
    protected _processors: {
        [name: string]: Method;
    };
    protected _options: any;
    protected _subUrlPattern: RegExp;
    constructor(options: {
        [name: string]: any;
    });
    process(req: {
        [name: string]: any;
    }, res: {
        [name: string]: any;
    }): Promise<Response>;
}
