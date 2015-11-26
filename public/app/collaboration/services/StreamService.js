var StreamService = function($resource, $interval, identity) {
	var resource = $resource('api/:orgId/task-management/streams/:streamId/:controller', { orgId: '@orgId' }, {
		query:  {
			method: 'GET',
			isArray: false,
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		save: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		delete: {
			method: 'DELETE',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		}
	});

	this.getIdentity = function() {
		return identity;
	};

	var isQueryPolling = false;
	this.query = function(organization, success, error) {
		isQueryPolling = true;
		resource.query(
				{ orgId: organization.id },
				function(data) {
					isQueryPolling = false;
					success(data);
				},
				function(response) {
					isQueryPolling = false;
					error(response);
				});
	};
	this.save  = function(stream, success, error) {
		return resource.save({ orgId: stream.organization.id }, stream, success, error);
	};
	this.delete = resource.delete;

	var queryPolling = null;
	this.startQueryPolling = function(organization, success, error, millis) {
		this.query(organization, success, error);
		var that = this;
		queryPolling = $interval(function() {
			if(isQueryPolling) return;
			that.query(organization, success, error);
		}, millis);
	};
	this.stopQueryPolling = function() {
		if(queryPolling) {
			$interval.cancel(queryPolling);
			queryPolling = null;
		}
	};
};
StreamService.prototype = {
	constructor: StreamService,
	visibilityCriteria: {
		createStream: function(organization) {
			return this.getIdentity().isAuthenticated() &&
					this.getIdentity().getMembership(organization.id);
		}
	},
	isAllowed: function(command, resource) {
		var criteria = this.visibilityCriteria[command];
		if(criteria) {
			criteria = criteria.bind(this);
			return criteria(resource);
		}
		return true;
	}
};
angular.module('oraApp.collaboration')
	.service('streamService', ['$resource', '$interval', 'identity', StreamService]);