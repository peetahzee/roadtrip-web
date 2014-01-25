var passport = require('passport');
// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
module.exports = function routes() {
  this.root('pages#main');
	this.match('login', 'pages#login', { via: 'get' });

  this.post('users/login', passport.authenticate('local', { successRedirect: '/users/successLogin', failureRedirect: '/users/failLogin' }));
	this.post('users/signup', 'users#signup');
  this.get('users/successLogin', 'users#successLogin');
  this.get('users/failLogin', 'users#failLogin');
  this.get('users/currentUser', 'users#currentUser');

  this.resource('trips');
  this.post('trips/addFriend', 'trips#addFriend');
}
