angular.module('oraApp.identity')
	.controller('IdentityController', ['$scope', '$log', '$location', '$routeParams', 'identity',
		function($scope, $log, $location, $routeParams, identity) {
			$scope.identity = identity;
			$scope.currOrg;

			$scope.$on('$routeChangeSuccess', function(event, next, current) {
				if($routeParams.orgId) {
					$scope.currOrg = identity.getMembership($routeParams.orgId);
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
						$location.path('/');
					});
				});
			}
		}]);
