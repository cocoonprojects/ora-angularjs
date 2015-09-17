angular.module('oraApp.collaboration')
	.controller('TaskListController', ['$scope', '$log', '$mdDialog', 'identity', 'taskService', 'TASK_STATUS',
		function ($scope, $log, $mdDialog, identity, taskService, TASK_STATUS) {
			$scope.tasks = taskService.updateTasks($scope.currOrg);
			$scope.$watch(taskService.getTasks(), function(newVal, oldVal) {
				if(newVal) {
					$scope.tasks = taskService.getTasks();
				}
			});
			$scope.statusLabel = taskService.statusLabel;
			$scope.isAllowed   = taskService.isAllowed;
			$scope.isOwner     = taskService.isOwner;
			$scope.countEstimators = function(task) {
				if(task.status != TASK_STATUS.ONGOING){
					return '';
				}
				var n = taskService.countEstimators(task);
				var tot = Object.keys(task.members).length;
				switch (n) {
					case tot:
						return " (All members have estimated)"
					case 0:
						return " (None has estimated yet)";
					default:
						return " (" + n + " of " + tot + " members have estimated)";
				}
			}

			$scope.alertMsg = null;
			$scope.count = function($map) {
				return Object.keys($map).length;
			};

			var originatorEv;
			this.openMoreMenu = function($mdOpenMenu, ev) {
				originatorEv = ev;
				$mdOpenMenu(ev);
			}
			this.deleteTask = function(task) {
				if(confirm("Deleting this item will remove all its informations. This operation cannot be undone. Do you want to proceed?")) {
					taskService.deleteTask(task, $scope.identity);
				}
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
			this.joinTask = function(task) {
				taskService.joinTask($scope.currOrg, task, identity);
			}
		}]);