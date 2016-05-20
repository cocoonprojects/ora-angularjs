angular.module('app.flow', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider.
				state('org.flow', {
					url: '/flow',
					templateUrl: 'app/flow/partials/flow.html',
					data: {
						pillarName: 'Flow',
						decisions: false
					},
					controller: 'FlowController as ctrl'
				});
		}
	]);
