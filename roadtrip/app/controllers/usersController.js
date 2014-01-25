var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , User       = require('../models/user')
  , bcrypt     = require('bcrypt')
  , passport   = require('passport');

var usersController = new Controller();

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
    if (err)
      result = { status: "err", error: "err" };

    result = { status: "ok" };

    self.respond({
      'json': function() { self.res.json(result); }
    });
  });
}

module.exports = usersController;
