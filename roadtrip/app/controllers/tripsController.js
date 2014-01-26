var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , User       = require('../models/user')
  , Trip       = require('../models/trip')
  , Media      = require('../models/media')
  , bcrypt     = require('bcrypt')
  , passport   = require('passport');

var tripsController = new Controller();

var accessTrip = function(id, context, process) {
  var result;
  var self = context;

  console.log(self.req.user);
  if (self.req.user) {
    Trip.findById(id, function(err, trip) {
      console.log(trip);
      if (err) {
        result = { status: "err", error: err };
        self.respond({ 'json': function() { self.res.json(503, result); } });
      } else if (!trip == null) {
        result = { status: "err", error: "can't find trip" };
        self.respond({ 'json': function() { self.res.json(404, result); } });
      } else if (!trip.people[0].equals(self.req.user._id)) {
        result = { status: "err", error: "no permission" };
        self.respond({ 'json': function() { self.res.json(403, result); } });
      } else {
        process.call(undefined, trip, function(shouldntContinue) {
          if(!shouldntContinue) {
            var code;
            trip.save(function(err) {
              if (err) {
                result = { status: "err", error: err }
                console.log("#########503ERRORR##########"); console.log(err); console.log("#########503ERRORR##########");
                code = 503;
              } else {
                result = { status: "ok" }
                code = 200;
              }
              self.respond({ 'json': function() { self.res.json(code, result); } });
            });
          } else {

          }
        });
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
        console.log("#########503ERRORR##########");
        console.log(err);
        console.log("#########503ERRORR##########");
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

// post to /addFriendId
// id           id of trip
// friendId     objectId of friend user
tripsController.addFriendId = function() {
  var self = this;
  accessTrip(self.param('id'), self, function(trip, callback) {
    var friendId = self.param('friendId');
    trip.people.push(friendId);
    callback.call();
  });
}

// post to /addFriend
// id           id of trip
// friendName   username
tripsController.addFriend = function() {
  var self = this;
  accessTrip(self.param('id'), self, function(trip, callback) {
    var friendName = self.param('friendName');
    User.findOne( { 'username': friendName }, function(err, user) {
      if(err) {
        self.respond({ 'json': function() { self.res.json(503, { status: "err", error: err }); } });
        callback.call(undefined, true);
      } else if (!user) {
        self.respond({ 'json': function() { self.res.json(404, { status: "err", error: "can't find user" }); } });
        callback.call(undefined, true);
      } else {
        trip.people.push(user._id);
        callback.call();
      }
    });
  });
}

// post to /addSpot
// id           id of trip
// lat
// lng
tripsController.addSpot = function() {
  var self = this;
  accessTrip(self.param('id'), self, function(trip, callback) {
    if(!trip.endTime) {
      var lat = self.param('lat');
      var lng = self.param('lng');
      trip.spots.push({ latLng: [lat, lng] });
      callback.call();  
    } else {
      self.respond({ 'json': function() { self.res.json(503, { status: "err", error: "trip has already ended" }) }});
    }
    
  });
}

// post to /end
// id         id of trip
tripsController.end = function() {
  var self = this;
  accessTrip(self.param('id'), self, function(trip, callback) {
    if(!trip.endTime) {
      trip.endTime = new Date();
      callback.call();
    } else {
      self.respond({ 'json': function() { self.res.json(503, { status: "err", error: "trip has already ended" }) }});
    }
  });
}

//get to /spots
tripsController.getSpots = function() {
  var self = this;
  accessTrip(self.param('id'), self, function(trip, callback) {
    self.respond({ 'json': function() { self.res.json( { status: "ok", results: trip.spots }); } });
    callback.call(undefined, true);
  }); 
}

// get to /media
tripsController.getMedia = function() {
  var self = this;
  var timeCriteria;
  accessTrip(self.param('id'), self, function(trip, callback) {
    if(trip.endTime) {
      timeCriteria = { time : { $gte: trip.startTime, $lt: trip.endTime } };
    } else {
      timeCriteria = { time : { $gte: trip.startTime}};
    }
    Media.find({ $and : [ timeCriteria, { user: { $in : trip.people }}]}, function(err, data) {
      console.log(data);
      if (err) {
        result = { status: "err", error: err }
        code = 503;
        self.respond({ 'json': function() { self.res.json(503, { status: "err", error: err }) }});
      } else {
        result = { status: "ok", results: data}
        code = 200;
        self.respond({ 'json': function() { self.res.json(200, { status: "ok", results: data }) }});
      }
    }); 

    callback.call(undefined, true);
  }); 
}

module.exports = tripsController;
