#!/bin/bash
#
rm -fr ./test/tmp/* 2>/dev/null 2>&1;
#
node ./test/assets/generate-test-dbs.js 2>&1 | tee ./test/tmp/generate-dbs.log;
#
nodemon -e js,html,css -i node_modules -i package.json -i src -i tsconfig.json -i ui-ng ./test/assets/dfdb-test-server.js;
