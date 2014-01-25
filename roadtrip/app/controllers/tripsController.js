var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , User       = require('../models/user')
  , Trip       = require('../models/trip')
  , bcrypt     = require('bcrypt')
  , passport   = require('passport');

var tripsController = new Controller();

// post to /trips
// name         title of trip
// startLat     lat of start point 
// startLng     lng of start point
// endLat       lat of end point
// endLng       lng of end point
tripsController.create = function() {
  var result;
  var self = this;
  if (this.req.user) {
    var trip = new Trip();
    trip.name = this.param('name');
    trip.people = [this.req.user];
    trip.startPoint = [this.param('startLat'), this.param('startLng')];
    trip.endPoint = [this.param('endLat'), this.param('endLng')];

    trip.save(function(err) {
      if(err)
        result = { status: "err", error: err }
      else
        result = { status: "ok" }
      self.respond({ 'json': function() { self.res.json(result); } });
    });
  } else {
    result = { status: "err", error: "not logged in" };
    self.respond({ 'json': function() { self.res.json(result); } });
  }
}

tripsController.signup = function() {
	var user = new User();
	user.username = this.param('username');
	user.password = bcrypt.hashSync(this.param('password'), 8);
	user.email = this.param('email');

	var self = this;
  user.save(function(err) {
    var result;
    if (err)
      result = { status: "err", error: err };
    else
      result = { status: "ok" };

    self.req.login(user, function(err) {
      if (err) 
        result = { status: "err",  error: err };
      else 
        result = { status: "ok" }; 
      self.respond({
        'json': function() { self.res.json(result); }
      });
    });

  });
}

module.exports = tripsController;
