#!/bin/bash -x
rm -fr ./test/tmp/* 2>/dev/null 2>&1;
nohup node ./test/assets/dfdb-test-server.js >./test/tmp/test-server.log 2>&1 &
echo $! > ./test/tmp/PID;
