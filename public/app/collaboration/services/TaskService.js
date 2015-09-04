angular.module('oraApp.collaboration')
	.constant('TASK_STATUS', {
		'ONGOING': 10,
		'COMPLETED': 20
	})
	.service('taskService', ['$resource', '$log', 'identity', 'TASK_STATUS',
		function($resource, $log, $identity, TASK_STATUS) {
			var ROLE_MEMBER = 'member';
			var ROLE_OWNER  = 'owner';
			var organization = null;
			var tasks = [];

			var backend = $resource('api/:orgId/task-management/tasks/:taskId/:controller', { orgId: '@orgId'}, {
				query:  { method: 'GET', isArray: false, headers: { 'GOOGLE-JWT': $identity.getToken() } },
				edit: { method: 'UPDATE', headers: { 'GOOGLE-JWT': $identity.getToken() } },
				joinTask: { method: 'POST', params: { controller: 'members' }, headers: { 'GOOGLE-JWT': $identity.getToken() } },
				unjoinTask: { method: 'DELETE', params: { controller: 'members' }, headers: { 'GOOGLE-JWT': $identity.getToken() } },
				completeTask: { method: 'POST', params: { controller: 'transitions', action: 'complete' }, headers: { 'GOOGLE-JWT': $identity.getToken() } },
				acceptTask: { method: 'POST', params: { controller: 'transitions', action: 'accept' }, headers: { 'GOOGLE-JWT': $identity.getToken() } }
			});

			this.getTasks = function() {
				return tasks;
			};

			this.updateTasks = function(org) {
				this.tasks = backend.query({ orgId: org.id },
					function(value, responseHeaders) {
						organization = org;
						tasks = value;
						$log.debug(org.id + ' organization tasks updated: ' + value.count);
					},
					function(httpResponse) {
						$log.debug('error');
					});
				return this.tasks;
			};

			this.joinTask = function(org, task, user) {
				if(task.members === undefined) {
					task.members = {};
				}
				task.members[user.id] = {
					id: user.id,
					firstname: user.firstname,
					lastname: user.lastname,
					role: ROLE_MEMBER,
					picture: user.picture
				}
				backend.joinTask({ orgId: org.id, taskId: task.id }, { },
					function(value, responseHeaders) {
						$log.debug('success');
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.unjoinTask = function(org, task, user) {
				delete task.members[user.id];
				backend.unjoinTask({ orgId: org.id, taskId: task.id }, { },
					function(value, responseHeaders) {
						$log.debug('success');
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.createTask = function(org, task, user) {
				backend.save({ orgId: org.id }, { subject: task.subject, streamID: task['ora:stream'].id },
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.editTask = function(org, task, user) {
				backend.edit({ orgId: org.id, taskId: task.id }, { subject: task.subject },
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.deleteTask = function(org, task, user) {
				backend.delete({ orgId: org.id, taskId: task.id }, null,
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.completeTask = function(org, task, user) {
				backend.completeTask({ orgId: org.id, taskId: task.id }, null,
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.acceptTask = function(org, task, user) {
				backend.acceptTask({ orgId: org.id, taskId: task.id }, null,
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.statusLabel = {
				10: 'Ongoing',
				20: 'Completed'
			}
		}]);