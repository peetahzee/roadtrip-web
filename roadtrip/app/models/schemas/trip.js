var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SpotSchema = require('./spot');

var TripSchema = new Schema({
	name: { type: String, required: true },
  people: [ Schema.Types.ObjectId ],
  spots: [SpotSchema],
  startPoint: [Number], // latlng
  endPoint: [Number], // latlng
  startTime: { type: Date, default: Date.now },
  endTime: Date
});

module.exports = TripSchema;