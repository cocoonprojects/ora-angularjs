angular.module('oraApp.people', ['ui.router', 'ngResource'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.pillars.people', {
					abstract: true,
					template: '<ui-view ng-cloak/>',
					data: {
						selectedTab: 3
					}
				})
				.state('org.pillars.people.list', {
					url: '/people',
					templateUrl: 'app/people/partials/people.html'
				})
				.state('org.pillars.people.profile', {
					url: '/people/:memberId',
					templateUrl: 'app/people/partials/profile.html',
					controller: 'ProfileController'
				});
		}]);