var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , User       = require('../models/user')
  , bcrypt     = require('bcrypt');

var tripController = new Controller();

var populateController = function(context) {
	context.user = context.req.user;
}

tripController.show = function() {
	populateController(this);
	this.id = this.param("id");
	this.render();
}

module.exports = tripController;
