/**
 * @file index.ts
 * @author Alejandro D. Simi
 */

import { Manager } from './includes/manager';
import { Response } from './includes/response';

export = {
    middleware: (options: any) => {
        const manager = new Manager(options);

        return (req: { [name: string]: any }, res: { [name: string]: any }, next: () => void) => {
            const respond = (response: Response) => {
                if (response.skip) {
                    next();
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
