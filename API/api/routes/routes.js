'use strict';

const { DatabaseWrapper } = require('../DatabaseWrapper')
const { AirportsMgr } = require('../AirportsMgr')

let mongoDB = new DatabaseWrapper();
let airports = new AirportsMgr(mongoDB);



module.exports = function(app) {
    app.get("/airports", async function(req,res) {
        var page = req.query.page;
        var per_page = req.query.per_page;

        res.json(await airports.getAirportsPaginated(page, per_page));
    });
};
