angular.module('oraApp.collaboration')
	.constant('TASK_STATUS', {
		'ONGOING': 10,
		'COMPLETED': 20
	})
	.service('taskService', ['$resource', '$log', 'TASK_STATUS',
		function($resource, $log, TASK_STATUS) {
			var ROLE_MEMBER = 'member';
			var ROLE_OWNER  = 'owner';

			var backend = $resource('data/task-management/tasks/:taskId/:controller.json', { }, {
				query:  { method: 'GET', isArray: false },
				edit: { method: 'UPDATE' },
				joinTask: { method: 'POST', params: { controller: 'members' } },
				unjoinTask: { method: 'DELETE', params: { controller: 'members' } },
				completeTask: { method: 'POST', params: { controller: 'transitions', action: 'complete' } },
				acceptTask: { method: 'POST', params: { controller: 'transitions', action: 'accept' } }
			});

			this.getTasks = function() {
				return this.tasks;
			};

			this.updateTasks = function() {
				this.tasks = backend.query({},
					function(value, responseHeaders) {
						$log.debug('success');
					},
					function(httpResponse) {
						$log.debug('error');
					});
				return this.tasks;
			};

			this.joinTask = function(task, user) {
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
				backend.joinTask({ taskId: task.id }, { },
					function(value, responseHeaders) {
						$log.debug('success');
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.unjoinTask = function(task, user) {
				delete task.members[user.id];
				backend.unjoinTask({ taskId: task.id }, { },
					function(value, responseHeaders) {
						$log.debug('success');
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.createTask = function(task, user) {
				backend.save({ }, { subject: task.subject, streamID: task['ora:stream'].id },
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.editTask = function(task, user) {
				backend.edit({ taskId: task.id }, { subject: task.subject },
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.deleteTask = function(task, user) {
				backend.delete({ taskId: task.id }, null,
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.completeTask = function(task, user) {
				backend.completeTask({ taskId: task.id }, null,
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.acceptTask = function(task, user) {
				backend.completeTask({ taskId: task.id }, null,
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

			this.tasks = this.updateTasks();
		}]);