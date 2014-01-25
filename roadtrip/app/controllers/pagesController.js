var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , _          = require('underscore')
  , User       = require('../models/user')
  , bcrypt     = require('bcrypt');

var pagesController = new Controller();

var populateController = function(context) {
	context.user = context.req.user;
}

pagesController.main = function() {
	populateController(this);
  this.title = 'roadtrip';
  this.render();

}
pagesController.login = function() {
	populateController(this);
	this.render();
}

pagesController.signup = function() {
	populateController(this);

	var user = new User();
	user.username = this.param('username');
	user.password = bcrypt.hashSync(this.param('password'), 8);
	user.email = this.param('email');

	var self = this;
  user.save(function(err) {
    if (err)
      return self.redirect("/");

    return self.redirect("/login");
  });
}

module.exports = pagesController;
