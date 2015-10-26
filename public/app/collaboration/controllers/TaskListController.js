angular.module('oraApp.collaboration')
	.controller('TaskListController', ['$scope', '$log', '$interval','$mdDialog', '$stateParams', 'streamService', 'taskService', 'TASK_STATUS',
		function ($scope, $log, $interval, $mdDialog, $stateParams, streamService, taskService, TASK_STATUS) {
			var that = this;
			$scope.tasks = taskService.query({ orgId: $stateParams.orgId });
			$interval(function() {
				taskService.query({ orgId: $stateParams.orgId }, function(value) { $scope.tasks = value; });
				}, 10000);

			$scope.statusLabel = taskService.statusLabel;
			$scope.isAllowed = taskService.isAllowed;
			$scope.isOwner   = taskService.isOwner;

			$scope.count = function($map) {
				return Object.keys($map).length;
			};
			$scope.countEstimators = function(task) {
				if(task.status != TASK_STATUS.ONGOING){
					return '';
				}
				var n = taskService.countEstimators(task);
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
			this.openNewTask = function(ev) {
				$mdDialog.show({
					controller: NewTaskController,
					templateUrl: "app/collaboration/partials/new-task.html",
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					scope: $scope.$new(),
					locals: {
						taskService: taskService
					}
				}).then(function(task) {
					that.addTask(task);
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
						{
							orgId: task.organization.id,
							taskId: task.id },
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
						orgId: task.organization.id,
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
						orgId: task.organization.id,
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
					scope: $scope.$new(),
					locals: {
						taskService: taskService,
						task: task
					}
				}).then(function(task) {
					that.updateTasks(task);
				});
			};
			this.executeTask = function(task) {
				taskService.executeTask(
					{
						orgId: task.organization.id,
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
							orgId: task.organization.id,
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
			this.reCompleteTask = function(task) {
				taskService.completeTask(
					{
						orgId: task.organization.id,
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
			};
			this.acceptTask = function(task) {
				taskService.acceptTask(
					{
						orgId: task.organization.id,
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
			this.openAssignShares = function(ev, task) {
				$mdDialog.show({
					controller: AssignSharesController,
					templateUrl: 'app/collaboration/partials/assign-shares.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					scope: $scope.$new(),
					locals: {
						taskService: taskService,
						task: task
					}
				}).then(function(task) {
					that.updateTasks(task);
				});
			};
			this.remindTaskEstimate = function(task) {
				taskService.remindTaskEstimate(
					{
						orgId: task.organization.id,
						taskId: task.id
					},
					{
						action: 'accept'
					},
					function(receivers) {
						$log.info(receivers);
					},
					function(httpResponse) {
						$log.warn(httpResponse);
					});
			};
			$scope.hasMore = function(task) {
				return $scope.isAllowed.editTask(task) ||
					$scope.isAllowed.deleteTask(task) ||
					$scope.isAllowed.unjoinTask(task) ||
					$scope.isAllowed.reExecuteTask(task);
			};
			this.addTask = function(task) {
				$scope.tasks._embedded['ora:task'].unshift(task);
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