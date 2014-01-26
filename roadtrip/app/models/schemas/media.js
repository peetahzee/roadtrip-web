var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MediaSchema = new Schema({
	user: Schema.Types.ObjectId,
	text: String,
	picture: String,
	latlng: [Number],
	city: String,
	time: { type: Date, default: Date.now },
	origId: { type: String, unique: true },
	medium: String
});

module.exports = MediaSchema;