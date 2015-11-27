var ItemService = function($resource, $interval, identity) {
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
	var isGetPolling = false;
	this.get = function(organization, itemId, success, error) {
		isGetPolling = true;
		return resource.get(
				{ orgId: organization.id, itemId: itemId },
				function(data) {
					isGetPolling = false;
					success(data);
				},
				function(response) {
					isGetPolling = false;
					error(response);
				}
		);
	};
	var isQueryPolling = false;
	this.query = function(filters, success, error) {
		isQueryPolling = true;
		return resource.query(
				filters,
				function (data) {
					isQueryPolling = false;
					success(data);
				},
				function (response) {
					isQueryPolling = false;
					error(response);
				});
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

	var queryPolling = null;
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
	var getPolling = null;
	this.startGetPolling = function(organization, itemId, success, error, millis) {
		this.get(organization, itemId, success, error);
		var that = this;
		getPolling = $interval(function() {
			if(isGetPolling) return;
			that.get(organization, itemId, success, error);
		}, millis);
	};
	this.stopGetPolling = function() {
		if(getPolling) {
			$interval.cancel(getPolling);
			getPolling = null;
		}
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
	getOwner: function(item) {
		if(item) {
			for(var id in item.members) {
				if(item.members.hasOwnProperty(id) &&
						item.members[id].role === this.ITEM_ROLES.ROLE_OWNER)
					return item.members[id];
			}
		}
		return null;
	},
	isOwner: function(item, userId) {
		return item &&
				item.members &&
				item.members.hasOwnProperty(userId) &&
				item.members[userId].role == this.ITEM_ROLES.ROLE_OWNER;
	},
	isMember: function(item, userId) {
		return item &&
				item.members &&
				item.members.hasOwnProperty(userId) &&
				item.members[userId].role == this.ITEM_ROLES.ROLE_MEMBER;
	},
	hasJoined: function(item, userId) {
		return item &&
				item.members &&
				item.members.hasOwnProperty(userId);
	},
	isEstimationCompleted: function(item) {
		if(item) {
			for(var id in item.members) {
				if(item.members.hasOwnProperty(id) &&
						item.members[id].estimation === undefined)
					return false;
			}
		}
		return true;
	},
	countEstimators: function(item) {
		var n = 0;
		if(item) {
			for(var id in item.members) {
				if(item.members.hasOwnProperty(id) &&
						item.members[id].estimation !== undefined)
					n++;
			}
		}
		return n;
	},
	visibilityCriteria: {
		createItem: function(organization) {
			return organization &&
					this.getIdentity().isAuthenticated() &&
					this.getIdentity().getMembership(organization.id);
		},
		editItem: function(resource) {
			return this.getIdentity().isAuthenticated() &&
					this.isOwner(resource, this.getIdentity().getId());
		},
		deleteItem: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status < this.ITEM_STATUS.COMPLETED &&
					this.isOwner(resource, this.getIdentity().getId());
		},
		joinItem: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status == this.ITEM_STATUS.ONGOING &&
					resource.members[this.getIdentity().getId()] === undefined;
		},
		unjoinItem: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status == this.ITEM_STATUS.ONGOING &&
					this.isMember(resource, this.getIdentity().getId());
		},
		executeItem: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status == this.ITEM_STATUS.IDEA &&
					this.isOwner(resource, this.getIdentity().getId());
		},
		reExecuteItem: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status == this.ITEM_STATUS.COMPLETED &&
					this.isOwner(resource, this.getIdentity().getId());
		},
		completeItem: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status == this.ITEM_STATUS.ONGOING &&
					this.isOwner(resource, this.getIdentity().getId()) &&
					this.isEstimationCompleted(resource);
		},
		reCompleteItem: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status == this.ITEM_STATUS.ACCEPTED &&
					this.isOwner(resource, this.getIdentity().getId());
		},
		acceptItem: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status == this.ITEM_STATUS.COMPLETED &&
					this.isOwner(resource, this.getIdentity().getId());
		},
		estimateItem: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status == this.ITEM_STATUS.ONGOING &&
					this.hasJoined(resource, this.getIdentity().getId());
		},
		remindItemEstimate: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status == this.ITEM_STATUS.ONGOING &&
					this.isOwner(resource, this.getIdentity().getId()) &&
					!this.isEstimationCompleted(resource);
		},
		assignShares: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
					resource.status == this.ITEM_STATUS.ACCEPTED &&
					this.hasJoined(resource, this.getIdentity().getId()) &&
					resource.members[this.getIdentity().getId()].shares === undefined;
		},
		skipShares: this.assignShares,
		showShares: function(resource) {
			return resource &&
					this.getIdentity().isAuthenticated() &&
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
	.service('itemService', ['$resource', '$interval', 'identity', ItemService]);