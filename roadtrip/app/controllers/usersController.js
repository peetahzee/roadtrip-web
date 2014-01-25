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
    'json': function() { self.res.json(200, {status: "ok"}) }
  });
}

usersController.failLogin = function() {
  var self = this;
  this.respond({ 
    'json': function() { self.res.json(401, {status: "err"}) }
  });
}

usersController.signup = function() {
	var user = new User();
	user.username = this.param('username');
	user.password = bcrypt.hashSync(this.param('password'), 8);
	user.email = this.param('email');
  user.picture = this.param('picture');

	var self = this;
  user.save(function(err) {
    var result;
    var code;
    if (err) {
      if (err.code == 11000) {
        result = { status: "err", error: "user already exists" }
        code = 409;
      } else {
        result = { status: "err", error: err };
        code = 501;
      }
      self.respond({
        'json': function() { code, self.res.json(result); }
      });
    } else {
      self.req.login(user, function(err) {
        if (err) {
          result = { status: "err",  error: err };
          code = 503;
        } else {
          result = { status: "ok" }; 
          code = 200
        }
        self.respond({
          'json': function() { self.res.json(code, result); }
        });
      });
    }

  });
}

module.exports = usersController;
