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
        self.respond({ 'json': function() { self.res.json(503, result); } });
      } else if (trip == null) {
        result = { status: "err", error: "can't find trip" };
        self.respond({ 'json': function() { self.res.json(404, result); } });
      } else if (!trip.people[0].equals(self.req.user._id)) {
        result = { status: "err", error: "no permission" };
        self.respond({ 'json': function() { self.res.json(403, result); } });
      } else {
        process.call(undefined, trip);
        var code;
        trip.save(function(err) {
          if (err) {
            result = { status: "err", error: err }
            console.log("#########503ERRORR##########");
            console.log(err);
            console.log("#########503ERRORR##########");
            code = 503;
          } else {
            result = { status: "ok" }
            code = 200;
          }
          self.respond({ 'json': function() { self.res.json(code, result); } });
        })
      }
    });
  } else {
    result = { status: "err", error: "not logged in" };
    self.respond({ 'json': function() { self.res.json(401, result); } });
  }
}

// post to /trips
// name         title of trip
// startLat     lat of start point 
// startLng     lng of start point
// startCity    start city
// endLat       lat of end point
// endLng       lng of end point
// endCity      end city
tripsController.create = function() {
  var result;
  var self = this;
  if (this.req.user) {
    var trip = new Trip();
    trip.name = this.param('name');
    trip.people = [this.req.user._id];
    trip.startPoint = [this.param('startLat'), this.param('startLng')];
    trip.endPoint = [this.param('endLat'), this.param('endLng')];
    trip.startCity = this.param('startCity');
    trip.endCity = this.param('endCity');

    var code;
    console.log("##########[CREATETRIP]######### startPoint: " + trip.startCity + "; endPoint: " + trip.endCity );
    trip.save(function(err) {
      if(err) {
        self.respond({ 'json': function() {
          self.res.json(503, { status: "err", error: err }); 
        } });
      } else {
        self.respond({ 'json': function() {
          self.res.json(200, { 
            status: "ok",
            result: {
              name: trip.name,
              id: trip._id
            }}
          ); 
        } });
      }
      
    });
  } else {
    result = { status: "err", error: "not logged in" };
    self.respond({ 'json': function() { self.res.json(401, result); } });
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
  console.log("###########[ADDSPOT]########### trip id: " + self.param('id')); 
  accessTrip(self.param('id'), self, function(trip) {
    var lat = self.param('lat');
    var lng = self.param('lng');
    trip.spots.push({ latLng: [lat, lng] });
  });
}

tripsController.end = function() {

}

module.exports = tripsController;
