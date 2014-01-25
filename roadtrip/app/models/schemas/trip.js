var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = require('./user');

var TripSchema = new Schema({
	name: { type: String, required: true },
  people: [UserSchema],
  startPoint: [Number], // latlng
  endPoint: [Number], // latlng
  startTime: { type: Date, default: Date.now },
  endTime: Date
});

module.exports = TripSchema;