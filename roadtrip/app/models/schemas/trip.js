var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripSchema = new Schema({
	name: { type: String, required: true },
  people: [ Schema.Types.ObjectId ],
  startPoint: [Number], // latlng
  endPoint: [Number], // latlng
  startTime: { type: Date, default: Date.now },
  endTime: Date
});

module.exports = TripSchema;