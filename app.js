var fs = require('fs');
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

var initExpressApp = function(db) {
	console.log('Setting application DB');
	app.set('db', db);
	initControllers();
	app.listen(appPort);
};

function initControllers() {
	var controllersPath = __dirname + '/routes/';
	fs.readdir(controllersPath, function(err, files) {
		var core = require('./core');
		core.init(app);
		if (!err) {
			for (key in files) {
				var file = files[key];
				var controller = require(controllersPath + file);
				controller.init(app);
			}
		} else {
			console.log(err);
		}
	});
}

var mongoCallback = function(err, db) {
	if (!err) {
		initExpressApp(db);
	} else {
		console.log(err);
	}
};

MongoClient.connect(mongoURI, mongoCallback);
