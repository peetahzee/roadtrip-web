var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpotSchema = new Schema({
	latLng: [Number],
	time: { type: Date, default: Date.now }
});

module.exports = SpotSchema;