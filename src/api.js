const { query, filterAndCleanData, findByCode, determineDateRange, mapCountToCountry } = require('./helper')
const chalk = require('chalk');

module.exports = {

  /* Searches all earthquake events from the past 7 days based on a code which returns a URL for that event,
  and the last days events as well, which returns the places with a magnitude of 4.6 or greater. */

  searchPast7Days: async (code) => {
    let currentDateMinus7 = determineDateRange(7)
    let currentDateMinus1 = determineDateRange(1)
    let currentDate = determineDateRange(0)

    try {
      let results = {}
      const eventsFromPast7Days = await query(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${currentDateMinus7}&endtime=${currentDate}`)
      const eventsFromPastDay = await query(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${currentDateMinus1}&endtime=${currentDate}&minmagnitude=4.6&orderby=magnitude`)
      const filteredEventsFromPast7Days = filterAndCleanData(eventsFromPast7Days)
      const filteredEventsFromPreviousDay = filterAndCleanData(eventsFromPastDay)
      const places = filteredEventsFromPreviousDay.map((feature) => feature?.properties?.place)
      const url = findByCode(filteredEventsFromPast7Days, code)

      if (url === undefined) {
        results.url = chalk.red('No match')
        results.places = places
        results.dateRange = 7
      } else {
        results.url = url
        results.places = places
        results.dateRange = 7
      }

      return results
    } catch (error) {
      return error;
    }
  },

  /* Searches all earthquake events from the past 30 days based on a code which returns a URL for that event,
  and returns the country/state with the number of occurances that occured in each. */

  searchPast30Days: async (code) => {
    let currentDateMinus30 = determineDateRange(30)
    let currentDate = determineDateRange(0)

    try {
      let results = {}
      const eventsFromPast30Days = await query(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${currentDateMinus30}&endtime=${currentDate}`)
      const filteredEventsFromPast30Days = filterAndCleanData(eventsFromPast30Days)

      const places = filteredEventsFromPast30Days.map((feature) => feature?.properties?.place)

      let earthquakeCountPerCountry = mapCountToCountry(places)
      const url = findByCode(filteredEventsFromPast30Days, code)

      if (url === undefined) {
        results.url = chalk.red('No match')
        results.places = earthquakeCountPerCountry
        results.dateRange = 30
      } else {
        results.url = url
        results.places = earthquakeCountPerCountry
        results.dateRange = 30
      }

      return results
    } catch (error) {
      return error;
    }
  },
};
