var OrganizationService = function($resource, identity) {
	var resource = $resource('api/organizations', null, {
		get: {
			method: 'GET',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		query: {
			method: 'GET',
			isArray: false,
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		save: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		}
	});

	this.query = resource.query.bind(resource);
	this.get   = resource.get.bind(resource);
	this.save  = resource.save.bind(resource);

	this.getIdentity = function() {
		return identity;
	};

};
OrganizationService.prototype = {
	constructor: OrganizationService,
	visibilityCriteria: {
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
angular.module('app.organizations')
	.service('organizationService', ['$resource', 'identity', OrganizationService]);