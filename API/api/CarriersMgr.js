'use strict';

const pagination = require('../utils/pagination')
const server = require('../server')
var projectURL = server.projectURL;


class CarriersMgr {
    constructor(db) {
        this.db = db;
    }

    async getCarriersPaginated(page_number=1, per_page=30, airport) {
        var urlBeginning =  projectURL + "carriers/";

        if(airport == undefined)
            var carriers = await this.db.getAllCarriers();
        else
            var carriers = await this.db.getAllCarriersPerAirport(airport);

        if(carriers == undefined || carriers.length == 0)
            throw new Error("Not found");

        carriers.forEach(carrier => {
            carrier.url = urlBeginning + carrier.code;
        });

        var page_number = parseInt(page_number);
        var per_page = parseInt(per_page);
        var firstItem = (page_number-1) * per_page;
        var lastItem = firstItem + per_page;

        if(airport == undefined)
            return pagination.addPaginationMetaData(projectURL+"carriers", carriers.slice(firstItem, lastItem), carriers.length, page_number, per_page);
        else
            return pagination.addPaginationMetaData(projectURL+"carriers", carriers.slice(firstItem, lastItem), carriers.length, page_number, per_page, "&airport="+airport);
    }

    async getCarrier(carrier) {
        var fullCarrier = await this.db.getCarrier(carrier);

        if(fullCarrier == undefined)
            throw new Error("Not found");

        var result = {data: fullCarrier.carrier};
        result.statistics = projectURL + "carriers/" + carrier + "/statistics/";
        return result;
    }

    async getCarrierStatisticsPaginated(carrier, airport, month, page_number=1, per_page=30) {
        var page_number = parseInt(page_number);
        var per_page = parseInt(per_page);
        var firstItem = (page_number-1) * per_page;
        var lastItem = firstItem + per_page;

        var cursor = await this.db.getCarrierEmptyStatisticsCursor(carrier, airport, month, firstItem, per_page);

        var statistics = await cursor.toArray();
        var total_count = await cursor.count();

        if(statistics == undefined || statistics.length == 0)
            throw new Error('Not found');

        var baseURL = projectURL+"carriers/"+carrier+"/statistics";

        statistics.forEach(statistic => {
            var extraURL = "?airport=" + statistic.airport.code + "&month=" + statistic.time.label.replace('/', '-');
            var statisticsURL = {
                "flights": baseURL+"/flights"+extraURL,
                "# of delays": baseURL+"/delays"+extraURL,
                "minutes delayed": baseURL+"/minutes-delayed"+extraURL
            };

            statistic["statistics"] = statisticsURL;
        })

        var extraURL = "";
        if(airport != undefined)
            extraURL = extraURL + "&airport=" + airport;
        if(month != undefined)
            extraURL = extraURL + "&month=" + month.replace('/', '-');

        return pagination.addPaginationMetaData(baseURL, statistics, total_count, page_number, per_page, extraURL);
    }

    // type can be "flights", "delays" or "minutes-delayed"
    // select can contain "cancelled", "on-time", "total", "delayed", "diverted", "late-aircraft", "weather", "carrier", "security" "total" or "national-aviation-system"
    async getSpecificCarrierStatisticsPaginated(type, select, carrier, airport, month, page_number=1, per_page=30) {
        var page_number = parseInt(page_number);
        var per_page = parseInt(per_page);
        var firstItem = (page_number-1) * per_page;
        var lastItem = firstItem + per_page;

        if(select == undefined) {
            if(type == "flights")
                select = ["cancelled", "on-time", "total", "delayed", "diverted"];
            else
                select = ["late-aircraft", "weather", "carrier", "security", "total", "national-aviation-system"];
        } else {
            select = select.split(",");
        }

        if(type == "flights") {
            var t = "statistics.flights";
        } else if (type == "delays") {
            var t = "statistics.# of delays";
        } else {
            var t = "statistics.minutes delayed";
        }

        var fields = {"airport":1, "time":1, "_id":0};
        select.forEach(function(selection) {
            fields[t+"."+selection.replace(/-/g, " ")] = 1;
        });

        var cursor = await this.db.getCarrierStatisticsCursor(carrier, airport, month, firstItem, per_page, fields);

        var fullStatistics = await cursor.toArray();
        var total_count = await cursor.count();

        if(fullStatistics == undefined || fullStatistics.length == 0)
            throw new Error('Not found');

        var baseURL = projectURL+"carriers/"+carrier+"/statistics/" + type;
        var extraURL = "";
        if(airport != undefined)
            extraURL = extraURL + "&airport=" + airport;
        if(month != undefined)
            extraURL = extraURL + "&month=" + month.replace('/', '-');

        return pagination.addPaginationMetaData(baseURL, fullStatistics, total_count, page_number, per_page, extraURL);
    }

    async updateSpecificCarrierStatistics(type, body, carrier, airport, month) {
        if(type == "flights") {
            var t = "statistics.flights";
            var typeFixed = "flights";
        } else if (type == "delays") {
            var t = "statistics.# of delays";
            var typeFixed = "# of delays";
        } else {
            var t = "statistics.minutes delayed";
            typeFixed = "minutes delayed";
        }

        var fields = {};
        fields[t] = 1;
        fields['_id'] = 0;

        var cursor = await this.db.getCarrierStatisticsCursor(carrier, airport, month, 0, 1, fields);
        var oldStatistics = await cursor.toArray();

        if(oldStatistics == undefined || oldStatistics.length == 0)
            throw new Error('Not found');

        var oldKeys = Object.keys(oldStatistics[0]['statistics'][typeFixed]);
        var newKeys = Object.keys(body);

        // Check that all the new keys are also in the old keys
        newKeys.forEach(key => {
            if(! oldKeys.includes(key))
                throw new Error("Bad json format");
        });

        var newValues = {};
        newKeys.forEach(key => {
            newValues["statistics."+typeFixed+"."+key] = body[key];
        });

        await this.db.updateCarrierStatistics(carrier, airport, month, newValues);

        var newStatistics = await cursor.toArray();

        return newStatistics[0];
    }

