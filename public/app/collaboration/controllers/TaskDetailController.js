angular.module('oraApp.collaboration')
	.controller('TaskDetailController', ['$scope', '$modalInstance', '$log', 'task', 'taskService',
		function ($scope, $modalInstance, $log, task, taskService) {
			$scope.task = task;
			$scope.daysAgo = function(when) {
				var now = new Date();
				var d = new Date(Date.parse(when));
				return Math.round(Math.abs((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)));
			};
			$scope.statusClass = function() {
				switch ($scope.task.status) {
					case 10:
						return 'text-info';
					case 20:
					case 30:
					case 40:
						return 'text-success';
					default :
						return 'text-muted';
				}
			};
			$scope.joinTask = function() {
				taskService.joinTask(task, $scope.identity);
			};
			$scope.unjoinTask = function() {
				if(task.members[$scope.identity.id].estimation != null && !confirm("Unjoining this item will remove your estimation. Do you want to proceed?")) {
					return;
				}
				taskService.unjoinTask(task, $scope.identity);
			}
		}]);