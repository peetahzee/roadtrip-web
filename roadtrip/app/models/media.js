var mongoose = require('mongoose');
var MediaSchema = require('./schemas/media');

module.exports = mongoose.model('Media', MediaSchema);