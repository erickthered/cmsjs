var _collection = 'articles';
var BSON = require('mongodb').BSONPure;

function _createFromRequest(req) {
	var article = new Object();

	article.author = req.body.article.author;
	article.content = req.body.article.content;
	article.title = req.body.article.title;
	article.seo_title = req.body.article.seo_title;
	article.publishedOn = new Date();
	article.ip_address = req.ip;
	article.comments_count = 0;
	if (req.body.article._id) {
		article._id = BSON.ObjectID('' + req.body.article._id);
	}
	// console.log(article);

	return article;
}

function get(db, articleId, callback) {
	db.collection(_collection, function(err, collection) {
		if (articleId) {
			var where = {
				_id : BSON.ObjectID('' + articleId)
			};
			collection.findOne(where, function(err, record) {
				var comment = require('./comment');
				comment.getByArticle(db, record, function(err, result) {
					if (callback) {
						callback(err, record);
					}
				});
			});
		} else {
			callback(null, null);
		}
	});
}

function fetchRecent(db, q, callback) {
	db.collection(_collection, function(err, collection) {
		if (!err) {
			collection.find().sort({publishedOn: -1}).limit(q).toArray(
				function (err, result) {
					callback(err, result);
				}
			);
		} else {
			callback(err, articles);
		}
	});
}

function save(db, req, callback) {
	db.collection(_collection, function(err, collection) {
		if (!err) {
			var article = _createFromRequest(req);
			get(db, article._id, function(err, record) {
				if (record) {
					collection.update({seo_title:article.seo_title}, article, function(err,record) {
						if (callback) {
							callback(err, record);
						}
					});					
				} else {
					collection.insert(article, function(err,record) {
						if (callback) {
							callback(err, record);
						}
					});
				}
			});
		} else {
			console.log(err);
		}
	});
}

function remove(db, articleId, callback) {
	db.collection(_collection, function(err, collection) {
		var comments = require('./comment.js');
		comments.getByArticle(db, articleId, function(err, result) {
			for (key in result) {
				comments.remove(db, result[key]._id);
			}
			var where = {
				_id : BSON.ObjectID('' + articleId)
			};
			collection.remove(where, function(err, result) {
				if (err) {
					console.log(err);
				} else {
					if (callback) {
						callback(err, result);
					}
				}
			});
		});
	});
}

exports.fetchRecent = fetchRecent;
exports.save = save;
exports.get = get;
exports.remove = remove;