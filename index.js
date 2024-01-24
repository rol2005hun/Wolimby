const BoilerplateClient = require('./src/util/client');
const ChalkAdvanced = require('chalk-advanced');

const client = new BoilerplateClient();

client.loginBot().then(() => {
  console.log(
    `${ChalkAdvanced.white('WoliBot')} ${ChalkAdvanced.gray(
      '>'
    )} ${ChalkAdvanced.green('A bot sikeresen elindult.')}`
  );
});
