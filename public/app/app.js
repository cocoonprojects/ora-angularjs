var app = angular.module('oraApp', [
	'ui.router',
	'ngMessages',
	'ngMaterial',
	'oraApp.identity',
	'oraApp.collaboration',
	'oraApp.people',
	'oraApp.flow'
]);
app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise(function($injector, $location) {
			var $state = $injector.get("$state");
			$state.go("flow");
		});

		$stateProvider
			.state('org', {
				abstract: true,
				url: '/:orgId',
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
	}]);
	//.config(['$mdIconProvider',
	//	function($mdIconProvider) {
	//		$mdIconProvider
	//			.iconSet('social', 'components/angular-material/demos/icon/demoSvgIconSets/social-icons.svg', 24)
	//			.defaultIconSet('components/angular-material/demos/icon/demoSvgIconSets/core-icons.svg', 24);
	//	}]);