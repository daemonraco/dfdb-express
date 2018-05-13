#!/bin/bash
rm -fr ./test/tmp/* 2>/dev/null 2>&1;
node ./test/assets/generate-test-dbs.js 2>&1 | tee ./test/tmp/generate-dbs.log;
nohup node ./test/assets/dfdb-test-server.js >./test/tmp/test-server.log 2>&1 &
echo $! > ./test/tmp/PID;
sleep 2;
