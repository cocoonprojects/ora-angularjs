angular.module('oraApp.collaboration')
	.controller('TaskListController', ['$scope', '$log', '$routeParams', 'identity', 'taskService',
		function ($scope, $log, $routeParams, identity, taskService) {
			$scope.tasks = taskService.updateTasks($scope.currOrg);
			$scope.$watch(taskService.getTasks(), function(newVal, oldVal) {
				if(newVal) {
					$scope.tasks = taskService.getTasks();
				}
			});
			$scope.statusLabel = taskService.statusLabel;
			$scope.alertMsg = null;
			//$scope.$watch('currOrg', function(newValue, oldValue) {
			//	if(newValue != undefined) {
			//		$log.debug("CurrOrg changed: " + newValue.organization.id);
			//	}
			//});
			$scope.count = function($map) {
				return Object.keys($map).length;
			};
			$scope.deleteTask = function(task) {
				if(confirm("Deleting this item will remove all its informations. This operation cannot be undone. Do you want to proceed?")) {
					taskService.deleteTask(task, $scope.identity);
				}
			};
			$scope.openNewTask = function() {
				$modal.open({
					animation: true,
					templateUrl: "app/collaboration/partials/new-task.html",
					controller: 'NewTaskController'
				});
			};
			$scope.openTaskDetail = function(task) {
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
		}]);