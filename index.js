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
};

var initExpressApp = function(db) {
	app.enable('trust proxy');
//	app.use(express.compress());
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
	app.set('view engine', 'jade');
	app.get('/article/:name', function(req, res) {
		var article = require('./lib/article');
		var visitor = require('./lib/visitor');
		article.get(db, req.params.name, function(err, record) {
			if (record) {
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				res.render('article/view', {article:record}, function (err, html) {
					if (err) {
						console.log(err);
						res.end();
					} else {
						res.send(html);
						res.end();
					}
				});
			} else {
				res.statusCode = 404;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				res.write('<h1>Error 404</h1>');
				res.write('<p>Not found.</p>');
				res.end();
			}
		});
		visitor.save(db, req);
	});
	app.get('/edit/:name?', function(req, res) {
		var article = require('./lib/article');
		var visitor = require('./lib/visitor');
		article.get(db, req.params.name, function(err, record) {
			if (!err) {
				res.render('article/edit', {article:record}, function (err, html) {
					if (err) {
						console.log(err);
						res.end();
					} else {
						res.send(html);
						res.end();
					}
				});
			} else {
				console.log(err);
			}
		});		
		visitor.save(db, req);
	});	
	app.post('/save', function(req, res) {
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
		var article = require('./lib/article');
		var visitor = require('./lib/visitor');
		article.fetchRecent(db, 3, function(err, articles) {
			if (!err) {
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				res.render('index/index', {articles: articles}, function(err, html) {
					if (!err) {
						res.send(html);
					} else {
						console.log("Error en get /" + err);
					}			
					res.end();
				});
			} else {
				res.statusCode = 500;
				res.end();
			}
		});
		visitor.save(db, req);
	});
	app.listen(appPort);
	writeLog("CmsJS started!");
};

var mongoCallback = function(err, db) {
	if (!err) {
		initExpressApp(db);
	} else {
		console.log(err);
	}
};

MongoClient.connect(mongoURI, mongoCallback);