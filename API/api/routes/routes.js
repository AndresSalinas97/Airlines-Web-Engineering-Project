'use strict';

const { DatabaseWrapper } = require('../DatabaseWrapper')
const { AirportsMgr } = require('../AirportsMgr')
const { CarriersMgr } = require('../CarriersMgr')

let mongoDB = new DatabaseWrapper();
let airports = new AirportsMgr(mongoDB);
let carriers = new CarriersMgr(mongoDB);



module.exports = function(app) {
    app.get("/airports", async function(req,res) {
        var page = req.query.page;
        var per_page = req.query.per_page;

        res.send(await airports.getAirportsPaginated(page, per_page));
    });

    app.get("/carriers", async function(req,res) {
        var page = req.query.page;
        var per_page = req.query.per_page;
        var airport = req.query.airport;

        res.send(await carriers.getCarriersPaginated(page, per_page, airport));
    });
};
