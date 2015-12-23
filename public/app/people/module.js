angular.module('app.people', ['ui.router', 'ngResource'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.people', {
					url: '/people',
					templateUrl: 'app/people/partials/people.html',
					data: {
						selectedTab: 3
					}
				})
				.state('org.profile', {
					url: '/people/:memberId',
					templateUrl: 'app/people/partials/profile.html',
					controller: 'ProfileController',
					data: {
						selectedTab: 3
					}
				});
		}]);