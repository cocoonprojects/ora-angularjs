angular.module('oraApp.people', ['ui.router', 'ngResource'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.people', {
					url: '/people',
					templateUrl: 'app/people/partials/people.html',
					data: {
						selectedTab: 3
					},
					controller: 'MemberListController'
				})
		}]);