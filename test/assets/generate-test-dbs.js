'use strict';

const dfdb = require('dfdb').DocsOnFileDB;
const path = require('path');

let steps = [];
steps.push((next) => {
    dfdb.connect('test_hiddens', path.join(__dirname, '../tmp')).then(conn => {
        conn.setInitializerFromJSON({
            collections: [{
                name: 'profiles',
                data: [{
                    user: 'Some user',
                    active: true
                }]
            }, {
                name: 'users',
                data: [{
                    isActive: false,
                    age: 30,
                    name: 'Boone Mendez',
                    gender: 'male',
                    company: 'ANOCHA',
                    email: 'boonemendez@anocha.com',
                    about: 'Magna dolore Lorem velit officia occaecat. Aliqua dolore ut dolor aliquip veniam dolor consectetur sunt fugiat. Tempor aliqua laboris mollit sunt Lorem. Irure sit fugiat proident proident cupidatat do adipisicing dolor ex do.\r\n',
                    tags: ['exercitation', 'non', 'do', 'occaecat', 'qui', 'est', 'sit']
                }]
            }]
        }).then(() => {
            next();
        });
    });
});
steps.push((next) => {
    dfdb.connect('test_schemas', path.join(__dirname, '../tmp')).then(conn => {
        conn.setInitializerFromJSON({
            collections: [{
                name: 'with_schema',
                schema: {
                    type: 'object',
                    properties: {
                        isActive: { type: 'boolean' },
                        age: { type: 'integer' },
                        name: { type: 'string' },
                        gender: { type: 'string' },
                        company: { type: 'string' },
                        xcompany: {
                            type: 'string',
                            default: 'NO COMPANY'
                        },
                        email: { type: 'string' },
                        about: { type: 'string' },
                        tags: { type: 'array' }
                    },
                    required: ['isActive', 'age', 'name', 'gender', 'company', 'about', 'tags']
                }
            }, {
                name: 'without_schema'
            }]
        }).then(() => {
            next();
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
