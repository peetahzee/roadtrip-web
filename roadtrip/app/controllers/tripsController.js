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
    trip.people = [this.req.user._id];
    trip.startPoint = [this.param('startLat'), this.param('startLng')];
    trip.endPoint = [this.param('endLat'), this.param('endLng')];

    console.log(trip);

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

// post to /addFriend
// id           id of trip
// friendId     objectId of friend user
tripsController.addFriend = function() {
  var result;
  var id = this.param('id');
  var self = this;

  Trip.findById(id, function(err, trip) {
    if (err) {
      result = { status: "err", error: err }
      self.respond({ 'json': function() { self.res.json(result); } });
    } else {
      var friendId = self.param('friendId');
      trip.people.push(friendId);
      trip.save(function(err) {
        if (err) {
          result = { status: "err", error: err }
        } else {
          result = { status: "ok" }
        }
        self.respond({ 'json': function() { self.res.json(result); } });
      })
    }

  });
}

// post to /addSpot
// id           id of trip
// lat
// lng
tripsController.addSpot = function() {
  var result;
  var id = this.param('id');
  var self = this;

  Trip.findById(id, function(err, trip) {
    if (err) {
      result = { status: "err", error: err }
      self.respond({ 'json': function() { self.res.json(result); } });
    } else {
      var lat = self.param('lat');
      var lng = self.param('lng');
      trip.spots.push({ latLng: [lat, lng] });
      trip.save(function(err) {
        if (err) {
          result = { status: "err", error: err }
        } else {
          result = { status: "ok" }
        }
        self.respond({ 'json': function() { self.res.json(result); } });
      })
    }
  });
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
