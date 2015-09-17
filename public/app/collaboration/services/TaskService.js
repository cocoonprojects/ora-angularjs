angular.module('oraApp.collaboration')
	.constant('TASK_STATUS', {
		'OPEN'     : 10,
		'ONGOING'  : 20,
		'COMPLETED': 30,
		'ACCEPTED' : 40,
		'CLOSED'   : 50
	})
	.constant('TASK_STATUS_LABEL', {
		10: 'Open Work Item',
		20: 'Ongoing',
		30: 'Completed',
		40: 'Accepted',
		50: 'Closed'
	})
	.constant('TASK_ROLES', {
		'ROLE_MEMBER': 'member',
		'ROLE_OWNER' : 'owner'
	})
	.service('taskService', ['$resource', '$log', 'identity', 'TASK_STATUS', 'TASK_STATUS_LABEL', 'TASK_ROLES',
		function($resource, $log, identity, TASK_STATUS, TASK_STATUS_LABEL, TASK_ROLES) {
			var tasks = [];

			this.isAllowed = {
			//	'createTask': function(stream) { return $scope.isAuthenticated() }, // TODO: Manca il controllo sull'appartenenza all'organizzazione dello stream
				'editTask': function(task) { return identity.isAuthenticated() && task.members[identity.getId()] !== undefined && task.members[identity.getId()].role == TASK_ROLES.ROLE_OWNER },
				'deleteTask': function(task) { return identity.isAuthenticated() && task.members[identity.getId()] !== undefined && task.members[identity.getId()].role == TASK_ROLES.ROLE_OWNER },
				'joinTask': function(task) { return identity.isAuthenticated() && task.status < TASK_STATUS.COMPLETED && task.members[identity.getId()] === undefined },
				'unjoinTask': function(task) { return identity.isAuthenticated() && task.status < TASK_STATUS.COMPLETED && task.members[identity.getId()] !== undefined },
				'reExecuteTask': function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.COMPLETED && task.members[identity.getId()] !== undefined && task.members[identity.getId()].role == TASK_ROLES.ROLE_OWNER },
				'completeTask': function(task) { return identity.isAuthenticated() && task.status == TASK_STATUS.ONGOING && task.members[identity.getId()] !== undefined && task.members[identity.getId()].role == TASK_ROLES.ROLE_OWNER },
			//	'acceptTask': function(task) { return $scope.isAuthenticated() && task.status < 40 && task.status > 20 && task.members[$scope.identity.id] !== undefined && task.members[$scope.identity.id].role == 'owner' },
			//	'estimateTask': function(task, member) { return $scope.isAuthenticated() && task.status < 30 && member.id == $scope.identity.id },
				'assignShares': function(task) { return identity.isAuthenticated() }
			};


			var backend = $resource('api/:orgId/task-management/tasks/:taskId/:controller', { orgId: '@orgId'}, {
				query:  { method: 'GET', isArray: false, headers: { 'GOOGLE-JWT': identity.getToken() } },
				edit: { method: 'UPDATE', headers: { 'GOOGLE-JWT': identity.getToken() } },
				joinTask: { method: 'POST', params: { controller: 'members' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				unjoinTask: { method: 'DELETE', params: { controller: 'members' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				completeTask: { method: 'POST', params: { controller: 'transitions', action: 'complete' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				acceptTask: { method: 'POST', params: { controller: 'transitions', action: 'accept' }, headers: { 'GOOGLE-JWT': identity.getToken() } }
			});

			this.getTasks = function() {
				return tasks;
			};

			this.updateTasks = function(organization) {
				this.tasks = backend.query({ orgId: organization.id },
					function(value, responseHeaders) {
						tasks = value;
						$log.debug(organization.id + ' organization tasks updated: ' + value.count);
					},
					function(httpResponse) {
						$log.debug('error');
					});
				return this.tasks;
			};

			this.joinTask = function(organization, task, user) {
				if(task.members === undefined) {
					task.members = {};
				}
				task.members[user.getId()] = {
					id: user.get(),
					firstname: user.getFirstname(),
					lastname: user.getLastname(),
					role: TASK_ROLES.ROLE_MEMBER,
					picture: user.getPicture()
				}
				backend.joinTask({ orgId: organization.id, taskId: task.id }, { },
					function(value, responseHeaders) {
						$log.debug('success');
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.unjoinTask = function(organization, task, user) {
				delete task.members[user.id];
				backend.unjoinTask({ orgId: organization.id, taskId: task.id }, { },
					function(value, responseHeaders) {
						$log.debug('success');
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.createTask = function(organization, task, user) {
				backend.save({ orgId: organization.id }, { subject: task.subject, streamID: task['ora:stream'].id },
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.editTask = function(organization, task, user) {
				backend.edit({ orgId: organization.id, taskId: task.id }, { subject: task.subject },
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.deleteTask = function(organization, task, user) {
				backend.delete({ orgId: organization.id, taskId: task.id }, null,
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.completeTask = function(organization, task, user) {
				backend.completeTask({ orgId: organization.id, taskId: task.id }, null,
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.acceptTask = function(organization, task, user) {
				backend.acceptTask({ orgId: organization.id, taskId: task.id }, null,
					function(value, responseHeaders) {
						$log.debug(value);
					},
					function(httpResponse) {
						$log.debug('error');
					});
			};

			this.isOwner = function(member) {
				return member.role == TASK_ROLES.ROLE_OWNER;
			}

			this.countEstimators = function(task) {
				var count = 0;
				for(id in task.members) {
					if(task.members[id].estimation != null) count++;
				}
				return count;
			}

			this.statusLabel = function(status) {
				return TASK_STATUS_LABEL.hasOwnProperty(status) ? TASK_STATUS_LABEL[status] : status;
			}
		}]);