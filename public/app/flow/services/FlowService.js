var FlowService = function($resource, $interval, identity) {
	var resource = $resource('api/flow-management/cards', {}, {
		query: {
			method: 'GET',
			isArray: false,
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
	});
	this.query = resource.query.bind(resource);
	var queryPolling = null;
	var isQueryPolling = false;
	this.startQueryPolling = function(filters, success, error, millis) {
		this.query(filters, success, error);
		var that = this;
		queryPolling = $interval(function() {
			if (isQueryPolling) return;
			that.query(filters, success, error);
		}, millis);
	};
	this.stopQueryPolling = function() {
		if(queryPolling) {
			$interval.cancel(queryPolling);
			queryPolling = null;
		}
	};
};

FlowService.prototype = {
		constructor: FlowService
};

angular.module('app.flow')
	.service('flowService', ['$resource', '$interval', 'identity', FlowService]);