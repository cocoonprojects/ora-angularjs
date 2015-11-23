var ItemService = function($resource, identity) {
	var resource = $resource('api/:orgId/task-management/tasks/:itemId/:controller/:type', { orgId: '@orgId' }, {
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

	this.save = function(item, success, error) {
		return resource.save({ orgId: item.organization.id }, item, success, error);
	};
	this.get = function(orgId, itemId) {
		return resource.get({ orgId: orgId, itemId: itemId });
	};
	this.query = function(filters, success, error) {
		return resource.query(filters, success, error);
	};
	this.delete = function(item, success, error) {
		return resource.delete({ orgId: item.organization.id, itemId: item.id }, { }, success, error);
	};
	this.edit = function(item, subject, success, error) {
		return resource.edit({ orgId: item.organization.id, itemId: item.id }, { subject: subject }, success, error);
	};
	this.joinItem = function(item, success, error) {
		return resource.joinItem({ orgId: item.organization.id, itemId: item.id }, { }, success, error);
	};
	this.unjoinItem = function(item, success, error) {
		return resource.unjoinItem({ orgId: item.organization.id, itemId: item.id }, { }, success, error);
	};
	this.estimateItem = function(item, value, success, error) {
		return resource.estimateItem({ orgId: item.organization.id, itemId: item.id }, { value: value }, success, error);
	};
	this.skipItemEstimation = function(item, success, error) {
		return resource.estimateItem({ orgId: item.organization.id, itemId: item.id }, { value: -1 }, success, error);
	};
	this.remindItemEstimate = function(item, success, error) {
		return resource.remindItemEstimate({ orgId: item.organization.id, itemId: item.id }, { action: 'accept' }, success, error);
	};
	this.executeItem = function(item, success, error) {
		return resource.executeItem({ orgId: item.organization.id, itemId: item.id }, { action: 'execute' }, success, error);
	};
	this.completeItem = function(item, success, error) {
		return resource.completeItem({ orgId: item.organization.id, itemId: item.id }, { action: 'complete' }, success, error);
	};
	this.acceptItem = function(item, success, error) {
		return resource.acceptItem({ orgId: item.organization.id, itemId: item.id}, { action: 'accept' }, success, error);
	};
	this.assignShares = function(item, shares, success, error) {
		return resource.assignShares({ orgId: item.organization.id, itemId: item.id }, shares, success, error);
	};
	this.skipShares = function(item, success, error) {
		return resource.skipShares({ orgId: item.organization.id, itemId: item.id }, {}, success, error);
	};
	this.userStats = function(filters) {
		return r2.get(filters);
	};
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
	isOwner: function(item, userId) {
		return item.members &&
				item.members.hasOwnProperty(userId) &&
				item.members[userId].role == this.ITEM_ROLES.ROLE_OWNER;
	},
	isMember: function(item, userId) {
		return item.members &&
				item.members.hasOwnProperty(userId) &&
				item.members[userId].role == this.ITEM_ROLES.ROLE_MEMBER;
	},
	hasJoined: function(item, userId) {
		return item.members &&
				item.members.hasOwnProperty(userId);
	},
	isEstimationCompleted: function(item) {
		for(var id in item.members) {
			if(item.members.hasOwnProperty(id) &&
				item.members[id].estimation === undefined)
				return false;
		}
		return true;
	},
	countEstimators: function(item) {
		var n = 0;
		for(var id in item.members) {
			if(item.members.hasOwnProperty(id) &&
				item.members[id].estimation !== undefined)
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