var  express = require('express');
var requiresAuth = express.basicAuth('admin', 'admin');

function notImplemented(req, res) {
	res.setHeader('Content-type', 'text/html');
	res.write('Not Implemented');
	if (!req.session.visits) {
		req.session.visits = 0;
	}
	req.session.visits++;
	res.write('Visitas ' + req.session.visits);
	res.end();
}

var init = function(app) {
	console.log("Initializing ADMIN routes");
	app.get('/admin', requiresAuth, notImplemented);
	app.get('/admin/configure', requiresAuth, notImplemented);
}

exports.init = init;