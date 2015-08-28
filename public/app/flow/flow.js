angular.module('oraApp.flow', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/flow', {
					templateUrl: 'app/flow/partials/flow.html',
					controller: 'FlowController'
				});
		}
	]);