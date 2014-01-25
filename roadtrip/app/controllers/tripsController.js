var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , User       = require('../models/user')
  , Trip       = require('../models/trip')
  , bcrypt     = require('bcrypt')
  , passport   = require('passport');

var tripsController = new Controller();

var accessTrip = function(id, context, process) {
  var result;
  var self = context;

  if (self.req.user) {
    Trip.findById(id, function(err, trip) {
      if (err) {
        result = { status: "err", error: err };
        self.respond({ 'json': function() { self.res.json(result); } });
      } else if (trip == null) {
        result = { status: "err", error: "can't find trip" };
        self.respond({ 'json': function() { self.res.json(result); } });
      } else if (!trip.people[0].equals(self.req.user._id)) {
        console.log("################");
        console.log(typeof(trip.people[0]));
        console.log(typeof(self.req.user._id));
        console.log("##################");
        result = { status: "err", error: "no permission" };
        self.respond({ 'json': function() { self.res.json(result); } });
      } else {
        process.call(undefined, trip);
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
  } else {
    result = { status: "err", error: "not logged in" };
    self.respond({ 'json': function() { self.res.json(result); } });
  }
}

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
  var self = this;
  accessTrip(self.param('id'), self, function(trip) {
    var friendId = self.param('friendId');
    trip.people.push(friendId);
  });
}

// post to /addSpot
// id           id of trip
// lat
// lng
tripsController.addSpot = function() {
  var self = this;
  accessTrip(self.param('id'), self, function(trip) {
    var lat = self.param('lat');
    var lng = self.param('lng');
    trip.spots.push({ latLng: [lat, lng] });
  });
}

tripsController.end = function() {
  
}

module.exports = tripsController;
