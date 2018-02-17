"use strict";
/**
 * @file index.ts
 * @author Alejandro D. Simi
 */
const manager_1 = require("./includes/manager");
module.exports = {
    middleware: (options) => {
        const manager = new manager_1.Manager(options);
        //
        // Building the actual middleware to return.
        return (req, res, next) => {
            const respond = (response) => {
                if (response.skip) {
                    next();
                }
                else if (response.errorBody !== null) {
                    res.status(response.status).json(response.errorBody);
                }
                else {
                    res.status(response.status).json(response.body);
                }
            };
            manager.process(req, res)
                .then(respond)
                .catch(respond);
        };
    }
};
