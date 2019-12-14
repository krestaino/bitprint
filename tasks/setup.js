const consola = require('consola');
const execa = require('execa');
const fs = require('fs');

(async () => {
  // Create an .env file if one doesn't exist
  try {
    consola.info('Checking for .env file…');
    if (!fs.existsSync('.env')) {
      fs.createReadStream('.env.example').pipe(fs.createWriteStream('.env'));
      consola.success('Created .env file.');
    } else {
      consola.success('Detected .env file, skipping creation.');
    }
  } catch (error) {
    consola.error(error);
  }

  // Install Server dependecies
  try {
    consola.info('Installing Server dependecies…');
    await execa('yarn', ['setup:server']);
    consola.success('Server dependecies installed.');
  } catch (error) {
    consola.error(error);
  }

  // Install Client dependecies
  try {
    consola.info('Installing Client dependecies…');
    await execa('yarn', ['setup:client']);
    consola.success('Client dependecies installed.');
  } catch (error) {
    consola.error(error);
  }
})();
