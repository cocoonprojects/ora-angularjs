angular.module('oraApp.accounting', ['ui.router', 'ngResource'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.pillars.accounting', {
					abstract: true,
					template: '<ui-view/>',
					url: '/accounting',
					data: {
						selectedTab: 1
					},
				})
				.state('org.pillars.accounting.personalStatement', {
					url: '/personal-statement',
					templateUrl: 'app/accounting/partials/personal-statement.html',
					controller: 'PersonalStatementController as ctrl'
				});
		}]);