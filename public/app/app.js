var app = angular.module('oraApp', [
	'ngRoute',
	'ngMessages',
	'ngMaterial',
	'oraApp.identity',
	'oraApp.collaboration',
	'oraApp.people',
	'oraApp.flow'
]);
app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			otherwise({
				redirectTo: '/flow'
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