var ItemService = function($resource, identity) {
	var resource = $resource('api/:orgId/task-management/tasks/:taskId/:controller/:type', { orgId: '@orgId' }, {
		save: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		get: {
			method: 'GET',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		query: {
			method: 'GET',
			isArray: false,
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		delete: {
			method: 'DELETE',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		edit: {
			method: 'PUT',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		joinItem: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'members' }
		},
		unjoinItem: {
			method: 'DELETE',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'members' }
		},
		estimateItem: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'estimations' }
		},
		remindItemEstimate: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'reminders', type: 'add-estimation' }
		},
		executeItem: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'transitions' }
		},
		completeItem: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'transitions' }
		},
		acceptItem: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'transitions' }
		},
		assignShares: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'shares' }
		},
		skipShares: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'shares' }
		}
	});

	var r2 = $resource('api/:orgId/task-management/member-stats/:memberId', { }, {
		get: {
			method: 'GET',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		}
	});

	this.getIdentity = function() {
		return identity;
	};

	this.save = resource.save.bind(resource);
	this.get = resource.get.bind(resource);
	this.query = resource.query.bind(resource);
	this.delete = resource.delete.bind(resource);
	this.edit = resource.edit.bind(resource);
	this.joinItem = resource.joinItem.bind(resource);
	this.unjoinItem = resource.unjoinItem.bind(resource);
	this.estimateItem = resource.estimateItem.bind(resource);
	this.remindItemEstimate = resource.remindItemEstimate.bind(resource);
	this.executeItem = resource.executeItem.bind(resource);
	this.completeItem = resource.completeItem.bind(resource);
	this.acceptItem = resource.acceptItem.bind(resource);
	this.assignShares = resource.assignShares.bind(resource);
	this.skipShares = resource.skipShares.bind(resource);
	this.userStats = r2.get;
};

ItemService.prototype = {
	constructor: ItemService,
	ITEM_STATUS: {
		'IDEA'     : 0,
		'OPEN'     : 10,
		'ONGOING'  : 20,
		'COMPLETED': 30,
		'ACCEPTED' : 40,
		'CLOSED'   : 50
	},
	ITEM_ROLES: {
		'ROLE_MEMBER': 'member',
		'ROLE_OWNER' : 'owner'
	},
	isOwner: function(task, userId) {
		return task.members &&
				task.members.hasOwnProperty(userId) &&
				task.members[userId].role == this.ITEM_ROLES.ROLE_OWNER;
	},
	isMember: function(task, userId) {
		return task.members &&
				task.members.hasOwnProperty(userId) &&
				task.members[userId].role == this.ITEM_ROLES.ROLE_MEMBER;
	},
	hasJoined: function(task, userId) {
		return task.members &&
				task.members.hasOwnProperty(userId);
	},
	isEstimationCompleted: function(task) {
		for(var id in task.members) {
			if(task.members.hasOwnProperty(id) &&
				task.members[id].estimation === undefined)
				return false;
		}
		return true;
	},
	countEstimators: function(task) {
		var n = 0;
		for(var id in task.members) {
			if(task.members.hasOwnProperty(id) &&
				task.members[id].estimation !== undefined)
				n++;
		}
		return n;
	},
	visibilityCriteria: {
		createItem: function() {
			// TODO: Add a check about the membership of the user to the organization
			return this.getIdentity().isAuthenticated();
		},
		editItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		deleteItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status < this.ITEM_STATUS.COMPLETED &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		joinItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.ONGOING &&
				resource.members[this.getIdentity().getId()] === undefined;
		},
		unjoinItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.ONGOING &&
				this.isMember(resource, this.getIdentity().getId());
		},
		executeItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.IDEA &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		reExecuteItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.COMPLETED &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		completeItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.ONGOING &&
				this.isOwner(resource, this.getIdentity().getId()) &&
				this.isEstimationCompleted(resource);
		},
		reCompleteItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.ACCEPTED &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		acceptItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.COMPLETED &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		estimateItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.ONGOING &&
				this.hasJoined(resource, this.getIdentity().getId());
		},
		remindItemEstimate: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.ONGOING &&
				this.isOwner(resource, this.getIdentity().getId()) &&
				!this.isEstimationCompleted(resource);
		},
		assignShares: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.ACCEPTED &&
				this.hasJoined(resource, this.getIdentity().getId()) &&
				resource.members[this.getIdentity().getId()].shares === undefined;
		},
		skipShares: this.assignShares,
		showShares: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.ITEM_STATUS.CLOSED;
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
	.constant('ITEM_STATUS', ItemService.prototype.ITEM_STATUS)
	.service('itemService', ['$resource', 'identity', ItemService]);