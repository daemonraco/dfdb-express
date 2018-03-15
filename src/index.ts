/**
 * @file index.ts
 * @author Alejandro D. Simi
 */

import { Manager } from './includes/manager';
import { Response } from './includes/response';
import * as fs from 'fs';
import * as path from 'path';

const htmlCache: { [name: string]: string } = {};

export = {
    middleware: (options: any) => {
        const manager = new Manager(options);
        //
        // Building the actual middleware to return.
        return (req: { [name: string]: any }, res: { [name: string]: any }, next: () => void) => {
            const respond = (response: Response) => {
                if (response.skip) {
                    next();
                } else if (response.ui !== null) {
                    const physicPath: string = path.join(__dirname, '../ui', response.ui.subUri);
                    let physicPathStat: any = null;

                    try { physicPathStat = fs.statSync(physicPath); } catch (e) { }

                    if (physicPathStat && physicPathStat.isFile()) {
                        res.sendFile(physicPath);
                    } else if (response.ui.subUri === '/config.js') {
                        let content: string = `'use strict';\n\n`;

                        content += `const DFDBConfig = {\n`;
                        content += `\trestUri: '${response.ui.restUri}',\n`;
                        content += `\tuiUri: '${response.ui.uri}',\n`;
                        content += `\tauthType: '${response.ui.authType}'\n`;
                        content += `};\n`;

                        res.contentType('text/javascript');
                        res.send(content);
                    } else {
                        if (req.xhr || req.headers['accept'] === 'application/json' || req.headers['content-type'] === 'application/json') {
                            res.status(404).json({
                                message: 'Not Found',
                                uri: req.url,
                                isAjax: req.xhr
                            });
                        } else {
                            const key: string = `${response.ui.uri}`;
                            if (typeof htmlCache[key] === 'undefined') {
                                let html: string = fs.readFileSync(path.join(__dirname, '../ui/index.html')).toString();

                                html = html.replace(`<base href="/">`, `<base href="${response.ui.uri}/">`);
                                // html = html   .replace(`<link href="styles.`, `<link href="${response.ui.uri}/styles.`);

                                htmlCache[key] = html;
                            }

                            res.send(htmlCache[key]);
                        }
                    }
                } else if (response.errorBody !== null) {
                    res.status(response.status).json(response.errorBody)
                } else {
                    res.status(response.status).json(response.body)
                }
            };

            manager.process(req, res)
                .then(respond)
                .catch(respond);
        }
    }
};
