var express = require('express');

var init = function(app) {
	console.log('Initialing Core...');
	app.enable('trust proxy');
	// app.use(express.compress());
	app.use(express.cookieParser({ secret: "crazysecretstuff"}));
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
	app.set('view engine', 'jade');
}

exports.init = init;