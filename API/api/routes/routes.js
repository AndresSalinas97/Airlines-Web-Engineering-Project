'use strict';

const { DatabaseWrapper } = require('../DatabaseWrapper')
const { AirportsMgr } = require('../AirportsMgr')
const { CarriersMgr } = require('../CarriersMgr')

let mongoDB = new DatabaseWrapper();
let airports = new AirportsMgr(mongoDB);
let carriers = new CarriersMgr(mongoDB);



module.exports = function(app) {
    // Airports - Get all US airports
    app.get("/airports", async function(req,res) {
        var page = req.query.page;
        var per_page = req.query.per_page;

        try {
            var result = await airports.getAirportsPaginated(page, per_page);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
            } else {
                res.status(400);
                res.json({"message": err.message});
            }
        }

        res.json(result);
    });

    // Airports - Get specific airport
    app.get("/airports/:airport", async function(req,res) {
        var airport = req.params.airport;

        try {
            var result = await airports.getAirport(airport);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
            } else {
                res.status(400);
                res.json({"message": err.message});
            }
        }

        res.json(result);
    });

    // Carriers - Get all carriers operating in US airports
    // Carriers - Get all carriers operating at a specific US airport
    app.get("/carriers", async function(req,res) {
        var airport = req.query.airport;
        var page = req.query.page;
        var per_page = req.query.per_page;

        try {
            var result = await carriers.getCarriersPaginated(page, per_page, airport);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
            } else {
                res.status(400);
                res.json({"message": err.message});
            }
        }

        res.json(result);
    });

    // Carriers - Get specific carrier
    app.get("/carriers/:carrier", async function(req,res) {
        var carrier = req.params.carrier;

        try {
            var result = await carriers.getCarrier(carrier);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
            } else {
                res.status(400);
                res.json({"message": err.message});
            }
        }

        res.json(result);
    });

    // Carrier Statistics - Get statistics about all flights of a carrier
    app.get("/carriers/:carrier/statistics", async function(req,res) {
        var carrier = req.params.carrier;
        var airport = req.query.airport;
        var month = req.query.month;
        var page = req.query.page;
        var per_page = req.query.per_page;

        try {
            var result = await carriers.getCarrierStatisticsPaginated(carrier, airport, month, page, per_page);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
            } else {
                res.status(400);
                res.json({"message": err.message});
            }
        }

        res.json(result);
    });

    // Carrier Statistics - Get specific statistics about all flights of a carrier
    app.get("/carriers/:carrier/statistics/:type", async function(req,res) {
        var carrier = req.params.carrier;
        var type = req.params.type;
        var airport = req.query.airport;
        var month = req.query.month;
        var select = req.query.select;
        var page = req.query.page;
        var per_page = req.query.per_page;

        try {
            var result = await carriers.getSpecificCarrierStatisticsPaginated(type, select, carrier, airport, month, page, per_page);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
            } else {
                res.status(400);
                res.json({"message": err.message});
            }
        }

        res.json(result);
    });

    // app.patch("/carriers/:carrier/statistics/:type", async function(req,res) {
    //     var carrier = req.params.carrier;
    //     var airport = req.query.airport;
    //     var month = req.query.month;
    //     var type = req.params.type;
    //     console.log(req.body);
    //     var body = JSON.stringify(req.body);
    //     console.log(body);
    //     res.json(await carriers.updateSpecificCarrierStatistics(type, body, carrier, airport, month));
    // });
};
