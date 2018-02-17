#!/bin/bash
rm -fr ./test/tmp/* 2>/dev/null 2>&1;
nohup node ./test/assets/dfdb-test-server.js >/dev/null 2>&1 &
echo $! > ./test/tmp/PID;
