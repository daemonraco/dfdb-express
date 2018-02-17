#!/bin/bash -x
kill $(cat ./test/tmp/PID);
cat ./test/tmp/test-server.log;
