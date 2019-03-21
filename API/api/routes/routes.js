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

        res.send(await airports.getAirportsPaginated(page, per_page));
    });

    // Airports - Get specific airport
    app.get("/airports/:airport", async function(req,res) {
        var airport = req.params.airport;

        res.send(await airports.getAirport(airport));
    });

    // Carriers - Get all carriers operating in US airports
    // Carriers - Get all carriers operating at a specific US airport
    app.get("/carriers", async function(req,res) {
        var page = req.query.page;
        var per_page = req.query.per_page;
        var airport = req.query.airport;

        res.send(await carriers.getCarriersPaginated(page, per_page, airport));
    });

    // Carriers - Get specific carrier
    app.get("/carriers/:carrier", async function(req,res) {
        var carrier = req.params.carrier;

        res.send(await carriers.getCarrier(carrier));
    });
};
