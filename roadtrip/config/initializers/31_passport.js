var passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy,
    User = require('../../app/models/user');

module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.authenticate(username, password, function(err, user) {
        return done(err, user);
      });
    }
  ));
}