'use strict';

const MongoClient = require('mongodb').MongoClient;
const logger = require('../utils/logger')


class DatabaseWrapper {
	constructor() {
        this.uri = "mongodb+srv://admin:admin@cluster0-q0yt0.gcp.mongodb.net/test?retryWrites=true";
        this.client = new MongoClient(this.uri, { useNewUrlParser: true });
        this.client.connect(err => {
            if(err != null) {
                logger.error("An ERROR occurred while trying to connect to MongoDB");
                logger.error(err);
            }
			else {
                logger.info("Connected correctly to MongoDB server");
                this.collection = this.client.db('web').collection('airlines');
			}
        });
    }

    destructor() {
        this.client.close();
    }

    async getAllAirports() {
        return await this.collection.distinct("airport");
    }

	async getAllCarriers() {
        return await this.collection.distinct("carrier");
	}
}


module.exports.DatabaseWrapper = DatabaseWrapper
