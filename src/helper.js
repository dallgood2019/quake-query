const axios = require('axios');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');
const figlet = require('figlet');
const { askToRetry, getNext20Rows } = require('./inquier');
const clear = require('clear');

module.exports = {
  // Calls the US Geology Service API
  query: async (url) => {

    try {
      const spin = new Spinner('Searching historical data...');
      spin.start();
      const response = await axios.get(url);

      if (response.status === 200) {
        spin.stop();
        return response.data.features
      } else {
        spin.stop();
        return `Request not OK: ${response.status} status code.`
      }
    } catch (error) {
      spin.stop();
      return `Error calling US Geology Service API: ${error}`
    }
  },

  // Returns the current date minus inputed range in the format 'yyyy-mm-dd' 
  determineDateRange: (range) => {
    let tempDate = new Date()
    let tempDate2 = new Date(tempDate.setDate(tempDate.getDate() - range))
    let offset = tempDate2.getTimezoneOffset()
    let tempDate3 = new Date(tempDate2.getTime() - (offset * 60 * 1000))
    let finalDate = tempDate3.toISOString().split('T')[0]

    return finalDate
  },
  // Filters the response returned from calling the 'query' method and scans the array of objects for a matching earthquake event by the code
  findByCode: (data, code) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i]?.properties?.code === code) {
        return data[i]?.properties?.detail
      }
    }
  },
  // Filters out non-earthquake events and properties that are null or undefined from the response object
  filterAndCleanData: (data) => {
    let filteredData = []
    for (let i = 0; i < data.length; i++) {

      if ((data[i]?.properties?.type === 'earthquake') && (data[i]?.properties?.place !== null && data[i]?.properties?.detail !== null)) {
        filteredData.push(data[i])
      }
    }
    return filteredData
  },
  // Logs the results from the query call to the console
  displayResults: async (data, url, dateRange) => {
    console.log(chalk.green('Detail URL: ') + chalk.cyan(url))
    console.log('\n')
    if (dateRange === 7) {
      console.log(chalk.green('Locations with a magnitude over 4.5 for the last day:'))
    } else {
      console.log(chalk.green('Country/State earthquake count from past 30 days:'))
    }
    let count = 20;
    let hasFinished = false;

    /* This function handles the amount of results displayed at a given time. Prompts the user to show more results,
    show more results, or exit the app. Default is 20. */
    const iterateOrResults = (async (index) => {
      for (let i = index; i < count; i++) {
        if (data[i] === undefined) {
          hasFinished = true
          break;
        } else {
          let result = chalk.cyan(`${data[i]}`)
          console.log(result)
        }
      }
      let showMoreRows = false;

      if (hasFinished === false) {
        console.log('\n')
        let expandRows = await getNext20Rows()
        console.log('\n')
        if (expandRows.selection === true) {
          showMoreRows = true
        }
      }

      if (showMoreRows === true && hasFinished === false) {
        count = count + 20
        await iterateOrResults(count - 20)
      }
    })

    await iterateOrResults(0)
  },
  // Maps the number of earthquakes per country
  mapCountToCountry: (data) => {
    const count = {}
    let result = []

    data.forEach((item) => {

      let ctry = item.split(',')
      let ctry2 = ctry[ctry.length - 1].trim()
      if (count[ctry2]) {
        count[ctry2] = count[ctry2] += 1
      } else {
        count[ctry2] = 1
      }
    })

    for (let key in count) {
      result.push(`${key}: ${chalk.yellow(count[key])}`)
    }

    return result
  },
  // Prompts the user to retry if the inputed code did not match a match, or if they want to search using a different date range
  retryOrExit: async (main) => {
    const retryOrExitResposne = await askToRetry()

    if (retryOrExitResposne.selection === 'Yes') {
      clear();
      main()
    } else {
      clear()
      console.log(chalk.blackBright(figlet.textSync('Earthquake Query', { font: 'Standard', horizontalLayout: 'full' })))
      console.log(chalk.green('All done!'))
    }
  },
  lineBreak: () => {
    console.log('\n')
  },
  write: (input) => {
    console.log(input)
  },
};

