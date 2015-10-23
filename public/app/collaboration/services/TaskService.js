angular.module('oraApp.collaboration')
	.constant('TASK_STATUS', {
		'IDEA'     : 0,
		'OPEN'     : 10,
		'ONGOING'  : 20,
		'COMPLETED': 30,
		'ACCEPTED' : 40,
		'CLOSED'   : 50
	})
	.constant('TASK_ROLES', {
		'ROLE_MEMBER': 'member',
		'ROLE_OWNER' : 'owner'
	})
	.constant('TASK_STATUS_LABEL', {
		0:  'Work Item Idea',
		10: 'Open Work Item',
		20: 'Ongoing',
		30: 'Completed',
		40: 'Accepted',
		50: 'Closed'
	})
	.service('taskService', ['$resource', 'identity', 'TASK_STATUS', 'TASK_STATUS_LABEL', 'TASK_ROLES',
		function($resource, identity, TASK_STATUS, TASK_STATUS_LABEL, TASK_ROLES) {
			var that = this;
			var resource = $resource('api/:orgId/task-management/tasks/:taskId/:controller/:type', { orgId: '@orgId' }, {
				get: { method: 'GET', headers: { 'GOOGLE-JWT': identity.getToken() } },
				query:  { method: 'GET', isArray: false, headers: { 'GOOGLE-JWT': identity.getToken() } },
				delete:  { method: 'DELETE', headers: { 'GOOGLE-JWT': identity.getToken() } },
				edit: { method: 'PUT', headers: { 'GOOGLE-JWT': identity.getToken() } },
				joinTask: { method: 'POST', params: { controller: 'members' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				unjoinTask: { method: 'DELETE', params: { controller: 'members' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				estimateTask: { method: 'POST', params: { controller: 'estimations' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				remindTaskEstimate: { method: 'POST', params: { controller: 'reminders', type: 'add-estimation' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				executeTask: { method: 'POST', params: { controller: 'transitions' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				completeTask: { method: 'POST', params: { controller: 'transitions' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				acceptTask: { method: 'POST', params: { controller: 'transitions' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				assignShares: { method: 'POST', params: { controller: 'shares' }, headers: { 'GOOGLE-JWT': identity.getToken() } }
			});

			this.isOwner = function(task, userId) {
				return task.members[userId] && task.members[userId].role == TASK_ROLES.ROLE_OWNER;
			};
			this.isMember = function(task, userId) {
				return task.members[userId] && task.members[userId].role == TASK_ROLES.ROLE_MEMBER;
			};
			this.hasJoined = function(task, userId) {
				return task.members[userId];
			};
			this.isEstimationCompleted = function(task) {
				var keys = Object.keys(task.members);
				for(var i = 0; i < keys.length; i++) {
					if(task.members[keys[i]].estimation !== undefined) {
						return false;
					}
				}
				return true;
			};
			this.countEstimators = function(task) {
				var n = 0;
				for(var id in task.members) {
					if(task.members[id].estimation !== undefined) n++;
				};
				return n;
			};

			this.isAllowed   = {
				//	'createTask': function(stream) { return .isAuthenticated() }, // TODO: Manca il controllo sull'appartenenza all'organizzazione dello stream
				editTask: function(task) { return identity.isAuthenticated() && that.isOwner(task, identity.getId()) },
				deleteTask: function(task) { return identity.isAuthenticated() && task.status < TASK_STATUS.COMPLETED && that.isOwner(task, identity.getId()) },
				joinTask: function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.ONGOING && task.members[identity.getId()] === undefined },
				unjoinTask: function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.ONGOING && that.isMember(task, identity.getId()) },
				executeTask: function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.IDEA && that.isOwner(task, identity.getId()) },
				reExecuteTask: function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.COMPLETED && that.isOwner(task, identity.getId()) },
				completeTask: function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.ONGOING && that.isOwner(task, identity.getId()) && task.estimation },
				acceptTask: function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.COMPLETED && that.isOwner(task, identity.getId()) },
				estimateTask: function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.ONGOING && that.hasJoined(task, identity.getId()) },
				remindTaskEstimate: function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.ONGOING && that.isOwner(task, identity.getId()) && !that.isEstimationCompleted(task)},
				assignShares: function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.ACCEPTED && that.hasJoined(task, identity.getId()) && task.members[identity.getId()].shares == undefined },
				showShares: function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.CLOSED }
			};

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

			this.statusLabel = function(status) {
				return TASK_STATUS_LABEL.hasOwnProperty(status) ? TASK_STATUS_LABEL[status] : status;
			};
		}]);