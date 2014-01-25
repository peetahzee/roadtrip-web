var mongoose = require('mongoose');
var UserSchema = require('./schemas/user');
var bcrypt = require('bcrypt');

UserSchema.method('checkPassword', function (pw, callback) {
  bcrypt.compare(pw, this.password, callback);
});

UserSchema.static('authenticate', function (username, password, callback) {
  this.findOne({ username: username }, function(err, user) {
    if (err)
      return callback(err);

    if (!user)
      return callback(null, false);

    user.checkPassword(password, function(err, passwordCorrect) {
      if (err)
        return callback(err);

      if (!passwordCorrect)
        return callback(null, false);

      return callback(null, user);
    });
  });
});

module.exports = mongoose.model('User', UserSchema);