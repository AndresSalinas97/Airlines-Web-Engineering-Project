'use strict';
const { DatabaseWrapper } = require('./DatabaseWrapper')
let db = new DatabaseWrapper();

module.exports = function(app) {

    app.get("/airports", async function(req,res){
      var pg1 = req.query.page;
      console.log(pg1);
      var pg2 = req.query.per_page;
      console.log(pg2);
      res.send( await db.getAirports(pg1, pg2));
  });



};