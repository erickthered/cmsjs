var _collection = 'visitors';

function save(db, req, callback) {
	db.collection(_collection, function(err, collection) {
		var record = {
			visit_date : new Date(),
			path : req.path,
			ip_address : req.ip
		};
		collection.insert(record, function(err, record) {
			if (callback) {
				callback(err, record);
			}
		});
	});
}

exports.save = save;