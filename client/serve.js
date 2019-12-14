const handler = require('serve-handler');
const http = require('http');

const { REACT_APP_CLIENT_HOST, REACT_APP_CLIENT_PORT } = process.env;

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: 'build'
  });
});

server.listen(REACT_APP_CLIENT_PORT, () => {
  console.info('Client: Accepting connections at ' + REACT_APP_CLIENT_HOST);
});
