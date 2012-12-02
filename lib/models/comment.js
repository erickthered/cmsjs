var _collection = 'comments';
var BSON = require('mongodb').BSONPure;

var _createFromRequest = function(req) {
	newComment = new Object();

	newComment.author = req.body.comment.author;
	newComment.email = req.body.comment.email;
	newComment.content = req.body.comment.content;
	newComment.postedOn = new Date();
	newComment.article = req.body.comment.article;
	newComment.showEmail = true;
	newComment.approved = true;

	return newComment;
}

var getByArticle = function (db, article, callback) {
	if (article) {
		db.collection(_collection, function (err, collection) {
			if (!err) {
				var where = {
					article : '' + article._id,
					approved: true
				};
				collection.find(where).sort({postedOn:-1}).toArray(
					function(err, result) {
						article.comments = result;
						callback(err, result);
					}
				);
			} else {
				console.log(err);
				callback(err, null);
			}
		});
	} else {
		callback(null, null)
	}
}

var save = function (db, req, callback) {
	console.log('entering save comment method');
	db.collection(_collection, function (err, collection) {
		if (!err) {
			var comment = _createFromRequest(req);
			collection.insert(comment, function(err, result) {
				// @todo. increment the comment counter in article
				if (!err) {

				} else {
					console.log(err);
				}
			})
		} else {
			console.log(err);
		}
		callback(err, collection);
	});
}

var remove = function (db, commentId, callback) {
	db.collection(_collection, function (err, collection) {
		if (!err) {
			var where = {
				_id : BSON.ObjectID(commentId)
			};
			console.log(where);
			collection.remove(where, function(err, result) {
				callback(err, result);
			});
		} else {
			console.log(err);
		}
	});
}

exports.getByArticle = getByArticle;
exports.save = save;
exports.remove = remove;