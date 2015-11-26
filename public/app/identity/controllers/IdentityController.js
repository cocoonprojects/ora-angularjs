angular.module('oraApp.identity')
	.controller('IdentityController', ['$scope', '$log', '$state', 'identity',
		function($scope, $log, $state, identity) {
			$scope.identity = identity;

			$scope.signOut = function() {
				var auth2 = gapi.auth2.getAuthInstance();
				auth2.signOut().then(function () {
					$scope.$apply(function() {
						identity.reset();
						$log.info('User signed out.');
						$state.go('sign-in');
					});
				});
			};
		}]);
