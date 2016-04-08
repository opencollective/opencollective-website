npm run start &
TESTSERVER_PID=$!

npm run nightwatch

kill $TESTSERVER_PID
