var TaskService = function($resource, identity) {
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
		joinTask: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'members' }
		},
		unjoinTask: {
			method: 'DELETE',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'members' }
		},
		estimateTask: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'estimations' }
		},
		remindTaskEstimate: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'reminders', type: 'add-estimation' }
		},
		executeTask: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'transitions' }
		},
		completeTask: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'transitions' }
		},
		acceptTask: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'transitions' }
		},
		assignShares: {
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

	this.save = resource.save;
	this.get = resource.get;
	this.query = resource.query;
	this.delete = resource.delete;
	this.edit = resource.edit;
	this.joinTask = resource.joinTask;
	this.unjoinTask = resource.unjoinTask;
	this.estimateTask = resource.estimateTask;
	this.remindTaskEstimate = resource.remindTaskEstimate;
	this.executeTask = resource.executeTask;
	this.completeTask = resource.completeTask;
	this.acceptTask = resource.acceptTask;
	this.assignShares = resource.assignShares;
	this.userStats = r2.get;
};

TaskService.prototype = {
	constructor: TaskService,
	TASK_STATUS: {
		'IDEA'     : 0,
		'OPEN'     : 10,
		'ONGOING'  : 20,
		'COMPLETED': 30,
		'ACCEPTED' : 40,
		'CLOSED'   : 50
	},
	TASK_ROLES: {
		'ROLE_MEMBER': 'member',
		'ROLE_OWNER' : 'owner'
	},
	isOwner: function(task, userId) {
		return task.members[userId] &&
			task.members[userId].role == this.TASK_ROLES.ROLE_OWNER;
	},
	isMember: function(task, userId) {
		return task.members[userId] &&
			task.members[userId].role == this.TASK_ROLES.ROLE_MEMBER;
	},
	hasJoined: function(task, userId) {
		return task.members[userId] !== undefined;
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
		createTask: function() {
			// TODO: Add a check about the membership of the user to the organization
			return this.getIdentity().isAuthenticated();
		},
		editTask: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		deleteTask: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status < this.TASK_STATUS.COMPLETED &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		joinTask: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.ONGOING &&
				resource.members[this.getIdentity().getId()] === undefined;
		},
		unjoinTask: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.ONGOING &&
				this.isMember(resource, this.getIdentity().getId());
		},
		executeTask: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.IDEA &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		reExecuteTask: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.COMPLETED &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		completeTask: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.ONGOING &&
				this.isOwner(resource, this.getIdentity().getId()) &&
				resource.estimation !== undefined;
		},
		reCompleteTask: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.ACCEPTED &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		acceptTask: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.COMPLETED &&
				this.isOwner(resource, this.getIdentity().getId());
		},
		estimateTask: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.ONGOING &&
				this.hasJoined(resource, this.getIdentity().getId());
		},
		remindTaskEstimate: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.ONGOING &&
				this.isOwner(resource, this.getIdentity().getId()) &&
				!this.isEstimationCompleted(resource);
		},
		assignShares: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.ACCEPTED &&
				this.hasJoined(resource, this.getIdentity().getId()) &&
				resource.members[this.getIdentity().getId()].shares === undefined;
		},
		showShares: function(resource) {
			return this.getIdentity().isAuthenticated() &&
				resource.status == this.TASK_STATUS.CLOSED;
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
	.constant('TASK_STATUS', TaskService.prototype.TASK_STATUS)
	.constant('TASK_ROLES', TaskService.prototype.TASK_ROLES)
	.service('taskService', ['$resource', 'identity', TaskService]);