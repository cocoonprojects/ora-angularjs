var oraApp = angular.module('oraApp', [
	'ngRoute',
	'ui.bootstrap',
	'oraApp.identity',
	'oraApp.collaboration',
	'oraApp.people'
]);
oraApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			otherwise({
				redirectTo: '/tasks'
			});
	}
]);
