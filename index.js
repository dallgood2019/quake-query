const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const { askForSelection, askForCode } = require('./src/inquier');
const { searchPast30Days, searchPast7Days } = require('./src/api');
const { lineBreak, write, displayResults, retryOrExit } = require('./src/helper')

/*
Main function for console app.

User has the ability to search for earthquake events from the past 7 days, 30 days, and for both options, enter a code
which will return a URL from a unqiue event should there be a match.

Example flow:

Search the past 7 days:
1. Enter a code to search by:
  Returns a URL (from any earthquake event from the past 7 days) and 
  prints place of all earthquakes with magnitude over 4.5 for the last day from high to low magnitude

Search the past 30 days:
1. Enter a code to search by:
  Returns a URL (from any earthquake event from the past 30 days)  and prints each state or country plus number of earthquakes
  that occurred
*/
const main = async () => {
  clear();
  write(chalk.blackBright(figlet.textSync('Earthquake Query', { font: 'Standard', horizontalLayout: 'full' })))
  lineBreak()

  try {
    let results;
    const searchBy = await askForSelection();

    if (searchBy.selection === '7 days') {
      const codeResponse = await askForCode();
      results = await searchPast7Days(codeResponse.code);
    }

    if (searchBy.selection === '30 days') {
      const codeResponse = await askForCode();
      results = await searchPast30Days(codeResponse.code)
    }

    if (results === 'No match') {
      lineBreak()
      console.log(chalk.yellowBright('Results: ' + chalk.red('No match!')))
      lineBreak()
      await retryOrExit(main)
    } else {
      lineBreak()
      await displayResults(results?.places, results?.url, results.dateRange)
      lineBreak()
      await retryOrExit(main)
    }
  } catch (err) {
    if (err) {
      write(chalk.red(err))
    }
  }
};

// start execution
main();
