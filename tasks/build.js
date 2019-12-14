const consola = require('consola');
const execa = require('execa');

(async () => {
  // Build Server for production
  try {
    consola.info('Building Server…');
    execa('yarn', ['build:server']).then(() => consola.success('Server built.'));
  } catch (error) {
    consola.error(error);
  }

  // Build Client for production
  try {
    consola.info('Building Client…');
    execa('yarn', ['build:client']).then(() => consola.success('Client built.'));
  } catch (error) {
    consola.error(error);
  }
})();
