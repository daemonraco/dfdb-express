'use strict';

const dfdb = require('dfdb').DocsOnFileDB;
const path = require('path');

let steps = [];
steps.push((next) => {
    dfdb.connect('test_hiddens', path.join(__dirname, '../tmp')).then(conn => {
        conn.collection('profiles').then(col => {
            col.insert({
                user: 'Some user',
                active: true
            }).then(doc => {
                next();
            });
        });
    });
});
steps.push((next) => {
    dfdb.connect('test_hiddens', path.join(__dirname, '../tmp')).then(conn => {
        conn.collection('users').then(col => {
            col.insert({
                isActive: false,
                age: 30,
                name: 'Boone Mendez',
                gender: 'male',
                company: 'ANOCHA',
                email: 'boonemendez@anocha.com',
                about: 'Magna dolore Lorem velit officia occaecat. Aliqua dolore ut dolor aliquip veniam dolor consectetur sunt fugiat. Tempor aliqua laboris mollit sunt Lorem. Irure sit fugiat proident proident cupidatat do adipisicing dolor ex do.\r\n',
                tags: ['exercitation', 'non', 'do', 'occaecat', 'qui', 'est', 'sit']
            }).then(doc => {
                next();
            });
        });
    });
});
steps.push((next) => {
    dfdb.connect('test_schemas', path.join(__dirname, '../tmp')).then(conn => {
        conn.collection('with_schema').then(col => {
            col.setSchema({
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
            }).then(doc => {
                next();
            });
        });
    });
});
steps.push((next) => {
    dfdb.connect('test_schemas', path.join(__dirname, '../tmp')).then(conn => {
        conn.collection('without_schema').then(col => { });
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
run()
