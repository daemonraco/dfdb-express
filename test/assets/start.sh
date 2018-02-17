#!/bin/bash
rm -fr ./test/tmp/* 2>/dev/null 2>&1;
node ./test/assets/generate-test-dbs.js;
nohup node ./test/assets/dfdb-test-server.js >./test/tmp/test-server.log 2>&1 &
echo $! > ./test/tmp/PID;
