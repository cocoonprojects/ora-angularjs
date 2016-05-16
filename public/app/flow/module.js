angular.module('app.flow', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider.
				state('flow', {
					url: '/flow',
					templateUrl: 'app/flow/partials/flow.html',
					controller: 'FlowController as ctrl'
				});
		}
	]);
