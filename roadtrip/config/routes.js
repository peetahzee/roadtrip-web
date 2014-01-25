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

  this.match('users/login', passport.authenticate('local', { successRedirect: '/users/successLogin', failureRedirect: '/users/failLogin' }), { via: 'post' })
  this.match('users/successLogin', 'users#successLogin', { via: 'get' });
  this.match('users/failLogin', 'users#failLogin', { via: 'get' });
  this.match('users/currentUser', 'users#currentUser',  { via: 'get'});
	this.match('users/signup', 'users#signup', { via: 'post' });
}
