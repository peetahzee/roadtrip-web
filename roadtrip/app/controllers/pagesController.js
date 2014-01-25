var locomotive = require('locomotive')
  , Controller = locomotive.Controller
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

module.exports = pagesController;
