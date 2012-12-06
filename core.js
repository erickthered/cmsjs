var express = require('express');
var user = require('./lib/models/user');

var init = function(app) {
	console.log('Initialing Core...');
	app.enable('trust proxy');
	// app.use(express.compress());
	app.use(express.cookieParser());
	app.use(express.session({secret: "crazysecretstuff", cookie: { secure: true }}));
	app.use(express.bodyParser());
	app.set('view engine', 'jade');
	user.setDb(app.get('db'));
	app.set('auth_provider', user.authenticate);
	// user.authenticate('admin', 'admin', function() {
	// 	console.log('El método de autenticación funcionó!!!');
	// });
	app.use(express.static(__dirname + '/public'));
}

exports.init = init;