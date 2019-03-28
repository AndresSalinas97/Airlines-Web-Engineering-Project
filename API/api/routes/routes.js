'use strict';

const logger = require('../../utils/logger')
const Json2csvParser = require('json2csv').Parser;

const { DatabaseWrapper } = require('../DatabaseWrapper')
const { AirportsMgr } = require('../AirportsMgr')
const { CarriersMgr } = require('../CarriersMgr')
const { RatingsMgr } = require('../RatingsMgr')

let mongoDB = new DatabaseWrapper();
let airports = new AirportsMgr(mongoDB);
let carriers = new CarriersMgr(mongoDB);
let ratings = new RatingsMgr(mongoDB);


module.exports = function(app) {
    // Airports - Get all US airports
    app.get("/airports", async function(req,res) {
        var page = req.query.page;
        var per_page = req.query.per_page;
        var contentType = req.get("Content-Type");

        try {
            var result = await airports.getAirportsPaginated(page, per_page);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
                return;
            } else {
                res.status(400);
                res.json({"message": err.message});
                return;
            }
        }

        if(contentType == "text/csv")
            sendCSV(result, res);
        else
            res.json(result);
    });

    // Airports - Get specific airport
    app.get("/airports/:airport", async function(req,res) {
        var airport = req.params.airport;
        var contentType = req.get("Content-Type");

        try {
            var result = await airports.getAirport(airport);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
                return;
            } else {
                res.status(400);
                res.json({"message": err.message});
                return;
            }
        }

        if(contentType == "text/csv")
            sendCSV(result, res);
        else
            res.json(result);
    });

    // Carriers - Get all carriers operating in US airports
    // Carriers - Get all carriers operating at a specific US airport
    app.get("/carriers", async function(req,res) {
        var airport = req.query.airport;
        var page = req.query.page;
        var per_page = req.query.per_page;
        var contentType = req.get("Content-Type");

        try {
            var result = await carriers.getCarriersPaginated(page, per_page, airport);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
                return;
            } else {
                res.status(400);
                res.json({"message": err.message});
                return;
            }
        }

        if(contentType == "text/csv")
            sendCSV(result, res);
        else
            res.json(result);
    });

    // Carriers - Get specific carrier
    app.get("/carriers/:carrier", async function(req,res) {
        var carrier = req.params.carrier;
        var contentType = req.get("Content-Type");

        try {
            var result = await carriers.getCarrier(carrier);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
                return;
            } else {
                res.status(400);
                res.json({"message": err.message});
                return;
            }
        }

        if(contentType == "text/csv")
            sendCSV(result, res);
        else
            res.json(result);
    });

    // Carrier Statistics - Get statistics about all flights of a carrier
    app.get("/carriers/:carrier/statistics", async function(req,res) {
        var carrier = req.params.carrier;
        var airport = req.query.airport;
        var month = req.query.month;
        var page = req.query.page;
        var per_page = req.query.per_page;
        var contentType = req.get("Content-Type");

        try {
            var result = await carriers.getCarrierStatisticsPaginated(carrier, airport, month, page, per_page);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
                return;
            } else {
                res.status(400);
                res.json({"message": err.message});
                return;
            }
        }

        if(contentType == "text/csv")
            sendCSV(result, res);
        else
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
        var contentType = req.get("Content-Type");

        try {
            var result = await carriers.getSpecificCarrierStatisticsPaginated(type, select, carrier, airport, month, page, per_page);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
                return;
            } else {
                res.status(400);
                res.json({"message": err.message});
                return;
            }
        }

        if(contentType == "text/csv")
            sendCSV(result, res);
        else
            res.json(result);
    });

    // Carrier Statistics - Update specific statistics about all flights of a carrier
    app.patch("/carriers/:carrier/statistics/:type", async function(req,res) {
        var carrier = req.params.carrier;
        var type = req.params.type;
        var airport = req.query.airport;
        var month = req.query.month;
        var body = req.body;
        var contentType = req.get("Content-Type");

        if(airport==undefined || month==undefined || body==undefined) {
            res.status(400);
            res.json({"message": "Parameters required"});
        } else if (contentType != "application/json") {
            res.status(400);
            res.json({"message": "Only json input is supported"});
        } else {
            try {
                body = JSON.parse(body);
                var result = await carriers.updateSpecificCarrierStatistics(type, body, carrier, airport, month);
            } catch (err) {
                if(err.message == "Not found") {
                    res.status(404);
                    res.json({"message": "Not found"});
                    return;
                } else {
                    res.status(400);
                    res.json({"message": err.message});
                    return;
                }
            }

            res.json(result);
        }
    });

    // Carrier Statistics - Delete specific statistics about all flights of a carrier
    app.delete("/carriers/:carrier/statistics/:type", async function(req,res) {
        var carrier = req.params.carrier;
        var type = req.params.type;
        var airport = req.query.airport;
        var month = req.query.month;
        var contentType = req.get("Content-Type");

        if(airport==undefined || month==undefined) {
            res.status(400);
            res.json({"message": "Parameters required"});
        } else {
            try {
                await carriers.deleteSpecificCarrierStatistics(type, carrier, airport, month);
            } catch (err) {
                if(err.message == "Not found") {
                    res.status(404);
                    res.json({"message": "Not found"});
                    return;
                } else {
                    res.status(400);
                    res.json({"message": err.message});
                    return;
                }
            }
            res.status(204);
            res.send();
        }
    });

    // Carrier Statistics - Add specific statistics about all flights of a carrier
    app.post("/carriers/:carrier/statistics/:type", async function(req,res) {
        var carrier = req.params.carrier;
        var type = req.params.type;
        var airport = req.query.airport;
        var month = req.query.month;
        var body = req.body;
        var contentType = req.get("Content-Type");

        if(airport==undefined || month==undefined || body==undefined) {
            res.status(400);
            res.json({"message": "Parameters required"});
        } else if (contentType != "application/json") {
            res.status(400);
            res.json({"message": "Only json input is supported"});
        } else {
            try {
                body = JSON.parse(body);
                var result = await carriers.addSpecificCarrierStatistics(type, body, carrier, airport, month);
            } catch (err) {
                if(err.message == "Not found") {
                    res.status(404);
                    res.json({"message": "Not found"});
                    return;
                } else {
                    res.status(400);
                    res.json({"message": err.message});
                    return;
                }
            }
            res.status(201);
            res.json(result);
        }
    });

    // Airport Statistics - Descriptive statistics for carrier-specific delays
    app.get("/airports/:airport/delaystats", async function(req,res) {
        var airport = req.params.airport;
        var carrier = req.query.carrier;
        var airport2 = req.query.airport;
        var select = req.query.select;
        var contentType = req.get("Content-Type");

        if(airport2 == undefined || carrier == undefined) {
            res.status(400);
            res.json({"message": "Parameters required"});
            return;
        }

        try {
            var result = await airports.getStats(airport, airport2, carrier, select);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
                return;
            } else {
                res.status(400);
                res.json({"message": err.message});
                return;
            }
        }

        if(contentType == "text/csv")
            sendCSV(result, res);
        else
            res.json(result);
    });

    // Carrier Rankings - Ranking of carriers per month
    app.get("/rankings/carriers", async function(req,res) {
        var month = req.query["month"];
        var basedOn = req.query["based-on"];
        var page = req.query.page;
        var per_page = req.query.per_page;
        var contentType = req.get("Content-Type");

        if(month == undefined || basedOn == undefined) {
            res.status(400);
            res.json({"message": "Parameters required"});
            return;
        }

        try {
            var result = await carriers.getCarriersRankingsPaginated(month, basedOn, page, per_page);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
                return;
            } else {
                console.log(err)
                res.status(400);
                res.json({"message": err.message});
                return;
            }
        }

        if(contentType == "text/csv")
            sendCSV(result, res);
        else
            res.json(result);
    });
    
    app.get("/carriers/:carrier/user-ratings", async function(req,res) {
        var carrier = req.params.carrier;
        var author = req.query.author;
        var page = req.query.page;
        var per_page = req.query.per_page;
        var contentType = req.get("Content-Type");

        try {
            var result = await ratings.getRatings(carrier, author, page, per_page);
        } catch (err) {
            if(err.message == "Not found") {
                res.status(404);
                res.json({"message": "Not found"});
                return;
            } else {
                res.status(400);
                res.json({"message": err.message});
                return;
            }
        }

        if(contentType == "text/csv")
            sendCSV(result, res);
        else
            res.json(result);
    });
    
    app.post("/carriers/:carrier/user-ratings", async function(req,res) {
        var carrier = req.params.carrier;
        var body = req.body;
        var contentType = req.get("Content-Type");

        if(body==undefined) {
            res.status(400);
            res.json({"message": "Parameters required"});
        } else if (contentType != "application/json") {
            res.status(400);
            res.json({"message": "Only json input is supported"});
        } else {
            try {
                body = JSON.parse(body);
                body["carrier"] = carrier;
                var result = await ratings.addRating(body);
            } catch (err) {
                if(err.message == "Not found") {
                    res.status(404);
                    res.json({"message": "Not found"});
                    return;
                } else {
                    res.status(400);
                    res.json({"message": err.message});
                    return;
                }
            }
            res.status(201);
            res.json(result);
        }
    });
};


function sendCSV(result, res) {
    const opts = { "flatten": true };
    try {
        const parser = new Json2csvParser(opts);
        const csv = parser.parse(result.data);
        res.set('Content-Type', 'text/csv');

        // Only if we have pagination
        if(result.page_number != undefined) {
            res.set('page_number', result.page_number);
            res.set('per_page', result.per_page);
            res.set('total_count', result.total_count);
            res.set('total_pages', result.total_pages);

            var links = {'last_page': result.last_page};
            if(result.next_page != undefined) links['next_page'] = result.next_page;
            if(result.previous_page != undefined) links['previous_page'] = result.previous_page;

            res.links(links);
        }
        res.send(csv);
    } catch (err) {
        logger.error(err);
    }
}
