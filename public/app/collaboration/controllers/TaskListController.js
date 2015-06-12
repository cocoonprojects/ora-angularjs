angular.module('oraApp.collaboration')
	.controller('TaskListController', ['$scope', '$modal', '$log', 'taskService',
		function ($scope, $modal, $log, taskService) {
			$scope.tasks = taskService.getTasks();
			$scope.alertMsg = null;
			$scope.$watch('currOrg', function(newValue, oldValue) {
				if(newValue != undefined) {
					$log.debug("CurrOrg changed: " + newValue.organization.id);
				}
			});
			$scope.count = function($map) {
				return Object.keys($map).length;
			};
			$scope.deleteTask = function(task) {
				Task.delete(task.id);
			};
			$scope.openNewTask = function() {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: "app/collaboration/partials/new-task.html",
					controller: 'NewTaskController'
				});
			};
			$scope.openTaskDetail = function(task) {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: "app/collaboration/partials/task-detail.html",
					controller: 'TaskDetailController',
					size: 'lg',
					resolve: {
						task: function() {
							return task;
						},
						currUser: function() {
							return $scope.currUser;
						}
					}
				});
			};
			$scope.openEditTask = function(task) {
				//$scope.task = Task.query({ taskId: id });
				//var modalInstance = $modal.open({
				//	templateUrl: "partials/task-detail.html",
				//	controller: 'TaskDetailCtrl'
				//});
			}
		}]);