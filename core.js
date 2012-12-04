var express = require('express');

var init = function(app) {
	console.log('Initialing Core...');
	app.enable('trust proxy');
	// app.use(express.compress());
	app.use(express.cookieParser());
	app.use(express.session({secret: "crazysecretstuff", cookie: { secure: true }}));
	app.use(express.bodyParser());
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
}

exports.init = init;