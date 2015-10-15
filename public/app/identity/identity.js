angular.module('oraApp.identity', [
	'ui.router'
	])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider.
				state('sign-in', {
					url: '/sign-in',
					templateUrl: 'app/identity/partials/sign-in.html',
					controller: 'SignInController'
				});
		}
	])
	.run(['$rootScope', '$state', '$log', 'identity',
		function($rootScope, $state, $log, identity) {
			$rootScope.$on("$stateChangeStart",
				function(event, toState) {
					if(toState.name === "sign-in") {
						return;
					}
					if(identity.isAuthenticated()) {
						$log.debug('Access to ' + toState.name + ' state granted: user authenticated');
						return;
					}
					event.preventDefault();
					$log.debug("Access to '" + toState.name + "' state denied: user not authenticated");
					$state.go("sign-in");
				});
		}
	]);