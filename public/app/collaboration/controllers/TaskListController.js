angular.module('oraApp.collaboration')
	.controller('TaskListController', ['$scope', '$log', '$mdDialog', 'streamService', 'taskService', 'TASK_STATUS', 'TASK_STATUS_LABEL', 'TASK_ROLES',
		function ($scope, $log, $mdDialog, streamService, taskService, TASK_STATUS, TASK_STATUS_LABEL, TASK_ROLES) {
			var that = this;
			$scope.streams = streamService.query({ orgId: $scope.currOrg.id });
			$scope.stream = function(task) {
				return $scope.streams['_embedded']['ora:stream'][task.stream.id];
			};
			$scope.tasks = taskService.query({ orgId: $scope.currOrg.id });

			$scope.statusLabel = function(status) {
				return TASK_STATUS_LABEL.hasOwnProperty(status) ? TASK_STATUS_LABEL[status] : status;
			};
			$scope.isAllowed   = {
				//	'createTask': function(stream) { return $scope.isAuthenticated() }, // TODO: Manca il controllo sull'appartenenza all'organizzazione dello stream
				'editTask': function(task) { return $scope.identity.isAuthenticated() && $scope.isOwner(task, $scope.identity.getId()) },
				'deleteTask': function(task) { return $scope.identity.isAuthenticated() && task.status < TASK_STATUS.COMPLETED && $scope.isOwner(task, $scope.identity.getId()) },
				'joinTask': function(task) { return $scope.identity.isAuthenticated() && task.status == TASK_STATUS.ONGOING && task.members[$scope.identity.getId()] === undefined },
				'unjoinTask': function(task) { return $scope.identity.isAuthenticated() && task.status == TASK_STATUS.ONGOING && that.isMember(task, $scope.identity.getId()) },
				'executeTask': function(task) { return $scope.identity.isAuthenticated() && task.status == TASK_STATUS.IDEA && $scope.isOwner(task, $scope.identity.getId()) },
				'reExecuteTask': function(task) { return $scope.identity.isAuthenticated() && task.status == TASK_STATUS.COMPLETED && $scope.isOwner(task, $scope.identity.getId()) },
				'completeTask': function(task) { return $scope.identity.isAuthenticated() && task.status == TASK_STATUS.ONGOING && $scope.isOwner(task, $scope.identity.getId()) && task.estimation },
				'acceptTask': function(task) { return $scope.identity.isAuthenticated() && task.status == TASK_STATUS.COMPLETED && $scope.isOwner(task, $scope.identity.getId()) },
				'estimateTask': function(task) { return $scope.identity.isAuthenticated() && task.status == TASK_STATUS.ONGOING && that.hasJoined(task, $scope.identity.getId()) },
				'assignShares': function(task) { return $scope.identity.isAuthenticated() }
			};
			$scope.isOwner     = function(task, userId) {
				return task.members[userId] && task.members[userId].role == TASK_ROLES.ROLE_OWNER;
			};
			this.isMember = function(task, userId) {
				return task.members[userId] && task.members[userId].role == TASK_ROLES.ROLE_MEMBER;
			};
			this.hasJoined = function(task, userId) {
				return task.members[userId];
			};

			$scope.alertMsg = null;
			$scope.count = function($map) {
				return Object.keys($map).length;
			};
			$scope.countEstimators = function(task) {
				if(task.status != TASK_STATUS.ONGOING){
					return '';
				}
				var n = 0;
				for(var id in task.members) {
					if(task.members[id].estimation != null) n++;
				};
				var tot = $scope.count(task.members);
				switch (n) {
					case tot:
						return " (All members have estimated)";
					case 0:
						return " (None has estimated yet)";
					default:
						return " (" + n + " of " + tot + " members have estimated)";
				}
			};

			var originatorEv;
			this.openMoreMenu = function($mdOpenMenu, ev) {
				originatorEv = ev;
				$mdOpenMenu(ev);
			};
			this.openNewTask = function() {
				$modal.open({
					animation: true,
					templateUrl: "app/collaboration/partials/new-task.html",
					controller: 'NewTaskController'
				});
			};
			this.openTaskDetail = function(task) {
				$modal.open({
					animation: true,
					templateUrl: "app/collaboration/partials/task-detail.html",
					controller: 'TaskDetailController',
					size: 'lg',
					resolve: {
						task: function() {
							return task;
						},
						isAllowed: function() {
							return $scope.isAllowed;
						},
						identity: function() {
							return $scope.identity;
						}
					}
				});
			};
			this.openEditTask = function(ev, task) {
				$mdDialog.show({
					controller: EditTaskController,
					templateUrl: 'app/collaboration/partials/edit-task.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						taskService: taskService,
						identity: $scope.identity,
						organization: $scope.currOrg,
						task: task
					}
				}).then(function(task) {
					that.updateTasks(task);
				});
			};
			this.deleteTask = function(task) {
				var confirm = $mdDialog.confirm()
					.content("Deleting this item removes all its informations\nand cannot be undone. Do you want to proceed?")
					.ok("Yes")
					.cancel("No");
				$mdDialog.show(confirm).then(function() {
					taskService.delete(
						{ orgId: $scope.currOrg.id, taskId: task.id },
						{ },
						function(value) {
							var tasks = $scope.tasks._embedded['ora:task'];
							for(var i = 0; i < tasks.length; i++) {
								if(tasks[i].id == task.id) {
									tasks.splice(i, 1);
									break;
								}
							}
						},
						function(httpResponse) {
							$log.warn(httpResponse);
						});
				});
			};
			this.joinTask = function(task) {
				taskService.joinTask(
					{
						orgId: $scope.currOrg.id,
						taskId: task.id
					},
					{ },
					function(task) {
						that.updateTasks(task);
					},
					function(httpResponse) {
						$log.warn(httpResponse);
					});
			};
			this.unjoinTask = function(task) {
				taskService.unjoinTask(
					{
						orgId: $scope.currOrg.id,
						taskId: task.id },
					{ },
					function(task) {
						that.updateTasks(task);
					},
					function(httpResponse) {
						$log.warn(httpResponse);
					});
			};
			this.openEstimateTask = function(ev, task) {
				$mdDialog.show({
					controller: EstimateTaskController,
					templateUrl: 'app/collaboration/partials/estimate-task.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						taskService: taskService,
						identity: $scope.identity,
						organization: $scope.currOrg,
						task: task
					}
				}).then(function(task) {
					that.updateTasks(task);
				});
			};
			this.executeTask = function(task) {
				taskService.executeTask(
					{
						orgId: $scope.currOrg.id,
						taskId: task.id
					},
					{
						action: 'execute'
					},
					function(task) {
						that.updateTasks(task);
					},
					function(httpResponse) {
						$log.warn(httpResponse);
					});
			};
			this.reExecuteTask = function(task) {
				var confirm = $mdDialog.confirm()
					.content("Reverting this item to ongoing allows users to join, members to unjoin and change their estimation. Do you want to proceed?")
					.ok("Yes")
					.cancel("No");
				$mdDialog.show(confirm).then(function() {
					that.executeTask(task);
				});
			};
			this.completeTask = function(task) {
				var confirm = $mdDialog.confirm()
					.content("Completing this item freezes task members and their estimation. Do you want to proceed?")
					.ok("Yes")
					.cancel("No");
				$mdDialog.show(confirm).then(function() {
					taskService.completeTask(
						{
							orgId: $scope.currOrg.id,
							taskId: task.id
						},
						{
							action: 'complete'
						},
						function(task) {
							that.updateTasks(task);
						},
						function(httpResponse) {
							$log.warn(httpResponse);
						});
				});
			};
			this.acceptTask = function(task) {
				taskService.acceptTask(
					{
						orgId: $scope.currOrg.id,
						taskId: task.id
					},
					{
						action: 'accept'
					},
					function(task) {
						that.updateTasks(task);
					},
					function(httpResponse) {
						$log.warn(httpResponse);
					});
			};
			$scope.hasMore = function(task) {
				return $scope.isAllowed.editTask(task)
					|| $scope.isAllowed.deleteTask(task)
					|| $scope.isAllowed.unjoinTask(task)
					|| $scope.isAllowed.reExecuteTask(task)
					;
			};
			this.updateTasks = function(task) {
				var tasks = $scope.tasks._embedded['ora:task'];
				for(var i = 0; i < tasks.length; i++) {
					if(tasks[i].id == task.id) {
						tasks[i] = task;
						break;
					}
				}
			};
		}]);
//this.createTask = function(organization, task) {
//	backend.save({ orgId: organization.id }, { subject: task.subject, streamID: task['ora:stream'].id },
//		function(value, responseHeaders) {
//			$log.debug(value);
//		},
//		function(httpResponse) {
//			$log.debug('error');
//		});
//};
//
//this.acceptTask = function(organization, task) {
//	backend.acceptTask({ orgId: organization.id, taskId: task.id }, null,
//		function(value, responseHeaders) {
//			$log.debug(value);
//		},
//		function(httpResponse) {
//			$log.debug('error');
//		});
//};
//
