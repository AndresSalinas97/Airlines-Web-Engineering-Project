'use strict';

var projectURL = "localhost:8080/";

module.exports = {
    projectURL
}

const logger = require('./utils/logger')
const express = require('express'),

app = express(),
port = process.env.PORT || 8080;


var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route


var server = app.listen(port, function() {
    logger.info("API server started on: " + port);
});
