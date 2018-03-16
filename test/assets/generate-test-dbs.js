'use strict';

const dfdb = require('dfdb').DocsOnFileDB;
const fs = require('fs');
const path = require('path');

let steps = [];

const initPath = path.join(__dirname, 'initializers');
const pattern = /^(.+).init.js/;
fs.readdirSync(initPath)
    .filter(x => x.match(pattern))
    .forEach(x => {
        steps.push((next) => {
            const conf = require(path.join(initPath, x));

            dfdb.connect(conf.collection, path.join(__dirname, '../tmp')).then(conn => {
                conn.setInitializerFromJSON(conf.initializer)
                    .then(() => {
                        next();
                    });
            });
        });
    });

const run = () => {
    const step = steps.shift();
    if (step) {
        step(run)
    } else {
        process.exit();
    }
};
run();
