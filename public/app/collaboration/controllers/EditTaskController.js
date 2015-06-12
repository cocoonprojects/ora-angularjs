angular.module('oraApp.collaboration')
	.controller('EditTaskController', ['$scope', '$modalInstance', '$log', 'taskService', 'task',
		function ($scope, $modalInstance, $log, taskService, task) {
			$scope.messages = null;
			$scope.task = task;

			$scope.submit = function() {
				taskService.editTask($scope.task, $scope.identity);
			};

			$scope.error = function(name) {
				var s = $scope.form[name];
				return s.$invalid && s.$dirty ? "has-error" : "";
			};
		}]);