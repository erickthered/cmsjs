var article = require('../lib/models/article');
var visitor = require('../lib/models/visitor');
var comment = require('../lib/models/comment');
var markdown = require('markdown');
var express = require('express');

var init = function(app) {
	console.log('Initializing ARTICLE routes...');

	var db = app.get('db');
	app.get('/article/view/:id', function(req, res) {
		article.get(db, req.params.id, function(err, record) {
			if (record) {
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				record.content = markdown.parse(record.content);
				res.render('article/view', {article:record, md:markdown.parse, user: req.session.user}, function (err, html) {
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
	app.get('/article/edit/:id?', function(req, res) {
		if (!req.session.user) {
			res.redirect("/");
			res.end();
		} else {
			article.get(db, req.params.id, function(err, record) {
				if (!err) {
					res.render('article/edit', {article:record, user:req.session.user}, function (err, html) {
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
		}
	});	
	app.post('/article/save', function(req, res) {
		if (!req.session.user) {
			res.redirect("/");
			res.end();
		} else {
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
		}
	});
	app.get('/article/remove/:articleid', function(req, res) {
		if (!req.session.user) {
			res.redirect("/");
			res.end();
		} else {
			article.remove(db, req.params.articleid, function(err, result) {
				if (err) {
					console.log(err);
				}
				res.redirect("/");
				res.end();
			});
		}
	});
	app.post('/article/comment/save', function(req, res) {
		comment.save(db, req, function(err, result) {
			if (!err) {
				res.statusCode = 200;
				res.setHeader('Content-type', 'application/json');
				res.write(JSON.stringify({result: 'success', data: result}));
				res.end();
			} else {
				console.log(err);

				res.statusCode = 200;
				res.setHeader('Content-type', 'application/json');
				res.write(JSON.stringify({result: 'error', data: err}));
				res.end();
			}
		});
	});
	app.get('/article/:articleid/comments', function(req, res) {
		comment.getByArticle(db, req.params.articleid, function(err, result) {
			res.statusCode = 200;
			res.setHeader('Content-type', 'application/json');
			if (err) {
				console.log(err);
				res.write(JSON.stringify({result:'error', data: err}));
				res.end();
			} else {
				res.write(JSON.stringify({result:'success', data: result, isLoggedIn: req.session.isLoggedIn}));
				res.end();
			}
		});
	});
	app.get('/article/comment/delete/:commentid', function(req, res) {
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
	app.get('/articles/unpublished', function(req, res) {
		if (!req.session.user) {
			res.redirect("/login");
			res.end();
		} else {
			article.fetchUnpublished(db, 10, function(err, records) {
				res.render('article/unpublished', {articles:records, user: req.session.user}, function(err, html) {
					if (err) {
						console.log(err);
						res.end();
					} else {
						res.statusCode = 200;
						res.setHeader('Content-type', 'text/html;charset=utf-8');
						res.write(html);
						res.end();
					}			
				});
			});
		}
	});
}

exports.init = init;