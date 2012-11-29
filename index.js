var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
// used for testing/development
var mongoHost = 'localhost';
var mongoPort = 27017;
var mongoDbName = 'test';

var mongoCollectionName = 'visitors';
var mongoURI = process.env.MONGOLAB_URI || "mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDbName;
var appPort = process.env.PORT || 7777;
var writeLog = function(message) {
	console.log(new Date() + ' - ' + message);
}

var initExpressApp = function(db) {
	app.enable('trust proxy');
	app.use(express.static(__dirname + '/public'));
	app.get('/article/:name', function(req, res) {
		var article = require('./lib/article');
		var visitor = require('./lib/visitor');
		article.get(db, req.params.name, function(err, record) {
			if (record) {
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				res.write('<h1>' + record.title + '</h1>');
				res.write('<div>' + record.author + '</div>');
				res.write('<div>' + record.content + '</div>');
			} else {
				res.statusCode = 404;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				res.write('<h1>Error 404</h1>');
				res.write('<p>Not found.</p>');
			}
			res.end();
		});
		visitor.save(db, req);
	});
	app.get('/save', function(req, res) {
		var article = require('./lib/article');
		var visitor = require('./lib/visitor');
		article.save(db, req, function(err, record) {
			res.statusCode = 200;
			res.setHeader('Content-type', 'text/html;charset=utf-8');
			if (record) {
				res.write('<h1>Article has been Saved</h1>');
			} else {
				res.write('<h1>Error when saving Article</h1>');
				res.write('<p>' + err + '</p>');
			}
			res.end();
		});
		visitor.save(db, req);
	});
	app.get('/', function(req, res) {
		var visitor = require('./lib/visitor');
		res.statusCode = 200;
		res.setHeader('Content-type', 'text/html;charset=utf-8');
		res.write('<h1>Welcome to CmsJS</h1>');
		res.end();
		visitor.save(db, req);
	});
	app.listen(appPort);
	writeLog("CmsJS started!");
}

var mongoCallback = function(err, db) {
	if (!err) {
		initExpressApp(db);
	} else {
		console.log(err);
	}
}

MongoClient.connect(mongoURI, mongoCallback);