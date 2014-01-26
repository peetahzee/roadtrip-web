var mongoose = require('mongoose');
var TwitterUserSchema = require('./schemas/twitterUser');

module.exports = mongoose.model('TwitterUser', TwitterUserSchema);