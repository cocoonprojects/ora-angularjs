var MINIMAL_CREDITS = 3000; //Dati da settings

var MemberService = function($http,$resource, identity) {
	var resource = $resource('api/:orgId/people/members/:memberId', { orgId: '@orgId', memberId: '@memberId' }, {
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
		},
		put: {
			method: 'PUT',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		}
	});

	this.query = resource.query;
	this.get   = resource.get;

	this.joinOrganization = function(organization, success, error) {
		resource.save({ orgId: organization.id }, success, error);
	};

	this.joinOrganizationAfterInvite = function(organization, success, error) {
		$http({
 			method: 'POST',
 			url: 'api/'+organization.id+'/people/members',
			headers: { 'GOOGLE-JWT': identity.getToken() },
 			data: { orgId: organization.id }
		}).success(success).error(error);
	};

	this.removeUserFromOrganization = function(organizationId, memberId) {
		return $http({
 			method: 'DELETE',
 			url: 'api/'+organizationId+'/people/members/' + memberId,
			headers: { 'GOOGLE-JWT': identity.getToken() }
		});
	};

	this.unjoinOrganization = function(organization, success, error) {
		resource.delete({ orgId: organization.id }, success, error);
	};

	this.changeMembership = function(orgId, memberId, newrole, success, error) {
		resource.put({ orgId: orgId, memberId: memberId, role: newrole}, success, error);
	};

	this.getIdentity = function() {
		return identity;
	};

	this.canIRequestMembership = function(organization,credits){
		return identity.loadMembership(organization).then(function(m){
			return m.role === 'contributor' && credits >= MINIMAL_CREDITS;
		});
	};

	this.canProposeMembership = function(organization,role,credits){
		return identity.loadMembership(organization).then(function(m){
			if(m.role === 'contributor'){
				return false;
			}else{
				return role === 'contributor' && credits >= MINIMAL_CREDITS;
			}
		});
	};

	this.canInviteNewUser = function(organization){
		var role = identity.getMembershipRole(organization);
		return role === 'contributor' ? false : true;
	};

	this.inviteNewUser = function(orgId,data){
		return $http({
			method:'POST',
			url:'api/organizations/' + orgId + '/invites',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			data:data
		});
	};
};
MemberService.prototype = {
	constructor: MemberService,
	visibilityCriteria: {
		removeUser: function(organizationId) {
			return 'admin' === this.getIdentity().getMembershipRole(organizationId);
		},
		joinOrganization: function(organization) {
			return organization &&
					this.getIdentity().getMembership(organization.id) === null;
		},
		unjoinOrganization: function(organization) {
			return organization &&
					this.getIdentity().getMembership(organization.id);
		},
		changeRole: function(data){
			var role = this.getIdentity().getMembershipRole(data.orgId);
			//Not me && I'm not a contributor
			return data && data.userId && this.getIdentity().getId() !== data.userId && role && role !== "contributor";
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
	.service('memberService', ['$http','$resource', 'identity', MemberService]);
