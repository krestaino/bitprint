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

const fs = require('fs');

const workFolderID = '11e8d6a8-984f-4625-9703-aa9100195fba';

fs.readFile('data.json', (err, data) => {
  if (err) throw err;

  const formatted = [];

  JSON.parse(data).items.filter(item => {
    if (item.folderId !== workFolderID && item.type === 1) {
      formatted.push({
        name: item.name,
        username: item.login ? item.login.username : null,
        password: item.login ? item.login.password : null,
        totp: item.login ? item.login.totp : null
      });
    }
  });

  fs.writeFile('format.json', JSON.stringify(formatted), 'utf8', function(err) {
    if (err) throw err;
  });
});
