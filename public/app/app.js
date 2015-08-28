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
				redirectTo: '/tasks'
			});
	}]);
	//.config(['$mdIconProvider',
	//	function($mdIconProvider) {
	//		$mdIconProvider
	//			.iconSet('social', 'components/angular-material/demos/icon/demoSvgIconSets/social-icons.svg', 24)
	//			.defaultIconSet('components/angular-material/demos/icon/demoSvgIconSets/core-icons.svg', 24);
	//	}]);
app.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $mdUtil, $log) {
		$scope.toggleLeft = buildToggler('left');
		$scope.toggleRight = buildToggler('right');
		/**
		 * Build handler to open/close a SideNav; when animation finishes
		 * report completion in console
		 */
		function buildToggler(navID) {
			var debounceFn =  $mdUtil.debounce(function(){
				$mdSidenav(navID)
					.toggle()
					.then(function () {
						$log.debug("toggle " + navID + " is done");
					});
			},200);
			return debounceFn;
		}
	})
	.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
		$scope.close = function () {
			$mdSidenav('left').close()
				.then(function () {
					$log.debug("close LEFT is done");
				});
		};
	});