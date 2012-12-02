var article = require('../lib/models/article');
var visitor = require('../lib/models/visitor');

var init = function(app) {
	console.log ("Initializing Index routes...");

	var db = app.get('db');
	app.get('/', function(req, res) {
		article.fetchRecent(db, 3, function(err, articles) {
			if (!err) {
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/html;charset=utf-8');
				res.render('index/index', {articles: articles}, function(err, html) {
					if (!err) {
						res.send(html);
					} else {
						console.log("Error en get /" + err);
					}			
					res.end();
				});
				res.end();
			} else {
				res.statusCode = 500;
				res.end();
			}
		});
		visitor.save(db, req);
	});
	app.get('/test', function (req, res) {
		var article = {
			title : "Prueba",
			seo_title : "prueba",
			content : "Contenido de prueba",
			publishedOn : new Date(),
			author : "Erick Rojas : erojas@hotmail.com",
			comments : [
				{
					author: 'Pepe Pegotero',
					publishedOn : new Date(),
					comment: 'JS rules!'
				},
				{
					author: 'Pepetitle Pegotero 2',
					publishedOn : new Date(),
					comment: 'Mongo also rules!'
				}
			]
		};
		res.statusCode = 200;
		res.setHeader('Content-type', 'application/json');
		res.write(JSON.stringify(article));
		res.end();
	});
	app.get('/test2', function (req, res) {
		res.render('test/index', {}, function(err,html) {
			if (!err) {
				res.send(html);
				res.end();
			} else {
				console.log(err);
			}
		});
	});
}

exports.init = init;