angular.module('oraApp.identity')
	.controller('IdentityController', ['$scope', '$log', '$state', 'identity',
		function($scope, $log, $state, identity) {
			$scope.identity = identity;
			$scope.currOrg = null;

			$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
				if(toParams.orgId) {
					if(toParams.orgId != fromParams.orgId) {
						$scope.currOrg = identity.getMembership(toParams.orgId);
						$log.debug('Organization changed: ' + $scope.currOrg.id);
					}
				} else {
					$scope.currOrg = null;
				}
			});

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
