var totalRequests = 1000;
var startDate = new Date();
var http = require('http');
var parsedRequests = 0;
var successfulRequests = 0;

var options = {
	'host' : '192.168.0.20',
	'port' : '7777',
//	'port' : '80',
	'method' : 'GET',
	'path' : '/'// + Math.floor(Math.random() * 1000)
//	'path' : 'phpinfo.php'
};


var callback = function(res) {
	res.on('end', function() {
		parsedRequests++;
		if (res.statusCode >= 200 && res.statusCode < 300) {
			successfulRequests++;
		}
		if (parsedRequests == totalRequests) {
			var finalDate = new Date();
			var seconds = (finalDate - startDate)/1000;
			console.log("Total execution time: " + seconds);
			console.log("Successful requests: " + successfulRequests);
			console.log("Unsuccessful requests: " + (totalRequests - successfulRequests));
			console.log("Total requests: " + totalRequests);
			console.log(parseInt(totalRequests / seconds) + " Request per second");
		}
	})
}

var req = new Array();
for (var i=0; i<totalRequests; i++) {
	req[i] = new http.request(options, callback);
	req[i].end();
}