var KanbanizeService = function($resource, identity) {

	this.getIdentity = function() {
		return identity;
	};

	var resource = $resource('api/:orgId/kanbanize/settings/:controller/:boardId', { controller:'@controller', boardId: '@boardId' }, {
		query: {
			method: 'GET',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			isArray: false
		},
		update: {
			method: 'PUT',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		getBoardDetails: {
			method: 'GET',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'boards' }
		},
		saveBoardSettings:{
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'boards' }
		}, 
	});
	this.updateSettings = function(organizationId, settings, success, error){
		return resource.update({ orgId: organizationId}, settings, success, error);
	};
	this.getBoardDetails = function(organizationId, boardId, settings, success, error){
		return resource.getBoardDetails({ orgId: organizationId, boardId: boardId}, settings, success, error);
	};
	this.saveBoardSettings = function(organizationId, boardId, settings, success, error){
		return resource.saveBoardSettings({ orgId: organizationId, boardId: boardId}, settings, success, error);
	};
	this.query = function(organizationId, success, error){
		return resource.query({ orgId: organizationId}, success, error);
	};
};
KanbanizeService.prototype = {
	constructor: KanbanizeService,
	visibilityCriteria: {
		editKanbanizeSettings: function(organization){
			membership = {};
			angular.forEach(this.getIdentity().getMemberships(), function(value) {
				if(value.organization.id === organization.id) {
					membership = value;
				}
			});
			return membership.role == 'admin';
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
angular.module('app.organizations')
	.service('kanbanizeService', ['$resource', 'identity', KanbanizeService]);