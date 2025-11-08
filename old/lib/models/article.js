var _collection = 'articles';
var BSON = require('mongodb');
var DEFAULT_ITEMS_PER_PAGE = 10;

function _createFromRequest(req) {
	var article = new Object();

	article.author = req.body.article.author;
	article.content = req.body.article.content;
	article.title = req.body.article.title;
	article.seo_title = req.body.article.seo_title;
	article.publishedOn = new Date();
	article.ip_address = req.ip;
	article.comments_count = 0;
	article.published = eval(req.body.article.published);

	if (req.body.article._id) {
		article._id = BSON.ObjectID('' + req.body.article._id);
	}

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
						return true;
					}
				});
			});
		} else {
			callback(null, null);
			return false;
		}
	});
}

function fetchRecent(db, paginator, callback) {
	if (!paginator) paginator = new Object();
	if (!paginator.items) paginator.items = DEFAULT_ITEMS_PER_PAGE;
	if (!paginator.page) paginator.page = 1;
	var skippedArticles = (paginator.page-1) * paginator.items;

	db.collection(_collection, function(err, collection) {
		if (!err) {
			var where = {
				published : 1
			}
			collection.find(where).sort({publishedOn: -1}).skip(skippedArticles).limit(paginator.items).toArray(
				function (err, result) {
					collection.find(where).count(function(err, countResult) {
						var articlesToEnd = countResult - skippedArticles;
						result.paginator = paginator;
						if (articlesToEnd > paginator.items) result.paginator.hasNext = true;
						if (paginator.page > 1) result.paginator.hasPrevious = true;
						callback(err, result);
					});
				}
			);
		} else {
			callback(err, articles);
		}
	});
}

function fetchUnpublished(db, q, callback) {
	if (!q) q=10;

	db.collection(_collection, function(err, collection) {
		if (!err) {
			var where = {
				published : 0
			}
			collection.find(where).sort({publishedOn: -1}).limit(q).toArray(
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
					collection.update({_id: new BSON.ObjectID('' + article._id)}, article, function(err,record) {
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

function increaseCommentsCount(db, articleId, callback) {
	db.collection(_collection, function (err, collection) {
		var where = {
			_id : BSON.ObjectID('' + articleId)
		}
		collection.update(where, {$inc:{comments_count:1}}, function(err, result) {
			if (err) console.log(err);
			if (!err && callback) callback(err, result);
		});
	});
}

exports.fetchRecent = fetchRecent;
exports.save = save;
exports.get = get;
exports.remove = remove;
exports.increaseCommentsCount = increaseCommentsCount;
exports.fetchUnpublished = fetchUnpublished;