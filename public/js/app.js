var oraApp = angular.module('oraApp', [
	'ngRoute',
	'ui.bootstrap',
	'oraApp.identity',
	'collaborationControllers',
	'peopleControllers',
	'peopleServices',
	'collaborationServices'
]);
oraApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/tasks', {
				templateUrl: 'partials/task-list.html'
			}).
			when('/tasks/:taskId', {
				templateUrl: 'partials/task-detail.html'
			}).
			when('/people', {
				templateUrl: 'partials/people-list.html'
			}).
			otherwise({
				redirectTo: '/tasks'
			});
	}
]);
