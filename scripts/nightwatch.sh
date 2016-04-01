npm run start &
TESTSERVER_PID=$!

NODE_CONFIG_DIR=./server/config ./node_modules/nightwatch/bin/nightwatch --config nightwatch.json

kill $TESTSERVER_PID
