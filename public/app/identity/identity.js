angular.module('oraApp.identity', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/sign-in', {
					templateUrl: 'app/identity/partials/sign-in.html',
					controller: 'SignInController'
				});
		}
	])
	.run(['$rootScope', '$location', '$log', 'identity',
	function($rootScope, $location, $log, identity) {
		$rootScope.$on("$routeChangeStart", function(event, next, current) {
			if(identity.isAuthenticated()) {
				$log.debug('Access to ' + next.templateUrl + ' granted: user authenticated');
			} else {
				// no logged user, we should be going to #sign-in
				if(next.templateUrl != 'app/identity/partials/sign-in.html') {
					$log.debug('Access to ' + next.templateUrl + ' denied: user not authenticated');
					// redirect needed only if not already going to #sign-in
					$location.path( "/sign-in" );
				}
			}
		})
	}]);