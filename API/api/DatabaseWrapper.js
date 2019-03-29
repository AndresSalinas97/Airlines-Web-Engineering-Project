/**
 * @file This file contains the DatabaseWrapper class.
 *
 * @author Emiel Pasman
 * @author Andrés Salinas Lima
 * @author Stefan Valeanu
 */

'use strict';

const MongoClient = require('mongodb').MongoClient;
const logger = require('../utils/logger')


/**
 * DatabaseWrapper class.
 *
 * Wrapper for the mongoDB database.
 */
class DatabaseWrapper {
	/**
	 * Constructor for the DatabaseWrapper class.
	 *
	 * Connects to mongoDB.
	 *
	 * @warning Uploading passwords to github is not very safe...
	 */
	constructor() {
		this.uri = "mongodb+srv://admin:admin@cluster0-q0yt0.gcp.mongodb.net/test?retryWrites=true";
		this.client = new MongoClient(this.uri, { useNewUrlParser: true });
		this.client.connect(err => {
			if(err != null) {
				logger.error("An error occurred while trying to connect to MongoDB");
				logger.error(err);
			} else {
				logger.info("Connected correctly to MongoDB server");
				this.airlinesCollection = this.client.db('web').collection('airlines');
				this.ratingsCollection = this.client.db('web').collection('user_ratings');
			}
		});
	}

	/**
	 * Destructor for the DatabaseWrapper class.
	 *
	 * Closes MongoClient.
	 */
	destructor() {
		this.client.close();
	}

	/**
	 * Gets all airports.
	 *
	 * @return Array of objects
	 */
	async getAllAirports() {
		return await this.airlinesCollection.distinct("airport");
	}

	/**
	 * Gets the airport with the inserted airportCode.
	 *
	 * @param airportCode  airport code
	 *
	 * @return Object
	 */
	async getAirport(airportCode) {
		return await this.airlinesCollection.findOne({"airport.code":airportCode});
	}

	/**
	 * Gets all carriers.
	 *
	 * @return Array of objects
	 */
	async getAllCarriers() {
		return await this.airlinesCollection.distinct("carrier");
	}

	/**
	 * Gets all carriers operating at a specific US airport.
	 *
	 * @param airport airport code
	 *
	 * @return Array of objects
	 */
	async getAllCarriersPerAirport(airport) {
		return await this.airlinesCollection.distinct("carrier", {"airport.code": airport});
	}

	/**
	 * Gets the carrier with the inserted carrier code.
	 *
	 * @param carrier  carrier code
	 *
	 * @return Object
	 */
	async getCarrier(carrier) {
		return await this.airlinesCollection.findOne({"carrier.code":carrier});
	}

	/**
	 * Gets the mongo cursor to get statistics about all flights of a carrier with the statistics fields empty (they will be replaced by links). It can be filtered by airport and month. Includes pagination.
	 *
	 * @param carrier    carrier code
	 * @param [airport]  airport code
	 * @param [month]    month in format yyyy-(m)m
	 * @param firstItem  first item to get (for pagination purposes)
	 * @param per_page   number of items to get (for pagination purposes)
	 *
	 * @return MongoClient cursor
	 */
	async getCarrierEmptyStatisticsCursor(carrier, airport, month, firstItem, per_page) {
		var query = {"carrier.code": carrier};

		if(airport != undefined) {
			query["airport.code"] = airport;
		}

		if(month != undefined) {
			month = month.replace('-', '/');
			query["time.label"] = month;
		}

		var options = {
			"limit": per_page,
			"skip": firstItem,
			"fields": {
				'_id': 0,
				'statistics.flights': 0,
				'statistics.# of delays': 0,
				'statistics.minutes delayed': 0
			}
		};

		return await this.airlinesCollection.find(query, options);
	}

	/**
	 * Gets the mongo cursor to get statistics about all flights of a carrier. It can be filtered by airport and month. Includes pagination. Output fields can be specified with fields.
	 *
	 * @param carrier    carrier code
	 * @param [airport]  airport code
	 * @param [month]    month in format yyyy-(m)m
	 * @param firstItem  first item to get (for pagination purposes)
	 * @param per_page   number of items to get (for pagination purposes)
	 * @param fields     object with the fields to be returned or ignored
	 *
	 * @return MongoClient cursor
	 */
	async getCarrierStatisticsCursor(carrier, airport, month, firstItem, per_page, fields) {
		var query = {"carrier.code": carrier};

		if(airport != undefined) {
			query["airport.code"] = airport;
		}

		if(month != undefined) {
			month = month.replace('-', '/');
			query["time.label"] = month;
		}

		var options = {
			"limit": per_page,
			"skip": firstItem,
			"fields": fields
		};

		return await this.airlinesCollection.find(query, options);
	}

	/**
	 * Updates carrier statistics
	 *
	 * @param carrier    carrier code
	 * @param airport    airport code
	 * @param month      month in format yyyy-(m)m
	 * @param newValues  new values ({field: value})
	 *
	 * @return result of calling updateOne
	 */
	async updateCarrierStatistics(carrier, airport, month, newValues) {
		var query = {
			"carrier.code": carrier,
			"airport.code": airport,
			"time.label": month.replace('-', '/')
		};

		var updateOperators = {$set: newValues};

		return await this.airlinesCollection.updateOne(query, updateOperators);
	}

	/**
	 * Deletes the specified carrier statistics
	 *
	 * @param carrier         carrier code
	 * @param airport         airport code
	 * @param month           month in format yyyy-(m)m
	 * @param valuesToDelete  fields to be deleted ({field: anyValue})
	 *
	 * @return result of calling updateOne
	 */
	async deleteCarrierStatistics(carrier, airport, month, valuesToDelete) {
		var query = {
			"carrier.code": carrier,
			"airport.code": airport,
			"time.label": month.replace('-', '/')
		};

		var updateOperators = {$unset: valuesToDelete};

		return await this.airlinesCollection.updateOne(query, updateOperators);
	}

	/**
	 * Gets all statistics involving airport or airport2 and carrier. Output fields can be specified with fields.
	 *
	 * @param airport   airport 1 code
	 * @param airport2  airport 2 code
	 * @param carrier   carrier code
	 * @param fields    object with the fields to be returned or ignored
	 *
	 * @return Array of objects
	 */
	async getRouteStatistics(airport, airport2, carrier, fields) {
		var query = {
			"carrier.code": carrier,
			$or:[{"airport.code":airport}, {"airport.code":airport2}]
		};

		var options = {"fields": fields};

		return await this.airlinesCollection.find(query, options).toArray();
	}

	/**
	 * Get user ratings of the carrier. It can be filtered by author. Includes pagination.
	 *
	 * @param carrier    carrier code
	 * @param [author]   author code
	 * @param firstItem  first item to get (for pagination purposes)
	 * @param per_page   number of items to get (for pagination purposes)
	 *
	 * @return Array of objects
	 */
	async getUserRatings(carrier, author, firstItem, per_page) {
		var query = {
			"carrier": carrier,
		}
		if(author != undefined){
			query["author"] = author;
		}
		var options = {
			"limit": per_page,
			"skip": firstItem,
			"fields": {"_id": 0}
		}
		return await this.ratingsCollection.find(query, options);
	}

	/**
	 * Add new rating for the carrier
	 *
	 * @param ratingObject
	 *
	 * @return result of calling insertOne
	 */
	async addUserRating(ratingObject) {
		return await this.ratingsCollection.insertOne(ratingObject);
	}
}


module.exports.DatabaseWrapper = DatabaseWrapper
