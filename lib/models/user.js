var _collection = 'users';
var _db;
var Hash = require('jshashes').SHA512;
var salt = 'my-salt-string';

var encodePassword = function(plainPassword) {
	return Hash().hex(plainPassword);
}

var authenticate = function(username, password, next) {
    console.log(username);
    console.log("Trying to authenticate " + username + "," + password);
    if( username && password ) {
    	_db.collection(_collection, function(err, collection) {
    		if (!err) {
    			var where = {
    				username : username,
    				password : encodePassword(password)
    			}
    			collection.findOne(where, function(err, result) {
                    console.log('Query has been made');
                    if (!err) {
                        console.log(result);
                        if (result != null) {
                            console.log('User has been found');
                            return true;
                        } else {
                            console.log('User NOT found, returns false');
                            return false;
                        }
                    } else {
                        console.log(err);
                        return false;
                    }
                });
    		} else {
    			console.log(err);
                return false;
    		}
    	}) ;  	
    } else {
    	console.error('No username or password supplied');
        return false;
    }
}

var setDb = function(db) {
	_db = db;
}

exports.authenticate = authenticate;
exports.setDb = setDb;
exports.encodePassword = encodePassword;