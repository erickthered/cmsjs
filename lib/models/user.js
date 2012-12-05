var _collection = 'users';
var _db;
var Hashes = require('jshashes');
var salt = 'my-salt-string';

var encodePassword = function(plainPassword) {
	return Hashes.SHA512.hex(plainPassword, salt);
}

var authenticate = function(username, password, callback) {
    if( username && password ) {
    	_db.collection(_collection, function(err, collection) {
    		if (!err) {
    			var where = {
    				username : username,
    				password : encodePassword(password)
    			}
    			collection.findOne(where, callback);
    		} else {
    			console.log(err);
    		}
    	}) ;  	
    } else {
    	console.error('No username or password supplied');
    }
}

var setDb = function(db) {
	_db = db;
}

exports.authenticate = authenticate;
exports.setDb = setDb;
exports.encodePassword = encodePassword;