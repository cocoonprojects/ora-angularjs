angular.module('app', [
	'ui.router',
	'ngMessages',
	'ngMaterial',
	'angularMoment',
	'infinite-scroll',
	'app.identity',
	'app.organizations',
	'app.collaboration',
	'app.people',
	'app.flow',
	'app.accounting'
])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise(function($injector, $location) {
				var $state = $injector.get("$state");
				$state.go("flow");
			});
			$stateProvider
				.state('org', {
					abstract: true,
					url: '/:orgId',
					templateUrl: 'app/main/partials/pillars.html',
					resolve: {
						members: function($stateParams, memberService) {
							return memberService.query({ orgId: $stateParams.orgId });
						}
					},
					controller: function($scope, $log, $stateParams, members) {
						$scope.organization = $scope.identity.getMembership($stateParams.orgId);
						$scope.members = members;
						$scope.user = function(member) {
							if($scope.members && member) {
								return $scope.members._embedded['ora:member'][member.id];
							}
							return null;
						};
						$scope.$on('$stateChangeSuccess',
							function(event, toState) {
								$scope.currentTab = toState.data.selectedTab;
							});
					}
				});
	}])
	.config(['$mdThemingProvider',
		function($mdThemingProvider) {
			$mdThemingProvider.theme('default')
				.primaryPalette('pink')
				.accentPalette('indigo');
			$mdThemingProvider.theme('input', 'default')
				.primaryPalette('grey');
		}])
	.config(['$mdIconProvider',
		function($mdIconProvider) {
			$mdIconProvider.defaultIconSet('icon-set.svg', 24);
		}])
	.run(function(amMoment) {
		amMoment.changeLocale('it');
	});
