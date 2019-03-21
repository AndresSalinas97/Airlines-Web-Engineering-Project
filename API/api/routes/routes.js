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

        res.json(await airports.getAirportsPaginated(page, per_page));
    });

    // Airports - Get specific airport
    app.get("/airports/:airport", async function(req,res) {
        var airport = req.params.airport;

        res.json(await airports.getAirport(airport));
    });

    // Carriers - Get all carriers operating in US airports
    // Carriers - Get all carriers operating at a specific US airport
    app.get("/carriers", async function(req,res) {
        var page = req.query.page;
        var per_page = req.query.per_page;
        var airport = req.query.airport;

        res.json(await carriers.getCarriersPaginated(page, per_page, airport));
    });

    // Carriers - Get specific carrier
    app.get("/carriers/:carrier", async function(req,res) {
        var carrier = req.params.carrier;

        res.json(await carriers.getCarrier(carrier));
    });

    // Carrier Statistics - Get statistics about all flights of a carrier
    app.get("/carriers/:carrier/statistics", async function(req,res) {
        var carrier = req.params.carrier;
        var airport = req.query.airport;
        var month = req.query.month;
        var page = req.query.page;
        var per_page = req.query.per_page;

        res.json(await carriers.getCarrierStatisticsPaginated(carrier, airport, month, page, per_page));
    });

    // Carrier Statistics - Get flight statistics about all flights of a carrier
    app.get("/carriers/:carrier/statistics/flights", async function(req,res) {
        var carrier = req.params.carrier;
        var airport = req.query.airport;
        var month = req.query.month;
        var page = req.query.page;
        var per_page = req.query.per_page;

        res.json(await carriers.getSpecificCarrierStatisticsPaginated("flights", carrier, airport, month, page, per_page));
    });

    // Carrier Statistics - Get # of delays statistics about all flights of a carrier
    app.get("/carriers/:carrier/statistics/delays", async function(req,res) {
        var carrier = req.params.carrier;
        var airport = req.query.airport;
        var month = req.query.month;
        var page = req.query.page;
        var per_page = req.query.per_page;

        res.json(await carriers.getSpecificCarrierStatisticsPaginated("# of delays", carrier, airport, month, page, per_page));
    });

    // Carrier Statistics - Get minutes delayed statistics about all flights of a carrier
    app.get("/carriers/:carrier/statistics/minutes-delayed", async function(req,res) {
        var carrier = req.params.carrier;
        var airport = req.query.airport;
        var month = req.query.month;
        var page = req.query.page;
        var per_page = req.query.per_page;

        res.json(await carriers.getSpecificCarrierStatisticsPaginated("minutes delayed", carrier, airport, month, page, per_page));
    });
};
