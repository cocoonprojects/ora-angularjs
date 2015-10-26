angular.module('oraApp.accounting', ['ui.router', 'ngResource'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.credits', {
					url: '/credits',
					templateUrl: 'app/accounting/partials/credits.html',
					data: {
						selectedTab: 1
					},
					controller: 'MemberListController'
				});
		}]);