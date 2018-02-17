#!/bin/bash
kill $(cat ./test/tmp/PID);

echo "Execution log:"
cat ./test/tmp/test-server.log | awk '{print "  |  " $0}';
