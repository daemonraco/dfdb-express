'use strict';

const path = require('path');

module.exports = ({ app, expressConnector }) => {
    app.use(expressConnector({
        dbname: 'test_multichanges',
        dbpath: path.join(__dirname, '../../tmp'),
        restPath: '/rest/multi'
    }));
};