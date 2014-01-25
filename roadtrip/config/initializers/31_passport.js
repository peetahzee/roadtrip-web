var passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy,
    User = require('../../app/models/user');

module.exports = function() {
  passport.serializeUser(function(user, done) {
    console.log("serializing");
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    console.log("deserializing: " + id);
    done(null, {id: 123, name: "Peter"});
    // User.findById(id, function (err, user) {
    //   done(err, user);
    // });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.authenticate(username, password, function(err, user) {
        console.log("ERROR: " + err);
        console.log("USER: " + user);
        return done(err, user);
      });
    }
  ));
}