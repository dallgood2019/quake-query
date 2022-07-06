const inquirer = require('inquirer');
const chalk = require('chalk');

/*
These methods deal with the prompts for a user. A user has a choice to search for earthquake events from the past 7 days, 30 days, and for both choice
they must enter a code for a unqiue event, which returns  a URL for that event.
*/

module.exports = {
  askForSelection: () => {

    const questions = [
      {
        type: 'list',
        name: 'selection',
        message: chalk.green('Search for data from the last:'),
        choices: ['7 days', '30 days'],
        default: '7 days',
      },
    ];
    return inquirer.prompt(questions);
  },
  askForCode: () => {
    const reg = new RegExp("^[a-zA-Z0-9_]+$")

    const questions = [
      {
        name: 'code',
        type: 'input',
        message: chalk.green('Enter a code to search by:'),
        validate: function (value) {
          if (value.length && reg.test(value)) {
            return true;
          } else {
            return 'Please enter a valid code.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
  askToRetry: () => {
    const questions = [
      {
        type: 'list',
        name: 'selection',
        message: chalk.green('Start over?'),
        choices: ['Yes', chalk.red('Exit')],
        default: 'Yes',
      },
    ];
    return inquirer.prompt(questions);
  },
  getNext20Rows: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'selection',
        message: chalk.green('Show more results?'),
        default: 'Y',
      },
    ];
    return inquirer.prompt(questions);
  }
};
