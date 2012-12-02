var article = require('../lib/models/article');
var visitor = require('../lib/models/visitor');

var init = function(app) {
	console.log ("Initializing INDEX routes...");

	var db = app.get('db');
	app.get('/', function(req, res) {
		article.fetchRecent(db, 3, function(err, articles) {
			if (!err) {
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				res.render('index/index', {articles: articles}, function(err, html) {
					if (!err) {
						res.write(html);
						res.end();
					} else {
						console.log("Error en get /" + err);
						res.end();
					}
				});
			} else {
				console.log("Error en fetchRecent " + err);
				res.statusCode = 500;
				res.write('Error when retrieving recent articles');
				res.end();
			}
		});
		visitor.save(db, req);
	});
	app.get('/markdown_parse', function(req, res) {
		var markdown = require('markdown');
		res.setHeader('Content-type', 'text/html;charset=utf-8');
		res.write(markdown.parse(req.query.data));
		res.end();
	});
}

exports.init = init;