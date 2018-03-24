[![Build Status](https://travis-ci.org/daemonraco/dfdb-express.svg?branch=master)](https://travis-ci.org/daemonraco/dfdb-express)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/783fe92fd0d641dda0e4261008ab93a7)](https://www.codacy.com/app/daemonraco/dfdb-express?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=daemonraco/dfdb-express&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/4b78f2337e1f0b4adc2c/maintainability)](https://codeclimate.com/github/daemonraco/dfdb-express/maintainability)

# DocsOnFileDB (ExpressJS connector)
This is a simple extension to easily expose a DocsOnFileDB through Express as a RESTful API.

# Contents
<!-- TOC updateOnSave:true -->

- [DocsOnFileDB (ExpressJS connector)](#docsonfiledb-expressjs-connector)
- [Contents](#contents)
- [Installation](#installation)
- [How to use](#how-to-use)
- [Endpoints](#endpoints)
- [Licence](#licence)

<!-- /TOC -->


# Installation
To install this module you may run:
```
npm install --save dfdb-express
```

# How to use
This code example shows a simple express server and how to set express to expose
certain __DocsOnFileDB__:
```js
'use strict';

//
// What port should be use?
const port = process.env.PORT || 3000;

//
// Basic required libraries.
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');

//
// Creating an express library.
const app = express();

//
// Basic middlewares.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//
// Importing 'dfdb-express' middleware.
const expressConnector = require('dfdb-express').middleware;
//
// Telling express to handle database API accesses on the URI '/rest/mydb'.
// Of course 'dbname' and 'dbpath' are the basic parameters required by
// 'DocsOnFileDB' to access certain database, in this case, the one that's going
// to be exposed.
// Also, in this configuraion the collection 'my_private_collection' won't be
// exposed.
app.use(expressConnector({
    dbname: 'mydb',
    dbpath: path.join(__dirname, 'db-dir'),
    restPath: '/rest/mydb',
    hide:[
        'my_private_collection'
    ]
}));

//
// Capturing unkwnon route requests.
app.all('*', (req, res) => {
    res.status(404).json({
        message: `Path '${req.url}' was not found.`
    });
});

//
// Starting server.
http.createServer(app).listen(port, () => {
    console.log(`listening on port ${port}`);
});
```

# Endpoints
These are endpoints provided by this connector:
<!-- AUTO:endpoints -->
* `[GET] /rest/mydb/$info` Provides information about current database connection and it's assets.
* `[POST] /rest/mydb/:collection/$createIndex?field=:name` Creates a field index for a collection and indexes it.
* `[GET] /rest/mydb/:collection/$create` Triggers the creation of certain collection.
* `[DELETE] /rest/mydb/:collection/$dropIndex?field=:name` Drops a field index from a collection.
* `[DELETE] /rest/mydb/:collection/$drop`
* `[GET] /rest/mydb/:collection/$indexes`
* `[GET] /rest/mydb/:collection/$schema`
* `[PUT] /rest/mydb/:collection/$schema` Updates a collection's schema specification.
* `[POST] /rest/mydb/:collection/$truncate` Remove all documents from a collection. It doesn't reset indexes.
* `[DELETE] /rest/mydb/:collection/:id`
* `[GET] /rest/mydb/:collection/:id`
* `[PUT] /rest/mydb/:collection/:id`
* `[GET] /rest/mydb/:collection` Retrieves all the information inside certain collection.
* `[POST] /rest/mydb/:collection`
<!-- /AUTO -->

# Licence
MIT &copy; 2018 [Alejandro Dario Simi](http://daemonraco.com)
