#!/bin/bash
rm -fr ./test/tmp/* 2>/dev/null 2>&1;
node ./test/assets/generate-test-dbs.js 2>&1 | tee ./test/tmp/generate-dbs.log;
nodemon -w lib ./test/assets/dfdb-test-server.js;
