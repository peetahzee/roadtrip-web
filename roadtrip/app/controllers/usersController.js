var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , User       = require('../models/user')
  , bcrypt     = require('bcrypt')
  , passport   = require('passport');

var usersController = new Controller();

usersController.currentUser = function() {
  var self = this;
  this.respond( {
    'json': function() { self.res.json(self.req.user) }
  });
}

usersController.successLogin = function() {
  var self = this;
  this.respond({ 
    'json': function() { self.res.json({status: "ok"}) }
  });
}

usersController.failLogin = function() {
  var self = this;
  this.respond({ 
    'json': function() { self.res.json({status: "err"}) }
  });
}

usersController.signup = function() {
	var user = new User();
	user.username = this.param('username');
	user.password = bcrypt.hashSync(this.param('password'), 8);
	user.email = this.param('email');

	var self = this;
  user.save(function(err) {
    var result;
    if (err) {
      if (err.code == 11000) {
        result = { status: "err", error: "user already exists" }
      } else {
        result = { status: "err", error: err };
      }
      self.respond({
        'json': function() { self.res.json(result); }
      });
    } else {
      self.req.login(user, function(err) {
        if (err) 
          result = { status: "err",  error: err };
        else 
          result = { status: "ok" }; 
        self.respond({
          'json': function() { self.res.json(result); }
        });
      });
    }

  });
}

module.exports = usersController;
