/**
 * @file This file contains the main entry point of our API server.
 *
 * @author Emiel Pasman
 * @author Andrés Salinas Lima
 * @author Stefan Valeanu
 */

'use strict';

var projectURL = "localhost:8080/";

module.exports = {
	projectURL
}

const logger = require('./utils/logger')
const express = require('express'),

app = express(),
port = process.env.PORT || 8080;

// Needed to get the body
app.use (function(req, res, next) {
	var data='';
	req.setEncoding('utf8');
    res.header("Access-Control-Allow-Origin", "*");
	req.on('data', function(chunk) {
	   data += chunk;
	});

	req.on('end', function() {
		req.body = data;
		next();
	});
});

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route


var server = app.listen(port, function() {
	logger.info("API server started on: " + port);
});
