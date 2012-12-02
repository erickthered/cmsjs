var article = require('../lib/models/article');
var visitor = require('../lib/models/visitor');
var markdown = require('markdown');

var init = function(app) {
	console.log('Initializing ARTICLE routes...');

	var db = app.get('db');
	app.get('/article/view/:name', function(req, res) {
		article.get(db, req.params.name, function(err, record) {
			if (record) {
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
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
	app.get('/article/edit/:name?', function(req, res) {
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
	app.post('/article/save', function(req, res) {
		article.save(db, req, function(err, record) {
			if (!err) {
				res.redirect('/article/view/' + req.body.article.seo_title);
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
	app.get('/article/remove/:name', function(req, res) {
		article.remove(db, req.params.name, function(err, result) {
			if (!err) {
				res.write('<h1>Article Deleted</h1>');
			} else {
				console.log(err);
			}
			res.end();
		});
	});
}

exports.init = init;