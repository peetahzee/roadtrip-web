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

	this.resource('trip');

  // this.post('users/login', passport.authenticate('local', { successRedirect: '/users/successLogin', failureRedirect: '/users/failLogin' }));
  this.post('users/login', function(req, res, next) {
  	console.log("##############[USER]############", req.body);
	  passport.authenticate('local', function(err, user, info) {
	    if (err) { return res.json(503, { status: "err", error: err }); }
	    if (!user) { return res.json(401, { status: "err", error: "invalid user name / password" }); }
	    req.logIn(user, function(err) {
		    if (err) { return res.json(503, { status: "err", error: err }); }
	      return res.json(200, {status: "ok"});
	    });
	  })(req, res, next);
	});

	this.post('users/signup', 'users#signup');
  this.get('users/successLogin', 'users#successLogin');
  this.get('users/failLogin', 'users#failLogin');
  this.get('users/currentUser', 'users#currentUser');

  this.get('user/trips', 'user#getTrips');

  this.resource('trips');
  this.post('trips/addFriend', 'trips#addFriend');
  this.post('trips/addFriendId', 'trips#addFriendId');
  this.post('trips/addSpot', 'trips#addSpot');
  this.post('trips/end', 'trips#end');
  this.get('trips/spots', 'trips#getSpots');
  this.get('trips/media', 'trips#getMedia');

  this.get('twitter/post', 'twitter#post');
  this.post('twitter/link', 'twitter#link');
}
