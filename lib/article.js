var _collection = 'articles';
var _db;

function _createFromRequest(req) {
	var article = new Object();

	article.author = req.body.article.author;
	article.content = req.body.article.content;
	article.title = req.body.article.title;
	article.seo_title = req.body.article.seo_title;
	article.publishedOn = new Date();
	console.log(article);

	if (req.params.id) {
		article.id = req.params.id;
	}

	return article;
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
			if (!article.id) {
				collection.insert(article, function(err,record) {
					if (callback) {
						callback(err, record);
					}
				});
			}
		} else {
			console.log(err);
		}
	});
}

function get(db, articleId, callback) {
	db.collection(_collection, function(err, collection) {
		var where = {
			seo_title : articleId
		};
		collection.findOne(where, function(err, record) {
			if (callback) {
				callback(err, record);
			}
		});
	});
}

exports.fetchRecent = fetchRecent;
exports.save = save;
exports.get = get;