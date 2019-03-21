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
            var result = pagination.addPaginationMetaData(projectURL + "carriers", carriers.slice(firstItem, lastItem), carriers.length, page_number, per_page);
        else
            var result = pagination.addPaginationMetaData(projectURL + "carriers", carriers.slice(firstItem, lastItem), carriers.length, page_number, per_page, "&airport="+airport);

        return result;
    }

    async getCarrier(carrier) {
        var fullCarrier = await this.db.getCarrier(carrier);
        var result = {data: fullCarrier.carrier};
        result.statistics = projectURL + "carriers/" + carrier + "/statistics/";
        return result;
    }
}

module.exports.CarriersMgr = CarriersMgr
