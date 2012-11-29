var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var mongoHost = 'localhost';
var mongoPort = 27017;
var mongoDbName = 'test';
var mongoURI = "mongodb://" + mongoHost + ":" + mongoPort + "/" + mongoDbName;
var mongoCollectionName = 'visitors';

var writeLog = function(message) {
	console.log(new Date() + ' - ' + message);
}

var insertVisitor = function(db, req) {
	db.collection(mongoCollectionName, function(err, collection) {
		if (!err) {
			var record = {
				'fecha' : new Date(),
				'ip_address' : req.ip,
				'path' : req.path
			}
			collection.insert(record, function(err, record) {
				if (err) console.log(err);
			});
		} else {
			console.log(err);
		}
	});
}

var initExpressApp = function(db) {
	app.enable('trust proxy');
	app.use(express.static(__dirname + '/public'));
	app.get('/article/:name', function(req, res) {
		var article = require('./lib/article');
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
			insertVisitor(db, req);
		});
	});
	app.get('/', function(req, res) {
		res.statusCode = 200;
		res.setHeader('Content-type', 'text/html;charset=utf-8');
		res.write('<h1>Welcome to CmsJS</h1>');
		res.end();
		insertVisitor(db, req);
	});
	app.listen(7777);
	writeLog("CmsJS started!");
}

var mongoCallback = function(err, db) {
	if (!err) {
		initExpressApp(db);
	} else {
		console.log(err);
	}
}

console.log(process.env);
MongoClient.connect(mongoURI, mongoCallback);