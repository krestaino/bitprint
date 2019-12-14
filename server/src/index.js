import cors from 'cors';
import express from 'express';

const { REACT_APP_CLIENT_HOST, SERVER_HOST, SERVER_PORT } = process.env;
const server = express();

server.use(cors({ origin: REACT_APP_CLIENT_HOST }));

server.get('/api', async ({ res }) => {
  res.send({ message: 'Hello from the Server.' });
});

server.listen(SERVER_PORT, () => {
  console.info('Server: Accepting connections at ' + SERVER_HOST);
});
