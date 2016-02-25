var _collection = 'users';
var _db;
var Hash = require('jshashes');
Hash = new Hash.SHA512;
var salt = 'my-salt-string';

var encodePassword = function(plainPassword) {
	return Hash.hex(plainPassword);
}

var authenticate = function(username, password, next) {
    if( username && password ) {
    	_db.collection(_collection, function(err, collection) {
    		if (!err) {
    			var where = {
    				username : username,
    				password : encodePassword(password)
    			}
    			collection.findOne(where, function(err, result) {
                    if (!err) {
                        if (result != null) {
                            if (next) next(null, true);
                            return true;
                        } else {
                            if (next) next('Not valid credentials', false);
                            return false;
                        }
                    } else {
                        if (next) next(err, false);
                        return false;
                    }
                });
    		} else {
                if (next) next(err, false);
                return false;
            }
    	}) ;  	
    } else {
        if (next) next('No username or password supplied', false);
        return false;
    }
}

var setDb = function(db) {
	_db = db;
}

exports.authenticate = authenticate;
exports.setDb = setDb;
exports.encodePassword = encodePassword;