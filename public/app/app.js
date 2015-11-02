angular.module('oraApp', [
	'ui.router',
	'ngMessages',
	'ngMaterial',
	'angularMoment',
	'oraApp.identity',
	'oraApp.collaboration',
	'oraApp.people',
	'oraApp.flow'
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
					template: '<ui-view/>',
					resolve: {
						members: function($stateParams, memberService) {
							return memberService.query({ orgId: $stateParams.orgId });
						}
					},
					controller: function($scope, members) {
						$scope.members = members;
						$scope.user = function(member) {
							return $scope.members._embedded['ora:organization-member'][member.id];
						};
					}
				})
				.state('org.pillars', {
					abstract: true,
					templateUrl: 'app/global/partials/pillars.html',
					controller: function($scope) {
						$scope.$on('$stateChangeSuccess',
							function(event, toState, toParams, fromState, fromParams) {
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
	.run(function(amMoment) {
		amMoment.changeLocale('it');
	});
	//.config(['$mdIconProvider',
	//	function($mdIconProvider) {
	//		$mdIconProvider
	//			.iconSet('social', 'components/angular-material/demos/icon/demoSvgIconSets/social-icons.svg', 24)
	//			.defaultIconSet('components/angular-material/demos/icon/demoSvgIconSets/core-icons.svg', 24);
	//	}]);
