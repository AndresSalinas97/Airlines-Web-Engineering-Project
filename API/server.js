const logger = require('./utils/logger')

var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080;

  


var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route


app.listen(port);


logger.info(' API server started on: ' + port);
