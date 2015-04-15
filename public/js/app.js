var oraApp = angular.module('oraApp', [
	'ngRoute',
	'collaborationControllers'
]);
oraApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/tasks', {
				templateUrl: 'partials/task-list.html',
//				controller: 'TaskListCtrl'
			}).
			when('/tasks/:taskId', {
				templateUrl: 'partials/task-detail.html',
				controller: 'TaskDetailCtrl'
			}).
			otherwise({
				redirectTo: '/tasks'
			});
	}
]);