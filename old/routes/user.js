var userModel = require('../lib/models/user');

function notImplemented(req, res) {
	res.setHeader('Content-type', 'text/html');
	res.write('Not implemented');
	res.end();
}

var init = function(app) {
	console.log('Initializing USER routes...');	

	// login URI
	app.get('/login', function(req, res) {
		if (req.session.isLoggedIn) {
			console.log('already logged in');
			res.redirect("/");
			res.end();
		} else {
			res.render('user/login', function(err, html) {
				if (!err) {
					res.statusCode = 200;
					res.setHeader('Content-type', 'text/html;charset=utf-8');
					res.write(html);
					res.end();
				} else {
					console.log(err);
					res.end();
				}
			});
		}
	});

	app.post('/dologin', function(req, res) {
		if (req.body.username && req.body.password) {
			userModel.authenticate(req.body.username, req.body.password, function(err, result) {
				if (!err && result) {
					req.session.isLoggedIn = true;
					req.session.user = req.session.remoteUser = req.body.username;
					res.redirect("/");
					res.end();				
				} else {
					console.log(err);
					res.redirect("/login");
					res.end();
				}
			});
		} else {
			console.log('no parameters found');
			res.redirect("/login");
			res.end();
		}
	});

	app.get('/logout', function(req, res) {
		req.session.user = null;
		req.session.isLoggedIn = false;
		req.session.regenerate(function(err) {
			if (err) console.log(err);
		});
		res.redirect("/");
		res.end();
	});

	app.get('/user/signup', notImplemented);
	app.get('/user/profile', notImplemented);
	app.get('/user/manage', notImplemented);
	app.get('/user/edit', notImplemented);
	app.get('/user/delete', notImplemented);
	app.get('/user/save', notImplemented);
}

exports.init = init;