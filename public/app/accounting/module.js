angular.module('app.accounting', ['ui.router', 'ngResource'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.organizationStatement', {
					url: '/organization-statement',
					templateUrl: 'app/accounting/partials/statement.html',
					controller: 'StatementController as ctrl',
					data: {
						pillarName: 'credits',
						selectedTab: 0
					}
				})
				.state('org.personalStatement', {
					url: '/personal-statement',
					templateUrl: 'app/accounting/partials/statement.html',
					controller: 'StatementController as ctrl',
					data: {
						selectedTab: 1
					}
				});
		}]);
