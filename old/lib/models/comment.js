var _collection = 'comments';
var BSON = require('mongodb');
var Hash = require('jshashes');
Hash = new Hash.MD5();

var _createFromRequest = function(req) {
	newComment = new Object();

	newComment.author = req.body.comment.author;
	newComment.email = req.body.comment.email;
	newComment.content = req.body.comment.content;
	newComment.postedOn = new Date();
	newComment.article = BSON.ObjectID(req.body.comment.article);
	newComment.ip_address = req.ip;
	newComment.showEmail = true;
	newComment.approved = true;
	newComment.gravatar = Hash.hex(req.body.comment.email);

	return newComment;
}

var getByArticle = function (db, article, callback) {
	if (article) {
		db.collection(_collection, function (err, collection) {
			var articleid = 0;
			if (!article._id) {
				articleid = article;
			} else {
				articleid = article._id;
			}
			if (!err) {
				var where = {
					article : BSON.ObjectID('' + articleid),
					approved: true
				};
				collection.find(where).sort({postedOn:1}).toArray(
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
	db.collection(_collection, function (err, collection) {
		var saveResult = null;
		if (!err) {
			var comment = _createFromRequest(req);
			collection.insert(comment, function(err, result) {
				if (!err) {
					var article = require('./article');
					article.increaseCommentsCount(db, comment.article);
					callback(err, result);
				} else {
					console.log(err);
					callback(err, null);
				}
			})
		} else {
			console.log(err);
			callback(err, null);
		}
	});
}

var remove = function (db, commentId, callback) {
	db.collection(_collection, function (err, collection) {
		if (!err) {
			var where = {
				_id : BSON.ObjectID('' + commentId)
			};
			collection.remove(where, function(err, result) {
				if (callback) callback(err, result);
			});
		} else {
			console.log(err);
		}
	});
}

exports.getByArticle = getByArticle;
exports.save = save;
exports.remove = remove;