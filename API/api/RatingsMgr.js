/**
 * @file This file contains the RatingsMgr class.
 *
 * @author Emiel Pasman
 * @author Andrés Salinas Lima
 * @author Stefan Valeanu
 */

'use strict';

const pagination = require('../utils/pagination')
const server = require('../server')
var projectURL = server.projectURL;


/**
 * RatingsMgr class.
 *
 * Ratings manager: gets the data from the database and generates the output for the different requests regarding carrier ratings.
 */
class RatingsMgr {
	/**
	 * Constructor for the RatingsMgr class.
	 *
	 * Stores the DatabaseWrapper object to connect to mongoDB.
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 * Returns user ratings for the carriers. Output is paginated and includes pagination metadata.
	 *
	 * @param carrier          carrier code
	 * @param [author]         author name
	 * @param [page_number=1]  number of the current page
	 * @param [per_page=30]    number of items per page
	 *
	 * @return {Object} Object with the result ready to be sent to the client as json
	 */
	async getRatings(carrier, author, page_number=1, per_page=30) {
		var page_number = parseInt(page_number);
		var per_page = parseInt(per_page);
		var firstItem = (page_number-1) * per_page;
		var lastItem = firstItem + per_page;
		var urlBeginning =  projectURL + "carriers/";

		var cursor = await this.db.getUserRatings(carrier, author, firstItem, per_page);
		var ratings = await cursor.toArray();

		if(ratings.length == 0)
			throw new Error("Not found");

		var total_count = await cursor.count();

		var baseURL = projectURL+"carriers/"+carrier+"/user-ratings";

		var extraURL = "";
		if(author != undefined){
			extraURL = extraURL + "&author=" + author;
		}

		return pagination.addPaginationMetaData(baseURL, ratings, total_count, page_number, per_page, extraURL);
	}

	/**
	 * Allow to add a new user rating
	 *
	 * @param rating object containing 'author', 'score', 'comment' and 'carrier'
	 *
	 * @return {Object} Object with the result ready to be sent to the client as json
	 */
	async addRating(rating) {
		// Check that all the new keys are correct keys for the type
		var correctKeys = ['author', 'score', 'comment', 'carrier'];
		var newKeys = Object.keys(rating);
		if(newKeys.length != correctKeys.length)
			throw new Error("Bad json format");
		newKeys.forEach(key => {
			if(! correctKeys.includes(key))
				throw new Error("Bad json format");
		});

		// Check that the score is between 1 and 5
		if(rating.score < 1 || rating.score > 5)
			throw new Error("Bad json format: score must be number between 1 and 5");

		var date = new Date();
		rating["time"] = date.toString();

		await this.db.addUserRating(rating);

		delete rating._id;
		return rating;
	}
}

module.exports.RatingsMgr = RatingsMgr
