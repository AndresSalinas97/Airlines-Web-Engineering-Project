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
            } else {
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

    async getAirport(airportCode) {
        return await this.collection.findOne({"airport.code":airportCode});
    }

    async getAllCarriers() {
        return await this.collection.distinct("carrier");
    }

    async getAllCarriersPerAirport(airport) {
        return await this.collection.distinct("carrier", {"airport.code": airport});
    }

    async getCarrier(carrier) {
        return await this.collection.findOne({"carrier.code":carrier});
    }

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

        return await this.collection.find(query, options);
    }

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

        return await this.collection.find(query, options);
    }

    async updateCarrierStatistics(carrier, airport, month, newValues) {
        var query = {
            "carrier.code": carrier,
            "airport.code": airport,
            "time.label": month.replace('-', '/')
        };

        var updateOperators = {$set: newValues};

        return await this.collection.updateOne(query, updateOperators);
    }

    async deleteCarrierStatistics(carrier, airport, month, valuesToDelete) {
        var query = {
            "carrier.code": carrier,
            "airport.code": airport,
            "time.label": month.replace('-', '/')
        };

        var updateOperators = {$unset: valuesToDelete};

        return await this.collection.updateOne(query, updateOperators);
    }

    async getRouteStatistics(airport, airport2, carrier, fields){
        var query = {
            "carrier.code": carrier,
            $or:[{"airport.code":airport}, {"airport.code":airport2}]
        };

        var options = {"fields": fields};

        return await this.collection.find(query, options).toArray();
    }
}


module.exports.DatabaseWrapper = DatabaseWrapper
