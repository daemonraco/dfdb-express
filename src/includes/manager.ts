/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */

import { Promise } from 'es6-promise';
import { DocsOnFileDB } from 'dfdb';

import { Delete } from './delete';
import { Get } from './get';
import { Post } from './post';
import { Put } from './put';
import { Method } from './method';
import { Response } from './response';

export class Manager {
    protected _connection: any = null;
    protected _fullUrlPattern: RegExp = null;
    protected _processors: { [name: string]: Method } = {};
    protected _options: any = {};
    protected _subUrlPattern: RegExp = /^\/(.+)(\/.*|)/;

    constructor(options: { [name: string]: any }) {
        this._options = options;
        const { dbname, dbpath, restPath } = this._options;

        if (dbname === undefined) {
            throw `Required option 'dbname' was not given`;
        }
        if (dbpath === undefined) {
            throw `Required option 'dbpath' was not given`;
        }
        if (restPath === undefined) {
            throw `Required option 'restPath' was not given`;
        }

        DocsOnFileDB.connect(dbname, dbpath)
            .then(conn => {
                this._connection = conn;

                this._processors['GET'] = new Get(this._connection);
                this._processors['POST'] = new Post(this._connection);
                this._processors['PUT'] = new Put(this._connection);
                this._processors['PATCH'] = this._processors['PUT'];
                this._processors['DELETE'] = new Delete(this._connection);
            })
            .catch(err => { throw err; });

        this._fullUrlPattern = RegExp(`^${restPath}(.*)`);
    }

    public process(req: { [name: string]: any }, res: { [name: string]: any }): Promise<Response> {
        //
        // Building promise to return.
        return new Promise<Response>((resolve: (result: Response) => void, reject: (err: Response) => void) => {
            let results: Response = new Response();
            const fullUrlMatches = req.url.split('?').shift().match(this._fullUrlPattern);

            if (fullUrlMatches) {
                let subUrl: string = fullUrlMatches[1];
                let subUrlPieces: string[] = subUrl.split('/').filter(x => x);

                let method: string = req.method;
                let collection: string = typeof subUrlPieces[0] !== 'undefined' ? subUrlPieces[0] : null;
                let id: string = typeof subUrlPieces[1] !== 'undefined' ? subUrlPieces[1] : null;
                let queryParams: { [name: string]: string } = req.query;
                let body: { [name: string]: string } = req.body;

                if (typeof req.body !== 'object' && typeof req.headers['content-type'] !== 'undefined' && req.headers['content-type'] === 'application/json') {
                    try {
                        body = JSON.parse(req.body);
                    } catch (e) {
                        body = {};
                    }
                }

                if (typeof this._processors[method] !== 'undefined') {
                    this._processors[method].process({ collection, id, queryParams, body })
                        .then(resolve)
                        .catch(reject);
                } else {
                    results.skip = true;
                    reject(results);
                }
            } else {
                results.skip = true;
                reject(results);
            }
        });
    }
};