var express = require('express');
var httpProxy = require('http-proxy');

var server = express();
server.set('port', 8000);
server.use(express.static(__dirname + '/public'));

var apiProxy = httpProxy.createProxyServer();

server.all("/api/*", function(req, res) {
	req.url = req.url.substring(4);
    apiProxy.web(req, res, { target: 'http://oraproject.carmati.it' }, function(e) {
		console.log(e);
	});
    console.log("Request made to " + req.url);
});

server.listen(server.get('port'), function() {
    console.log('Express server listening on port ' + server.get('port'));
});
