#!/usr/bin/env node
'use strict';

const bodyParser = require('body-parser');
const chalk = require('chalk');
const commander = require('commander');
const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');
const tools = require('./tools');

let error = null;

commander
    .version(tools.version(), '-v, --version')
    .option('-d, --database [path]', 'Database that has to be served.')
    .option('-p, --port [port-number]', 'Port number.')
    .option('-P, --password [code]', 'Connection password')
    .option('-r, --restpath [uri]', 'Absolute URI where the RESTful API is provided')
    .option('-u, --uipath [uri]', 'Absolute URI where the Web-UI is provided')
    .parse(process.argv);

const port = commander.port || 3005;
const password = commander.password || null;
const restPath = commander.restpath && commander.restpath.match(/^\/.*/) ? commander.restpath : '/rest';
const uiPath = commander.uipath && commander.uipath.match(/^\/.*/) ? commander.uipath : '/ui';

if (!commander.database) {
    error = `No database given. Use '--database' to specify it.`;
}

if (!error) {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    //
    // Exposing collection @{
    const expressConnector = require('..').middleware;

    const dbPath = path.parse(path.resolve(commander.database));
    app.use(expressConnector({
        dbname: dbPath.name,
        dbpath: dbPath.dir,
        restPath, uiPath, password
    }));
    // @}

    app.all('*', (req, res) => {
        res.status(404).json({
            message: `Path '${req.url}' was not found.`,
            availableUrls: { restPath, uiPath }
        });
    });

    http.createServer(app).listen(port, () => {
        console.log(`Database '${chalk.green(dbPath.name)}' is now exposed at:`);
        console.log(`\tAPI:    '${chalk.green(`http://localhost:${port}${restPath}`)}'`);
        console.log(`\tWeb-UI: '${chalk.green(`http://localhost:${port}${uiPath}`)}'`);
        if (password) {
            console.log(chalk.yellow(`\tConnection requires a password`));
        }
    });

    const exitHandler = (options, err) => {
        process.exit();
    }
    //
    // Do something when app is closing.
    process.on('exit', exitHandler.bind(null, { cleanup: true }));
    //
    // Catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
    //
    // Catches "kill pid" (for example: nodemon restart).
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
    //
    // Catches uncaught exceptions.
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
} else {
    console.error(chalk.red(error));
}
