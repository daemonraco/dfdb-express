[![Build Status](https://travis-ci.org/daemonraco/dfdb-express.svg?branch=master)](https://travis-ci.org/daemonraco/dfdb-express)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/783fe92fd0d641dda0e4261008ab93a7)](https://www.codacy.com/app/daemonraco/dfdb-express?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=daemonraco/dfdb-express&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/4b78f2337e1f0b4adc2c/maintainability)](https://codeclimate.com/github/daemonraco/dfdb-express/maintainability)

# DocsOnFileDB (ExpressJS connector)
This is a simple extension to easily expose a DocsOnFileDB through Express as a RESTful API.

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
const expressConnector = require('../..').middleware;
//
// Telling express to handle database API accesses on the URI '/rest/mydb'.
// Of course 'dbname' and 'dbpath' are the basic parameters required by
// 'DocsOnFileDB' to access certain database, in this case, the one that's going
// to be exposed.
app.use(expressConnector({
    dbname: 'mydb',
    dbpath: path.join(__dirname, 'db-dir'),
    restPath: '/rest/mydb'
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
Based on te example, and assuming that you want to use a collection called
`users`, you'll be able to use these endpoints:
* `[GET] /rest/mydb` List of all known and exposed collections.
* `[GET] /rest/mydb?simple` Idem, but it's just a list of names.
* `[GET] /rest/mydb/users` List of documents stored inside the collection `users`.
* `[GET] /rest/mydb/users?simple` Idem, but it's just a list of documents.
* `[POST] /rest/mydb/users` Adds a new document into collection `users`.
* `[PUT] /rest/mydb/users/:id` Changes the content of certain document in
collection `users`.
* `[DELETE] /rest/mydb/users/:id` Removes certain document from collection
`users`.

# Licence
MIT &copy; 2018 [Alejandro Dario Simi](http://daemonraco.com)
