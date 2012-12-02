var _collection = 'articles';

function _createFromRequest(req) {
	var article = new Object();

	article.author = req.body.article.author;
	article.content = req.body.article.content;
	article.title = req.body.article.title;
	article.seo_title = req.body.article.seo_title;
	article.publishedOn = new Date();
	// console.log(article);

	return article;
}

function get(db, articleId, callback) {
	db.collection(_collection, function(err, collection) {
		var where = {
			seo_title : articleId
		};
		collection.findOne(where, function(err, record) {
			var comment = require('./comment');
			comment.getByArticle(db, record, function(err, result) {
				if (callback) {
					callback(err, record);
				}
			});
		});
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
			get(db, article.seo_title, function(err, record) {
				if (record) {
					console.log('updating article...');
					collection.update({seo_title:article.seo_title}, article, function(err,record) {
						if (callback) {
							callback(err, record);
						}
					});					
				} else {
					console.log("inserting article...");
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
		var where = {
			seo_title : articleId
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
}

exports.fetchRecent = fetchRecent;
exports.save = save;
exports.get = get;
exports.remove = remove;