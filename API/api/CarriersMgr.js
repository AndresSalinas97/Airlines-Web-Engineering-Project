'use strict';

const pagination = require('../utils/pagination')
const server = require('../server')
var projectURL = server.projectURL;


class CarriersMgr {
    constructor(db) {
        this.db = db;
    }

    async getCarriersPaginated(page_number=1, per_page=30, airport) {
        var urlBegining =  projectURL + "carriers/"

        if(airport == undefined)
            var carriers = await this.db.getAllCarriers();
        else
            var carriers = await this.db.getAllCarriersPerAirport(airport);

        carriers.forEach(carrier => {
            carrier.url = urlBegining + carrier.code;
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
        var result = {data: fullCarrier.carrier};
        result.statistics = projectURL + "carriers/" + carrier + "/statistics/";
        return result;
    }

    async getCarrierStatisticsPaginated(carrier, airport, month, page_number=1, per_page=30) {
        var page_number = parseInt(page_number);
        var per_page = parseInt(per_page);
        var firstItem = (page_number-1) * per_page;
        var lastItem = firstItem + per_page;

        var cursor = await this.db.getCarrierStatisticsCursor(carrier, airport, month, firstItem, per_page);

        var statistics = await cursor.toArray();
        var total_count = await cursor.count();

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
}

module.exports.CarriersMgr = CarriersMgr
