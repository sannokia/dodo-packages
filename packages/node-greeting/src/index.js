var figlet = require('figlet');
var chalk = require('chalk');

const SPACER = '   ';

module.exports = (subtitle) => {
  var main = '';

  var mainAscii = figlet.textSync(main);
  var subtitleAscii = figlet.textSync(subtitle || '');

  var mainAsciiSplit = mainAscii.split('\n');
  var subtitleAsciiSplit = subtitleAscii.split('\n');

  var lines = mainAsciiSplit.length;

  console.log('\n');

  for (var i = 0; i < lines; i++) {
    console.log(
      chalk.green.bold(mainAsciiSplit[i]) +
        chalk.green.bold(SPACER) +
        chalk.blue(subtitleAsciiSplit[i])
    );
  }

  console.log('\n');
};
