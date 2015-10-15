angular.module('oraApp.identity')
	.controller('IdentityController', ['$scope', '$log', '$state', '$stateParams', 'identity',
		function($scope, $log, $state, $stateParams, identity) {
			$scope.identity = identity;
			$scope.currOrg;

			$scope.$on('$stateChangeSuccess', function(event, next, current) {
				if($stateParams.orgId) {
					$scope.currOrg = identity.getMembership($stateParams.orgId);
					$log.debug('Organization changed: ' + $scope.currOrg.id);
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
			}
		}]);