    async deleteSpecificCarrierStatistics(type, carrier, airport, month) {
        if(type == "flights") {
            var typeFixed = "flights";
        } else if (type == "delays") {
            var typeFixed = "# of delays";
        } else {
            typeFixed = "minutes delayed";
        }

        // Before deleting we check that the document exists
        var cursor = await this.db.getCarrierStatisticsCursor(carrier, airport, month, 0, 1);
        var oldStatistics = await cursor.toArray();
        if(oldStatistics == undefined || oldStatistics.length == 0)
            throw new Error('Not found');

        var valuesToDelete = {};
        valuesToDelete["statistics." + typeFixed] = "";

        await this.db.deleteCarrierStatistics(carrier, airport, month, valuesToDelete);
    }

    async addSpecificCarrierStatistics(type, body, carrier, airport, month) {
        if(type == "flights") {
            var typeFixed = "flights";
            var correctKeys = ['cancelled', 'on time', 'total', 'delayed', 'diverted'];
        } else if (type == "delays") {
            var typeFixed = "# of delays";
            var correctKeys = ['late aircraft', 'weather', 'security', 'national aviation system', 'carrier'];
        } else {
            typeFixed = "minutes delayed";
            var correctKeys = ['late aircraft', 'weather', 'security', 'national aviation system', 'carrier', 'total'];
        }

        // Before inserting we check that the document exists
        var cursor = await this.db.getCarrierStatisticsCursor(carrier, airport, month, 0, 1);
        var oldStatistics = await cursor.toArray();
        if(oldStatistics == undefined || oldStatistics.length == 0)
            throw new Error('Not found');

        var newKeys = Object.keys(body);

        // Check that all the new keys are correct keys for the type
        newKeys.forEach(key => {
            if(! correctKeys.includes(key))
                throw new Error("Bad json format");
        });

        var newValues = {};
        newKeys.forEach(key => {
            newValues["statistics."+typeFixed+"."+key] = body[key];
        });

        await this.db.updateCarrierStatistics(carrier, airport, month, newValues);

        var newStatistics = await cursor.toArray();

        return newStatistics[0];
    }

    // basedOn can be "flightsDelayed" or "minutesDelayed"
    async getCarriersRankingsPaginated(month, basedOn, page_number=1, per_page=30) {
        if(basedOn != "flightsDelayed" && basedOn != "minutesDelayed")
            throw new Error("The introduced based-on variable is not an option");

        if(basedOn == "flightsDelayed")
            var fields = {"statistics.flights.total":1, "statistics.# of delays.carrier":1, "_id":0};
        else
            var fields = {"statistics.flights.total":1, "statistics.minutes delayed.carrier":1, "_id":0};

        var carriers = await this.db.getAllCarriers();

        // For every carrier...
        for (var carrier of Object.values(carriers)) {
            carrier["total flights"] = 0;

            if(basedOn == "flightsDelayed")
                carrier["flights delayed"] = 0;
            else
                carrier["minutes delayed"] = 0;

            // ... get its statistics for the specified month (any airport)...
            var cursor = await this.db.getCarrierStatisticsCursor(carrier.code, undefined, month, 0, 99999999, fields);
            var stats = await cursor.toArray();

            // ... and sum the values
            for (var stat of Object.values(stats)) {
                carrier["total flights"] += stat["statistics"]["flights"]["total"];

                if(basedOn == "flightsDelayed")
                    carrier["flights delayed"] += stat["statistics"]["# of delays"]["carrier"];
                else
                    carrier["minutes delayed"] += stat["statistics"]["minutes delayed"]["carrier"];
            }
        }

        // Calculate average and remove carriers without flights
        for(var i=0; i<carriers.length; i++) {
            if(carriers[i]["total flights"] != 0) {
                if(basedOn == "flightsDelayed")
                    carriers[i]["proportion of flights delayed"] = carriers[i]["flights delayed"] / carriers[i]["total flights"];
                else
                    carriers[i]["minutes delayed per flight"] = carriers[i]["minutes delayed"] / carriers[i]["total flights"];
            } else {
                carriers.splice(i, 1);
                i--;
            }
        }

        // Sort based on the average value
        if(basedOn == "flightsDelayed")
            carriers.sort(function(a, b){return a["proportion of flights delayed"] - b["proportion of flights delayed"]});
        else
            carriers.sort(function(a, b){return a["minutes delayed per flight"] - b["minutes delayed per flight"]});

        for(var i=0; i<carriers.length; i++) {
            carriers[i]["ranking position"] = i+1;
        }

        var page_number = parseInt(page_number);
        var per_page = parseInt(per_page);
        var firstItem = (page_number-1) * per_page;
        var lastItem = firstItem + per_page;

        // Add pagination
        var result = pagination.addPaginationMetaData(
            projectURL+"rankings/carriers",
            carriers.slice(firstItem, lastItem),
            carriers.length,
            page_number,
            per_page,
            "&month="+month+"&based-on="+basedOn
        )

        return result;
    }
}

module.exports.CarriersMgr = CarriersMgr
