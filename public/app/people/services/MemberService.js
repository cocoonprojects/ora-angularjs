var MemberService = function($resource, identity) {
	var resource = $resource('api/:orgId/people/members/:memberId', { orgId: '@orgId' }, {
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
		},
		delete: {
			method: 'DELETE',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		}
	});

	this.query = resource.query;
	this.get   = resource.get;
	this.joinOrganization = function(organization, success, error) {
		resource.save({ orgId: organization.id }, success, error);
	};
	this.unjoinOrganization = function(organization, success, error) {
		resource.delete({ orgId: organization.id }, success, error);
	};
	this.getIdentity = function() {
		return identity;
	};
};
MemberService.prototype = {
	constructor: MemberService,
	visibilityCriteria: {
		joinOrganization: function(organization) {
			return organization &&
					this.getIdentity().getMembership(organization.id) === null;
		},
		unjoinOrganization: function(organization) {
			return organization &&
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
angular.module('app.people')
	.service('memberService', ['$resource', 'identity', MemberService]);