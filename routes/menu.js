function notImplemented(req, res) {
	res.setHeader('Content-type', 'text/html');
	res.write('Not implemented');
	res.end();
}

var init = function(app) {
	console.log('Initializing MENU routes...');	

	app.get('/menu/manage', notImplemented);
	app.get('/menu/edit', notImplemented);
	app.get('/menu/delete', notImplemented);
	app.get('/menu/save', notImplemented);
}

exports.init = init;