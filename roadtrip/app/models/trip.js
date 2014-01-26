var mongoose = require('mongoose');
var TripSchema = require('./schemas/trip');

module.exports = mongoose.model('Trip', TripSchema);