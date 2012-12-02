function notImplemented(req, res) {
	res.setHeader('Content-type', 'text/html');
	res.write('Not implemented');
	res.end();
}

var init = function(app) {
	console.log('Initializing USER routes...');	

	app.get('/user/manage', notImplemented);
	app.get('/user/edit', notImplemented);
	app.get('/user/delete', notImplemented);
	app.get('/user/save', notImplemented);
}

exports.init = init;