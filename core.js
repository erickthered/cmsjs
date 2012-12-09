var express = require('express');
var user = require('./lib/models/user');
var MemoryStore = require('express').session.MemoryStore;

var theme = process.env.THEME || 'default'

var init = function(app) {
	console.log('Initialing Core...');
	app.enable('trust proxy');
	// app.use(express.compress());
	app.use(express.cookieParser());
	app.use(express.session({secret: "crazy secret stuff" }));
	app.use(express.bodyParser());

	app.set('theme', theme);
	app.set('view engine', 'jade');
	app.set('views', './themes/' + app.get('theme'));

	user.setDb(app.get('db'));
	app.all('*', function(req, res, next) {
		res.setHeader('x-powered-by', 'CmsJS');
		next();
	});
	app.use(express.static(__dirname + '/public'));
}

exports.init = init;