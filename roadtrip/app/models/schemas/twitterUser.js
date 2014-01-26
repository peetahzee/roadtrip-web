var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TwitterUserSchema = new Schema({
	user: Schema.Types.ObjectId,
	twitterId: Number,
	twitterUsername: String,
	oauthToken: String,
	oauthSecret: String,
	timeAdded: { type: Date, default: Date.now }
});

module.exports = TwitterUserSchema;