var _collection = 'articles';

function save(db, data, callback) {
	console.log('article.save() has not been implemented');
}

function get(db, articleId, callback) {
	db.collection(_collection, function(err, collection) {
		var where = {
			title : articleId
		};
		collection.findOne(where, function(err, record) {
				callback(err, record);
		});
	});
}

exports.save = save;
exports.get = get;

exports.save = save;