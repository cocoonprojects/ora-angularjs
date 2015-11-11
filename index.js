var express = require('express');
var httpProxy = require('http-proxy');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var backend_url = 'http://oraproject.carmati.it';

var server = express();
server.set('port', server_port);
server.use(express.static(__dirname + '/public'));

var apiProxy = httpProxy.createProxyServer();
apiProxy.on('proxyRes', function(proxyRes, req, res) {
	if(proxyRes.headers.location) {
		proxyRes.headers.location = '/api' + proxyRes.headers.location;
	}
});

server.all("/api/*", function(req, res) {
	req.url = req.url.substring(4);
	apiProxy.web(req, res, { target: backend_url }, function(e) {
		console.log(e);
	});
	console.log("Request made to " + req.url);
});

server.listen(server.get('port'), server_ip_address, function() {
	console.log('Express server listening on ' + server_ip_address + ', port ' + server.get('port'));
});
