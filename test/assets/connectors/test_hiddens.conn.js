'use strict';

const path = require('path');

module.exports = ({ app, expressConnector }) => {
    app.use(expressConnector({
        dbname: 'test_hiddens',
        dbpath: path.join(__dirname, '../../tmp'),
        restPath: '/rest/hiddens',
        hide: ['profiles']
    }));
};