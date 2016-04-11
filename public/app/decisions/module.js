angular.module('app.decisions', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider.
				state('org.decisions', {
					url: '/decisions',
					templateUrl: 'app/decisions/partials/decision-list.html',
					controller: 'DecisionListController as ctrl',
					data: {
						pillarName: 'Decisions'
					}
				});
		}
	]);
