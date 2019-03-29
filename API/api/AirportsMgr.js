/**
 * @file This file contains the AirportsMgr class.
 *
 * @author Emiel Pasman
 * @author Andrés Salinas Lima
 * @author Stefan Valeanu
 */

'use strict';

const pagination = require('../utils/pagination')
const server = require('../server')
const stats = require('stats-lite')

var projectURL = server.projectURL;


/**
 * AirportsMgr class.
 *
 * Airports manager: gets the data from the database and generates the output for the different requests regarding airports.
 */
class AirportsMgr {
	/**
	 * Constructor for the AirportsMgr class.
	 *
	 * Stores the DatabaseWrapper object to connect to mongoDB.
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 * Returns all airports. Output is paginated and includes pagination metadata.
	 *
	 * @param [page_number=1]  number of the current page
	 * @param [per_page=30]    number of items per page
	 *
	 * @return {Object} Object with the paginated result ready to be sent to the client as json
	 */
	async getAirportsPaginated(page_number=1,  [per_page=30]) {
		var urlBeginning =  projectURL + "airports/"

		var airports = await this.db.getAllAirports();

		if(airports == undefined || airports.length == 0)
			throw new Error("Not found");

		airports.forEach(airport => {
			airport.url = urlBeginning + airport.code;
		});

		page_number = parseInt(page_number);
		per_page = parseInt(per_page);
		var firstItem = (page_number-1) * per_page;
		var lastItem = firstItem + per_page;

		return pagination.addPaginationMetaData(projectURL+"airports", airports.slice(firstItem, lastItem), airports.length, page_number, per_page);
	}

	/**
	 * Returns the selected airport
	 *
	 * @param airport airport code
	 *
	 * @return {Object} Object with the result ready to be sent to the client as json
	 */
	async getAirport(airport) {
		var fullAirport = await this.db.getAirport(airport);

		if (fullAirport == undefined)
			throw new Error("Not found");

		var result = {data: fullAirport.airport};
		return result;
	}

	/**
	 * Returns descriptive statistics for carrier-specific delays.
	 *
	 * @param airport   airport 1 code
	 * @param airport2  airport 2 code
	 * @param carrier   carrier code
	 * @param select    Can be ‘late-aircraft’, ‘weather’, ‘carrier’, ‘security’, ‘total’ or ‘national-aviation-system’.
	 * 	 *
	 * @return {Object} Object with the result ready to be sent to the client as json
	 */
	async getStats(airport, airport2, carrier, select) {
		if(select == undefined) {
			select = ["late-aircraft", "weather", "carrier", "security", "total", "national-aviation-system"];
		} else {
			select = select.split(",");
		}

		var fields = {"_id":0, "statistics.flights.total":1};
		select.forEach(function(selection) {
			fields["statistics.minutes delayed" + "." + selection.replace(/-/g, " ")] = 1;
		});

		var data = await this.db.getRouteStatistics(airport, airport2, carrier, fields);
		if(data == undefined || data.length == 0)
			throw new Error("Not found");

		var statistics = {};
		select.forEach(function(selection){
			var array = [];
			data.forEach(function(object){
				if(object["statistics"]["flights"] != undefined){
					var numFlights = object["statistics"]["flights"]["total"];
					if(object["statistics"]["minutes delayed"] != undefined){
						array.push(object["statistics"]["minutes delayed"][selection.replace(/-/g, " ")] / numFlights);
					}
				}
			});
			statistics[selection.replace(/-/g, " ")] = {}
			statistics[selection.replace(/-/g, " ")]["mean"] = stats.mean(array);
			statistics[selection.replace(/-/g, " ")]["median"] = stats.median(array);
			statistics[selection.replace(/-/g, " ")]["std"] = stats.stdev(array);
		});

		var result = {data:statistics};
		return result;
	}
}

module.exports.AirportsMgr = AirportsMgr
