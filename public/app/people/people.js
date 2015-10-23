angular.module('oraApp.people', ['ui.router', 'ngResource'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.pillars.people', {
					url: '/people',
					templateUrl: 'app/people/partials/people.html',
					data: {
						selectedTab: 3
					},
					controller: 'MemberListController'
				})
		}]);