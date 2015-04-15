var collaborationControllers = angular.module('collaborationControllers', []);

collaborationControllers.controller('TaskListCtrl', ['$scope', '$http',
	function ($scope, $http) {
		$http.get('task-management/tasks').success(function(data) {
			$scope.tasks = data._embedded['ora:task'];
		})
		$scope.count = function($map) {
			return Object.keys($map).length;
		};
	}
]);

collaborationControllers.controller('TaskDetailCtrl', ['$scope', '$routeParams', 'Task',
	function($scope, $routeParams, Task) {
		$scope.task = Task.get({taskId : $routeParams.taskId }, function(task) {
			
		});
	}
]);