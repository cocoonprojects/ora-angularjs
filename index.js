var configFile = './config.' + (process.env.NODE_ENV || 'development');
var config = require(configFile);
if(!config) {
	console.log('Unable to find config file ' + configFile);
} else {
	console.log('API End Point [apiEndPoint]: ' + config.apiEndPoint);
}

var express = require('express');
var httpProxy = require('http-proxy');
var url = require('url');

var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var server = express();
server.set('port', config.serverPort);
server.use(express.static(__dirname + '/public'));

var apiProxy = httpProxy.createProxyServer();
apiProxy.on('proxyRes', function(proxyRes, req, res) {
	if(proxyRes.headers.location) {
		proxyRes.headers.location = '/api' + proxyRes.headers.location;
	}
});

server.all("/api/*", function(req, res) {
	req.headers.host = url.parse(config.apiEndPoint).hostname;
	req.url = req.url.substring(4);
	apiProxy.web(req, res, { target: config.apiEndPoint }, function(e) {
		console.log(config.apiEndPoint + e);
	});
	console.log("Request made to " + req.headers.host + req.url);
});

server.listen(server.get('port'), config.serverIpAddress, function() {
	console.log('Express server listening on ' + server_ip_address + ', port ' + server.get('port'));
});