var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , User       = require('../models/user')
  , Trip       = require('../models/trip');

var userController = new Controller();

// get /user/trips
// only shows your trips
userController.getTrips = function() {
  var self = this;
  if (self.req.user) {
    Trip.find( { people: self.req.user._id }, function(err, data) {
      if(err) {
        self.respond({
          'json': function() { self.res.json(503, { status: "err", errror: err }); }
        });
      } else {
        console.log(data);
        self.respond({
          'json': function() { self.res.json(200, { status: "ok", results: data }); }
        });
      }
    });
  } else {
    self.respond({
      'json': function() { self.res.json(401, { status: "err", error: "not logged in" }); }
    });
  }
}

module.exports = userController;
