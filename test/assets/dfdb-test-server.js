'use strict';

const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//
// Section to be tested @{
const expressConnector = require('../..').middleware;

const connPath = path.join(__dirname, 'connectors');
const pattern = /^(.+).conn.js/;
const params = { app, expressConnector };
fs.readdirSync(connPath)
    .filter(x => x.match(pattern))
    .forEach(x => {
        require(path.join(connPath, x))(params);
    });
// @}

app.all('*', (req, res) => {
    res.status(404).json({
        message: `Path '${req.url}' was not found.`
    });
});

http.createServer(app).listen(port, () => {
    console.log(`listening on port ${port}`);
});
