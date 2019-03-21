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

        page_number = parseInt(page_number);
        per_page = parseInt(per_page);

        var firstItem = (page_number-1) * per_page;
        var lastItem = firstItem + per_page;

        let result = pagination.addPaginationMetaData(projectURL + "airports", carriers.slice(firstItem, lastItem), carriers.length, page_number, per_page);

        return result;
    }
}

module.exports.CarriersMgr = CarriersMgr
