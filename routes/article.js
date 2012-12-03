var article = require('../lib/models/article');
var visitor = require('../lib/models/visitor');
var comment = require('../lib/models/comment');
var markdown = require('markdown');
var express = require('express');
var requiresAuth = express.basicAuth('admin', 'admin');

var init = function(app) {
	console.log('Initializing ARTICLE routes...');

	var db = app.get('db');
	app.get('/article/view/:name', function(req, res) {
		article.get(db, req.params.name, function(err, record) {
			if (record) {
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				record.content = markdown.parse(record.content);
				res.render('article/view', {article:record, md:markdown.parse}, function (err, html) {
					if (err) {
						console.log(err);
						res.end();
					} else {
						res.write(html);
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
	app.get('/article/edit/:name?', requiresAuth, function(req, res) {
		article.get(db, req.params.name, function(err, record) {
			if (!err) {
				res.render('article/edit', {article:record}, function (err, html) {
					if (err) {
						console.log(err);
						res.end();
					} else {
						res.setHeader('Content-type', 'text/html;charset=utf-8');
						res.write(html);
						res.end();
					}
				});
			} else {
				console.log(err);
			}
		});		
		visitor.save(db, req);
	});	
	app.post('/article/save', requiresAuth, function(req, res) {
		article.save(db, req, function(err, record) {
			if (!err) {
				var articleid = 0;
				if (record == 1) {
					articleid = req.body.article._id;
				} else {
					articleid = record[0]._id;
				}
				res.redirect('/article/view/' + articleid);
			} else {
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				res.write('<h1>Error when saving Article</h1>');
				res.write('<p>' + err + '</p>');
			}
			res.end();
		});
		visitor.save(db, req);
	});
	app.get('/article/remove/:articleid', requiresAuth, function(req, res) {
		// @todo Delete comments
		article.remove(db, req.params.articleid, function(err, result) {
			if (!err) {
				res.write('<h1>Article Deleted</h1>');
			} else {
				console.log(err);
			}
			res.end();
		});
	});
	app.post('/article/comment/save', function(req, res) {
		comment.save(db, req, function(err, result) {
			if (!err) {
				res.write('comment added');
				res.end();
			} else {
				console.log(err);
				res.write('error when saving comment');
				res.end();
			}
		});
	});
	app.get('/article/comment/delete/:commentid', requiresAuth, function(req, res) {
		comment.remove(db, req.params.commentid, function(err, result) {
			if (!err) {
				res.write('comment deleted');
				res.end();
			} else {
				console.log(err);
				res.write('error when deleting comment');
				res.end();
			}
		});
	});
}

exports.init = init;