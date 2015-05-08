var oraApp = angular.module('oraApp', [
	'ngRoute',
	'collaborationControllers',
	'identityControllers',
	'peopleControllers',
	'peopleServices',
	'collaborationServices'
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
			when('/people', {
				templateUrl: 'partials/people-list.html',
			}).
			otherwise({
				redirectTo: '/tasks'
			});
	}
]);