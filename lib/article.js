var _collection = 'articles';

function _createFromRequest(req) {
	var article = new Object();

	article.author = req.query['author'];
	article.content = req.query['content'];
	article.title = req.query['title'];
	article.seo_title = req.query['seo_title'];
	console.log(article);

	if (req.params.id) {
		article.id = req.params.id;
	}

	return article;
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

exports.save = save;
exports.get = get;