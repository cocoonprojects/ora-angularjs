var app = angular.module('oraApp', [
	'ngRoute',
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
	}]);
	//.config(['$mdIconProvider',
	//	function($mdIconProvider) {
	//		$mdIconProvider
	//			.iconSet('social', 'components/angular-material/demos/icon/demoSvgIconSets/social-icons.svg', 24)
	//			.defaultIconSet('components/angular-material/demos/icon/demoSvgIconSets/core-icons.svg', 24);
	//	}]);