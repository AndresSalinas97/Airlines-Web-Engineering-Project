'use strict';

const pagination = require('../utils/pagination')
const server = require('../server')
var projectURL = server.projectURL;


class AirportsMgr {
    constructor(db) {
        this.db = db;
    }

    async getAirportsPaginated(page_number=1, per_page=30) {
        var urlBegining =  projectURL + "airports/"

        var airports = await this.db.getAllAirports();

        airports.forEach(airport => {
            airport.url = urlBegining + airport.code;
        });

        page_number = parseInt(page_number);
        per_page = parseInt(per_page);
        var firstItem = (page_number-1) * per_page;
        var lastItem = firstItem + per_page;

        return pagination.addPaginationMetaData(projectURL+"airports", airports.slice(firstItem, lastItem), airports.length, page_number, per_page);
    }

    async getAirport(airport) {
        var fullAirport = await this.db.getAirport(airport);
        var result = {data: fullAirport.airport};
        return result;
    }
}

module.exports.AirportsMgr = AirportsMgr
