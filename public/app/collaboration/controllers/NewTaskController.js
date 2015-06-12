angular.module('oraApp.collaboration')
	.controller('NewTaskController', ['$scope', '$modalInstance', '$log', 'taskService', 'streamService',
		function ($scope, $modalInstance, $log, taskService, streamService) {
			$scope.messages = null;
			$scope.task = {};
			$scope.streams = streamService.getStreams();

			$scope.submit = function() {
				taskService.createTask($scope.task);
			};

			$scope.error = function(name) {
				var s = $scope.form[name];
				return s.$invalid && s.$dirty ? "has-error" : "";
			};
		}]);