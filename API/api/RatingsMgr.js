'use strict';

const pagination = require('../utils/pagination')
const server = require('../server')
var projectURL = server.projectURL;


class RatingsMgr {
    constructor(db) {
        this.db = db;
    }
    
    async getRatings(carrier, author, page_number=1, per_page=30){
		var page_number = parseInt(page_number);
        var per_page = parseInt(per_page);
        var firstItem = (page_number-1) * per_page;
        var lastItem = firstItem + per_page;
		var urlBeginning =  projectURL + "carriers/";
		 
		var cursor = await this.db.getUserRatings(carrier, author, firstItem, per_page);
		var ratings = await cursor.toArray();
		if(ratings.length == 0){
			throw new Error("No comments found for carrier " + carrier);
		}
        var total_count = await cursor.count();
        
        var baseURL = projectURL+"carriers/"+carrier+"/user-ratings";
        
        var extraURL = "";
        if(author != undefined){
            extraURL = extraURL + "&author=" + author;
		}
		
		return pagination.addPaginationMetaData(baseURL, ratings, total_count, page_number, per_page, extraURL);
	}
	
	async addRating(rating){
		var date = new Date();
		rating["time"] = date.toString();
		await this.db.addUserRating(rating);
		return rating;
	}
}

module.exports.RatingsMgr = RatingsMgr
