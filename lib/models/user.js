var _collection = 'users';
var _db;

var authenticate = function(username, password) {
	_db.collection(_collection, function(err, collection) {
		if (!err) {
			collection.findOne(where, function(err, record) {
				var md5=require('./md5').md5(password);
				console.log(md5);
			});
		} else {
			console.log('Authenticate: ' + err);
		}
	});
};

var setDb = function(db) {
	_db = db;
}

exports.authenticate = authenticate;
exports.setDb = setDb;